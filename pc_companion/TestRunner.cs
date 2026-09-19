using System;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

class Test
{
    static void Main()
    {
        try
        {
            Console.WriteLine("Step 1: Testing AgencyAssets.GetLogo()...");
            Image img = MobileOneMedia.DevDeckStudio.AgencyAssets.GetLogo();
            Console.WriteLine("Logo loaded: " + (img != null ? img.Size.ToString() : "NULL"));

            Console.WriteLine("Step 2: Creating DevDeckStudioForm...");
            var f = new MobileOneMedia.DevDeckStudio.DevDeckStudioForm();
            Console.WriteLine("Form created successfully! Showing form...");
            Application.Run(f);
        }
        catch (Exception ex)
        {
            Console.WriteLine("CRASH EXCEPTION: " + ex.ToString());
        }
    }
}