require('express-async-errors');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.raw({ type: 'application/octet-stream', limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
const blobRoutes = require('./routes/blob');
const filesystemRoutes = require('./routes/filesystem');
const healthRoutes = require('./routes/health');

app.use('/health', healthRoutes);
app.use('/', blobRoutes);
app.use('/', filesystemRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    error: message,
    code: err.code || 'InternalServerError',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    code: 'ResourceNotFound',
    path: req.path,
  });
});

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log('Azure Data Lake Storage Gen2 Emulator');
  console.log(`${'='.repeat(60)}`);
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  - Blob API: http://localhost:${PORT}/{container}/{path}`);
  console.log(`  - Health: http://localhost:${PORT}/health`);
  console.log(`\nSupported operations:`);
  console.log(`  - PUT    /{container}/{path}     - Create/Upload file or directory`);
  console.log(`  - GET    /{container}/{path}     - Download file or list directory`);
  console.log(`  - DELETE /{container}/{path}     - Delete file or directory`);
  console.log(`  - PATCH  /{container}/{path}     - Update file metadata`);
  console.log(`${'='.repeat(60)}\n`);
});

module.exports = app;
