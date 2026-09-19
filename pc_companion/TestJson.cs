using System;

public class TestJson
{
    private static string GetJsonString(string json, string key)
    {
        try
        {
            string search = "\"" + key + "\"";
            int kIdx = json.IndexOf(search);
            if (kIdx == -1) return "";
            int colonIdx = json.IndexOf(":", kIdx + search.Length);
            if (colonIdx == -1) return "";
            int q1 = json.IndexOf("\"", colonIdx + 1);
            if (q1 == -1) return "";
            int q2 = json.IndexOf("\"", q1 + 1);
            if (q2 == -1) return "";
            return json.Substring(q1 + 1, q2 - q1 - 1);
        }
        catch { }
        return "";
    }

    public static void Main()
    {
        string[] tests = new string[] {
            "{\"action\":\"/goal\"}",
            "{\"action\": \"/goal\"}",
            "{\"action\":\"/goal\", \"profile\":\"antigravity\"}",
            "{\"action\": \"proceed\"}"
        };

        foreach (var t in tests)
        {
            string val = GetJsonString(t, "action");
            Console.WriteLine("JSON: " + t + " -> Action: '" + val + "'");
        }
    }
}
