using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Runtime.InteropServices;
using System.Collections.Generic;

namespace DevDeckCompanion
{
    class Program
    {
        [DllImport("user32.dll")]
        public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);

        [DllImport("user32.dll")]
        public static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
        public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

        const uint KEYEVENTF_KEYUP = 0x0002;
        const uint KEYEVENTF_UNICODE = 0x0004;

        const byte VK_LBUTTON = 0x01;
        const byte VK_TAB = 0x09;
        const byte VK_RETURN = 0x0D;
        const byte VK_SHIFT = 0x10;
        const byte VK_CONTROL = 0x11;
        const byte VK_MENU = 0x12;
        const byte VK_ESCAPE = 0x1B;
        const byte VK_SPACE = 0x20;
        const byte VK_LEFT = 0x25;
        const byte VK_UP = 0x26;
        const byte VK_RIGHT = 0x27;
        const byte VK_DOWN = 0x28;
        const byte VK_VOLUME_MUTE = 0xAD;
        const byte VK_VOLUME_DOWN = 0xAE;
        const byte VK_VOLUME_UP = 0xAF;
        const byte VK_MEDIA_NEXT_TRACK = 0xB0;
        const byte VK_MEDIA_PREV_TRACK = 0xB1;
        const byte VK_MEDIA_STOP = 0xB2;
        const byte VK_MEDIA_PLAY_PAUSE = 0xB3;

