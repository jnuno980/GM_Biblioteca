<<<<<<< HEAD
const express = require('express');
const app = express();
const PORT = 3001;

// Simple test server
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Test server is running'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'API is working',
    data: { test: 'Hello World' }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API test: http://localhost:${PORT}/api/test`);
});






=======
const express = require('express');
const app = express();
const PORT = 3001;

// Simple test server
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Test server is running'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'API is working',
    data: { test: 'Hello World' }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API test: http://localhost:${PORT}/api/test`);
});






>>>>>>> cdde7e74c145f3a7e1d3f77290ab03c7b8100859

