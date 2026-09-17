# DevDeck PC Companion

A lightweight, zero-dependency Windows companion server for DevDeck that guarantees **permanent, zero-drop Wi-Fi connectivity** and empowers native YouTube controls.

## Why use the Companion?
- **Zero Disconnections**: Wi-Fi/LAN TCP link never times out or drops due to Bluetooth selective suspend or Android battery optimization.
- **YouTube Native Controls**: Automates `👍 LIKE`, `🔗 SHARE` (instant link copy), `💾 SAVE` (Add to Playlist), and `⏩ SKIP AD`.
- **Ultra-Low Latency**: Dispatches macros and keystrokes in sub-millisecond time.
- **Dual Mode**: DevDeck seamlessly uses Bluetooth HID and PC Companion simultaneously.

## How to Run:
1. Double-click `start_companion.bat` (or run `python devdeck_companion.py`).
2. Your PC will show its IP address (e.g. `http://192.168.1.5:8989`).
3. In DevDeck on your phone, the companion links automatically (or enter the PC IP in Settings if on a different subnet).
