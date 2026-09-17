@echo off
title DevDeck PC Companion
cls
echo ====================================================================
echo                 DEVDECK PC COMPANION SERVER
echo ====================================================================
echo.
echo Starting DevDeck Companion on port 8989...
echo This companion provides permanent, zero-drop Wi-Fi connectivity
echo and direct YouTube actions (Like, Share, Save, Media controls).
echo.
python "%~dp0devdeck_companion.py"
pause
