package com.mobileonemedia.devdeck;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattServer;
import android.bluetooth.BluetoothGattServerCallback;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.ParcelUuid;
import android.util.Log;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Set;
import java.util.UUID;

@SuppressLint("MissingPermission")
public class BleHidDeviceServer {
    private static final String TAG = "BleHidDeviceServer";

    public static final UUID SERVICE_DEVICE_INFO = UUID.fromString("0000180A-0000-1000-8000-00805f9b34fb");
    public static final UUID SERVICE_BATTERY = UUID.fromString("0000180F-0000-1000-8000-00805f9b34fb");
    public static final UUID SERVICE_HID = UUID.fromString("00001812-0000-1000-8000-00805f9b34fb");

    public static final UUID CHAR_REPORT = UUID.fromString("00002A4D-0000-1000-8000-00805f9b34fb");
    public static final UUID CHAR_REPORT_MAP = UUID.fromString("00002A4B-0000-1000-8000-00805f9b34fb");
    public static final UUID CHAR_HID_INFORMATION = UUID.fromString("00002A4A-0000-1000-8000-00805f9b34fb");
    public static final UUID CHAR_HID_CONTROL_POINT = UUID.fromString("00002A4C-0000-1000-8000-00805f9b34fb");
    public static final UUID CHAR_PROTOCOL_MODE = UUID.fromString("00002A4E-0000-1000-8000-00805f9b34fb");

    public static final UUID CHAR_PNP_ID = UUID.fromString("00002A50-0000-1000-8000-00805f9b34fb");
    public static final UUID CHAR_MANUFACTURER_NAME = UUID.fromString("00002A29-0000-1000-8000-00805f9b34fb");
    public static final UUID CHAR_MODEL_NUMBER = UUID.fromString("00002A24-0000-1000-8000-00805f9b34fb");
    public static final UUID CHAR_APPEARANCE = UUID.fromString("00002A01-0000-1000-8000-00805f9b34fb");

    public static final UUID CHAR_BOOT_KEYBOARD_INPUT = UUID.fromString("00002A22-0000-1000-8000-00805f9b34fb");
    public static final UUID CHAR_BOOT_KEYBOARD_OUTPUT = UUID.fromString("00002A32-0000-1000-8000-00805f9b34fb");
    public static final UUID CHAR_BOOT_MOUSE_INPUT = UUID.fromString("00002A33-0000-1000-8000-00805f9b34fb");

    public static final UUID CHAR_BATTERY_LEVEL = UUID.fromString("00002A19-0000-1000-8000-00805f9b34fb");

    public static final UUID DESC_CLIENT_CHAR_CONFIG = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb");
    public static final UUID DESC_REPORT_REFERENCE = UUID.fromString("00002908-0000-1000-8000-00805f9b34fb");

    public static final byte REPORT_ID_KEYBOARD = 1;
    public static final byte REPORT_ID_CONSUMER = 2;
    public static final byte REPORT_ID_MOUSE = 3;

