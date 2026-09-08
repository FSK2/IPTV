package com.mobileonemedia.devdeck;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothHidDevice;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import java.util.Set;

@SuppressLint("MissingPermission")
public class BluetoothHidManager {
    private static final String TAG = "DevDeck_HID";

    public static final byte MOD_NONE = 0;
    public static final byte KEY_SPACE = 0x2C;
    public static final byte KEY_K = 0x0E;
    public static final byte KEY_LEFT = 0x50;
    public static final byte KEY_RIGHT = 0x4F;
    public static final byte KEY_MEDIA_PLAY_PAUSE = (byte) 0xE8;
    public static final byte KEY_MEDIA_STOP = (byte) 0xE9;

    // Consumer Usage Codes (HID Usage Page 0x0C)
    public static final int CONSUMER_PLAY = 0xB0;
    public static final int CONSUMER_PAUSE = 0xB1;
    public static final int CONSUMER_STOP = 0xB7;
    public static final int CONSUMER_PLAY_PAUSE = 0xCD;
    public static final int CONSUMER_VOL_UP = 0xE9;
    public static final int CONSUMER_VOL_DOWN = 0xEA;
    public static final int CONSUMER_MUTE = 0xE2;

    private final Context context;
    private final BluetoothAdapter bluetoothAdapter;
    private BluetoothHidDevice hidDevice;
    private BluetoothDevice connectedHostDevice;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    private final BluetoothProfile.ServiceListener serviceListener = new BluetoothProfile.ServiceListener() {
        @Override
        public void onServiceConnected(int profile, BluetoothProfile proxy) {
            if (profile == BluetoothProfile.HID_DEVICE) {
                hidDevice = (BluetoothHidDevice) proxy;
                Log.d(TAG, "HID Device Proxy connected");
                autoConnectToBondedHost();
            }
        }

        @Override
        public void onServiceDisconnected(int profile) {
            if (profile == BluetoothProfile.HID_DEVICE) {
                hidDevice = null;
                connectedHostDevice = null;
                Log.d(TAG, "HID Device Proxy disconnected");
            }
        }
    };

