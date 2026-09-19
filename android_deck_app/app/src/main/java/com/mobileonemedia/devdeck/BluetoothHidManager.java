package com.mobileonemedia.devdeck;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothHidDevice;
import android.bluetooth.BluetoothHidDeviceAppQosSettings;
import android.bluetooth.BluetoothHidDeviceAppSdpSettings;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.Executors;

@SuppressLint("MissingPermission")
public class BluetoothHidManager {
    private static final String TAG = "BluetoothHidManager";

    public static final byte REPORT_ID_KEYBOARD = 1;
    public static final byte REPORT_ID_CONSUMER = 2;
    public static final byte REPORT_ID_MOUSE = 3;

    public static final byte[] HID_REPORT_DESCRIPTOR = new byte[]{
        // Keyboard (Report ID 1)
        (byte) 0x05, (byte) 0x01, // USAGE_PAGE (Generic Desktop)
        (byte) 0x09, (byte) 0x06, // USAGE (Keyboard)
        (byte) 0xA1, (byte) 0x01, // COLLECTION (Application)
        (byte) 0x85, REPORT_ID_KEYBOARD, // REPORT_ID (1)
        (byte) 0x05, (byte) 0x07, //   USAGE_PAGE (Keyboard)
        (byte) 0x19, (byte) 0xE0, //   USAGE_MINIMUM (Keyboard LeftControl)
        (byte) 0x29, (byte) 0xE7, //   USAGE_MAXIMUM (Keyboard Right GUI)
        (byte) 0x15, (byte) 0x00, //   LOGICAL_MINIMUM (0)
        (byte) 0x25, (byte) 0x01, //   LOGICAL_MAXIMUM (1)
        (byte) 0x75, (byte) 0x01, //   REPORT_SIZE (1)
        (byte) 0x95, (byte) 0x08, //   REPORT_COUNT (8)
        (byte) 0x81, (byte) 0x02, //   INPUT (Data,Var,Abs)
        (byte) 0x95, (byte) 0x01, //   REPORT_COUNT (1)
        (byte) 0x75, (byte) 0x08, //   REPORT_SIZE (8)
        (byte) 0x81, (byte) 0x01, //   INPUT (Cnst,Var,Abs)
        (byte) 0x95, (byte) 0x05, //   REPORT_COUNT (5)
        (byte) 0x75, (byte) 0x01, //   REPORT_SIZE (1)
        (byte) 0x05, (byte) 0x08, //   USAGE_PAGE (LEDs)
        (byte) 0x19, (byte) 0x01, //   USAGE_MINIMUM (Num Lock)
        (byte) 0x29, (byte) 0x05, //   USAGE_MAXIMUM (Kana)
        (byte) 0x91, (byte) 0x02, //   OUTPUT (Data,Var,Abs)
        (byte) 0x95, (byte) 0x01, //   REPORT_COUNT (1)
        (byte) 0x75, (byte) 0x03, //   REPORT_SIZE (3)
        (byte) 0x91, (byte) 0x01, //   OUTPUT (Cnst,Var,Abs)
        (byte) 0x95, (byte) 0x06, //   REPORT_COUNT (6)
        (byte) 0x75, (byte) 0x08, //   REPORT_SIZE (8)
        (byte) 0x15, (byte) 0x00, //   LOGICAL_MINIMUM (0)
        (byte) 0x25, (byte) 0x65, //   LOGICAL_MAXIMUM (101)
        (byte) 0x05, (byte) 0x07, //   USAGE_PAGE (Keyboard)
        (byte) 0x19, (byte) 0x00, //   USAGE_MINIMUM (Reserved)
        (byte) 0x29, (byte) 0x65, //   USAGE_MAXIMUM (Keyboard Application)
        (byte) 0x81, (byte) 0x00, //   INPUT (Data,Ary,Abs)
        (byte) 0xC0,              // END_COLLECTION

        // Consumer Control (Report ID 2, 1-byte bitmask)
        (byte) 0x05, (byte) 0x0C, // USAGE_PAGE (Consumer Devices)
        (byte) 0x09, (byte) 0x01, // USAGE (Consumer Control)
        (byte) 0xA1, (byte) 0x01, // COLLECTION (Application)
        (byte) 0x85, REPORT_ID_CONSUMER, // REPORT_ID (2)
        (byte) 0x15, (byte) 0x00, //   LOGICAL_MINIMUM (0)
        (byte) 0x25, (byte) 0x01, //   LOGICAL_MAXIMUM (1)
        (byte) 0x75, (byte) 0x01, //   REPORT_SIZE (1)
        (byte) 0x95, (byte) 0x07, //   REPORT_COUNT (7)
        (byte) 0x09, (byte) 0xB5, //   USAGE (Scan Next Track) -> Bit 0
        (byte) 0x09, (byte) 0xB6, //   USAGE (Scan Prev Track) -> Bit 1
        (byte) 0x09, (byte) 0xB7, //   USAGE (Stop)            -> Bit 2
        (byte) 0x09, (byte) 0xCD, //   USAGE (Play/Pause)      -> Bit 3
        (byte) 0x09, (byte) 0xE2, //   USAGE (Mute)            -> Bit 4
        (byte) 0x09, (byte) 0xE9, //   USAGE (Volume Up)       -> Bit 5
        (byte) 0x09, (byte) 0xEA, //   USAGE (Volume Down)     -> Bit 6
        (byte) 0x81, (byte) 0x02, //   INPUT (Data,Var,Abs)
        (byte) 0x95, (byte) 0x01, //   REPORT_COUNT (1)
        (byte) 0x75, (byte) 0x01, //   REPORT_SIZE (1)
        (byte) 0x81, (byte) 0x01, //   INPUT (Const,Ary,Abs) -> Bit 7 padding
        (byte) 0xC0,              // END_COLLECTION

        // Mouse (Report ID 3)
        (byte) 0x05, (byte) 0x01, // USAGE_PAGE (Generic Desktop)
        (byte) 0x09, (byte) 0x02, // USAGE (Mouse)
        (byte) 0xA1, (byte) 0x01, // COLLECTION (Application)
        (byte) 0x85, REPORT_ID_MOUSE, // REPORT_ID (3)
        (byte) 0x09, (byte) 0x01, //   USAGE (Pointer)
        (byte) 0xA1, (byte) 0x00, //   COLLECTION (Physical)
        (byte) 0x05, (byte) 0x09, //     USAGE_PAGE (Button)
        (byte) 0x19, (byte) 0x01, //     USAGE_MINIMUM (Button 1)
        (byte) 0x29, (byte) 0x03, //     USAGE_MAXIMUM (Button 3)
        (byte) 0x15, (byte) 0x00, //     LOGICAL_MINIMUM (0)
        (byte) 0x25, (byte) 0x01, //     LOGICAL_MAXIMUM (1)
        (byte) 0x95, (byte) 0x03, //     REPORT_COUNT (3)
        (byte) 0x75, (byte) 0x01, //     REPORT_SIZE (1)
        (byte) 0x81, (byte) 0x02, //     INPUT (Data,Var,Abs)
        (byte) 0x95, (byte) 0x01, //     REPORT_COUNT (1)
        (byte) 0x75, (byte) 0x05, //     REPORT_SIZE (5)
        (byte) 0x81, (byte) 0x03, //     INPUT (Cnst,Var,Abs)
        (byte) 0x05, (byte) 0x01, //     USAGE_PAGE (Generic Desktop)
        (byte) 0x09, (byte) 0x30, //     USAGE (X)
        (byte) 0x09, (byte) 0x31, //     USAGE (Y)
        (byte) 0x09, (byte) 0x38, //     USAGE (Wheel)
        (byte) 0x15, (byte) 0x81, //     LOGICAL_MINIMUM (-127)
        (byte) 0x25, (byte) 0x7F, //     LOGICAL_MAXIMUM (127)
        (byte) 0x75, (byte) 0x08, //     REPORT_SIZE (8)
        (byte) 0x95, (byte) 0x03, //     REPORT_COUNT (3)
        (byte) 0x81, (byte) 0x06, //     INPUT (Data,Var,Rel)
        (byte) 0xC0,              //   END_COLLECTION
        (byte) 0xC0               // END_COLLECTION
    };

