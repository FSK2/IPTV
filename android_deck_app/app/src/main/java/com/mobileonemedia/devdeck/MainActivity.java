package com.mobileonemedia.devdeck;

import android.Manifest;
import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.PowerManager;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.Settings;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.ConsoleMessage;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import android.speech.tts.TextToSpeech;
import java.util.Locale;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Set;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    private static final int PERMISSION_REQUEST_CODE = 101;
    private static final int FILE_CHOOSER_REQUEST_CODE = 102;
    private ValueCallback<Uri[]> mFilePathCallback;
    private WebView webView;
    private BluetoothHidManager hidManager;
    private BleHidDeviceServer bleHidServer;
    private Vibrator vibrator;
    private BroadcastReceiver batteryReceiver;
    private TextToSpeech tts;
    private java.net.DatagramSocket udpSocket;
    private Thread udpListenerThread;
    private volatile boolean isDiscoveryRunning = false;
    private volatile String lastDiscoveredCompanionIp = "192.168.100.37";
    private volatile String lastDiscoveredCompanionHost = "MSI";
    private volatile boolean isCompanionOnline = false;
    private volatile int currentBatteryPct = 100;

    public String getDeviceDisplayName() {
        try {
            String model = Build.MODEL;
            String mfg = Build.MANUFACTURER;
            if (model != null) {
                if (model.toLowerCase().contains("cph2389") || model.toLowerCase().contains("nord")) {
                    return "OnePlus Nord";
                }
                if (mfg != null && !model.toLowerCase().startsWith(mfg.toLowerCase())) {
                    return mfg + " " + model;
                }
                return model;
            }
        } catch (Exception ignored) {}
        return "OnePlus Nord";
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Keep screen on while coding & lock to portrait
        getWindow().addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        webView = new WebView(this);
        setContentView(webView);

        vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);

        setupWebView();
        registerBatteryMonitor();
        startCompanionAutoDiscovery();
        restoreOriginalBluetoothName();

        try {
            tts = new TextToSpeech(this, status -> {
                if (status == TextToSpeech.SUCCESS && tts != null) {
                    tts.setLanguage(Locale.US);
                    tts.setSpeechRate(0.88f);
                    tts.setPitch(0.98f);
                }
            });
        } catch (Exception ignored) {}
    }

    @Override
    protected void onResume() {
        super.onResume();
        restoreOriginalBluetoothName();
        updateRealBattery();
        updateRealConnectionState();
        updateBatteryOptimizationState();
    }

    private void restoreOriginalBluetoothName() {
        try {
            BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
            if (adapter != null) {
                String currentName = adapter.getName();
                if (currentName != null && (currentName.toLowerCase().contains("devdeck") || currentName.toLowerCase().contains("dev studio"))) {
                    String model = Build.MODEL;
                    if (model == null || model.isEmpty()) model = "OnePlus Nord";
                    adapter.setName(model);
                    Log.d(TAG, "Restored native Bluetooth device name: " + model);
                }
            }
        } catch (Exception ignored) {}
    }

    private void updateBatteryOptimizationState() {
        boolean ignored = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
            ignored = (pm != null && pm.isIgnoringBatteryOptimizations(getPackageName()));
        }
        final boolean isIgnored = ignored;
        if (webView != null) {
            webView.post(() -> {
                String script = "if(window.updateBatteryOptimizationUI){window.updateBatteryOptimizationUI(" + isIgnored + ");}";
                webView.evaluateJavascript(script, null);
            });
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null) {
            webView.evaluateJavascript("(function(){ if(window.handleAppBackPressed){ return window.handleAppBackPressed(); } return false; })()", value -> {
                if (!"true".equalsIgnoreCase(value) && !"\"true\"".equalsIgnoreCase(value)) {
                    showExitConfirmationDialog();
                }
            });
        } else {
            showExitConfirmationDialog();
        }
    }

    public void showExitConfirmationDialog() {
        runOnUiThread(() -> {
            new androidx.appcompat.app.AlertDialog.Builder(this)
                    .setTitle("Exit DevDeck?")
                    .setMessage("Are you sure you want to exit DevDeck Studio?")
                    .setPositiveButton("Exit", (dialog, which) -> {
                        finishAffinity();
                    })
                    .setNegativeButton("Cancel", (dialog, which) -> dialog.dismiss())
                    .setCancelable(true)
                    .show();
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            if (mFilePathCallback == null) return;
            if (resultCode != RESULT_OK || data == null) {
                mFilePathCallback.onReceiveValue(null);
                mFilePathCallback = null;
                return;
            }
            Uri[] results = null;
            if (resultCode == RESULT_OK && data != null) {
                if (data.getClipData() != null) {
                    int count = data.getClipData().getItemCount();
                    results = new Uri[count];
                    for (int i = 0; i < count; i++) {
                        results[i] = data.getClipData().getItemAt(i).getUri();
                    }
                } else if (data.getData() != null) {
                    results = new Uri[]{data.getData()};
                }
            }
            mFilePathCallback.onReceiveValue(results);
            mFilePathCallback = null;
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        isDiscoveryRunning = false;
        if (udpSocket != null && !udpSocket.isClosed()) {
            try { udpSocket.close(); } catch (Exception ignored) {}
        }
        if (bleHidServer != null) {
            bleHidServer.stop();
        }
        if (batteryReceiver != null) {
            try {
                unregisterReceiver(batteryReceiver);
            } catch (Exception ignored) {}
        }
        if (tts != null) {
            try {
                tts.stop();
                tts.shutdown();
            } catch (Exception ignored) {}
        }
    }

    public void startCompanionAutoDiscovery() {
        if (isDiscoveryRunning) return;
        isDiscoveryRunning = true;

        // 1. UDP Broadcast Listener on Port 8990
        udpListenerThread = new Thread(() -> {
            try {
                udpSocket = new java.net.DatagramSocket(8990);
                udpSocket.setBroadcast(true);
                byte[] buf = new byte[1024];

                while (isDiscoveryRunning) {
                    try {
                        java.net.DatagramPacket packet = new java.net.DatagramPacket(buf, buf.length);
                        if (udpSocket.isClosed()) break;
                        udpSocket.receive(packet);
                        String msg = new String(packet.getData(), 0, packet.getLength(), java.nio.charset.StandardCharsets.UTF_8);
                        String senderIp = packet.getAddress().getHostAddress();
                        if (msg.startsWith("DEVDECK_BEACON")) {
                            String[] parts = msg.split(":");
                            String hostName = parts.length > 2 ? parts[2] : "Host PC";
                            notifyCompanionDiscovered(senderIp, hostName);
                        }
                    } catch (Exception ignored) {}
                }
            } catch (Exception ignored) {}
        });
        udpListenerThread.setDaemon(true);
        udpListenerThread.start();

        // 2. Efficient Active Probe Loop of 127.0.0.1 (USB Reverse) & Wi-Fi LAN
        Thread probeSupervisorThread = new Thread(() -> {
            while (isDiscoveryRunning) {
                if (isCompanionOnline && lastDiscoveredCompanionIp != null && !lastDiscoveredCompanionIp.isEmpty()) {
                    probeHost(lastDiscoveredCompanionIp);
                    if (!"127.0.0.1".equals(lastDiscoveredCompanionIp)) {
                        probeHost("127.0.0.1");
                    }
                    try { Thread.sleep(5000); } catch (InterruptedException e) { break; }
                    continue;
                }

                String[] probeList = new String[]{"127.0.0.1", "192.168.100.37", "10.0.2.2", "192.168.42.129", "192.168.137.1"};
                for (String ip : probeList) {
                    if (isCompanionOnline) break;
                    probeHost(ip);
                }

                if (!isCompanionOnline) {
                    try {
                        java.util.Enumeration<java.net.NetworkInterface> interfaces = java.net.NetworkInterface.getNetworkInterfaces();
                        if (interfaces != null) {
                            while (interfaces.hasMoreElements()) {
                                java.net.NetworkInterface nif = interfaces.nextElement();
                                java.util.Enumeration<java.net.InetAddress> addrs = nif.getInetAddresses();
                                while (addrs.hasMoreElements()) {
                                    java.net.InetAddress addr = addrs.nextElement();
                                    if (!addr.isLoopbackAddress() && addr instanceof java.net.Inet4Address) {
                                        String host = addr.getHostAddress();
                                        int lastDot = host != null ? host.lastIndexOf('.') : -1;
                                        if (lastDot > 0) {
                                            String prefix = host.substring(0, lastDot + 1);
                                            for (int i = 1; i <= 254; i++) {
                                                if (isCompanionOnline) break;
                                                final String targetIp = prefix + i;
                                                new Thread(() -> probeHost(targetIp)).start();
                                                if (i % 25 == 0) Thread.sleep(40);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } catch (Exception ignored) {}
                }

                try {
                    Thread.sleep(8000);
                } catch (InterruptedException e) {
                    break;
                }
            }
        });
        probeSupervisorThread.setDaemon(true);
        probeSupervisorThread.start();
    }

    private void probeHost(String ip) {
        if (ip == null || ip.isEmpty()) return;
        java.net.HttpURLConnection conn = null;
        try {
            String devName = getDeviceDisplayName();
            String q = "device=" + java.net.URLEncoder.encode(devName, "UTF-8") + "&battery=" + currentBatteryPct;
            java.net.URL url = new java.net.URL("http://" + ip + ":8989/api/status?" + q);
            conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Connection", "close");
            conn.setRequestProperty("X-Device-Model", devName);
            conn.setRequestProperty("X-Device-Battery", String.valueOf(currentBatteryPct));
            conn.setConnectTimeout(800);
            conn.setReadTimeout(800);
            if (conn.getResponseCode() == 200) {
                java.io.InputStream is = conn.getInputStream();
                java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
                byte[] b = new byte[512];
                int r;
                while ((r = is.read(b)) != -1) baos.write(b, 0, r);
                String resp = baos.toString("UTF-8");
                String hostName = "MSI";
                if (resp.contains("\"hostname\":\"")) {
                    int s = resp.indexOf("\"hostname\":\"") + 12;
                    int e = resp.indexOf("\"", s);
                    if (e > s) hostName = resp.substring(s, e);
                }
                notifyCompanionDiscovered(ip, hostName);
            }
        } catch (Exception ignored) {
        } finally {
            if (conn != null) {
                try { conn.disconnect(); } catch (Exception ignored) {}
            }
        }
    }

    private void notifyCompanionDiscovered(String ip, String hostName) {
        if (ip != null && !ip.isEmpty()) {
            this.lastDiscoveredCompanionIp = ip;
            this.lastDiscoveredCompanionHost = (hostName != null && !hostName.isEmpty()) ? hostName : "MSI";
            this.isCompanionOnline = true;
        }
        if (webView != null) {
            webView.post(() -> {
                String safeHost = (lastDiscoveredCompanionHost != null && !lastDiscoveredCompanionHost.isEmpty()) ? lastDiscoveredCompanionHost : "MSI";
                String js = String.format(Locale.US,
                        "if(window.onCompanionDiscovered){window.onCompanionDiscovered('%s', '%s');} if(window.updateConnectionUI){window.updateConnectionUI('%s', true);}",
                        ip.replace("'", "\\'"), safeHost.replace("'", "\\'"), safeHost.replace("'", "\\'"));
                webView.evaluateJavascript(js, null);
                updateRealConnectionState();
            });
        }
    }

    private void registerBatteryMonitor() {
        batteryReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
                int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
                if (level >= 0 && scale > 0) {
                    int pct = (int) ((level / (float) scale) * 100);
                    currentBatteryPct = pct;
                    sendBatteryToUI(pct);
                }
            }
        };
        registerReceiver(batteryReceiver, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    }

    private void updateRealBattery() {
        BatteryManager bm = (BatteryManager) getSystemService(Context.BATTERY_SERVICE);
        int level = 100;
        if (bm != null) {
            level = bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY);
            if (level <= 0 || level > 100) level = 100;
        }
        currentBatteryPct = level;
        sendBatteryToUI(level);
    }

    private void sendBatteryToUI(int level) {
        webView.post(() -> webView.evaluateJavascript(
                "if(window.updateBattery){window.updateBattery(" + level + ");}", null));
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        webView.setHorizontalScrollBarEnabled(false);
        webView.setVerticalScrollBarEnabled(true);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
        settings.setLoadsImagesAutomatically(true);
        settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setUseWideViewPort(false);
        settings.setLoadWithOverviewMode(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d("DevDeckWeb", consoleMessage.message() + " -- Line " + consoleMessage.lineNumber() + " of " + consoleMessage.sourceId());
                return true;
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
                if (mFilePathCallback != null) {
                    mFilePathCallback.onReceiveValue(null);
                    mFilePathCallback = null;
                }
                mFilePathCallback = filePathCallback;

                try {
                    Intent intent = fileChooserParams.createIntent();
                    startActivityForResult(intent, FILE_CHOOSER_REQUEST_CODE);
                } catch (Exception e) {
                    try {
                        Intent fallbackIntent = new Intent(Intent.ACTION_GET_CONTENT);
                        fallbackIntent.addCategory(Intent.CATEGORY_OPENABLE);
                        fallbackIntent.setType("*/*");
                        startActivityForResult(Intent.createChooser(fallbackIntent, "Select Files to Stream"), FILE_CHOOSER_REQUEST_CODE);
                    } catch (Exception ex) {
                        mFilePathCallback = null;
                        return false;
                    }
                }
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("market://")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception ignored) {}
                }
                return false;
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, android.webkit.WebResourceRequest request) {
                if (request != null && request.getUrl() != null) {
                    String url = request.getUrl().toString();
                    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("market://")) {
                        try {
                            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                            startActivity(intent);
                            return true;
                        } catch (Exception ignored) {}
                    }
                }
                return false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                updateRealBattery();
                updateRealConnectionState();
                updateBatteryOptimizationState();
                if (getIntent() != null && getIntent().hasExtra("tab")) {
                    String tab = getIntent().getStringExtra("tab");
                    getIntent().removeExtra("tab");
                    if (tab != null && !tab.isEmpty()) {
                        webView.post(() -> webView.evaluateJavascript("if(window.switchTab){window.switchTab('" + tab + "');}", null));
                    }
                } else {
                    webView.post(() -> webView.evaluateJavascript("if(window.switchTab){window.switchTab('matrix');}", null));
                }
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                Log.e("DevDeckWeb", "Error loading " + failingUrl + ": " + description);
            }
        });
        WebView.setWebContentsDebuggingEnabled(true);
        webView.addJavascriptInterface(new WebAppInterface(), "AndroidBridge");

        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (intent != null && intent.hasExtra("tab")) {
            String tab = intent.getStringExtra("tab");
            if (tab != null && !tab.isEmpty() && webView != null) {
                webView.post(() -> webView.evaluateJavascript("if(window.switchTab){window.switchTab('" + tab + "');}", null));
            }
        }
    }

    private void updateRealConnectionState() {
        boolean isConn = false;
        String hostName = "Host PC";

        if (hidManager != null && hidManager.getConnectedDevice() != null) {
            isConn = true;
            BluetoothDevice dev = hidManager.getConnectedDevice();
            hostName = dev.getName() != null ? dev.getName() : "Host PC";
        } else if (bleHidServer != null && bleHidServer.hasConnectedDevices()) {
            isConn = true;
            BluetoothDevice dev = bleHidServer.getPrimaryConnectedDevice();
            hostName = (dev != null && dev.getName() != null) ? dev.getName() : "Host PC";
        } else if (isCompanionOnline && lastDiscoveredCompanionIp != null && !lastDiscoveredCompanionIp.isEmpty()) {
            isConn = true;
            hostName = (lastDiscoveredCompanionHost != null && !lastDiscoveredCompanionHost.isEmpty()) ? lastDiscoveredCompanionHost : "MSI";
        }

        final boolean connected = isConn;
        final String name = hostName;
        webView.post(() -> {
            String script = String.format("if(window.updateConnectionUI){window.updateConnectionUI('%s', %b);}",
                    name.replace("'", "\\'"), connected);
            webView.evaluateJavascript(script, null);
        });
    }

    private void checkAndRequestPermissions() {
        // Bluetooth permissions removed - companion operates via local Wi-Fi / USB socket on Port 8989
    }

    private void initHidManager() {
        // Bluetooth HID server disabled - DevDeck Studio socket is active
    }

    private void sendBleMacro(String label, String osMode) {
        if (bleHidServer == null) return;
        boolean isMac = "mac".equalsIgnoreCase(osMode);
        byte mod = 0x00;
        byte key = 0x00;

        switch (label.toLowerCase().trim()) {
            case "undo":
                mod = isMac ? (byte) 0x08 : (byte) 0x01; // Cmd vs Ctrl
                key = 0x1D; // KEY_Z
                break;
            case "redo":
                mod = isMac ? (byte) (0x08 | 0x02) : (byte) 0x01; // Cmd+Shift vs Ctrl
                key = isMac ? (byte) 0x1D : (byte) 0x1C; // Z vs Y
                break;
            case "cut":
                mod = isMac ? (byte) 0x08 : (byte) 0x01;
                key = 0x1B; // KEY_X
                break;
            case "copy":
                mod = isMac ? (byte) 0x08 : (byte) 0x01;
                key = 0x06; // KEY_C
                break;
            case "paste":
                mod = isMac ? (byte) 0x08 : (byte) 0x01;
                key = 0x19; // KEY_V
                break;
            case "clipboard hist":
            case "clipboard history":
                // Win + V on Windows / Ctrl + Cmd + V on Mac
                mod = isMac ? (byte) (0x01 | 0x08) : (byte) 0x08; // Win (0x08 GUI)
                key = 0x19; // KEY_V
                break;
            case "text extract":
            case "ocr extract":
                // Win + Shift + T (Windows 11 PowerToys OCR) / Cmd + Shift + 2 on Mac
                mod = isMac ? (byte) (0x08 | 0x02) : (byte) (0x08 | 0x02); // Win + Shift
                key = isMac ? (byte) 0x1F : (byte) 0x17; // T (0x17)
                break;
            case "select all":
                mod = isMac ? (byte) 0x08 : (byte) 0x01;
                key = 0x04; // KEY_A
                break;
            case "save":
                mod = isMac ? (byte) 0x08 : (byte) 0x01;
                key = 0x16; // KEY_S
                break;
            case "find / replace":
            case "find":
                mod = isMac ? (byte) 0x08 : (byte) 0x01;
                key = 0x09; // KEY_F
                break;
            case "bold":
                mod = isMac ? (byte) 0x08 : (byte) 0x01;
                key = 0x05; // KEY_B
                break;
            case "italic":
                mod = isMac ? (byte) 0x08 : (byte) 0x01;
                key = 0x0C; // KEY_I
                break;
            case "underline":
                mod = isMac ? (byte) 0x08 : (byte) 0x01;
                key = 0x18; // KEY_U
                break;
            case "indent":
            case "indent / jump":
            case "tab":
                mod = 0x00;
                key = 0x2B; // KEY_TAB
                break;
            case "new tab":
                mod = isMac ? (byte) 0x08 : (byte) 0x01;
                key = 0x17; // KEY_T
                break;
            case "close tab":
                mod = isMac ? (byte) 0x08 : (byte) 0x01;
                key = 0x1A; // KEY_W
                break;
            case "reopen":
            case "reopen tab":
                mod = isMac ? (byte) (0x08 | 0x02) : (byte) (0x01 | 0x02);
                key = 0x17; // KEY_T
                break;
            case "refresh":
                mod = isMac ? (byte) 0x08 : (byte) 0x01;
                key = 0x15; // KEY_R
                break;
            case "history":
                mod = isMac ? (byte) 0x08 : (byte) 0x01;
                key = isMac ? (byte) 0x1C : (byte) 0x0B; // Y vs H
                break;
            case "app switch":
                mod = isMac ? (byte) 0x08 : (byte) 0x04; // Cmd vs Alt
                key = 0x2B; // KEY_TAB
                break;
            case "snip tool":
            case "screenshot":
                if (isMac) {
                    mod = (byte) (0x08 | 0x02); // Cmd + Shift
                    key = 0x21; // 4
                } else {
                    mod = 0x00;
                    key = 0x46; // PrintScreen
                }
                break;
            case "desktop":
                if (isMac) {
                    mod = 0x00;
                    key = 0x44; // F11
                } else {
                    mod = 0x08; // Win
                    key = 0x07; // D
                }
                break;
            case "task mgr":
                if (isMac) {
                    mod = (byte) (0x08 | 0x04);
                    key = 0x29; // ESC
                } else {
                    mod = (byte) (0x01 | 0x02); // Ctrl + Shift
                    key = 0x29; // ESC
                }
                break;
            case "print":
                mod = isMac ? (byte) 0x08 : (byte) 0x01;
                key = 0x13; // KEY_P
                break;
            case "force kill":
                if (isMac) {
                    mod = 0x08;
                    key = 0x14; // KEY_Q
                } else {
                    mod = 0x04;
                    key = 0x3D; // KEY_F4
                }
                break;
            case "lock pc":
                if (isMac) {
                    mod = (byte) (0x01 | 0x08); // Ctrl + Cmd
                    key = 0x14; // Q
                } else {
                    mod = 0x08; // Win
                    key = 0x0F; // L
                }
                break;
            case "search":
            case "search menu":
            case "open search menu":
                mod = (byte) 0x08; // Win / Cmd
                key = isMac ? (byte) 0x2C : (byte) 0x16; // Space vs S
                break;
            case "settings":
            case "settings menu":
            case "open setting menu":
            case "quick settings":
                mod = (byte) 0x08; // Win / Cmd
                key = isMac ? (byte) 0x36 : (byte) 0x04; // ',' vs A
                break;
            case "{":
                mod = 0x02; // Shift
                key = 0x2F; // [
                break;
            case "[":
                mod = 0x00;
                key = 0x2F; // [
                break;
            case "(":
                mod = 0x02; // Shift
                key = 0x26; // 9
                break;
            case "<":
            case "slower":
            case "slow":
            case "speed_down":
                mod = 0x02; // Shift
                key = 0x36; // , / <
                break;
            case ">":
            case "faster":
            case "fast":
            case "speed_up":
                mod = 0x02; // Shift
                key = 0x37; // . / >
                break;
            case "speed_normal":
            case "speed_reset":
            case "normal_speed":
                new Thread(() -> {
                    for (int i = 0; i < 8; i++) {
                        bleHidServer.sendKeyPress((byte) 0x02, (byte) 0x36); // Shift + ,
                        try { Thread.sleep(30); } catch (InterruptedException ignored) {}
                    }
                    for (int i = 0; i < 3; i++) {
                        bleHidServer.sendKeyPress((byte) 0x02, (byte) 0x37); // Shift + .
                        try { Thread.sleep(30); } catch (InterruptedException ignored) {}
                    }
                }).start();
                return;
            case "format":
                mod = isMac ? (byte) (0x04 | 0x02) : (byte) (0x04 | 0x02); // Alt + Shift
                key = 0x09; // F
                break;
            case "quick run":
                mod = 0x08; // Win
                key = 0x15; // R
                break;
            case "devtools":
            case "dev tools":
                mod = 0x00;
                key = 0x45; // F12
                break;
            case ";":
                mod = 0x00;
                key = 0x33; // ;
                break;
            case ":":
                mod = 0x02; // Shift
                key = 0x33; // :
                break;
            case "enter":
            case "return":
                mod = 0x00;
                key = 0x28; // KEY_ENTER
                break;
            case "play":
                bleHidServer.sendConsumerBit((byte) 0x08); // Play bit
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x2C); // Spacebar fallback
                return;
            case "pause":
                bleHidServer.sendConsumerBit((byte) 0x08); // Pause bit
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x2C); // Spacebar fallback
                return;
            case "play_pause":
                bleHidServer.sendConsumerBit((byte) 0x08); // Play/Pause bit
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x2C); // Spacebar fallback
                return;
            case "stop":
                bleHidServer.sendConsumerBit((byte) 0x04); // Stop bit
                return;
            case "mute":
                bleHidServer.sendConsumerBit((byte) 0x10); // Mute bit
                return;
            case "vol_up":
                bleHidServer.sendConsumerBit((byte) 0x20); // Vol+ bit
                return;
            case "vol_down":
                bleHidServer.sendConsumerBit((byte) 0x40); // Vol- bit
                return;
            case "seek_forward":
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x4F); // Right arrow
                return;
            case "seek_reverse":
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x50); // Left arrow
                return;
            case "skip_ad":
            case "skip ad":
                skipYouTubeAd();
                return;
            case "fullscreen":
            case "f":
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x09); // 'f'
                return;
            case "theater":
            case "theater_mode":
            case "t":
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x17); // 't'
                return;
            case "captions":
            case "c":
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x06); // 'c'
                return;
            case "miniplayer":
            case "i":
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x0C); // 'i'
                return;
            case "backspace":
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x2A);
                return;
            case "space":
            case "spacebar":
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x2C);
                return;
            case "left":
            case "left_arrow":
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x50);
                return;
            case "right":
            case "right_arrow":
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x4F);
                return;
            case "up":
            case "up_arrow":
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x52);
                return;
            case "down":
            case "down_arrow":
                bleHidServer.sendKeyPress((byte) 0x00, (byte) 0x51);
                return;
        }

        bleHidServer.sendKeyPress(mod, key);
    }

    public void skipYouTubeAd() {
        triggerHapticFeedback();
        // Do not pulse Tab + Enter over Bluetooth HID! In modern YouTube, Tab focuses the sponsor link
        // and Enter opens the advertiser's website. UI Automation via Companion handles Skip directly.
    }

    private void triggerHapticFeedback() {
        if (vibrator != null && vibrator.hasVibrator()) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createOneShot(15, VibrationEffect.DEFAULT_AMPLITUDE));
            } else {
                vibrator.vibrate(15);
            }
        }
    }

    private void sendKeystrokeFallback(byte modifier, byte keycode) {
        boolean sent = false;
        if (hidManager != null && hidManager.isConnected()) {
            sent = hidManager.sendKeystroke(modifier, keycode);
        }
        if (!sent && bleHidServer != null && bleHidServer.hasConnectedDevices()) {
            sent = bleHidServer.sendKeyPress(modifier, keycode);
        }
        if (!sent) {
            if (hidManager != null) hidManager.sendKeystroke(modifier, keycode);
            if (bleHidServer != null) bleHidServer.sendKeyPress(modifier, keycode);
        }
    }

    private void sendConsumerBitFallback(byte bitMask) {
        boolean sent = false;
        if (hidManager != null && hidManager.isConnected()) {
            sent = hidManager.sendConsumerBit(bitMask);
        }
        if (!sent && bleHidServer != null && bleHidServer.hasConnectedDevices()) {
            sent = bleHidServer.sendConsumerBit(bitMask);
        }
        if (!sent) {
            if (hidManager != null) hidManager.sendConsumerBit(bitMask);
            if (bleHidServer != null) bleHidServer.sendConsumerBit(bitMask);
        }
    }

    public class WebAppInterface {
        @JavascriptInterface
        public void sendMouseMove(int dx, int dy) {
            if (hidManager != null && hidManager.isConnected()) {
                hidManager.sendMouseMove(dx, dy);
            } else if (bleHidServer != null && bleHidServer.hasConnectedDevices()) {
                bleHidServer.sendMouseMove(dx, dy);
            } else if (hidManager != null) {
                hidManager.sendMouseMove(dx, dy);
            } else if (bleHidServer != null) {
                bleHidServer.sendMouseMove(dx, dy);
            }
            sendHttpMouse(lastDiscoveredCompanionIp, "{\"dx\":" + dx + ",\"dy\":" + dy + "}");
        }

        @JavascriptInterface
        public void sendMouseClick(int button) {
            triggerHapticFeedback();
            if (hidManager != null && hidManager.isConnected()) {
                hidManager.sendMouseClick(button);
            } else if (bleHidServer != null && bleHidServer.hasConnectedDevices()) {
                bleHidServer.sendMouseClick(button);
            } else if (hidManager != null) {
                hidManager.sendMouseClick(button);
            } else if (bleHidServer != null) {
                bleHidServer.sendMouseClick(button);
            }
            int cCode = button == 1 ? 0 : (button == 2 ? 2 : 1);
            sendHttpMouse(lastDiscoveredCompanionIp, "{\"click\":" + cCode + "}");
        }

        @JavascriptInterface
        public void sendMouseButtonState(int button, boolean isDown) {
            if (isDown) triggerHapticFeedback();
            if (hidManager != null && hidManager.isConnected()) {
                hidManager.setMouseButtonState(button, isDown);
            } else if (bleHidServer != null && bleHidServer.hasConnectedDevices()) {
                bleHidServer.setMouseButtonState(button, isDown);
            } else if (hidManager != null) {
                hidManager.setMouseButtonState(button, isDown);
            } else if (bleHidServer != null) {
                bleHidServer.setMouseButtonState(button, isDown);
            }
            int cCode = button == 1 ? 0 : (button == 2 ? 2 : 1);
            if (isDown) {
                sendHttpMouse(lastDiscoveredCompanionIp, "{\"down\":" + cCode + "}");
            } else {
                sendHttpMouse(lastDiscoveredCompanionIp, "{\"up\":" + cCode + "}");
            }
        }

        @JavascriptInterface
        public void sendMouseWheel(int delta) {
            if (hidManager != null && hidManager.isConnected()) {
                hidManager.sendMouseWheel(delta);
            } else if (bleHidServer != null && bleHidServer.hasConnectedDevices()) {
                bleHidServer.sendMouseWheel(delta);
            } else if (hidManager != null) {
                hidManager.sendMouseWheel(delta);
            } else if (bleHidServer != null) {
                bleHidServer.sendMouseWheel(delta);
            }
            sendHttpMouse(lastDiscoveredCompanionIp, "{\"wheel\":" + delta + "}");
        }

        @JavascriptInterface
        public boolean isConnected() {
            return isCompanionOnline;
        }

        @JavascriptInterface
        public String getConnectedHost() {
            return (lastDiscoveredCompanionHost != null && !lastDiscoveredCompanionHost.isEmpty()) ? lastDiscoveredCompanionHost : "MSI";
        }

        @JavascriptInterface
        public String getConnectedIp() {
            return (lastDiscoveredCompanionIp != null && !lastDiscoveredCompanionIp.isEmpty()) ? lastDiscoveredCompanionIp : "192.168.100.37";
        }

        @JavascriptInterface
        public String getDeviceModelName() {
            return getDeviceDisplayName();
        }

        @JavascriptInterface
        public int getBatteryLevel() {
            return currentBatteryPct;
        }

        @JavascriptInterface
        public void probeCompanionNow() {
            new Thread(() -> {
                String[] list = new String[]{"127.0.0.1", "192.168.100.37", "10.0.2.2"};
                for (String ip : list) {
                    probeHost(ip);
                }
                if (lastDiscoveredCompanionIp != null && !lastDiscoveredCompanionIp.isEmpty()) {
                    probeHost(lastDiscoveredCompanionIp);
                }
            }).start();
        }

        @JavascriptInterface
        public void triggerAutoDiscover() {
            startCompanionAutoDiscovery();
        }

        @JavascriptInterface
        public void sendHttpAction(String ip, String actionJson) {
            if (actionJson == null || actionJson.isEmpty()) return;
            new Thread(() -> {
                String target = (lastDiscoveredCompanionIp != null && !lastDiscoveredCompanionIp.isEmpty())
                        ? lastDiscoveredCompanionIp : (ip != null && !ip.isEmpty() ? ip : "127.0.0.1");
                boolean sent = sendPostRequest(target, "/api/action", actionJson, "application/json; charset=utf-8");
                if (!sent && !"127.0.0.1".equals(target)) {
                    sendPostRequest("127.0.0.1", "/api/action", actionJson, "application/json; charset=utf-8");
                }
            }).start();
        }

        @JavascriptInterface
        public void sendHttpMouse(String ip, String mouseJson) {
            if (mouseJson == null || mouseJson.isEmpty()) return;
            new Thread(() -> {
                String target = (lastDiscoveredCompanionIp != null && !lastDiscoveredCompanionIp.isEmpty())
                        ? lastDiscoveredCompanionIp : (ip != null && !ip.isEmpty() ? ip : "127.0.0.1");
                boolean sent = sendPostRequest(target, "/api/mouse", mouseJson, "application/json; charset=utf-8");
                if (!sent && !"127.0.0.1".equals(target)) {
                    sendPostRequest("127.0.0.1", "/api/mouse", mouseJson, "application/json; charset=utf-8");
                }
            }).start();
        }

        @JavascriptInterface
        public void sendHttpText(String ip, String text) {
            if (text == null || text.isEmpty()) return;
            new Thread(() -> {
                String target = (lastDiscoveredCompanionIp != null && !lastDiscoveredCompanionIp.isEmpty())
                        ? lastDiscoveredCompanionIp : (ip != null && !ip.isEmpty() ? ip : "127.0.0.1");
                boolean sent = sendPostRequest(target, "/api/text", text, "text/plain; charset=utf-8");
                if (!sent && !"127.0.0.1".equals(target)) {
                    sendPostRequest("127.0.0.1", "/api/text", text, "text/plain; charset=utf-8");
                }
            }).start();
        }

        private boolean sendPostRequest(String targetIp, String endpoint, String data, String contentType) {
            if (targetIp == null || targetIp.isEmpty()) return false;
            java.net.HttpURLConnection conn = null;
            try {
                java.net.URL url = new java.net.URL("http://" + targetIp + ":8989" + endpoint);
                conn = (java.net.HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", contentType);
                conn.setRequestProperty("Connection", "close");
                conn.setRequestProperty("X-Device-Model", getDeviceDisplayName());
                conn.setRequestProperty("X-Device-Battery", String.valueOf(currentBatteryPct));
                conn.setConnectTimeout(600);
                conn.setReadTimeout(600);
                conn.setDoOutput(true);
                byte[] out = data.getBytes(java.nio.charset.StandardCharsets.UTF_8);
                conn.setRequestProperty("Content-Length", String.valueOf(out.length));
                conn.setFixedLengthStreamingMode(out.length);
                try (java.io.OutputStream os = conn.getOutputStream()) {
                    os.write(out);
                    os.flush();
                }
                int code = conn.getResponseCode();
                return code == 200;
            } catch (Exception ignored) {
                return false;
            } finally {
                if (conn != null) {
                    try { conn.disconnect(); } catch (Exception ignored) {}
                }
            }
        }

        @JavascriptInterface
        public void sendTypingChar(String ch) {
            triggerHapticFeedback();
            if (ch != null && !ch.isEmpty()) {
                if (hidManager != null && hidManager.isConnected()) {
                    hidManager.sendText(ch);
                } else if (bleHidServer != null && bleHidServer.hasConnectedDevices()) {
                    bleHidServer.sendText(ch);
                } else if (hidManager != null) {
                    hidManager.sendText(ch);
                } else if (bleHidServer != null) {
                    bleHidServer.sendText(ch);
                }
                sendHttpText(lastDiscoveredCompanionIp, ch);
            }
        }

        @JavascriptInterface
        public void skipYouTubeAd() {
            speak("Skip ad");
            MainActivity.this.skipYouTubeAd();
            sendHttpAction(lastDiscoveredCompanionIp, "{\"action\":\"skip ad\"}");
        }

        @JavascriptInterface
        public void seekForward(int seconds) {
            triggerHapticFeedback();
            speak("Forward " + seconds + " seconds");
            if (hidManager != null && hidManager.isConnected()) {
                hidManager.sendSeekInterval(true, seconds);
            } else if (bleHidServer != null && bleHidServer.hasConnectedDevices()) {
                bleHidServer.sendSeek(true, seconds);
            } else if (hidManager != null) {
                hidManager.sendSeekInterval(true, seconds);
            } else if (bleHidServer != null) {
                bleHidServer.sendSeek(true, seconds);
            }
            sendHttpAction(lastDiscoveredCompanionIp, "{\"action\":\"seek_forward\",\"value\":" + seconds + "}");
        }

        @JavascriptInterface
        public void seekReverse(int seconds) {
            triggerHapticFeedback();
            speak("Rewind " + seconds + " seconds");
            if (hidManager != null && hidManager.isConnected()) {
                hidManager.sendSeekInterval(false, seconds);
            } else if (bleHidServer != null && bleHidServer.hasConnectedDevices()) {
                bleHidServer.sendSeek(false, seconds);
            } else if (hidManager != null) {
                hidManager.sendSeekInterval(false, seconds);
            } else if (bleHidServer != null) {
                bleHidServer.sendSeek(false, seconds);
            }
            sendHttpAction(lastDiscoveredCompanionIp, "{\"action\":\"seek_reverse\",\"value\":" + seconds + "}");
        }

        @JavascriptInterface
        public void triggerYouTubeAction(String action) {
            triggerHapticFeedback();
            String dispatchAction = action;
            if ("like".equalsIgnoreCase(action)) {
                speak("Video liked");
                dispatchAction = "yt_like";
            } else if ("share".equalsIgnoreCase(action)) {
                speak("Share video");
                dispatchAction = "yt_share";
                new Thread(() -> {
                    sendKeystrokeFallback(BluetoothHidManager.MOD_CTRL_LEFT, BluetoothHidManager.KEY_L);
                    try { Thread.sleep(75); } catch (InterruptedException ignored) {}
                    sendKeystrokeFallback(BluetoothHidManager.MOD_CTRL_LEFT, BluetoothHidManager.KEY_C);
                }).start();
            } else if ("save".equalsIgnoreCase(action)) {
                speak("Save to playlist");
                dispatchAction = "yt_save";
            }
            sendHttpAction(lastDiscoveredCompanionIp, "{\"action\":\"" + (dispatchAction != null ? dispatchAction.replace("\"", "\\\"") : "") + "\"}");
        }

        @JavascriptInterface
        public void reconnectHost() {
            triggerHapticFeedback();
            if (hidManager != null) {
                hidManager.reconnectLastHost();
            }
            if (bleHidServer != null) {
                bleHidServer.reconnectBondedDevices();
            }
        }

        @JavascriptInterface
        public void startContinuousSeek(boolean isForward) {
            triggerHapticFeedback();
            // Single discrete jump to prevent runaway scrubbing
            if (hidManager != null && hidManager.isConnected()) {
                hidManager.sendSeekInterval(isForward, 10);
            } else if (bleHidServer != null && bleHidServer.hasConnectedDevices()) {
                bleHidServer.sendSeek(isForward, 10);
            }
            sendHttpAction(lastDiscoveredCompanionIp, "{\"action\":\"" + (isForward ? "seek_forward" : "seek_reverse") + "\"}");
        }

        @JavascriptInterface
        public void stopContinuousSeek() {
            // Safe no-op
        }

        @JavascriptInterface
        public boolean isBatteryOptimizationIgnored() {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
                return pm != null && pm.isIgnoringBatteryOptimizations(getPackageName());
            }
            return true;
        }

        @JavascriptInterface
        public void requestIgnoreBatteryOptimization() {
            runOnUiThread(() -> {
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                        intent.setData(Uri.parse("package:" + getPackageName()));
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } else {
                        openPowerSettings();
                    }
                } catch (Exception e) {
                    openPowerSettings();
                }
            });
        }

        @JavascriptInterface
        public void openPowerSettings() {
            runOnUiThread(() -> {
                try {
                    Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                    intent.setData(Uri.parse("package:" + getPackageName()));
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                } catch (Exception e) {
                    try {
                        Intent intent = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } catch (Exception ex) {
                        Toast.makeText(MainActivity.this, "Please allow background activity in Settings > Apps > DevDeck", Toast.LENGTH_LONG).show();
                    }
                }
            });
        }

        @JavascriptInterface
        public void exitApp() {
            runOnUiThread(() -> finishAffinity());
        }

        @JavascriptInterface
        public void sendMacro(String label) {
            sendMacro(label, "win");
        }

        @JavascriptInterface
        public void sendMacro(String label, String osMode) {
            triggerHapticFeedback();
            boolean btSent = false;
            // Route to active Bluetooth HID transport if actively connected
            if (hidManager != null && hidManager.isConnected()) {
                hidManager.sendMacro(label, osMode);
                btSent = true;
            } else if (bleHidServer != null && bleHidServer.hasConnectedDevices()) {
                sendBleMacro(label, osMode);
                btSent = true;
            }

            // Send via DevDeck Companion socket if Bluetooth HID is not connected
            if (!btSent) {
                String json = "{\"action\":\"" + (label != null ? label.replace("\"", "\\\"") : "") + "\"}";
                sendHttpAction(lastDiscoveredCompanionIp, json);
            }
        }

        @JavascriptInterface
        public void sendTextToPc(String text) {
            triggerHapticFeedback();
            boolean btSent = false;
            if (hidManager != null && hidManager.isConnected()) {
                hidManager.sendText(text);
                btSent = true;
            } else if (bleHidServer != null && bleHidServer.hasConnectedDevices()) {
                bleHidServer.sendText(text);
                btSent = true;
            }
            if (!btSent) {
                sendHttpText(lastDiscoveredCompanionIp, text);
            }
        }

        private boolean isVoiceAnnouncementsEnabled = true;

        @JavascriptInterface
        public void setVoiceEnabled(boolean enabled) {
            this.isVoiceAnnouncementsEnabled = enabled;
            if (!enabled && tts != null) {
                tts.stop();
            }
        }

        @JavascriptInterface
        public boolean isVoiceEnabled() {
            return isVoiceAnnouncementsEnabled;
        }

        @JavascriptInterface
        public void speak(String phrase) {
            if (!isVoiceAnnouncementsEnabled) return;
            if (tts != null && phrase != null && !phrase.isEmpty()) {
                tts.speak(phrase, TextToSpeech.QUEUE_FLUSH, null, "media_feedback");
            }
        }

        @JavascriptInterface
        public void triggerHaptic() {
            triggerHapticFeedback();
        }

        @JavascriptInterface
        public void sendVolumeStep(boolean isUp) {
            triggerHapticFeedback();
            speak(isUp ? "Volume up 25 percent" : "Volume down 25 percent");
            if (hidManager != null && hidManager.isConnected()) {
                hidManager.sendVolumeStep(isUp);
            } else if (bleHidServer != null && bleHidServer.hasConnectedDevices()) {
                bleHidServer.sendVolumeStep(isUp);
            } else if (hidManager != null) {
                hidManager.sendVolumeStep(isUp);
            } else if (bleHidServer != null) {
                bleHidServer.sendVolumeStep(isUp);
            }
            sendHttpAction(lastDiscoveredCompanionIp, "{\"action\":\"" + (isUp ? "vol_step_up" : "vol_step_down") + "\"}");
        }

        @JavascriptInterface
        public void sendVolumeMax() {
            triggerHapticFeedback();
            speak("Volume up 100 percent");
            if (hidManager != null && hidManager.isConnected()) {
                hidManager.sendVolumeMax();
            } else if (bleHidServer != null && bleHidServer.hasConnectedDevices()) {
                bleHidServer.sendVolumeMax();
            } else if (hidManager != null) {
                hidManager.sendVolumeMax();
            } else if (bleHidServer != null) {
                bleHidServer.sendVolumeMax();
            }
            sendHttpAction(lastDiscoveredCompanionIp, "{\"action\":\"vol_max\"}");
        }

        @JavascriptInterface
        public void sendVolumeZero() {
            triggerHapticFeedback();
            speak("Total silence, volume zero percent");
            if (hidManager != null && hidManager.isConnected()) {
                hidManager.sendVolumeZero();
            } else if (bleHidServer != null && bleHidServer.hasConnectedDevices()) {
                bleHidServer.sendVolumeZero();
            } else if (hidManager != null) {
                hidManager.sendVolumeZero();
            } else if (bleHidServer != null) {
                bleHidServer.sendVolumeZero();
            }
            sendHttpAction(lastDiscoveredCompanionIp, "{\"action\":\"vol_zero\"}");
        }

        @JavascriptInterface
        public int getRealBatteryLevel() {
            BatteryManager bm = (BatteryManager) getSystemService(Context.BATTERY_SERVICE);
            return bm != null ? bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY) : 100;
        }

        @JavascriptInterface
        public String getBluetoothDeviceName() {
            try {
                BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
                return adapter != null ? adapter.getName() : "DevDeck Studio";
            } catch (Exception e) {
                return "DevDeck Studio";
            }
        }

        @JavascriptInterface
        public void setBluetoothDeviceName(String newName) {
            BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
            if (adapter != null) {
                try {
                    adapter.setName(newName);
                    Toast.makeText(MainActivity.this, "Bluetooth Name: " + newName, Toast.LENGTH_SHORT).show();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        @JavascriptInterface
        public String getPairedDevicesJson() {
            BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
            if (adapter == null) return "[]";
            JSONArray arr = new JSONArray();
            try {
                Set<BluetoothDevice> paired = adapter.getBondedDevices();
                if (paired != null) {
                    for (BluetoothDevice dev : paired) {
                        if (!isHostComputer(dev)) continue;
                        JSONObject obj = new JSONObject();
                        obj.put("name", dev.getName() != null ? dev.getName() : "Unknown Host");
                        obj.put("address", dev.getAddress());
                        boolean isConn = (hidManager != null && hidManager.getConnectedDevice() != null &&
                                dev.getAddress().equalsIgnoreCase(hidManager.getConnectedDevice().getAddress())) ||
                                (bleHidServer != null && bleHidServer.hasConnectedDevices());
                        obj.put("connected", isConn);
                        arr.put(obj);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return arr.toString();
        }

        private boolean isHostComputer(BluetoothDevice dev) {
            if (dev == null) return false;
            return BluetoothHidManager.isEligibleHost(dev);
        }

        @JavascriptInterface
        public void connectDevice(String address) {
            triggerHapticFeedback();
            try {
                BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
                if (adapter != null && address != null) {
                    BluetoothDevice dev = adapter.getRemoteDevice(address);
                    if (dev != null) {
                        if (hidManager != null) {
                            hidManager.connectHost(address);
                        }
                        if (bleHidServer != null) {
                            bleHidServer.connectDevice(dev);
                        }
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "Error in connectDevice: " + address, e);
            }
        }

        @JavascriptInterface
        public void reconnectAllBondedHosts() {
            triggerHapticFeedback();
            try {
                if (hidManager != null) {
                    hidManager.autoConnectBondedHost();
                }
                if (bleHidServer != null) {
                    bleHidServer.reconnectBondedDevices();
                }
            } catch (Exception e) {
                Log.e(TAG, "Error in reconnectAllBondedHosts", e);
            }
        }

        @JavascriptInterface
        public boolean unpairDevice(String address) {
            try {
                BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
                if (adapter != null) {
                    BluetoothDevice dev = adapter.getRemoteDevice(address);
                    if (dev != null) {
                        java.lang.reflect.Method m = dev.getClass().getMethod("removeBond");
                        boolean result = (Boolean) m.invoke(dev);
                        runOnUiThread(() -> Toast.makeText(MainActivity.this, "Unpaired " + dev.getName(), Toast.LENGTH_SHORT).show());
                        return result;
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return false;
        }

        @JavascriptInterface
        public void openBluetoothSettings() {
            try {
                Intent discoverable = new Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE);
                discoverable.putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 300);
                discoverable.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(discoverable);
            } catch (Exception e) {
                Intent intent = new Intent(Settings.ACTION_BLUETOOTH_SETTINGS);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            }
        }

        @JavascriptInterface
        public void openWebsite() {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.mobileonemedia.com"));
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        }

        @JavascriptInterface
        public void openExternalUrl(String url) {
            try {
                if (url != null && !url.isEmpty()) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                }
            } catch (Exception e) {
                Log.e(TAG, "Error opening external url: " + url, e);
            }
        }

        @JavascriptInterface
        public void emailSupport() {
            Intent intent = new Intent(Intent.ACTION_SENDTO);
            intent.setData(Uri.parse("mailto:info@mobileonemedia.com"));
            intent.putExtra(Intent.EXTRA_SUBJECT, "DevDeck Support & Inquiry");
            startActivity(intent);
        }

        @JavascriptInterface
        public void callSupport() {
            Intent intent = new Intent(Intent.ACTION_DIAL);
            intent.setData(Uri.parse("tel:+923486567127"));
            startActivity(intent);
        }
    }
}
