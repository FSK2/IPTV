package com.mobileonemedia.devdeck;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattServer;
import android.bluetooth.BluetoothGattServerCallback;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import java.util.Collections;
import java.util.Set;
import java.util.ConcurrentModificationException;
import java.util.concurrent.ConcurrentHashMap;

@SuppressLint("MissingPermission")
public class BleHidDeviceServer {
    private static final String TAG = "DevDeck_BLE_HID";

    public static final byte MOD_NONE = 0;
    public static final byte MOD_LEFT_SHIFT = 0x02;

    public static final byte KEY_K = 0x0E;
    public static final byte KEY_LEFT = 0x50;
    public static final byte KEY_RIGHT = 0x4F;
    public static final byte KEY_TAB = 0x2B;
    public static final byte KEY_ENTER = 0x28;
    public static final byte KEY_COMMA = 0x36;
    public static final byte KEY_PERIOD = 0x37;

    public static final byte KEY_F = 0x09;
    public static final byte KEY_T = 0x17;
    public static final byte KEY_C = 0x06;
    public static final byte KEY_I = 0x0C;
    public static final byte KEY_L = 0x0F;
    public static final byte KEY_S = 0x16;
    public static final byte KEY_A = 0x04;

    public static final int CONSUMER_PLAY = 0xB0;
    public static final int CONSUMER_PAUSE = 0xB1;
    public static final int CONSUMER_STOP = 0xB7;
    public static final int CONSUMER_PLAY_PAUSE = 0xCD;
    public static final int CONSUMER_VOL_UP = 0xE9;
    public static final int CONSUMER_VOL_DOWN = 0xEA;
    public static final int CONSUMER_MUTE = 0xE2;

    private final Context context;
    private final BluetoothManager bluetoothManager;
    private final BluetoothAdapter bluetoothAdapter;
    private BluetoothGattServer gattServer;
    private final Set<BluetoothDevice> connectedDevices = ConcurrentHashMap.newKeySet();
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    private BluetoothGattCharacteristic inputReportCharacteristic;
    private BluetoothGattCharacteristic consumerReportCharacteristic;

    public BleHidDeviceServer(Context context) {
        this.context = context;
        this.bluetoothManager = (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
        this.bluetoothAdapter = bluetoothManager != null ? bluetoothManager.getAdapter() : null;
    }

    public void sendKeystroke(byte modifier, byte key) {
        if (connectedDevices.isEmpty()) {
            Log.w(TAG, "No BLE devices connected to receive keystroke.");
            return;
        }

        byte[] keyDown = new byte[]{modifier, 0, key, 0, 0, 0, 0, 0};
        byte[] keyUp = new byte[]{0, 0, 0, 0, 0, 0, 0, 0};

        sendReportToAll(inputReportCharacteristic, keyDown);
        mainHandler.postDelayed(() -> sendReportToAll(inputReportCharacteristic, keyUp), 50);
    }

    public void sendKeystrokeSync(byte modifier, byte key) {
        if (connectedDevices.isEmpty()) return;

        byte[] keyDown = new byte[]{modifier, 0, key, 0, 0, 0, 0, 0};
        byte[] keyUp = new byte[]{0, 0, 0, 0, 0, 0, 0, 0};

        sendReportToAll(inputReportCharacteristic, keyDown);
        try {
            Thread.sleep(45);
        } catch (InterruptedException ignored) {}

        sendReportToAll(inputReportCharacteristic, keyUp);
        try {
            Thread.sleep(40);
        } catch (InterruptedException ignored) {}
    }

    public void sendConsumerKey(int usageCode) {
        if (connectedDevices.isEmpty()) {
            Log.w(TAG, "No BLE devices connected to receive consumer key.");
            return;
        }

        byte[] reportDown = new byte[]{(byte) (usageCode & 0xFF), (byte) ((usageCode >> 8) & 0xFF)};
        byte[] reportUp = new byte[]{0, 0};

        sendReportToAll(consumerReportCharacteristic, reportDown);
        mainHandler.postDelayed(() -> sendReportToAll(consumerReportCharacteristic, reportUp), 50);
    }

    private void sendReportToAll(BluetoothGattCharacteristic characteristic, byte[] value) {
        if (gattServer == null || characteristic == null) return;
        characteristic.setValue(value);
        for (BluetoothDevice device : connectedDevices) {
            try {
                gattServer.notifyCharacteristicChanged(device, characteristic, false);
            } catch (Exception e) {
                Log.e(TAG, "Error notifying characteristic change", e);
            }
        }
    }

    public void sendSkipAd() {
        new Thread(() -> {
            sendKeystrokeSync(MOD_NONE, KEY_TAB);
            try {
                Thread.sleep(100);
            } catch (InterruptedException ignored) {}
            sendKeystrokeSync(MOD_NONE, KEY_ENTER);
        }).start();
    }

    public void sendKeyShortcut(String key) {
        if (key == null) return;
        switch (key.toLowerCase()) {
            case "f":
                sendKeystroke(MOD_NONE, KEY_F);
                break;
            case "t":
                sendKeystroke(MOD_NONE, KEY_T);
                break;
            case "c":
                sendKeystroke(MOD_NONE, KEY_C);
                break;
            case "i":
                sendKeystroke(MOD_NONE, KEY_I);
                break;
            case "l":
                sendKeystroke(MOD_NONE, KEY_L);
                break;
            case "s":
                sendKeystroke(MOD_NONE, KEY_S);
                break;
            case "a":
                sendKeystroke(MOD_NONE, KEY_A);
                break;
            default:
                Log.w(TAG, "Unknown key shortcut: " + key);
                break;
        }
    }

    public void sendSpeedCommand(String speedAction) {
        if (speedAction == null) return;
        if (speedAction.equals("down")) {
            sendKeystroke(MOD_LEFT_SHIFT, KEY_COMMA);
        } else if (speedAction.equals("up")) {
            sendKeystroke(MOD_LEFT_SHIFT, KEY_PERIOD);
        } else {
            Log.i(TAG, "Set speed preset: " + speedAction);
        }
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
                sendConsumerKey(CONSUMER_PLAY_PAUSE);
                return;
            case "stop":
                // Bug 3 Fix: Consumer Stop (0xB7) + 'k' pause fallback
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
            case "skip_ad":
                sendSkipAd();
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

    public Set<BluetoothDevice> getConnectedDevices() {
        return Collections.unmodifiableSet(connectedDevices);
    }
}
