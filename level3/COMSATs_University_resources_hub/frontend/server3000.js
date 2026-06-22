import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

console.log('========================================');
console.log('COMSATS Resource Hub - Static Server');
console.log('========================================\n');

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

console.log('📂 Serving directory:', __dirname);

const server = http.createServer(async (req, res) => {
  console.log('\n📨 Request received:', req.method, req.url);
  
  let filePath = path.join(__dirname, req.url);
  
  // Serve index.html if path is root
  if (filePath === path.join(__dirname, '/')) {
    filePath = path.join(__dirname, 'index.html');
    console.log('   🔍 Requesting root, serving index.html');
  }
  
  console.log('   📁 File path:', filePath);

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  console.log('   📝 Content type:', contentType);

  try {
    const content = await fs.readFile(filePath);
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    res.end(content, 'utf-8');
    console.log('   ✅ Served successfully!');
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    
    if (error.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - Not Found</h1>', 'utf-8');
      console.log('      → 404: File not found');
    } else {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`<h1>500 - Server Error</h1><pre>${error.message}</pre>`, 'utf-8');
      console.log('      → 500: Internal server error');
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 Server is running!');
  console.log('🌐 Open in your browser: http://localhost:' + PORT);
  console.log('   ⏳ Waiting for connections...\n');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error('   💥 Port ' + PORT + ' is already in use!');
  }
});