    // Standard HID Modifiers
    public static final byte MOD_NONE = 0x00;
    public static final byte MOD_CTRL_LEFT = 0x01;
    public static final byte MOD_SHIFT_LEFT = 0x02;
    public static final byte MOD_ALT_LEFT = 0x04;
    public static final byte MOD_GUI_LEFT = 0x08; // Windows / Command

    // Standard HID Keycodes
    public static final byte KEY_A = 0x04;
    public static final byte KEY_B = 0x05;
    public static final byte KEY_C = 0x06;
    public static final byte KEY_D = 0x07;
    public static final byte KEY_E = 0x08;
    public static final byte KEY_F = 0x09;
    public static final byte KEY_H = 0x0B;
    public static final byte KEY_I = 0x0C;
    public static final byte KEY_L = 0x0F;
    public static final byte KEY_P = 0x13;
    public static final byte KEY_Q = 0x14;
    public static final byte KEY_R = 0x15;
    public static final byte KEY_S = 0x16;
    public static final byte KEY_T = 0x17;
    public static final byte KEY_U = 0x18;
    public static final byte KEY_V = 0x19;
    public static final byte KEY_W = 0x1A;
    public static final byte KEY_X = 0x1B;
    public static final byte KEY_Y = 0x1C;
    public static final byte KEY_Z = 0x1D;
    public static final byte KEY_ENTER = 0x28;
    public static final byte KEY_ESCAPE = 0x29;
    public static final byte KEY_TAB = 0x2B;
    public static final byte KEY_F4 = 0x3D;
    public static final byte KEY_F5 = 0x3E;
    public static final byte KEY_COMMA = 0x36;
    public static final byte KEY_PERIOD = 0x37;
    public static final byte KEY_RIGHT = 0x4F;
    public static final byte KEY_LEFT = 0x50;

