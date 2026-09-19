#!/usr/bin/env python3
"""
Mobile One Media Services - DevDeck Receiver for macOS
Compatible with macOS Sonoma, Ventura, Monterey (Apple Silicon & Intel)
"""

import sys
import os
import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
import subprocess

PORT = 8989

def run_applescript(script):
    try:
        subprocess.run(["osascript", "-e", script], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        print(f"AppleScript error: {e}")

def type_text(text):
    safe_text = text.replace('\\', '\\\\').replace('"', '\\"')
    run_applescript(f'tell application "System Events" to keystroke "{safe_text}"')

def send_key_combo(key, modifiers):
    # modifiers list e.g. ["command down", "shift down"]
    mod_str = " using {" + ", ".join(modifiers) + "}" if modifiers else ""
    run_applescript(f'tell application "System Events" to keystroke "{key}"{mod_str}')

class DevDeckHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path.startswith('/api/status'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            data = {
                "status": "ok",
                "hostname": os.uname().nodename,
                "os": "macOS",
                "cpu": 5,
                "activeApp": "macOS Desktop"
            }
            self.wfile.write(json.dumps(data).encode('utf-8'))
        else:
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"Mobile One Media - DevDeck macOS Receiver Running")

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8') if length > 0 else ""

        try:
            req = json.loads(body) if body else {}
            action = req.get("action", body).lower().strip()
        except Exception:
            action = body.lower().strip()

        print(f"[macOS HUD] DISPATCH -> [{action}]")

        # 1. Antigravity & Agentic
        if action in ["/goal", "launch /goal"]:
            type_text("/goal ")
        elif action in ["/boost", "trigger /boost"]:
            type_text("/boost ")
        elif action in ["/browser", "start /browser"]:
            type_text("/browser ")
        elif action in ["/grill-me", "engage /grill-me"]:
            type_text("/grill-me ")
        elif action in ["proceed", "approve plan"]:
            type_text("Proceed\n")
        elif action in ["undo"]:
            send_key_combo("z", ["command down"])
        elif action in ["redo"]:
            send_key_combo("z", ["command down", "shift down"])
        elif action in ["copy"]:
            send_key_combo("c", ["command down"])
        elif action in ["paste"]:
            send_key_combo("v", ["command down"])
        elif action in ["cut"]:
            send_key_combo("x", ["command down"])
        elif action in ["save"]:
            send_key_combo("s", ["command down"])
        elif action in ["find"]:
            send_key_combo("f", ["command down"])
        elif action in ["new tab"]:
            send_key_combo("t", ["command down"])
        elif action in ["close tab"]:
            send_key_combo("w", ["command down"])
        elif action in ["play/pause", "media_play_pause"]:
            run_applescript('tell application "Spotify" to playpause')
        elif action in ["next track"]:
            run_applescript('tell application "Spotify" to next track')
        elif action in ["prev track"]:
            run_applescript('tell application "Spotify" to previous track')

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({"success": True, "action": action}).encode('utf-8'))

    def log_message(self, format, *args):
        pass

def main():
    server = HTTPServer(('0.0.0.0', PORT), DevDeckHandler)
    print("=========================================================")
    print("Mobile One Media Services // DevDeck macOS Receiver")
    print(f"Listening on port {PORT} (Wired USB & Wi-Fi)...")
    print("=========================================================")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nReceiver stopped.")
        server.server_close()

if __name__ == '__main__':
    main()
