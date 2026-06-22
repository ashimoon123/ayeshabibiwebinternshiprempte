const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