    public static final byte[] REPORT_DESCRIPTOR = new byte[]{
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

    public interface BleStatusListener {
        void onBleStateChanged(String status, boolean isConnected);
    }

    private final Context context;
    private final BleStatusListener listener;
    private final Handler mainHandler;
    private final BluetoothManager bluetoothManager;
    private final BluetoothAdapter bluetoothAdapter;
    private final Queue<BluetoothGattService> serviceQueue = new LinkedList<>();

    private BluetoothGattServer gattServer;
    private BluetoothLeAdvertiser advertiser;
    private final Set<BluetoothDevice> connectedDevices = new HashSet<>();

    private BluetoothGattCharacteristic inputReportChar;
    private BluetoothGattCharacteristic outputReportChar;
    private BluetoothGattCharacteristic consumerReportChar;
    private BluetoothGattCharacteristic mouseReportChar;
    private BluetoothGattCharacteristic bootKeyboardInputChar;
    private BluetoothGattCharacteristic bootKeyboardOutputChar;
    private BluetoothGattCharacteristic bootMouseInputChar;

    private volatile boolean isBleContinuousSeeking = false;
    private Thread bleContinuousSeekThread = null;

    public BleHidDeviceServer(Context context, BleStatusListener listener) {
        this.context = context;
        this.listener = listener;
        this.mainHandler = new Handler(Looper.getMainLooper());
        this.bluetoothManager = (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
        this.bluetoothAdapter = bluetoothManager != null ? bluetoothManager.getAdapter() : null;
    }

    public boolean start() {
        if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled()) {
            notifyStatus("Bluetooth is Disabled", false);
            return false;
        }

        advertiser = bluetoothAdapter.getBluetoothLeAdvertiser();
        if (advertiser == null) {
            notifyStatus("BLE Advertiser Not Supported", false);
            return false;
        }

        gattServer = bluetoothManager.openGattServer(context, gattServerCallback);
        if (gattServer == null) {
            notifyStatus("Failed to open GATT Server", false);
            return false;
        }

        setupGattServices();
        return true;
    }

    private void setupGattServices() {
        serviceQueue.clear();

        // 1. Device Information Service
        BluetoothGattService devInfoService = new BluetoothGattService(SERVICE_DEVICE_INFO, BluetoothGattService.SERVICE_TYPE_PRIMARY);
        BluetoothGattCharacteristic pnpIdChar = new BluetoothGattCharacteristic(CHAR_PNP_ID, BluetoothGattCharacteristic.PROPERTY_READ, BluetoothGattCharacteristic.PERMISSION_READ);
        pnpIdChar.setValue(new byte[]{0x02, 0x05, (byte) 0xAC, 0x02, 0x2B, 0x01, 0x1B});
        devInfoService.addCharacteristic(pnpIdChar);

        BluetoothGattCharacteristic mfgChar = new BluetoothGattCharacteristic(CHAR_MANUFACTURER_NAME, BluetoothGattCharacteristic.PROPERTY_READ, BluetoothGattCharacteristic.PERMISSION_READ);
        mfgChar.setValue("Mobile One Media Services".getBytes(StandardCharsets.UTF_8));
        devInfoService.addCharacteristic(mfgChar);

        BluetoothGattCharacteristic modelChar = new BluetoothGattCharacteristic(CHAR_MODEL_NUMBER, BluetoothGattCharacteristic.PROPERTY_READ, BluetoothGattCharacteristic.PERMISSION_READ);
        modelChar.setValue("DevDeck Studio".getBytes(StandardCharsets.UTF_8));
        devInfoService.addCharacteristic(modelChar);

        BluetoothGattCharacteristic appChar = new BluetoothGattCharacteristic(CHAR_APPEARANCE, BluetoothGattCharacteristic.PROPERTY_READ, BluetoothGattCharacteristic.PERMISSION_READ);
        appChar.setValue(new byte[]{(byte) 0xC1, 0x03}); // 0x03C1 = Keyboard Appearance
        devInfoService.addCharacteristic(appChar);
        serviceQueue.add(devInfoService);

        // 2. Battery Service
        BluetoothGattService batteryService = new BluetoothGattService(SERVICE_BATTERY, BluetoothGattService.SERVICE_TYPE_PRIMARY);
        BluetoothGattCharacteristic battLevelChar = new BluetoothGattCharacteristic(CHAR_BATTERY_LEVEL, BluetoothGattCharacteristic.PROPERTY_READ | BluetoothGattCharacteristic.PROPERTY_NOTIFY, BluetoothGattCharacteristic.PERMISSION_READ);
        battLevelChar.setValue(new byte[]{100});
        battLevelChar.addDescriptor(new BluetoothGattDescriptor(DESC_CLIENT_CHAR_CONFIG, BluetoothGattDescriptor.PERMISSION_READ | BluetoothGattDescriptor.PERMISSION_WRITE));
        batteryService.addCharacteristic(battLevelChar);
        serviceQueue.add(batteryService);

        // 3. HID Service
        BluetoothGattService hidService = new BluetoothGattService(SERVICE_HID, BluetoothGattService.SERVICE_TYPE_PRIMARY);

        BluetoothGattCharacteristic hidInfoChar = new BluetoothGattCharacteristic(CHAR_HID_INFORMATION, BluetoothGattCharacteristic.PROPERTY_READ, BluetoothGattCharacteristic.PERMISSION_READ);
        hidInfoChar.setValue(new byte[]{0x01, 0x11, 0x00, 0x02}); // HID v1.11, normally connectable
        hidService.addCharacteristic(hidInfoChar);

        BluetoothGattCharacteristic reportMapChar = new BluetoothGattCharacteristic(CHAR_REPORT_MAP, BluetoothGattCharacteristic.PROPERTY_READ, BluetoothGattCharacteristic.PERMISSION_READ);
        reportMapChar.setValue(REPORT_DESCRIPTOR);
        hidService.addCharacteristic(reportMapChar);

        BluetoothGattCharacteristic hidCpChar = new BluetoothGattCharacteristic(CHAR_HID_CONTROL_POINT, BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE, BluetoothGattCharacteristic.PERMISSION_WRITE);
        hidService.addCharacteristic(hidCpChar);

        BluetoothGattCharacteristic protoModeChar = new BluetoothGattCharacteristic(CHAR_PROTOCOL_MODE, BluetoothGattCharacteristic.PROPERTY_READ | BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE, BluetoothGattCharacteristic.PERMISSION_READ | BluetoothGattCharacteristic.PERMISSION_WRITE);
        protoModeChar.setValue(new byte[]{0x01}); // Report Protocol Mode default
        hidService.addCharacteristic(protoModeChar);

        // Keyboard Input Report (Report ID 1)
        inputReportChar = new BluetoothGattCharacteristic(CHAR_REPORT, BluetoothGattCharacteristic.PROPERTY_READ | BluetoothGattCharacteristic.PROPERTY_NOTIFY, BluetoothGattCharacteristic.PERMISSION_READ);
        inputReportChar.addDescriptor(new BluetoothGattDescriptor(DESC_CLIENT_CHAR_CONFIG, BluetoothGattDescriptor.PERMISSION_READ | BluetoothGattDescriptor.PERMISSION_WRITE));
        BluetoothGattDescriptor inputRefDesc = new BluetoothGattDescriptor(DESC_REPORT_REFERENCE, BluetoothGattDescriptor.PERMISSION_READ);
        inputRefDesc.setValue(new byte[]{REPORT_ID_KEYBOARD, 0x01});
        inputReportChar.addDescriptor(inputRefDesc);
        hidService.addCharacteristic(inputReportChar);

        // Keyboard Output Report (Report ID 1)
        outputReportChar = new BluetoothGattCharacteristic(CHAR_REPORT, BluetoothGattCharacteristic.PROPERTY_READ | BluetoothGattCharacteristic.PROPERTY_WRITE | BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE, BluetoothGattCharacteristic.PERMISSION_READ | BluetoothGattCharacteristic.PERMISSION_WRITE);
        BluetoothGattDescriptor outputRefDesc = new BluetoothGattDescriptor(DESC_REPORT_REFERENCE, BluetoothGattDescriptor.PERMISSION_READ);
        outputRefDesc.setValue(new byte[]{REPORT_ID_KEYBOARD, 0x02});
        outputReportChar.addDescriptor(outputRefDesc);
        hidService.addCharacteristic(outputReportChar);

        // Consumer Control Input Report (Report ID 2)
        consumerReportChar = new BluetoothGattCharacteristic(CHAR_REPORT, BluetoothGattCharacteristic.PROPERTY_READ | BluetoothGattCharacteristic.PROPERTY_NOTIFY, BluetoothGattCharacteristic.PERMISSION_READ);
        consumerReportChar.addDescriptor(new BluetoothGattDescriptor(DESC_CLIENT_CHAR_CONFIG, BluetoothGattDescriptor.PERMISSION_READ | BluetoothGattDescriptor.PERMISSION_WRITE));
        BluetoothGattDescriptor consumerRefDesc = new BluetoothGattDescriptor(DESC_REPORT_REFERENCE, BluetoothGattDescriptor.PERMISSION_READ);
        consumerRefDesc.setValue(new byte[]{REPORT_ID_CONSUMER, 0x01});
        consumerReportChar.addDescriptor(consumerRefDesc);
        hidService.addCharacteristic(consumerReportChar);

        // Mouse Input Report (Report ID 3)
        mouseReportChar = new BluetoothGattCharacteristic(CHAR_REPORT, BluetoothGattCharacteristic.PROPERTY_READ | BluetoothGattCharacteristic.PROPERTY_NOTIFY, BluetoothGattCharacteristic.PERMISSION_READ);
        mouseReportChar.addDescriptor(new BluetoothGattDescriptor(DESC_CLIENT_CHAR_CONFIG, BluetoothGattDescriptor.PERMISSION_READ | BluetoothGattDescriptor.PERMISSION_WRITE));
        BluetoothGattDescriptor mouseRefDesc = new BluetoothGattDescriptor(DESC_REPORT_REFERENCE, BluetoothGattDescriptor.PERMISSION_READ);
        mouseRefDesc.setValue(new byte[]{REPORT_ID_MOUSE, 0x01});
        mouseReportChar.addDescriptor(mouseRefDesc);
        hidService.addCharacteristic(mouseReportChar);

        // Boot Keyboard Input Report (Mandatory for HOGP Keyboard)
        bootKeyboardInputChar = new BluetoothGattCharacteristic(CHAR_BOOT_KEYBOARD_INPUT, BluetoothGattCharacteristic.PROPERTY_READ | BluetoothGattCharacteristic.PROPERTY_NOTIFY, BluetoothGattCharacteristic.PERMISSION_READ);
        bootKeyboardInputChar.addDescriptor(new BluetoothGattDescriptor(DESC_CLIENT_CHAR_CONFIG, BluetoothGattDescriptor.PERMISSION_READ | BluetoothGattDescriptor.PERMISSION_WRITE));
        hidService.addCharacteristic(bootKeyboardInputChar);

        // Boot Keyboard Output Report (Mandatory for HOGP Keyboard)
        bootKeyboardOutputChar = new BluetoothGattCharacteristic(CHAR_BOOT_KEYBOARD_OUTPUT, BluetoothGattCharacteristic.PROPERTY_READ | BluetoothGattCharacteristic.PROPERTY_WRITE | BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE, BluetoothGattCharacteristic.PERMISSION_READ | BluetoothGattCharacteristic.PERMISSION_WRITE);
        hidService.addCharacteristic(bootKeyboardOutputChar);

        // Boot Mouse Input Report (Mandatory for HOGP Mouse)
        bootMouseInputChar = new BluetoothGattCharacteristic(CHAR_BOOT_MOUSE_INPUT, BluetoothGattCharacteristic.PROPERTY_READ | BluetoothGattCharacteristic.PROPERTY_NOTIFY, BluetoothGattCharacteristic.PERMISSION_READ);
        bootMouseInputChar.addDescriptor(new BluetoothGattDescriptor(DESC_CLIENT_CHAR_CONFIG, BluetoothGattDescriptor.PERMISSION_READ | BluetoothGattDescriptor.PERMISSION_WRITE));
        hidService.addCharacteristic(bootMouseInputChar);

        serviceQueue.add(hidService);

        addNextService();
    }

    private void addNextService() {
        if (!serviceQueue.isEmpty()) {
            BluetoothGattService service = serviceQueue.poll();
            if (gattServer != null && service != null) {
                gattServer.addService(service);
            }
        } else {
            startAdvertising();
        }
    }

    private void ensureDeviceConnected(BluetoothDevice device) {
        if (device != null) {
            synchronized (connectedDevices) {
                if (connectedDevices.add(device)) {
                    Log.i(TAG, "GATT Client active: " + device.getName() + " [" + device.getAddress() + "]");
                    notifyStatus("BLE Connected: " + (device.getName() != null ? device.getName() : device.getAddress()), true);
                }
            }
        }
    }

    private final BluetoothGattServerCallback gattServerCallback = new BluetoothGattServerCallback() {
        @Override
        public void onServiceAdded(int status, BluetoothGattService service) {
            super.onServiceAdded(status, service);
            if (status == BluetoothGatt.GATT_SUCCESS) {
                Log.i(TAG, "GATT Service added: " + service.getUuid());
                addNextService();
            } else {
                Log.e(TAG, "Failed to add GATT service: " + status);
            }
        }

        @Override
        public void onConnectionStateChange(BluetoothDevice device, int status, int newState) {
            super.onConnectionStateChange(device, status, newState);
            Log.i(TAG, "BLE onConnectionStateChange: dev=" + (device != null ? device.getName() + " [" + device.getAddress() + "]" : "null") + " status=" + status + " newState=" + newState);
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                ensureDeviceConnected(device);
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                Log.i(TAG, "BLE Device disconnected: " + (device != null ? device.getAddress() : "null"));
                if (device != null) {
                    synchronized (connectedDevices) {
                        connectedDevices.remove(device);
                    }
                }
                boolean hasMore = !connectedDevices.isEmpty();
                notifyStatus(hasMore ? "BLE Connected" : "BLE Disconnected", hasMore);
            }
        }

        @Override
        public void onCharacteristicReadRequest(BluetoothDevice device, int requestId, int offset, BluetoothGattCharacteristic characteristic) {
            super.onCharacteristicReadRequest(device, requestId, offset, characteristic);
            ensureDeviceConnected(device);
            byte[] value = characteristic.getValue();
            if (value == null) {
                if (characteristic.getUuid().equals(CHAR_BOOT_KEYBOARD_INPUT) || characteristic.getUuid().equals(CHAR_REPORT)) {
                    value = new byte[8];
                } else if (characteristic.getUuid().equals(CHAR_BOOT_MOUSE_INPUT)) {
                    value = new byte[3];
                } else {
                    value = new byte[0];
                }
            }
            if (offset > value.length) {
                gattServer.sendResponse(device, requestId, BluetoothGatt.GATT_INVALID_OFFSET, offset, null);
            } else {
                byte[] response = Arrays.copyOfRange(value, offset, value.length);
                gattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, response);
            }
        }

