using System;
using System.Runtime.InteropServices;
using System.Threading;

public class TestKeybdEvent
{
    [DllImport("user32.dll")]
    public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);

    [DllImport("user32.dll")]
    public static extern short VkKeyScan(char ch);

    const uint KEYEVENTF_KEYUP = 0x0002;
    const uint KEYEVENTF_UNICODE = 0x0004;

    public static void TypeChar(char c)
    {
        short scan = VkKeyScan(c);
        if (scan == -1) return;

        byte vk = (byte)(scan & 0xFF);
        byte shiftState = (byte)((scan >> 8) & 0xFF);

        bool shift = (shiftState & 1) != 0;
        bool ctrl = (shiftState & 2) != 0;
        bool alt = (shiftState & 4) != 0;

        if (shift) keybd_event(0x10, 0, 0, UIntPtr.Zero);
        if (ctrl) keybd_event(0x11, 0, 0, UIntPtr.Zero);
        if (alt) keybd_event(0x12, 0, 0, UIntPtr.Zero);

        keybd_event(vk, 0, 0, UIntPtr.Zero);
        Thread.Sleep(5);
        keybd_event(vk, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);

        if (alt) keybd_event(0x12, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
        if (ctrl) keybd_event(0x11, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
        if (shift) keybd_event(0x10, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
    }

    public static void TypeString(string s)
    {
        foreach (char c in s)
        {
            if (c == '\n' || c == '\r')
            {
                keybd_event(0x0D, 0, 0, UIntPtr.Zero);
                Thread.Sleep(5);
                keybd_event(0x0D, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            }
            else
            {
                TypeChar(c);
            }
            Thread.Sleep(10);
        }
    }

    public static void Main()
    {
        Console.WriteLine("Testing VkKeyScan for '/goal ':");
        string test = "/goal ";
        foreach (char c in test)
        {
            short scan = VkKeyScan(c);
            byte vk = (byte)(scan & 0xFF);
            byte shiftState = (byte)((scan >> 8) & 0xFF);
            Console.WriteLine("Char: " + c + " -> VK: 0x" + vk.ToString("X2") + " Shift: " + shiftState);
        }
        Console.WriteLine("SUCCESS");
    }
}
