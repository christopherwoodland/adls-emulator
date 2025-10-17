const { v4: uuidv4 } = require('uuid');

class Container {
  constructor(name) {
    this.id = uuidv4();
    this.name = name;
    this.fileSystem = {}; // hierarchical structure: { 'dir1': { 'dir2': { 'file.txt': FileObject } } }
    this.properties = {
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      etag: uuidv4(),
    };
  }

  updateModifiedTime() {
    this.properties.modifiedTime = new Date().toISOString();
    this.properties.etag = uuidv4();
  }

  getPath(pathStr) {
    const parts = pathStr.split('/').filter(p => p.length > 0);
    let current = this.fileSystem;
    
    for (const part of parts) {
      if (current[part] === undefined) {
        return null;
      }
      current = current[part];
    }
    
    return current;
  }

  setPath(pathStr, value) {
    const parts = pathStr.split('/').filter(p => p.length > 0);
    let current = this.fileSystem;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (current[part] === undefined) {
        current[part] = {};
      }
      current = current[part];
    }
    
    if (parts.length > 0) {
      current[parts[parts.length - 1]] = value;
    }
    
    this.updateModifiedTime();
  }

  deletePath(pathStr) {
    const parts = pathStr.split('/').filter(p => p.length > 0);
    if (parts.length === 0) return false;
    
    let current = this.fileSystem;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (current[part] === undefined) {
        return false;
      }
      current = current[part];
    }
    
    const lastPart = parts[parts.length - 1];
    if (current[lastPart] !== undefined) {
      delete current[lastPart];
      this.updateModifiedTime();
      return true;
    }
    
    return false;
  }

  listDirectory(pathStr = '') {
    const target = pathStr ? this.getPath(pathStr) : this.fileSystem;
    
    if (target === null || target === undefined) {
      return [];
    }
    
    // Check if it's a file (has content property) or directory
    if (target.content !== undefined) {
      return null; // It's a file, not a directory
    }
    
    return Object.keys(target).map(key => ({
      name: key,
      isDirectory: typeof target[key] === 'object' && target[key].content === undefined,
      item: target[key],
    }));
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      properties: this.properties,
    };
  }
}

module.exports = Container;
