const Container = require('../models/Container');
const File = require('../models/File');

class StorageController {
  constructor() {
    this.containers = new Map();
  }

  // Container operations
  createContainer(containerName) {
    if (this.containers.has(containerName)) {
      throw new Error(`Container '${containerName}' already exists`);
    }
    
    const container = new Container(containerName);
    this.containers.set(containerName, container);
    return container;
  }

  getContainer(containerName) {
    const container = this.containers.get(containerName);
    if (!container) {
      throw new Error(`Container '${containerName}' not found`);
    }
    return container;
  }

  listContainers() {
    return Array.from(this.containers.values());
  }

  deleteContainer(containerName) {
    if (!this.containers.has(containerName)) {
      throw new Error(`Container '${containerName}' not found`);
    }
    this.containers.delete(containerName);
  }

  // File operations
  createFile(containerName, filePath, content = Buffer.alloc(0), contentType = 'application/octet-stream') {
    const container = this.getContainer(containerName);
    
    // Ensure parent directories exist
    const pathParts = filePath.split('/').filter(p => p.length > 0);
    this._ensureDirectoryPath(container, pathParts.slice(0, -1));
    
    const file = new File(
      pathParts[pathParts.length - 1],
      filePath,
      pathParts.slice(0, -1).join('/'),
      content,
      contentType
    );
    
    container.setPath(filePath, file);
    return file;
  }

  getFile(containerName, filePath) {
    const container = this.getContainer(containerName);
    const item = container.getPath(filePath);
    
    if (!item) {
      throw new Error(`File '${filePath}' not found in container '${containerName}'`);
    }
    
    if (item.content === undefined) {
      throw new Error(`Path '${filePath}' is a directory, not a file`);
    }
    
    return item;
  }

  updateFile(containerName, filePath, content, contentType = 'application/octet-stream') {
    const container = this.getContainer(containerName);
    const file = container.getPath(filePath);
    
    if (!file) {
      // Create new file if it doesn't exist
      return this.createFile(containerName, filePath, content, contentType);
    }
    
    if (file.content === undefined) {
      throw new Error(`Path '${filePath}' is a directory, not a file`);
    }
    
    file.updateContent(content, contentType);
    return file;
  }

  deleteFile(containerName, filePath) {
    const container = this.getContainer(containerName);
    const item = container.getPath(filePath);
    
    if (!item) {
      throw new Error(`File '${filePath}' not found`);
    }
    
    if (item.content === undefined) {
      throw new Error(`Path '${filePath}' is a directory, not a file`);
    }
    
    return container.deletePath(filePath);
  }

  // Directory operations
  createDirectory(containerName, directoryPath) {
    const container = this.getContainer(containerName);
    const pathParts = directoryPath.split('/').filter(p => p.length > 0);
    
    const dir = {};
    container.setPath(directoryPath, dir);
    return { path: directoryPath, isDirectory: true };
  }

  getDirectory(containerName, directoryPath) {
    const container = this.getContainer(containerName);
    
    if (directoryPath === '' || directoryPath === '/') {
      return container.listDirectory('');
    }
    
    const item = container.getPath(directoryPath);
    
    if (!item) {
      throw new Error(`Directory '${directoryPath}' not found`);
    }
    
    if (item.content !== undefined) {
      throw new Error(`Path '${directoryPath}' is a file, not a directory`);
    }
    
    return container.listDirectory(directoryPath);
  }

  deleteDirectory(containerName, directoryPath) {
    const container = this.getContainer(containerName);
    const item = container.getPath(directoryPath);
    
    if (!item) {
      throw new Error(`Directory '${directoryPath}' not found`);
    }
    
    if (item.content !== undefined) {
      throw new Error(`Path '${directoryPath}' is a file, not a directory`);
    }
    
    // Check if directory is empty
    if (Object.keys(item).length > 0) {
      throw new Error(`Directory '${directoryPath}' is not empty`);
    }
    
    return container.deletePath(directoryPath);
  }

  // Helper method to ensure directory path exists
  _ensureDirectoryPath(container, pathParts) {
    let currentPath = '';
    
    for (const part of pathParts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const item = container.getPath(currentPath);
      
      if (!item) {
        container.setPath(currentPath, {});
      }
    }
  }
}

module.exports = new StorageController();
