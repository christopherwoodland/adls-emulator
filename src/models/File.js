const { v4: uuidv4 } = require('uuid');

class File {
  constructor(name, path, parentPath, content = Buffer.alloc(0), contentType = 'application/octet-stream') {
    this.id = uuidv4();
    this.name = name;
    this.path = path;
    this.parentPath = parentPath;
    this.content = content;
    this.contentType = contentType;
    this.properties = {
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      etag: uuidv4(),
      size: content.length,
    };
  }

  updateContent(content, contentType = this.contentType) {
    this.content = content;
    this.contentType = contentType;
    this.properties.size = content.length;
    this.properties.modifiedTime = new Date().toISOString();
    this.properties.etag = uuidv4();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      path: this.path,
      type: 'file',
      contentType: this.contentType,
      properties: this.properties,
    };
  }
}

module.exports = File;