    public interface StatusListener {
        void onBluetoothStatus(String message, boolean isConnected);
    }

    private final Context context;
    private final StatusListener listener;
    private final Handler mainHandler;
    private BluetoothAdapter bluetoothAdapter;
    private BluetoothHidDevice hidDevice;
    private BluetoothDevice connectedHostDevice;
    private boolean isAppRegistered = false;

    private static final String PREFS_NAME = "DevDeckPrefs";
    private static final String KEY_LAST_HOST_ADDR = "last_host_address";
    private static final String KEY_LAST_HOST_NAME = "last_host_name";

    private final Runnable keepAliveRunnable = new Runnable() {
        @Override
        public void run() {
            if (hidDevice != null && connectedHostDevice != null) {
                try {
                    // Send neutral Consumer report (0x00) every 12s to prevent Windows Selective Suspend
                    byte[] neutralReport = new byte[]{0x00};
                    hidDevice.sendReport(connectedHostDevice, REPORT_ID_CONSUMER, neutralReport);
                } catch (Exception e) {
                    Log.v(TAG, "Keep-alive ping error: " + e.getMessage());
                }
            }
            mainHandler.postDelayed(this, 12000);
        }
    };

    private final Runnable autoReconnectRunnable = new Runnable() {
        @Override
        public void run() {
            if (connectedHostDevice == null && hidDevice != null) {
                String lastAddr = getLastHostAddress();
                if (lastAddr != null && !lastAddr.isEmpty()) {
                    Log.d(TAG, "Auto-reconnect tick: connecting to " + lastAddr);
                    connectHost(lastAddr);
                } else {
                    autoConnectBondedHost();
                }
                mainHandler.postDelayed(this, 3500);
            }
        }
    };

