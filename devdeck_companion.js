const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec, spawn } = require('child_process');
const dgram = require('dgram');

const PORT = 8989;
const UDP_PORT = 8990;
const RECEIVED_DIR = path.join(os.homedir(), 'Downloads', 'DevDeck_Received');

if (!fs.existsSync(RECEIVED_DIR)) {
  try {
    fs.mkdirSync(RECEIVED_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create received dir:', e);
  }
}

console.log('=====================================================');
console.log('  DEVDECK STUDIO PC COMPANION (ZERO-BLOCK ENGINE)');
console.log('  Host Name: ' + os.hostname());
console.log('  Listening Port: ' + PORT);
console.log('  File Stream Path: ' + RECEIVED_DIR);
console.log('=====================================================');

try {
  const udpClient = dgram.createSocket('udp4');
  udpClient.bind(() => {
    udpClient.setBroadcast(true);
    setInterval(() => {
      const beaconMsg = Buffer.from(`DEVDECK_BEACON:${PORT}:${os.hostname()}`);
      udpClient.send(beaconMsg, 0, beaconMsg.length, UDP_PORT, '255.255.255.255', (err) => {});
    }, 3000);
  });
} catch (e) {
  console.log('UDP broadcast init skipped:', e.message);
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

const server = http.createServer((req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  if (pathname === '/api/status' || pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'DevDeck Companion Online',
      host: os.hostname(),
      port: PORT,
      version: '2.0',
      active_window: 'Windows Desktop',
      cpu_load: 1,
      received_path: RECEIVED_DIR
    }));
    return;
  }

  if (pathname === '/api/upload' && req.method === 'POST') {
    let filename = reqUrl.searchParams.get('filename') || reqUrl.searchParams.get('name') || `DevDrop_${Date.now()}.bin`;
    filename = path.basename(filename).replace(/[/\\?%*:|"<>]/g, '_');
    const targetFile = path.join(RECEIVED_DIR, filename);

    const writeStream = fs.createWriteStream(targetFile);
    req.pipe(writeStream);

    writeStream.on('finish', () => {
      console.log(`[DevDrop] Successfully received: ${filename} (${fs.statSync(targetFile).size} bytes)`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', filename: filename, path: targetFile }));
    });

    writeStream.on('error', (err) => {
      writeStream.destroy();
      console.error('[DevDrop] File write error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });
    return;
  }

  if (pathname === '/api/files') {
    fs.readdir(RECEIVED_DIR, (err, files) => {
      if (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ files: [] }));
        return;
      }
      const fileInfos = [];
      files.forEach(f => {
        try {
          const stats = fs.statSync(path.join(RECEIVED_DIR, f));
          if (stats.isFile()) {
            fileInfos.push({
              name: f,
              size: stats.size,
              date: stats.mtime.toLocaleDateString() + ' ' + stats.mtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
          }
        } catch (e) {}
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ files: fileInfos }));
    });
    return;
  }

  if (pathname === '/api/download') {
    const fname = path.basename(reqUrl.searchParams.get('file') || '');
    const filePath = path.join(RECEIVED_DIR, fname);
    if (fs.existsSync(filePath)) {
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fname}"`
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'File not found' }));
    }
    return;
  }

  if (pathname === '/api/open-folder') {
    exec(`explorer.exe "${RECEIVED_DIR}"`, (err) => {});
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', folder: RECEIVED_DIR }));
    return;
  }

  if (pathname === '/api/beam' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const text = data.text || '';
        if (text) {
          const proc = spawn('powershell', ['-NoProfile', '-Command', '$input | Set-Clipboard']);
          proc.stdin.write(text);
          proc.stdin.end();
          console.log(`[DevDrop Beam] Injected text (${text.length} chars) into PC clipboard`);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', length: text.length }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (pathname === '/api/text' && req.method === 'POST') {
    let textBody = '';
    req.on('data', chunk => textBody += chunk);
    req.on('end', () => {
      if (textBody) {
        const proc = spawn('powershell', ['-NoProfile', '-Command', '$input | Set-Clipboard; Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait("^v")']);
        proc.stdin.write(textBody);
        proc.stdin.end();
        console.log(`[DevDeck Text] Injected: ${textBody.substring(0, 30)}...`);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    });
    return;
  }

  if (pathname === '/api/action' && req.method === 'POST') {
    let actBody = '';
    req.on('data', chunk => actBody += chunk);
    req.on('end', () => {
      try {
        const actionObj = JSON.parse(actBody);
        const act = actionObj.action || '';
        console.log(`[DevDeck Action] Received: ${act}`);
        if (act === 'open_explorer' || act === 'explorer') {
          exec('explorer.exe', () => {});
        } else if (act === 'calc') {
          exec('calc.exe', () => {});
        } else if (act === 'taskmgr') {
          exec('taskmgr.exe', () => {});
        } else if (act === 'terminal' || act === 'powershell') {
          exec('wt.exe || powershell.exe', () => {});
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', action: act }));
      } catch (e) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`DevDeck Companion Server running at http://0.0.0.0:${PORT}/`);
});
