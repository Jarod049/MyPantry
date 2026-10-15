const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const port = Number(process.env.PORT || 4173);
http.createServer((req, res) => {
  const file = new URL(req.url, 'http://localhost').pathname;
  const allowed = ['/', '/index.html', '/app.js', '/auth.js', '/styles.css', '/config.js'];
  if (!allowed.includes(file)) { res.writeHead(404); res.end('Not found'); return; }
  fs.readFile(path.join(root, file === '/' ? 'index.html' : file.slice(1)), (error, data) => {
    if (error) { res.writeHead(404); res.end('Run npm run build first.'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'text/html', 'Cache-Control': 'no-store' }); res.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log(`MyPantry: http://127.0.0.1:${port}`));