    public BluetoothHidManager(Context context) {
        this.context = context;
        this.bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter != null) {
            bluetoothAdapter.getProfileProxy(context, serviceListener, BluetoothProfile.HID_DEVICE);
        }
    }

    public synchronized BluetoothDevice autoConnectToBondedHost() {
        if (connectedHostDevice != null) {
            return connectedHostDevice;
        }
        if (bluetoothAdapter == null) {
            Log.w(TAG, "BluetoothAdapter is null");
            return null;
        }

        Set<BluetoothDevice> bondedDevices = bluetoothAdapter.getBondedDevices();
        if (bondedDevices != null && !bondedDevices.isEmpty()) {
            for (BluetoothDevice device : bondedDevices) {
                // Connect to the bonded host device (PC / Mac)
                Log.i(TAG, "Attempting auto-connect to bonded device: " + device.getName() + " (" + device.getAddress() + ")");
                if (hidDevice != null) {
                    hidDevice.connect(device);
                }
                connectedHostDevice = device;
                return device;
            }
        }
        Log.w(TAG, "No bonded host device found to auto-connect.");
        return null;
    }

    public void sendKeystroke(byte modifier, byte key) {
        if (connectedHostDevice == null) {
            Log.w(TAG, "connectedHostDevice is null in sendKeystroke, attempting auto-connect...");
            autoConnectToBondedHost();
            if (connectedHostDevice == null) {
                Log.e(TAG, "No host connected to receive keystroke. Please pair with PC/Mac.");
                return;
            }
        }

        if (hidDevice == null) {
            Log.e(TAG, "HID Device proxy not available");
            return;
        }

        // Key Down report (Report ID 1, Keyboard: [modifier, reserved, key, 0, 0, 0, 0, 0])
        byte[] keyDown = new byte[]{modifier, 0, key, 0, 0, 0, 0, 0};
        byte[] keyUp = new byte[]{0, 0, 0, 0, 0, 0, 0, 0};

        hidDevice.sendReport(connectedHostDevice, 1, keyDown);
        mainHandler.postDelayed(() -> {
            if (hidDevice != null && connectedHostDevice != null) {
                hidDevice.sendReport(connectedHostDevice, 1, keyUp);
            }
        }, 50);
    }

    public void sendKeystrokeSync(byte modifier, byte key) {
        if (connectedHostDevice == null) {
            autoConnectToBondedHost();
            if (connectedHostDevice == null) return;
        }
        if (hidDevice == null) return;

        byte[] keyDown = new byte[]{modifier, 0, key, 0, 0, 0, 0, 0};
        byte[] keyUp = new byte[]{0, 0, 0, 0, 0, 0, 0, 0};

        hidDevice.sendReport(connectedHostDevice, 1, keyDown);
        try {
            Thread.sleep(45);
        } catch (InterruptedException ignored) {}

        hidDevice.sendReport(connectedHostDevice, 1, keyUp);
        try {
            Thread.sleep(40);
        } catch (InterruptedException ignored) {}
    }

    public void sendConsumerBit(byte bitmask) {
        if (connectedHostDevice == null) {
            Log.w(TAG, "connectedHostDevice is null in sendConsumerBit, attempting auto-connect...");
            autoConnectToBondedHost();
            if (connectedHostDevice == null) {
                Log.e(TAG, "No host connected to receive consumer key");
                return;
            }
        }

        if (hidDevice == null) {
            Log.e(TAG, "HID Device proxy not available");
            return;
        }

        byte[] reportDown = new byte[]{bitmask, 0};
        byte[] reportUp = new byte[]{0, 0};

        hidDevice.sendReport(connectedHostDevice, 2, reportDown);
        mainHandler.postDelayed(() -> {
            if (hidDevice != null && connectedHostDevice != null) {
                hidDevice.sendReport(connectedHostDevice, 2, reportUp);
            }
        }, 50);
    }

    public void sendConsumerKey(int usageCode) {
        if (connectedHostDevice == null) {
            Log.w(TAG, "connectedHostDevice is null in sendConsumerKey, attempting auto-connect...");
            autoConnectToBondedHost();
            if (connectedHostDevice == null) {
                Log.e(TAG, "No host connected to receive consumer key");
                return;
            }
        }

        if (hidDevice == null) return;

        byte[] reportDown = new byte[]{(byte) (usageCode & 0xFF), (byte) ((usageCode >> 8) & 0xFF)};
        byte[] reportUp = new byte[]{0, 0};

        hidDevice.sendReport(connectedHostDevice, 2, reportDown);
        mainHandler.postDelayed(() -> {
            if (hidDevice != null && connectedHostDevice != null) {
                hidDevice.sendReport(connectedHostDevice, 2, reportUp);
            }
        }, 50);
    }

    public void handleMediaAction(String action) {
        switch (action) {
            case "play":
                // Bug 2 Fix: Distinct Consumer Play (0xB0), NO Spacebar fallback
                sendConsumerKey(CONSUMER_PLAY);
                return;
            case "pause":
                // Bug 2 Fix: Distinct Consumer Pause (0xB1), NO Spacebar fallback
                sendConsumerKey(CONSUMER_PAUSE);
                return;
            case "play_pause":
                // Consumer Play/Pause toggle (0xCD or bitmask 0x08)
                sendConsumerKey(CONSUMER_PLAY_PAUSE);
                return;
            case "stop":
                // Bug 3 Fix: Send Consumer Stop (0xB7 / bitmask 0x04) + 'k' (pause) for browser web players
                sendConsumerKey(CONSUMER_STOP);
                sendKeystroke(MOD_NONE, KEY_K);
                return;
            case "vol_up":
                sendConsumerKey(CONSUMER_VOL_UP);
                return;
            case "vol_down":
                sendConsumerKey(CONSUMER_VOL_DOWN);
                return;
            case "mute":
                sendConsumerKey(CONSUMER_MUTE);
                return;
            case "vol_max":
                sendVolumeMax();
                return;
            case "vol_zero":
                sendVolumeZero();
                return;
            default:
                Log.w(TAG, "Unknown media action: " + action);
        }
    }

    public void sendSeek(int seconds) {
        // Bug 4 Fix: Key down -> wait 45ms -> key up -> wait 40ms cadence to prevent key overlap
        byte key = (seconds > 0) ? KEY_RIGHT : KEY_LEFT;
        int pulses = Math.max(1, Math.abs(seconds) / 5);

        new Thread(() -> {
            for (int i = 0; i < pulses; i++) {
                sendKeystrokeSync(MOD_NONE, key);
            }
        }).start();
    }

    public void sendVolumeMax() {
        // Bug 6 Fix: Reduce loop count to 30 steps and sleep to 28ms to prevent queue flooding
        new Thread(() -> {
            for (int i = 0; i < 30; i++) {
                sendConsumerKey(CONSUMER_VOL_UP);
                try {
                    Thread.sleep(28);
                } catch (InterruptedException ignored) {}
            }
        }).start();
    }

    public void sendVolumeZero() {
        // Bug 6 Fix: Reduce loop count to 30 steps and sleep to 28ms to prevent queue flooding
        new Thread(() -> {
            for (int i = 0; i < 30; i++) {
                sendConsumerKey(CONSUMER_VOL_DOWN);
                try {
                    Thread.sleep(28);
                } catch (InterruptedException ignored) {}
            }
        }).start();
    }

    public void setConnectedHostDevice(BluetoothDevice device) {
        this.connectedHostDevice = device;
    }

    public BluetoothDevice getConnectedHostDevice() {
        return connectedHostDevice;
    }
}
