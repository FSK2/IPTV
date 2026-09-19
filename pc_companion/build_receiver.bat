@echo off
setlocal
echo =======================================================
echo Compiling Mobile One Media - DevDeck Native Receiver...
echo =======================================================

set CSC_PATH=C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe
if not exist C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe set CSC_PATH=C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe

echo Using C# Compiler: %CSC_PATH%

"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe" /target:winexe /platform:anycpu /optimize+ /win32icon:app.ico /r:System.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll /r:System.Net.Http.dll /r:"C:\Windows\Microsoft.NET\assembly\GAC_MSIL\WindowsBase\v4.0_4.0.0.0__31bf3856ad364e35\WindowsBase.dll" /r:"C:\Windows\Microsoft.NET\assembly\GAC_MSIL\UIAutomationClient\v4.0_4.0.0.0__31bf3856ad364e35\UIAutomationClient.dll" /r:"C:\Windows\Microsoft.NET\assembly\GAC_MSIL\UIAutomationTypes\v4.0_4.0.0.0__31bf3856ad364e35\UIAutomationTypes.dll" /out:DevDeckReceiver.exe DevDeckReceiver.cs LogoResource.cs

if %ERRORLEVEL% equ 0 (
    copy /Y DevDeckReceiver.exe DevDeckStudio.exe >nul
    copy /Y DevDeckReceiver.exe "..\companion app\DevDeckStudio.exe" >nul
    if exist "%USERPROFILE%\Downloads" copy /Y DevDeckReceiver.exe "%USERPROFILE%\Downloads\DevDeckStudio.exe" >nul
    echo.
    echo =======================================================
    echo SUCCESS: DevDeckStudio.exe built with embedded Icon!
    echo Location: %~dp0DevDeckStudio.exe
    echo =======================================================
) else (
    echo.
    echo [ERROR] Build failed with error code %ERRORLEVEL%.
    exit /b %ERRORLEVEL%
)
