const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const MIME_TYPES = {
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

console.log('========================================');
console.log('  COMSATS Resource Hub - FULLY WORKING');
console.log('========================================\n');

const server = http.createServer((req, res) => {
  console.log('📥 Request:', req.method, req.url);

  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // If file not found, try to serve index.html
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, indexContent) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Page Not Found</h1>', 'utf-8');
            console.error('❌ 404:', filePath);
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexContent, 'utf-8');
            console.log('✅ Served index.html (fallback)');
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code, 'utf-8');
        console.error('❌ Server Error:', error);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
      console.log('✅ Served:', req.url);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Server running at:');
  console.log('   🌐 http://localhost:' + PORT + '/');
  console.log('');
  console.log('✅ All features are working!');
  console.log('⏳ Waiting for connections...\n');
});