    private void saveLastConnectedHost(BluetoothDevice device) {
        if (device == null || context == null) return;
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            prefs.edit()
                    .putString(KEY_LAST_HOST_ADDR, device.getAddress())
                    .putString(KEY_LAST_HOST_NAME, device.getName() != null ? device.getName() : "Host PC")
                    .apply();
        } catch (Exception e) {
            Log.e(TAG, "Failed saving last host: " + e.getMessage());
        }
    }

    public String getLastHostAddress() {
        if (context == null) return null;
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            return prefs.getString(KEY_LAST_HOST_ADDR, null);
        } catch (Exception e) {
            return null;
        }
    }

    public String getLastHostName() {
        if (context == null) return "Host PC";
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            return prefs.getString(KEY_LAST_HOST_NAME, "Host PC");
        } catch (Exception e) {
            return "Host PC";
        }
    }

    public void startKeepAliveHeartbeat() {
        mainHandler.removeCallbacks(keepAliveRunnable);
        mainHandler.postDelayed(keepAliveRunnable, 12000);
    }

    public void stopKeepAliveHeartbeat() {
        mainHandler.removeCallbacks(keepAliveRunnable);
    }

    public void startAutoReconnect() {
        mainHandler.removeCallbacks(autoReconnectRunnable);
        mainHandler.postDelayed(autoReconnectRunnable, 2000);
    }

    public void stopAutoReconnect() {
        mainHandler.removeCallbacks(autoReconnectRunnable);
    }

    public void reconnectLastHost() {
        String lastAddr = getLastHostAddress();
        if (lastAddr != null && !lastAddr.isEmpty()) {
            notifyStatus("Connecting to " + getLastHostName() + "...", false);
            connectHost(lastAddr);
        } else {
            notifyStatus("Paging bonded hosts...", false);
            autoConnectBondedHost();
        }
    }

    public BluetoothHidManager(Context context, StatusListener listener) {
        this.context = context;
        this.listener = listener;
        this.mainHandler = new Handler(Looper.getMainLooper());
        initBluetooth();
    }

    public BluetoothDevice getConnectedDevice() {
        return connectedHostDevice;
    }

    private void initBluetooth() {
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter == null) {
            notifyStatus("Bluetooth not supported", false);
            return;
        }

        // Native device name preserved

        bluetoothAdapter.getProfileProxy(context, new BluetoothProfile.ServiceListener() {
            @Override
            public void onServiceConnected(int profile, BluetoothProfile proxy) {
                if (profile == BluetoothProfile.HID_DEVICE) {
                    hidDevice = (BluetoothHidDevice) proxy;
                    Log.d(TAG, "Bluetooth HID Profile Proxy Connected");
                    registerHidApp();
                }
            }

            @Override
            public void onServiceDisconnected(int profile) {
                if (profile == BluetoothProfile.HID_DEVICE) {
                    hidDevice = null;
                    isAppRegistered = false;
                    notifyStatus("HID Service Disconnected", false);
                }
            }
        }, BluetoothProfile.HID_DEVICE);
    }

    private void registerHidApp() {
        if (hidDevice == null) return;

        BluetoothHidDeviceAppSdpSettings sdp = new BluetoothHidDeviceAppSdpSettings(
                "DevDeck Studio",
                "Mobile One Media Services",
                "MOMS",
                BluetoothHidDevice.SUBCLASS1_COMBO,
                HID_REPORT_DESCRIPTOR
        );

        BluetoothHidDeviceAppQosSettings qos = new BluetoothHidDeviceAppQosSettings(
                BluetoothHidDeviceAppQosSettings.SERVICE_BEST_EFFORT,
                800, 9, 0, 11250, BluetoothHidDeviceAppQosSettings.MAX
        );

        hidDevice.registerApp(sdp, null, qos, Executors.newCachedThreadPool(), new BluetoothHidDevice.Callback() {
            @Override
            public void onAppStatusChanged(BluetoothDevice pluggedDevice, boolean registered) {
                isAppRegistered = registered;
                Log.d(TAG, "HID App registered: " + registered);
                if (registered) {
                    notifyStatus("DevDeck Ready for Pairing", false);
                    autoConnectBondedHost();
                }
            }

            @Override
            public void onConnectionStateChanged(BluetoothDevice device, int state) {
                Log.d(TAG, "Connection state changed: " + state + " for " + (device != null ? device.getName() : "null"));
                if (state == BluetoothProfile.STATE_CONNECTED) {
                    connectedHostDevice = device;
                    saveLastConnectedHost(device);
                    stopAutoReconnect();
                    startKeepAliveHeartbeat();
                    notifyStatus("Connected: " + (device.getName() != null ? device.getName() : "Host Device"), true);
                } else if (state == BluetoothProfile.STATE_DISCONNECTED) {
                    if (connectedHostDevice != null && device != null && connectedHostDevice.getAddress().equals(device.getAddress())) {
                        connectedHostDevice = null;
                    }
                    stopKeepAliveHeartbeat();
                    startAutoReconnect();
                    String lastName = getLastHostName();
                    notifyStatus("Disconnected (" + lastName + " Auto-Reconnecting...)", false);
                }
            }

            @Override
            public void onGetReport(BluetoothDevice device, byte type, byte id, int bufferSize) {
                Log.d(TAG, "onGetReport: type=" + type + ", id=" + id + ", bufferSize=" + bufferSize);
                if (hidDevice != null) {
                    byte[] report;
                    if (id == REPORT_ID_CONSUMER) {
                        report = new byte[1];
                    } else if (id == REPORT_ID_MOUSE) {
                        report = new byte[4];
                    } else {
                        report = new byte[8];
                    }
                    hidDevice.replyReport(device, type, id, report);
                }
            }

            @Override
            public void onSetReport(BluetoothDevice device, byte type, byte id, byte[] data) {
                if (hidDevice != null) {
                    hidDevice.reportError(device, BluetoothHidDevice.ERROR_RSP_SUCCESS);
                }
            }
        });
    }

    public static boolean isEligibleHost(BluetoothDevice dev) {
        if (dev == null) return false;
        String name = dev.getName() != null ? dev.getName().toLowerCase() : "";
        if (name.contains("bud") || name.contains("pod") || name.contains("headphone") ||
            name.contains("headset") || name.contains("earphone") || name.contains("speaker") ||
            name.contains("watch") || name.contains("band") || name.contains("airpod") ||
            name.contains("sound") || name.contains("cmf") || name.contains("audio")) {
            return false;
        }
        return true;
    }

    public void autoConnectBondedHost() {
        if (hidDevice == null || bluetoothAdapter == null) return;
        Set<BluetoothDevice> bonded = bluetoothAdapter.getBondedDevices();
        if (bonded == null || bonded.isEmpty()) return;

        // Prioritize last known host if present in bonded list
        String lastAddr = getLastHostAddress();
        if (lastAddr != null) {
            for (BluetoothDevice device : bonded) {
                if (device.getAddress().equalsIgnoreCase(lastAddr)) {
                    Log.d(TAG, "Connecting directly to last saved host: " + device.getName() + " [" + device.getAddress() + "]");
                    hidDevice.connect(device);
                    return;
                }
            }
        }

        for (BluetoothDevice device : bonded) {
            if (isEligibleHost(device)) {
                Log.i(TAG, "Attempting auto-connection to bonded host: " + device.getName() + " [" + device.getAddress() + "]");
                hidDevice.connect(device);
                break;
            }
        }
    }

    public boolean isConnected() {
        return connectedHostDevice != null;
    }

    public void connect(BluetoothDevice device) {
        if (hidDevice != null && device != null) {
            hidDevice.connect(device);
        }
    }

    public void disconnect() {
        if (hidDevice != null && connectedHostDevice != null) {
            hidDevice.disconnect(connectedHostDevice);
        }
    }

    public boolean sendKeystroke(byte modifier, byte keycode) {
        if (hidDevice == null || connectedHostDevice == null) {
            return false;
        }

        byte[] pressReport = new byte[]{modifier, 0x00, keycode, 0x00, 0x00, 0x00, 0x00, 0x00};
        byte[] releaseReport = new byte[]{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};

        boolean delivered = hidDevice.sendReport(connectedHostDevice, REPORT_ID_KEYBOARD, pressReport);
        mainHandler.postDelayed(() -> {
            if (hidDevice != null && connectedHostDevice != null) {
                hidDevice.sendReport(connectedHostDevice, REPORT_ID_KEYBOARD, releaseReport);
            }
        }, 45);

        return delivered;
    }

    public boolean sendConsumerBit(byte bitMask) {
        if (hidDevice == null || connectedHostDevice == null) {
            return false;
        }

        byte[] pressReport = new byte[]{bitMask};
        byte[] releaseReport = new byte[]{0x00};

        boolean delivered = hidDevice.sendReport(connectedHostDevice, REPORT_ID_CONSUMER, pressReport);
        mainHandler.postDelayed(() -> {
            if (hidDevice != null && connectedHostDevice != null) {
                hidDevice.sendReport(connectedHostDevice, REPORT_ID_CONSUMER, releaseReport);
            }
        }, 35);

        return delivered;
    }

    private byte currentMouseButtonState = 0x00;

    public synchronized boolean sendMouseReport(byte buttons, byte dx, byte dy, byte wheel) {
        if (hidDevice == null || connectedHostDevice == null) {
            return false;
        }
        currentMouseButtonState = buttons;
        byte[] mouseReport = new byte[]{buttons, dx, dy, wheel};
        return hidDevice.sendReport(connectedHostDevice, REPORT_ID_MOUSE, mouseReport);
    }

    public boolean sendMouseMove(int dx, int dy) {
        byte clampedX = (byte) Math.max(-127, Math.min(127, dx));
        byte clampedY = (byte) Math.max(-127, Math.min(127, dy));
        return sendMouseReport(currentMouseButtonState, clampedX, clampedY, (byte) 0);
    }

    public boolean sendMouseWheel(int wheelDelta) {
        byte clampedWheel = (byte) Math.max(-127, Math.min(127, wheelDelta));
        return sendMouseReport(currentMouseButtonState, (byte) 0, (byte) 0, clampedWheel);
    }

    public boolean setMouseButtonState(int button, boolean isDown) {
        byte mask = 0;
        if (button == 1) mask = 0x01; // Left button
        else if (button == 2) mask = 0x02; // Right button
        else if (button == 3) mask = 0x04; // Middle button

        if (isDown) {
            currentMouseButtonState |= mask;
        } else {
            currentMouseButtonState &= ~mask;
        }
        return sendMouseReport(currentMouseButtonState, (byte) 0, (byte) 0, (byte) 0);
    }

    public void sendMouseClick(int button) {
        setMouseButtonState(button, true);
        mainHandler.postDelayed(() -> setMouseButtonState(button, false), 40);
    }

    public boolean sendMacro(String macroKey, String osMode) {
        boolean isMac = "mac".equalsIgnoreCase(osMode);
        byte mod = MOD_NONE;
        byte key = 0x00;

        String m = macroKey.toLowerCase().trim();
        switch (m) {
            case "undo":
                mod = isMac ? MOD_GUI_LEFT : MOD_CTRL_LEFT;
                key = KEY_Z;
                break;
            case "redo":
                mod = isMac ? (byte)(MOD_GUI_LEFT | MOD_SHIFT_LEFT) : MOD_CTRL_LEFT;
                key = isMac ? KEY_Z : KEY_Y;
                break;
            case "cut":
                mod = isMac ? MOD_GUI_LEFT : MOD_CTRL_LEFT;
                key = KEY_X;
                break;
            case "copy":
                mod = isMac ? MOD_GUI_LEFT : MOD_CTRL_LEFT;
                key = KEY_C;
                break;
            case "paste":
                mod = isMac ? MOD_GUI_LEFT : MOD_CTRL_LEFT;
                key = KEY_V;
                break;
            case "select all":
                mod = isMac ? MOD_GUI_LEFT : MOD_CTRL_LEFT;
                key = KEY_A;
                break;
            case "save":
                mod = isMac ? MOD_GUI_LEFT : MOD_CTRL_LEFT;
                key = KEY_S;
                break;
            case "find / replace":
            case "find":
                mod = isMac ? MOD_GUI_LEFT : MOD_CTRL_LEFT;
                key = KEY_F;
                break;
            case "bold":
                mod = isMac ? MOD_GUI_LEFT : MOD_CTRL_LEFT;
                key = KEY_B;
                break;
            case "italic":
                mod = isMac ? MOD_GUI_LEFT : MOD_CTRL_LEFT;
                key = KEY_I;
                break;
            case "underline":
                mod = isMac ? MOD_GUI_LEFT : MOD_CTRL_LEFT;
                key = KEY_U;
                break;
            case "indent":
                mod = isMac ? MOD_GUI_LEFT : MOD_NONE;
                key = isMac ? (byte) 0x30 : KEY_TAB;
                break;
            case "new tab":
                mod = isMac ? MOD_GUI_LEFT : MOD_CTRL_LEFT;
                key = KEY_T;
                break;
            case "close tab":
                mod = isMac ? MOD_GUI_LEFT : MOD_CTRL_LEFT;
                key = KEY_W;
                break;
            case "reopen tab":
                mod = isMac ? (byte)(MOD_GUI_LEFT | MOD_SHIFT_LEFT) : (byte)(MOD_CTRL_LEFT | MOD_SHIFT_LEFT);
                key = KEY_T;
                break;
            case "refresh":
                mod = isMac ? MOD_GUI_LEFT : MOD_NONE;
                key = isMac ? KEY_R : KEY_F5;
                break;
            case "history":
                mod = isMac ? MOD_GUI_LEFT : MOD_CTRL_LEFT;
                key = isMac ? KEY_Y : KEY_H;
                break;
            case "app switch":
                mod = isMac ? MOD_GUI_LEFT : MOD_ALT_LEFT;
                key = KEY_TAB;
                break;
            case "print":
                mod = isMac ? MOD_GUI_LEFT : MOD_CTRL_LEFT;
                key = KEY_P;
                break;
            case "desktop":
                mod = isMac ? (byte)(MOD_CTRL_LEFT) : MOD_GUI_LEFT;
                key = KEY_D;
                break;
            case "task mgr":
                mod = isMac ? (byte)(MOD_ALT_LEFT | MOD_GUI_LEFT) : (byte)(MOD_CTRL_LEFT | MOD_SHIFT_LEFT);
                key = KEY_ESCAPE;
                break;
            case "snipping":
                mod = isMac ? (byte)(MOD_GUI_LEFT | MOD_SHIFT_LEFT) : (byte)(MOD_GUI_LEFT | MOD_SHIFT_LEFT);
                key = isMac ? (byte) 0x21 : KEY_S;
                break;
            case "force kill":
                mod = isMac ? MOD_GUI_LEFT : MOD_ALT_LEFT;
                key = isMac ? KEY_Q : KEY_F4;
                break;
            case "lock pc":
                mod = isMac ? (byte)(MOD_CTRL_LEFT | MOD_GUI_LEFT) : MOD_GUI_LEFT;
                key = KEY_L;
                break;
            case "search":
            case "search menu":
            case "open search menu":
                mod = MOD_GUI_LEFT;
                key = isMac ? (byte) 0x2C : KEY_S;
                break;
            case "settings":
            case "settings menu":
            case "open setting menu":
            case "quick settings":
                mod = MOD_GUI_LEFT;
                key = isMac ? (byte) 0x36 : KEY_A;
                break;
            case "enter":
                mod = MOD_NONE;
                key = KEY_ENTER;
                break;
            case "colon":
                mod = MOD_SHIFT_LEFT;
                key = (byte) 0x33;
                break;
            case "<":
            case "slower":
            case "slow":
            case "speed_down":
                mod = MOD_SHIFT_LEFT;
                key = KEY_COMMA; // Shift + , = '<' on YouTube (decreases speed)
                break;
            case ">":
            case "faster":
            case "fast":
            case "speed_up":
                mod = MOD_SHIFT_LEFT;
                key = KEY_PERIOD; // Shift + . = '>' on YouTube (increases speed)
                break;
            case "speed_normal":
            case "speed_reset":
            case "normal_speed":
                new Thread(() -> {
                    for (int i = 0; i < 8; i++) {
                        sendKeystroke(MOD_SHIFT_LEFT, KEY_COMMA);
                        try { Thread.sleep(30); } catch (InterruptedException ignored) {}
                    }
                    for (int i = 0; i < 3; i++) {
                        sendKeystroke(MOD_SHIFT_LEFT, KEY_PERIOD);
                        try { Thread.sleep(30); } catch (InterruptedException ignored) {}
                    }
                }).start();
                return true;
            case "format":
                mod = (byte)(MOD_ALT_LEFT | MOD_SHIFT_LEFT);
                key = KEY_F;
                break;
            case "quick run":
                mod = MOD_GUI_LEFT;
                key = KEY_R;
                break;
            case "devtools":
            case "dev tools":
                mod = MOD_NONE;
                key = (byte) 0x45; // F12
                break;
            case "play":
            case "pause":
            case "play/pause":
                return sendConsumerBit((byte) 0x08);
            case "stop":
                return sendConsumerBit((byte) 0x04);
            case "next":
            case "next_track":
                return sendConsumerBit((byte) 0x01);
            case "prev":
            case "prev_track":
                return sendConsumerBit((byte) 0x02);
            case "mute":
                return sendConsumerBit((byte) 0x10);
            case "vol_up":
                return sendConsumerBit((byte) 0x20);
            case "vol_down":
                return sendConsumerBit((byte) 0x40);
            case "seek_forward":
                return sendKeystroke(MOD_NONE, KEY_RIGHT);
            case "seek_reverse":
                return sendKeystroke(MOD_NONE, KEY_LEFT);
            case "skip_ad":
            case "skip ad":
                sendKeystroke(MOD_NONE, (byte) 0x2B);
                mainHandler.postDelayed(() -> sendKeystroke(MOD_NONE, (byte) 0x28), 85);
                return true;
            case "fullscreen":
            case "f":
                return sendKeystroke(MOD_NONE, KEY_F);
            case "theater":
            case "theater_mode":
            case "t":
                return sendKeystroke(MOD_NONE, (byte) 0x17);
            case "captions":
            case "c":
                return sendKeystroke(MOD_NONE, KEY_C);
            case "backspace":
                return sendKeystroke(MOD_NONE, (byte) 0x2A);
            case "space":
            case "spacebar":
                return sendKeystroke(MOD_NONE, (byte) 0x2C);
            case "left":
            case "left_arrow":
                return sendKeystroke(MOD_NONE, KEY_LEFT);
            case "right":
            case "right_arrow":
                return sendKeystroke(MOD_NONE, KEY_RIGHT);
            case "up":
            case "up_arrow":
                return sendKeystroke(MOD_NONE, (byte) 0x52);
            case "down":
            case "down_arrow":
                return sendKeystroke(MOD_NONE, (byte) 0x51);
            default:
                Log.w(TAG, "Unrecognized macro key: " + macroKey);
                return false;
        }

        return sendKeystroke(mod, key);
    }

    public void sendSeekInterval(boolean isForward, int seconds) {
        int pulses = Math.max(1, Math.round((float) seconds / 5.0f));
        new Thread(() -> {
            byte key = isForward ? KEY_RIGHT : KEY_LEFT;
            byte[] pressReport = new byte[]{MOD_NONE, 0x00, key, 0x00, 0x00, 0x00, 0x00, 0x00};
            byte[] releaseReport = new byte[]{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
            for (int i = 0; i < pulses; i++) {
                if (hidDevice != null && connectedHostDevice != null) {
                    hidDevice.sendReport(connectedHostDevice, REPORT_ID_KEYBOARD, pressReport);
                }
                try {
                    Thread.sleep(40);
                } catch (InterruptedException e) {
                    break;
                }
                if (hidDevice != null && connectedHostDevice != null) {
                    hidDevice.sendReport(connectedHostDevice, REPORT_ID_KEYBOARD, releaseReport);
                }
                try {
                    Thread.sleep(60);
                } catch (InterruptedException e) {
                    break;
                }
            }
        }).start();
    }

    public void startContinuousSeek(boolean isForward) {
        // Continuous looping scrub removed per user request (prevents runaway scrubbing)
        // Dispatches a single discrete jump
        sendSeekInterval(isForward, 10);
    }

    public void stopContinuousSeek() {
        // Safe no-op
    }

    public void sendVolumeStep(boolean isUp) {
        new Thread(() -> {
            byte bit = isUp ? (byte) 0x20 : (byte) 0x40;
            for (int i = 0; i < 13; i++) {
                sendConsumerBit(bit);
                try {
                    Thread.sleep(12);
                } catch (InterruptedException ignored) {}
            }
        }).start();
    }

    public void sendVolumeMax() {
        new Thread(() -> {
            for (int i = 0; i < 50; i++) {
                sendConsumerBit((byte) 0x20);
                try {
                    Thread.sleep(12);
                } catch (InterruptedException ignored) {}
            }
        }).start();
    }

    public void sendVolumeZero() {
        new Thread(() -> {
            for (int i = 0; i < 50; i++) {
                sendConsumerBit((byte) 0x40);
                try {
                    Thread.sleep(12);
                } catch (InterruptedException ignored) {}
            }
        }).start();
    }

    public void sendText(String text) {
        if (text == null || text.isEmpty()) return;
        new Thread(() -> {
            for (int i = 0; i < text.length(); i++) {
                char c = text.charAt(i);
                sendCharKeystroke(c);
                try {
                    Thread.sleep(12);
                } catch (InterruptedException ignored) {}
            }
        }).start();
    }

    private void sendCharKeystroke(char c) {
        byte mod = MOD_NONE;
        byte key = 0x00;

        if (c >= 'a' && c <= 'z') {
            mod = MOD_NONE;
            key = (byte) (KEY_A + (c - 'a'));
        } else if (c >= 'A' && c <= 'Z') {
            mod = MOD_SHIFT_LEFT;
            key = (byte) (KEY_A + (c - 'A'));
        } else if (c >= '1' && c <= '9') {
            mod = MOD_NONE;
            key = (byte) (0x1E + (c - '1'));
        } else if (c == '0') {
            mod = MOD_NONE;
            key = 0x27;
        } else {
            switch (c) {
                case ' ':  mod = MOD_NONE; key = 0x2C; break;
                case '\n': mod = MOD_NONE; key = KEY_ENTER; break;
                case '\r': return;
                case '\t': mod = MOD_NONE; key = KEY_TAB; break;
                case '!':  mod = MOD_SHIFT_LEFT; key = 0x1E; break;
                case '@':  mod = MOD_SHIFT_LEFT; key = 0x1F; break;
                case '#':  mod = MOD_SHIFT_LEFT; key = 0x20; break;
                case '$':  mod = MOD_SHIFT_LEFT; key = 0x21; break;
                case '%':  mod = MOD_SHIFT_LEFT; key = 0x22; break;
                case '^':  mod = MOD_SHIFT_LEFT; key = 0x23; break;
                case '&':  mod = MOD_SHIFT_LEFT; key = 0x24; break;
                case '*':  mod = MOD_SHIFT_LEFT; key = 0x25; break;
                case '(':  mod = MOD_SHIFT_LEFT; key = 0x26; break;
                case ')':  mod = MOD_SHIFT_LEFT; key = 0x27; break;
                case '-':  mod = MOD_NONE; key = 0x2D; break;
                case '_':  mod = MOD_SHIFT_LEFT; key = 0x2D; break;
                case '=':  mod = MOD_NONE; key = 0x2E; break;
                case '+':  mod = MOD_SHIFT_LEFT; key = 0x2E; break;
                case '[':  mod = MOD_NONE; key = 0x2F; break;
                case '{':  mod = MOD_SHIFT_LEFT; key = 0x2F; break;
                case ']':  mod = MOD_NONE; key = 0x30; break;
                case '}':  mod = MOD_SHIFT_LEFT; key = 0x30; break;
                case '\\': mod = MOD_NONE; key = 0x31; break;
                case '|':  mod = MOD_SHIFT_LEFT; key = 0x31; break;
                case ';':  mod = MOD_NONE; key = 0x33; break;
                case ':':  mod = MOD_SHIFT_LEFT; key = 0x33; break;
                case '\'': mod = MOD_NONE; key = 0x34; break;
                case '"':  mod = MOD_SHIFT_LEFT; key = 0x34; break;
                case '`':  mod = MOD_NONE; key = 0x35; break;
                case '~':  mod = MOD_SHIFT_LEFT; key = 0x35; break;
                case ',':  mod = MOD_NONE; key = 0x36; break;
                case '<':  mod = MOD_SHIFT_LEFT; key = 0x36; break;
                case '.':  mod = MOD_NONE; key = 0x37; break;
                case '>':  mod = MOD_SHIFT_LEFT; key = 0x37; break;
                case '/':  mod = MOD_NONE; key = 0x38; break;
                case '?':  mod = MOD_SHIFT_LEFT; key = 0x38; break;
                default:
                    return;
            }
        }

        byte[] pressReport = new byte[]{mod, 0x00, key, 0x00, 0x00, 0x00, 0x00, 0x00};
        byte[] releaseReport = new byte[]{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
        if (hidDevice != null && connectedHostDevice != null) {
            hidDevice.sendReport(connectedHostDevice, REPORT_ID_KEYBOARD, pressReport);
        }
        try {
            Thread.sleep(15);
        } catch (InterruptedException ignored) {}
        if (hidDevice != null && connectedHostDevice != null) {
            hidDevice.sendReport(connectedHostDevice, REPORT_ID_KEYBOARD, releaseReport);
        }
        try {
            Thread.sleep(15);
        } catch (InterruptedException ignored) {}
    }

    public void connectHost(String address) {
        if (hidDevice == null || address == null) return;
        try {
            BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
            if (adapter != null) {
                BluetoothDevice dev = adapter.getRemoteDevice(address);
                if (dev != null) {
                    hidDevice.connect(dev);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to connect to host " + address, e);
        }
    }

    private void notifyStatus(String message, boolean isConnected) {
        mainHandler.post(() -> {
            if (listener != null) {
                listener.onBluetoothStatus(message, isConnected);
            }
        });
    }
}
