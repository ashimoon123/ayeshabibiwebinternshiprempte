const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('COMSATS Resource Hub - Express Server');
  console.log('========================================');
  console.log(`Serving from: ${__dirname}`);
  console.log(`✅ Server running on: http://localhost:${PORT}`);
  console.log('========================================\n');
  console.log('⏳ Waiting for connections...');
});