        @Override
        public void onDescriptorReadRequest(BluetoothDevice device, int requestId, int offset, BluetoothGattDescriptor descriptor) {
            super.onDescriptorReadRequest(device, requestId, offset, descriptor);
            ensureDeviceConnected(device);
            byte[] val = descriptor.getValue();
            if (val == null) val = new byte[]{0x00, 0x00};
            gattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, val);
        }

        @Override
        public void onDescriptorWriteRequest(BluetoothDevice device, int requestId, BluetoothGattDescriptor descriptor, boolean preparedWrite, boolean responseNeeded, int offset, byte[] value) {
            super.onDescriptorWriteRequest(device, requestId, descriptor, preparedWrite, responseNeeded, offset, value);
            ensureDeviceConnected(device);
            descriptor.setValue(value);
            Log.i(TAG, "Descriptor write from " + (device != null ? device.getName() : "unknown") + " desc=" + descriptor.getUuid() + " val=" + Arrays.toString(value));
            if (responseNeeded) {
                gattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, value);
            }
        }
    };

    private void startAdvertising() {
        if (advertiser == null) return;

        AdvertiseSettings settings = new AdvertiseSettings.Builder()
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
                .setConnectable(true)
                .setTimeout(0)
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
                .build();

        AdvertiseData advertiseData = new AdvertiseData.Builder()
                .setIncludeDeviceName(false)
                .setIncludeTxPowerLevel(false)
                .addServiceUuid(new ParcelUuid(SERVICE_HID))
                .build();

        AdvertiseData scanResponseData = new AdvertiseData.Builder()
                .setIncludeDeviceName(true)
                .build();

        advertiser.startAdvertising(settings, advertiseData, scanResponseData, advertiseCallback);
    }

    private final AdvertiseCallback advertiseCallback = new AdvertiseCallback() {
        @Override
        public void onStartSuccess(AdvertiseSettings settingsInEffect) {
            super.onStartSuccess(settingsInEffect);
            Log.i(TAG, "BLE Advertising started successfully.");
            notifyStatus("BLE Advertising Online (Pair with PC/Mac)", false);
        }

        @Override
        public void onStartFailure(int errorCode) {
            super.onStartFailure(errorCode);
            Log.e(TAG, "BLE Advertising failed: " + errorCode);
            notifyStatus("BLE Advertising Failed: " + errorCode, false);
        }
    };

    public boolean connectDevice(BluetoothDevice device) {
        if (gattServer == null || device == null) return false;
        try {
            Log.i(TAG, "Initiating active GATT connection to bonded host: " + device.getName() + " [" + device.getAddress() + "]");
            notifyStatus("Connecting to " + (device.getName() != null ? device.getName() : device.getAddress()) + "...", false);
            boolean res = gattServer.connect(device, true);
            if (res) {
                ensureDeviceConnected(device);
            }
            restartAdvertising();
            return res;
        } catch (Exception e) {
            Log.e(TAG, "Error connecting to device: " + device.getAddress(), e);
            return false;
        }
    }

    public void reconnectBondedDevices() {
        if (bluetoothAdapter == null || gattServer == null) return;
        try {
            Set<BluetoothDevice> bonded = bluetoothAdapter.getBondedDevices();
            if (bonded != null) {
                for (BluetoothDevice dev : bonded) {
                    if (BluetoothHidManager.isEligibleHost(dev)) {
                        Log.i(TAG, "Auto-reconnecting to bonded host: " + dev.getName() + " [" + dev.getAddress() + "]");
                        connectDevice(dev);
                    }
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error during reconnectBondedDevices", e);
        }
    }

    public void restartAdvertising() {
        if (advertiser == null) return;
        try {
            advertiser.stopAdvertising(advertiseCallback);
        } catch (Exception ignored) {}
        mainHandler.postDelayed(this::startAdvertising, 200);
    }

    public boolean sendKeyPress(byte modifier, byte keycode) {
        if (gattServer == null) {
            return false;
        }

        byte[] pressReport = new byte[]{modifier, 0x00, keycode, 0x00, 0x00, 0x00, 0x00, 0x00};
        byte[] releaseReport = new byte[]{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};

        boolean delivered = false;
        if (inputReportChar != null) {
            delivered |= sendReportToAll(inputReportChar, pressReport);
        }
        if (bootKeyboardInputChar != null) {
            delivered |= sendReportToAll(bootKeyboardInputChar, pressReport);
        }

        mainHandler.postDelayed(() -> {
            if (inputReportChar != null) sendReportToAll(inputReportChar, releaseReport);
            if (bootKeyboardInputChar != null) sendReportToAll(bootKeyboardInputChar, releaseReport);
        }, 45);

        return delivered;
    }

    public boolean sendConsumerBit(byte bitMask) {
        if (gattServer == null || consumerReportChar == null) {
            return false;
        }

        byte[] pressReport = new byte[]{bitMask};
        byte[] releaseReport = new byte[]{0x00};

        boolean delivered = sendReportToAll(consumerReportChar, pressReport);
        mainHandler.postDelayed(() -> sendReportToAll(consumerReportChar, releaseReport), 35);

        return delivered;
    }

    private byte currentMouseButtonState = 0x00;

    public synchronized boolean sendMouseReport(byte buttons, byte dx, byte dy, byte wheel) {
        if (gattServer == null || connectedDevices.isEmpty()) {
            return false;
        }
        currentMouseButtonState = buttons;
        byte[] mouseReport = new byte[]{buttons, dx, dy, wheel};
        boolean delivered = false;
        if (mouseReportChar != null) {
            delivered |= sendReportToAll(mouseReportChar, mouseReport);
        }
        if (bootMouseInputChar != null) {
            byte[] bootReport = new byte[]{buttons, dx, dy};
            delivered |= sendReportToAll(bootMouseInputChar, bootReport);
        }
        return delivered;
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

    public void sendSeek(boolean isForward, int seconds) {
        int pulses = Math.max(1, Math.round((float) seconds / 5.0f));
        new Thread(() -> {
            byte key = isForward ? (byte) 0x4F : (byte) 0x50; // Right vs Left Arrow
            byte[] pressReport = new byte[]{0x00, 0x00, key, 0x00, 0x00, 0x00, 0x00, 0x00};
            byte[] releaseReport = new byte[]{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
            for (int i = 0; i < pulses; i++) {
                if (gattServer != null && inputReportChar != null) {
                    sendReportToAll(inputReportChar, pressReport);
                }
                try {
                    Thread.sleep(40);
                } catch (InterruptedException e) {
                    break;
                }
                if (gattServer != null && inputReportChar != null) {
                    sendReportToAll(inputReportChar, releaseReport);
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
        sendSeek(isForward, 10);
    }

    public void stopContinuousSeek() {
        // Safe no-op
    }

    public void sendVolumeStep(boolean isUp) {
        new Thread(() -> {
            byte bit = isUp ? (byte) 0x20 : (byte) 0x40; // 0x20 Vol+, 0x40 Vol-
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
                sendConsumerBit((byte) 0x20); // Vol+
                try {
                    Thread.sleep(12);
                } catch (InterruptedException ignored) {}
            }
        }).start();
    }

    public void sendVolumeZero() {
        new Thread(() -> {
            for (int i = 0; i < 50; i++) {
                sendConsumerBit((byte) 0x40); // Vol-
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
        if (gattServer == null || inputReportChar == null) return;
        byte mod = 0x00;
        byte key = 0x00;

        if (c >= 'a' && c <= 'z') {
            mod = 0x00;
            key = (byte) (0x04 + (c - 'a'));
        } else if (c >= 'A' && c <= 'Z') {
            mod = 0x02; // Shift
            key = (byte) (0x04 + (c - 'A'));
        } else if (c >= '1' && c <= '9') {
            mod = 0x00;
            key = (byte) (0x1E + (c - '1'));
        } else if (c == '0') {
            mod = 0x00;
            key = 0x27;
        } else {
            switch (c) {
                case ' ':  mod = 0x00; key = 0x2C; break;
                case '\n': mod = 0x00; key = 0x28; break;
                case '\r': return;
                case '\t': mod = 0x00; key = 0x2B; break;
                case '!':  mod = 0x02; key = 0x1E; break;
                case '@':  mod = 0x02; key = 0x1F; break;
                case '#':  mod = 0x02; key = 0x20; break;
                case '$':  mod = 0x02; key = 0x21; break;
                case '%':  mod = 0x02; key = 0x22; break;
                case '^':  mod = 0x02; key = 0x23; break;
                case '&':  mod = 0x02; key = 0x24; break;
                case '*':  mod = 0x02; key = 0x25; break;
                case '(':  mod = 0x02; key = 0x26; break;
                case ')':  mod = 0x02; key = 0x27; break;
                case '-':  mod = 0x00; key = 0x2D; break;
                case '_':  mod = 0x02; key = 0x2D; break;
                case '=':  mod = 0x00; key = 0x2E; break;
                case '+':  mod = 0x02; key = 0x2E; break;
                case '[':  mod = 0x00; key = 0x2F; break;
                case '{':  mod = 0x02; key = 0x2F; break;
                case ']':  mod = 0x00; key = 0x30; break;
                case '}':  mod = 0x02; key = 0x30; break;
                case '\\': mod = 0x00; key = 0x31; break;
                case '|':  mod = 0x02; key = 0x31; break;
                case ';':  mod = 0x00; key = 0x33; break;
                case ':':  mod = 0x02; key = 0x33; break;
                case '\'': mod = 0x00; key = 0x34; break;
                case '"':  mod = 0x02; key = 0x34; break;
                case '`':  mod = 0x00; key = 0x35; break;
                case '~':  mod = 0x02; key = 0x35; break;
                case ',':  mod = 0x00; key = 0x36; break;
                case '<':  mod = 0x02; key = 0x36; break;
                case '.':  mod = 0x00; key = 0x37; break;
                case '>':  mod = 0x02; key = 0x37; break;
                case '/':  mod = 0x00; key = 0x38; break;
                case '?':  mod = 0x02; key = 0x38; break;
                default:
                    return;
            }
        }

        byte[] press = new byte[]{mod, 0x00, key, 0x00, 0x00, 0x00, 0x00, 0x00};
        byte[] release = new byte[]{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};

        sendReportToAll(inputReportChar, press);
        try {
            Thread.sleep(15);
        } catch (InterruptedException ignored) {}
        sendReportToAll(inputReportChar, release);
        try {
            Thread.sleep(15);
        } catch (InterruptedException ignored) {}
    }

    private boolean sendReportToAll(BluetoothGattCharacteristic characteristic, byte[] report) {
        if (gattServer == null || characteristic == null) return false;

        boolean success = false;
        synchronized (connectedDevices) {
            for (BluetoothDevice dev : connectedDevices) {
                characteristic.setValue(report);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    int res = gattServer.notifyCharacteristicChanged(dev, characteristic, false, report);
                    if (res == BluetoothGatt.GATT_SUCCESS) success = true;
                } else {
                    if (gattServer.notifyCharacteristicChanged(dev, characteristic, false)) {
                        success = true;
                    }
                }
            }
        }
        return success;
    }

    public boolean hasConnectedDevices() {
        synchronized (connectedDevices) {
            return !connectedDevices.isEmpty();
        }
    }

    public BluetoothDevice getPrimaryConnectedDevice() {
        synchronized (connectedDevices) {
            if (!connectedDevices.isEmpty()) {
                return connectedDevices.iterator().next();
            }
            return null;
        }
    }

    public void stop() {
        try {
            if (advertiser != null) {
                advertiser.stopAdvertising(advertiseCallback);
            }
            if (gattServer != null) {
                gattServer.close();
            }
            synchronized (connectedDevices) {
                connectedDevices.clear();
            }
            Log.i(TAG, "BLE HID Server stopped.");
        } catch (Exception e) {
            Log.e(TAG, "Error stopping BLE server: " + e.getMessage());
        }
    }

    private void notifyStatus(String status, boolean isConnected) {
        mainHandler.post(() -> {
            if (listener != null) {
                listener.onBleStateChanged(status, isConnected);
            }
        });
    }
}
