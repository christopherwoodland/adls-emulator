const express = require('express');
const router = express.Router();
const StorageController = require('../controllers/StorageController');

// GET / - List all containers
router.get('/', (req, res) => {
  try {
    const containers = StorageController.listContainers();
    res.status(200).json({
      containers: containers.map(c => c.toJSON()),
      count: containers.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /:container - Create container
router.put('/:container', (req, res) => {
  try {
    const { container } = req.params;
    
    // Check if it's a resource operation with empty path
    if (req.query.resource === 'file' && !req.query.directory) {
      // This is a blob upload to root container, delegate to blob handling
      return handleBlobUpload(req, res, container, '');
    }
    
    const newContainer = StorageController.createContainer(container);
    res.status(201).json({
      container: newContainer.toJSON(),
      message: `Container '${container}' created successfully`,
    });
  } catch (err) {
    if (err.message.includes('already exists')) {
      res.status(409).json({ error: err.message, code: 'ContainerAlreadyExists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// GET /:container - List container contents (root directory)
router.get('/:container', (req, res) => {
  try {
    const { container } = req.params;
    
    try {
      StorageController.getContainer(container);
    } catch {
      return res.status(404).json({ error: `Container '${container}' not found` });
    }
    
    const contents = StorageController.getDirectory(container, '');
    res.status(200).json({
      container,
      contents: contents || [],
      count: contents ? contents.length : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /:container - Delete container
router.delete('/:container', (req, res) => {
  try {
    const { container } = req.params;
    StorageController.deleteContainer(container);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /:container/* - Create/Upload file or create directory
router.put('/:container/*', (req, res) => {
  try {
    const { container } = req.params;
    const path = req.params[0];
    
    if (req.query.directory !== undefined) {
      // Create directory
      const result = StorageController.createDirectory(container, path);
      res.status(201).json({
        path: result.path,
        type: 'directory',
        message: `Directory '${path}' created successfully`,
      });
    } else {
      // Upload file
      handleBlobUpload(req, res, container, path);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:container/* - Download file or list directory
router.get('/:container/*', (req, res) => {
  try {
    const { container } = req.params;
    const path = req.params[0];
    
    try {
      const file = StorageController.getFile(container, path);
      res.set('Content-Type', file.contentType);
      res.set('ETag', file.properties.etag);
      res.set('Last-Modified', file.properties.modifiedTime);
      res.set('Content-Length', file.properties.size);
      res.status(200).send(file.content);
      return;
    } catch (fileErr) {
      // Not a file, try as directory
    }
    
    try {
      const contents = StorageController.getDirectory(container, path);
      res.status(200).json({
        path,
        type: 'directory',
        contents: contents || [],
        count: contents ? contents.length : 0,
      });
    } catch (dirErr) {
      res.status(404).json({ error: `Path '${path}' not found` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /:container/* - Delete file or directory
router.delete('/:container/*', (req, res) => {
  try {
    const { container } = req.params;
    const path = req.params[0];
    
    try {
      const file = StorageController.getFile(container, path);
      StorageController.deleteFile(container, path);
      res.status(204).send();
      return;
    } catch (fileErr) {
      // Not a file, try as directory
    }
    
    try {
      StorageController.deleteDirectory(container, path);
      res.status(204).send();
    } catch (dirErr) {
      res.status(500).json({ error: dirErr.message });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /:container/* - Update file metadata
router.patch('/:container/*', (req, res) => {
  try {
    const { container } = req.params;
    const path = req.params[0];
    
    const file = StorageController.getFile(container, path);
    
    // Update metadata if provided
    if (req.body.properties) {
      Object.assign(file.properties, req.body.properties);
    }
    
    res.status(200).json({
      path,
      type: 'file',
      properties: file.properties,
      message: 'File metadata updated',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function to handle blob upload
function handleBlobUpload(req, res, container, path) {
  try {
    let content;
    let contentType = req.get('Content-Type') || 'application/octet-stream';
    
    if (Buffer.isBuffer(req.body)) {
      content = req.body;
    } else if (typeof req.body === 'string') {
      content = Buffer.from(req.body);
    } else if (typeof req.body === 'object') {
      content = Buffer.from(JSON.stringify(req.body));
      contentType = 'application/json';
    } else {
      content = Buffer.from('');
    }
    
    const file = StorageController.updateFile(container, path, content, contentType);
    
    res.status(201).json({
      path,
      type: 'file',
      properties: file.properties,
      message: `File '${path}' uploaded successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = router;
