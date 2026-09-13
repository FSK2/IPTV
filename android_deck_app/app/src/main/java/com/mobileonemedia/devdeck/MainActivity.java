package com.mobileonemedia.devdeck;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.util.Log;

public class MainActivity extends Activity {
    private static final String TAG = "DevDeck_MainActivity";

    private WebView webView;
    private BluetoothHidManager bluetoothHidManager;
    private BleHidDeviceServer bleHidDeviceServer;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        bluetoothHidManager = new BluetoothHidManager(this);
        bleHidDeviceServer = new BleHidDeviceServer(this);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);

        webView.addJavascriptInterface(new WebAppInterface(), "AndroidBridge");
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("file:///android_asset/index.html");
    }

    public class WebAppInterface {

        @JavascriptInterface
        public void handleMediaCommand(String command) {
            Log.d(TAG, "handleMediaCommand received: " + command);
            if (command == null) return;

            switch (command) {
                case "play":
                    // Bug 2 Fix: Distinct Play, NO Spacebar fallback
                    if (bluetoothHidManager != null) {
                        bluetoothHidManager.handleMediaAction("play");
                    }
                    if (bleHidDeviceServer != null) {
                        bleHidDeviceServer.handleMediaAction("play");
                    }
                    break;

                case "pause":
                    // Bug 2 Fix: Distinct Pause, NO Spacebar fallback
                    if (bluetoothHidManager != null) {
                        bluetoothHidManager.handleMediaAction("pause");
                    }
                    if (bleHidDeviceServer != null) {
                        bleHidDeviceServer.handleMediaAction("pause");
                    }
                    break;

                case "play_pause":
                    if (bluetoothHidManager != null) {
                        bluetoothHidManager.handleMediaAction("play_pause");
                    }
                    if (bleHidDeviceServer != null) {
                        bleHidDeviceServer.handleMediaAction("play_pause");
                    }
                    break;

                case "stop":
                    // Bug 3 Fix: Send Consumer Stop (0xB7) + Pause keystroke sequence
                    if (bluetoothHidManager != null) {
                        bluetoothHidManager.handleMediaAction("stop");
                    }
                    if (bleHidDeviceServer != null) {
                        bleHidDeviceServer.handleMediaAction("stop");
                    }
                    break;

                case "vol_up":
                    if (bluetoothHidManager != null) {
                        bluetoothHidManager.handleMediaAction("vol_up");
                    }
                    if (bleHidDeviceServer != null) {
                        bleHidDeviceServer.handleMediaAction("vol_up");
                    }
                    break;

                case "vol_down":
                    if (bluetoothHidManager != null) {
                        bluetoothHidManager.handleMediaAction("vol_down");
                    }
                    if (bleHidDeviceServer != null) {
                        bleHidDeviceServer.handleMediaAction("vol_down");
                    }
                    break;

                case "mute":
                    if (bluetoothHidManager != null) {
                        bluetoothHidManager.handleMediaAction("mute");
                    }
                    if (bleHidDeviceServer != null) {
                        bleHidDeviceServer.handleMediaAction("mute");
                    }
                    break;

                case "vol_max":
                    // Bug 6 Fix: Volume max burst
                    if (bluetoothHidManager != null) {
                        bluetoothHidManager.sendVolumeMax();
                    }
                    if (bleHidDeviceServer != null) {
                        bleHidDeviceServer.sendVolumeMax();
                    }
                    break;

                case "vol_zero":
                    // Bug 6 Fix: Volume zero burst
                    if (bluetoothHidManager != null) {
                        bluetoothHidManager.sendVolumeZero();
                    }
                    if (bleHidDeviceServer != null) {
                        bleHidDeviceServer.sendVolumeZero();
                    }
                    break;

                case "skip_ad":
                    if (bluetoothHidManager != null) {
                        bluetoothHidManager.sendSkipAd();
                    }
                    if (bleHidDeviceServer != null) {
                        bleHidDeviceServer.sendSkipAd();
                    }
                    break;

                default:
                    Log.w(TAG, "Unhandled command: " + command);
                    break;
            }
        }

        @JavascriptInterface
        public void handleSeek(int seconds) {
            Log.d(TAG, "handleSeek received: " + seconds + "s");
            // Bug 4 Fix: Call sendSeek with 45ms key-down / 40ms key-up cadence
            if (bluetoothHidManager != null) {
                bluetoothHidManager.sendSeek(seconds);
            }
            if (bleHidDeviceServer != null) {
                bleHidDeviceServer.sendSeek(seconds);
            }
        }

        @JavascriptInterface
        public void handleKeyShortcut(String key) {
            Log.d(TAG, "handleKeyShortcut received: " + key);
            if (bluetoothHidManager != null) {
                bluetoothHidManager.sendKeyShortcut(key);
            }
            if (bleHidDeviceServer != null) {
                bleHidDeviceServer.sendKeyShortcut(key);
            }
        }

        @JavascriptInterface
        public void handleYouTubeAction(String action) {
            Log.d(TAG, "handleYouTubeAction received: " + action);
            String key = null;
            if ("like".equalsIgnoreCase(action)) {
                key = "l";
            } else if ("share".equalsIgnoreCase(action)) {
                key = "s";
            } else if ("save".equalsIgnoreCase(action)) {
                key = "a";
            }

            if (key != null) {
                if (bluetoothHidManager != null) {
                    bluetoothHidManager.sendKeyShortcut(key);
                }
                if (bleHidDeviceServer != null) {
                    bleHidDeviceServer.sendKeyShortcut(key);
                }
            }
        }

        @JavascriptInterface
        public void handleSpeedCommand(String speedAction) {
            Log.d(TAG, "handleSpeedCommand received: " + speedAction);
            if (bluetoothHidManager != null) {
                bluetoothHidManager.sendSpeedCommand(speedAction);
            }
            if (bleHidDeviceServer != null) {
                bleHidDeviceServer.sendSpeedCommand(speedAction);
            }
        }
    }
}