        static void SendVk(byte vk, int delayMs = 30)
        {
            keybd_event(vk, 0, 0, UIntPtr.Zero);
            Thread.Sleep(delayMs);
            keybd_event(vk, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            Thread.Sleep(10);
        }

        static void SendKeyCombo(byte[] modifiers, byte vk, int delayMs = 40)
        {
            foreach (var mod in modifiers)
                keybd_event(mod, 0, 0, UIntPtr.Zero);
            Thread.Sleep(10);
            keybd_event(vk, 0, 0, UIntPtr.Zero);
            Thread.Sleep(delayMs);
            keybd_event(vk, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            for (int i = modifiers.Length - 1; i >= 0; i--)
                keybd_event(modifiers[i], 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            Thread.Sleep(10);
        }

        static void TypeText(string text)
        {
            foreach (char c in text)
            {
                if (c == '\n')
                {
                    SendVk(VK_RETURN);
                    continue;
                }
                keybd_event(0, (byte)c, KEYEVENTF_UNICODE, UIntPtr.Zero);
                Thread.Sleep(5);
                keybd_event(0, (byte)c, KEYEVENTF_UNICODE | KEYEVENTF_KEYUP, UIntPtr.Zero);
                Thread.Sleep(5);
            }
        }

        static string GetActiveWindowTitle()
        {
            try
            {
                IntPtr hwnd = GetForegroundWindow();
                StringBuilder sb = new StringBuilder(256);
                if (GetWindowText(hwnd, sb, 256) > 0)
                    return sb.ToString();
            }
            catch { }
            return "Windows Desktop";
        }

        static string HandleAction(string jsonBody)
        {
            string action = "";
            string val = "";

            int actIdx = jsonBody.IndexOf("\"action\"", StringComparison.OrdinalIgnoreCase);
            if (actIdx != -1)
            {
                int colon = jsonBody.IndexOf(':', actIdx);
                if (colon != -1)
                {
                    int q1 = jsonBody.IndexOf('\"', colon);
                    if (q1 != -1)
                    {
                        int q2 = jsonBody.IndexOf('\"', q1 + 1);
                        if (q2 != -1)
                            action = jsonBody.Substring(q1 + 1, q2 - q1 - 1).ToLower().Trim();
                    }
                }
            }

            int valIdx = jsonBody.IndexOf("\"value\"", StringComparison.OrdinalIgnoreCase);
            if (valIdx != -1)
            {
                int colon = jsonBody.IndexOf(':', valIdx);
                if (colon != -1)
                {
                    int q1 = jsonBody.IndexOf('\"', colon);
                    if (q1 != -1)
                    {
                        int q2 = jsonBody.IndexOf('\"', q1 + 1);
                        if (q2 != -1)
                            val = jsonBody.Substring(q1 + 1, q2 - q1 - 1);
                    }
                    else
                    {
                        int comma = jsonBody.IndexOfAny(new char[] { ',', '}' }, colon);
                        if (comma != -1)
                            val = jsonBody.Substring(colon + 1, comma - colon - 1).Trim();
                    }
                }
            }

            Console.WriteLine("[*] Action: " + action + (string.IsNullOrEmpty(val) ? "" : " (" + val + ")"));

            if (action == "like")
            {
                SendKeyCombo(new byte[] { VK_SHIFT }, 0xBB);
                return "YouTube Like Sent";
            }
            if (action == "share")
            {
                SendKeyCombo(new byte[] { VK_CONTROL }, (byte)'L');
                Thread.Sleep(50);
                SendKeyCombo(new byte[] { VK_CONTROL }, (byte)'C');
                return "YouTube URL Copied";
            }
            if (action == "save")
            {
                SendKeyCombo(new byte[] { VK_CONTROL }, (byte)'D');
                return "Save Triggered";
            }
            if (action == "skip_ad" || action == "skip ad")
            {
                // Never send Tab + Enter to prevent opening advertiser website!
                return "Skip Ad Handled";
            }
            if (action == "fullscreen") { SendVk((byte)'F'); return "Fullscreen [F]"; }
            if (action == "theater") { SendVk((byte)'T'); return "Theater [T]"; }
            if (action == "captions") { SendVk((byte)'C'); return "Captions [C]"; }
            if (action == "miniplayer") { SendVk((byte)'I'); return "Miniplayer [I]"; }

            if (action == "play_pause") { SendVk(VK_MEDIA_PLAY_PAUSE); return "Media Play/Pause"; }
            if (action == "play" || action == "pause") { SendVk((byte)'K'); return "Play/Pause [K]"; }
            if (action == "stop") { SendVk(VK_MEDIA_STOP); return "Media Stop"; }
            if (action == "mute") { SendVk(VK_VOLUME_MUTE); return "Mute Toggled"; }
            if (action == "volume_up" || action == "vol_step_up" || action == "vol_up")
            {
                for (int i = 0; i < 13; i++) SendVk(VK_VOLUME_UP, 8);
                return "Volume +25%";
            }
            if (action == "volume_down" || action == "vol_step_down" || action == "vol_down")
            {
                for (int i = 0; i < 13; i++) SendVk(VK_VOLUME_DOWN, 8);
                return "Volume -25%";
            }
            if (action == "volume_zero" || action == "vol_zero")
            {
                for (int i = 0; i < 50; i++) SendVk(VK_VOLUME_DOWN, 5);
                return "Total Silence (0%)";
            }
            if (action == "volume_max" || action == "vol_max")
            {
                for (int i = 0; i < 50; i++) SendVk(VK_VOLUME_UP, 5);
                return "Turbo Max (100%)";
            }

            if (action == "seek_forward")
            {
                int sec = 10;
                int.TryParse(val, out sec);
                int pulses = Math.Max(1, sec / 5);
                for (int i = 0; i < pulses; i++) SendVk(VK_RIGHT, 20);
                return "Seek +" + sec + "s";
            }
            if (action == "seek_reverse")
            {
                int sec = 10;
                int.TryParse(val, out sec);
                int pulses = Math.Max(1, sec / 5);
                for (int i = 0; i < pulses; i++) SendVk(VK_LEFT, 20);
                return "Seek -" + sec + "s";
            }

            if (action == "macro")
            {
                string m = val.ToLower();
                if (m == "undo") SendKeyCombo(new byte[] { VK_CONTROL }, (byte)'Z');
                else if (m == "redo") SendKeyCombo(new byte[] { VK_CONTROL }, (byte)'Y');
                else if (m == "copy") SendKeyCombo(new byte[] { VK_CONTROL }, (byte)'C');
                else if (m == "paste") SendKeyCombo(new byte[] { VK_CONTROL }, (byte)'V');
                else if (m == "cut") SendKeyCombo(new byte[] { VK_CONTROL }, (byte)'X');
                else if (m == "save") SendKeyCombo(new byte[] { VK_CONTROL }, (byte)'S');
                else if (m == "select_all") SendKeyCombo(new byte[] { VK_CONTROL }, (byte)'A');
                else if (m == "find") SendKeyCombo(new byte[] { VK_CONTROL }, (byte)'F');
                else if (m == "enter") SendVk(VK_RETURN);
                else if (m == "escape") SendVk(VK_ESCAPE);
                return "Macro '" + m + "' executed";
            }

            if (action == "type")
            {
                TypeText(val);
                return "Typed " + val.Length + " chars";
            }

            return "OK";
        }

        static List<string> GetLocalIPs()
        {
            var list = new List<string>();
            try
            {
                string host = Dns.GetHostName();
                foreach (var ip in Dns.GetHostAddresses(host))
                {
                    if (ip.AddressFamily == AddressFamily.InterNetwork && !ip.ToString().StartsWith("127."))
                        list.Add(ip.ToString());
                }
            }
            catch { }
            if (list.Count == 0) list.Add("127.0.0.1");
            return list;
        }

        static void Main(string[] args)
        {
            Console.Title = "DevDeck PC Companion Server";
            int port = 8989;

            var ips = GetLocalIPs();
            string primaryIp = ips.Count > 0 ? ips[0] : "127.0.0.1";

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("================================================================");
            Console.WriteLine("      ⚡ DEVDECK PC COMPANION SERVER (WINDOWS NATIVE) ⚡       ");
            Console.WriteLine("================================================================");
            Console.ResetColor();
            Console.WriteLine("[*] Listening on Port: " + port);
            Console.WriteLine("[*] PC Hostname: " + Environment.MachineName);
            Console.WriteLine("[*] Wi-Fi / Local IP Address(es):");
            foreach (var ip in ips)
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("    -> http://" + ip + ":" + port);
                Console.ResetColor();
            }
            Console.WriteLine();
            Console.WriteLine("[*] INSTRUCTIONS:");
            Console.WriteLine(" 1. Ensure your phone and PC are on the same Wi-Fi network.");
            Console.WriteLine(" 2. In DevDeck app on your phone, connect to " + primaryIp + ":" + port);
            Console.WriteLine(" 3. Enjoy permanent, zero-drop Wi-Fi link and YouTube actions!");
            Console.WriteLine("================================================================");
            Console.WriteLine("[*] DevDeck Companion is actively running. Minimize anytime.\n");

            TcpListener listener = new TcpListener(IPAddress.Any, port);
            try
            {
                listener.Start();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("[!] Could not bind to port " + port + ": " + ex.Message);
                Console.ResetColor();
                Console.ReadLine();
                return;
            }

            while (true)
            {
                try
                {
                    TcpClient client = listener.AcceptTcpClient();
                    ThreadPool.QueueUserWorkItem(ProcessClient, client);
                }
                catch
                {
                    break;
                }
            }
        }

        static void ProcessClient(object obj)
        {
            TcpClient client = (TcpClient)obj;
            try
            {
                using (NetworkStream stream = client.GetStream())
                {
                    byte[] buffer = new byte[8192];
                    int bytesRead = stream.Read(buffer, 0, buffer.Length);
                    if (bytesRead <= 0) return;

                    string request = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                    string[] lines = request.Split(new string[] { "\r\n" }, StringSplitOptions.None);
                    if (lines.Length == 0) return;

                    string requestLine = lines[0];
                    string[] parts = requestLine.Split(' ');
                    string method = parts.Length > 0 ? parts[0] : "GET";
                    string path = parts.Length > 1 ? parts[1] : "/";

                    if (method == "OPTIONS")
                    {
                        string header = "HTTP/1.1 200 OK\r\n" +
                                        "Access-Control-Allow-Origin: *\r\n" +
                                        "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n" +
                                        "Access-Control-Allow-Headers: Content-Type\r\n" +
                                        "Content-Length: 0\r\n\r\n";
                        byte[] hBytes = Encoding.UTF8.GetBytes(header);
                        stream.Write(hBytes, 0, hBytes.Length);
                        return;
                    }

                    if (method == "POST")
                    {
                        int emptyLine = request.IndexOf("\r\n\r\n");
                        string body = "";
                        if (emptyLine != -1)
                        {
                            body = request.Substring(emptyLine + 4);
                        }

                        string result = HandleAction(body);
                        string respJson = "{\"ok\":true,\"result\":\"" + result + "\"}";
                        byte[] bodyBytes = Encoding.UTF8.GetBytes(respJson);

                        string header = "HTTP/1.1 200 OK\r\n" +
                                        "Content-Type: application/json\r\n" +
                                        "Access-Control-Allow-Origin: *\r\n" +
                                        "Content-Length: " + bodyBytes.Length + "\r\n\r\n";
                        byte[] hBytes = Encoding.UTF8.GetBytes(header);
                        stream.Write(hBytes, 0, hBytes.Length);
                        stream.Write(bodyBytes, 0, bodyBytes.Length);
                        return;
                    }

                    if (path.StartsWith("/api/status") || path.StartsWith("/status"))
                    {
                        var ips = GetLocalIPs();
                        string ipJson = "[\"" + string.Join("\",\"", ips.ToArray()) + "\"]";
                        string statusJson = "{\"server\":\"DevDeck PC Companion\",\"version\":\"1.0\",\"status\":\"ONLINE\",\"active_window\":\"" +
                                            GetActiveWindowTitle().Replace("\"", "\\\"") + "\",\"ips\":" + ipJson + "}";
                        byte[] bodyBytes = Encoding.UTF8.GetBytes(statusJson);

                        string header = "HTTP/1.1 200 OK\r\n" +
                                        "Content-Type: application/json\r\n" +
                                        "Access-Control-Allow-Origin: *\r\n" +
                                        "Content-Length: " + bodyBytes.Length + "\r\n\r\n";
                        byte[] hBytes = Encoding.UTF8.GetBytes(header);
                        stream.Write(hBytes, 0, hBytes.Length);
                        stream.Write(bodyBytes, 0, bodyBytes.Length);
                        return;
                    }

                    string html = "<!DOCTYPE html><html><body style=\"font-family:sans-serif;background:#0f172a;color:#38bdf8;padding:2rem;\">" +
                                  "<h2>DevDeck PC Companion Active</h2>" +
                                  "<p style=\"color:#4ade80\">Status: ONLINE (Port 8989)</p>" +
                                  "<p>Active Window: " + GetActiveWindowTitle() + "</p></body></html>";
                    byte[] htmlBytes = Encoding.UTF8.GetBytes(html);
                    string htmlHeader = "HTTP/1.1 200 OK\r\n" +
                                        "Content-Type: text/html\r\n" +
                                        "Access-Control-Allow-Origin: *\r\n" +
                                        "Content-Length: " + htmlBytes.Length + "\r\n\r\n";
                    byte[] hhBytes = Encoding.UTF8.GetBytes(htmlHeader);
                    stream.Write(hhBytes, 0, hhBytes.Length);
                    stream.Write(htmlBytes, 0, htmlBytes.Length);
                }
            }
            catch { }
            finally
            {
                client.Close();
            }
        }
    }
}
