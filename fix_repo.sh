#!/bin/bash
cd /app
git remote set-url origin https://github.com/FSK2/scriptsense-ai-app
git fetch origin
git branch -D jules-16453514440860874296-f7d169e0
git checkout -b fix/inline-event-handlers origin/main
cp /tmp/scriptsense-ai-app/app.js /app/app.js
git add app.js
git commit -m "Fix undefined event errors in inline event handlers"
