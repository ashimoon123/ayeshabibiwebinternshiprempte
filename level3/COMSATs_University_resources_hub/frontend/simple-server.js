import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5173;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

console.log('Starting server...');

const server = http.createServer(async (req, res) => {
  console.log(`${req.method} ${req.url} from ${req.socket.remoteAddress}`);

  let filePath = path.join(__dirname, req.url);
  if (filePath === path.join(__dirname, '/')) {
    filePath = path.join(__dirname, 'index.html');
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  try {
    const content = await fs.readFile(filePath);
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    res.end(content, 'utf-8');
    console.log(`Served ${filePath} (${content.length} bytes)`);
  } catch (error) {
    console.error(`Error serving ${filePath}:`, error);
    if (error.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>', 'utf-8');
    } else {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`<h1>Server Error</h1><pre>${error.message}</pre>`, 'utf-8');
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend server running at http://localhost:${PORT}/`);
  console.log(`🚀 Server is ready to accept connections!`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error('❌ Port 5173 is already in use!');
  }
});
