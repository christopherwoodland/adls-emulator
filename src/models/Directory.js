const { v4: uuidv4 } = require('uuid');

class Directory {
  constructor(name, path, parentPath = null) {
    this.id = uuidv4();
    this.name = name;
    this.path = path;
    this.parentPath = parentPath;
    this.children = []; // array of file/directory names
    this.properties = {
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      etag: uuidv4(),
    };
  }

  addChild(name) {
    if (!this.children.includes(name)) {
      this.children.push(name);
      this.updateModifiedTime();
    }
  }

  removeChild(name) {
    this.children = this.children.filter(child => child !== name);
    this.updateModifiedTime();
  }

  updateModifiedTime() {
    this.properties.modifiedTime = new Date().toISOString();
    this.properties.etag = uuidv4();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      path: this.path,
      type: 'directory',
      properties: this.properties,
      childCount: this.children.length,
    };
  }
}

module.exports = Directory;
