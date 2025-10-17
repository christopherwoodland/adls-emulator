# Developer Guide

## Architecture Overview

### Project Structure

```
adls-emulator/
├── src/
│   ├── server.js                  # Express server setup
│   ├── models/
│   │   ├── Container.js           # Container abstraction (file system root)
│   │   ├── Directory.js           # Directory metadata and operations
│   │   └── File.js                # File abstraction with content
│   ├── controllers/
│   │   └── StorageController.js   # Business logic and CRUD operations
│   └── routes/
│       ├── health.js              # Health check endpoint
│       ├── blob.js                # Blob API endpoints (primary)
│       └── filesystem.js          # DFS/HDFS compatibility (future)
├── tests/
│   └── api.test.js                # Jest test suite
├── examples.js                    # Usage examples and demonstrations
├── package.json                   # Dependencies and scripts
├── Dockerfile                     # Docker container definition
├── docker-compose.yml             # Docker compose configuration
├── .env                           # Environment variables
├── .gitignore                     # Git ignore rules
├── README.md                      # API documentation
└── QUICKSTART.md                  # Quick start guide
```

## Core Components

### 1. Models

#### Container.js
- Represents a top-level storage container
- Manages hierarchical file system structure
- Provides path-based access to files and directories

**Key Methods:**
- `getPath(pathStr)` - Retrieve item at path
- `setPath(pathStr, value)` - Set/create item at path
- `deletePath(pathStr)` - Delete item at path
- `listDirectory(pathStr)` - List directory contents

#### File.js
- Represents a single file with content
- Stores file metadata (size, timestamps, ETag)
- Tracks content type for proper handling

**Key Methods:**
- `updateContent(content, contentType)` - Update file content

#### Directory.js
- Represents a directory node
- Tracks metadata and children
- Currently used for type identification (can be enhanced)

### 2. StorageController

Singleton controller that manages all storage operations:

**Container Operations:**
- `createContainer(name)` - Create new container
- `getContainer(name)` - Retrieve container
- `listContainers()` - List all containers
- `deleteContainer(name)` - Delete container

**File Operations:**
- `createFile(container, path, content, type)` - Create file
- `getFile(container, path)` - Retrieve file
- `updateFile(container, path, content, type)` - Update file
- `deleteFile(container, path)` - Delete file

**Directory Operations:**
- `createDirectory(container, path)` - Create directory
- `getDirectory(container, path)` - List directory contents
- `deleteDirectory(container, path)` - Delete empty directory

### 3. Routes

#### blob.js
Main API routes implementing REST semantics:

```
PUT    /:container              - Create container
GET    /                        - List containers
GET    /:container             - List container contents
DELETE /:container             - Delete container

PUT    /:container/*           - Upload file or create directory
GET    /:container/*           - Download file or list directory
DELETE /:container/*           - Delete file or directory
PATCH  /:container/*           - Update file metadata
```

#### health.js
Simple health check endpoint for monitoring.

#### filesystem.js
Placeholder for future HDFS/DFS compatibility.

## Data Model

### In-Memory Storage Structure

```javascript
// Container structure
containers: Map<string, Container> {
  "mycontainer": {
    fileSystem: {
      "dir1": {
        "dir2": {
          "file.txt": File { content, properties, ... },
          "image.jpg": File { ... }
        }
      },
      "readme.md": File { ... }
    }
  }
}
```

### File Properties

```javascript
{
  id: "uuid",
  name: "filename.txt",
  path: "dir/filename.txt",
  parentPath: "dir",
  content: Buffer,
  contentType: "text/plain",
  properties: {
    createdTime: ISO8601,
    modifiedTime: ISO8601,
    etag: "uuid",
    size: 1024
  }
}
```

## Adding New Features

### Example: Add Blob Tiering

```javascript
// 1. Update File model
class File {
  constructor(...) {
    this.tier = 'hot'; // hot, cool, archive
    this.properties = {
      ...existing,
      accessTier: this.tier
    };
  }

  setTier(newTier) {
    this.tier = newTier;
    this.updateModifiedTime();
  }
}

// 2. Add controller method
StorageController.prototype.setFileTier = function(container, path, tier) {
  const file = this.getFile(container, path);
  file.setTier(tier);
  return file;
};

// 3. Add API endpoint
router.patch('/:container/*', (req, res) => {
  const { tier } = req.body;
  if (tier) {
    const file = StorageController.setFileTier(container, path, tier);
    res.json({ tier: file.tier });
  }
});
```

### Example: Add Versioning

```javascript
// 1. Extend File model
class File {
  constructor(...) {
    this.versions = []; // Track versions
    this.currentVersion = 0;
  }

  updateContent(content, contentType) {
    this.versions.push({
      content: this.content,
      timestamp: new Date(),
      etag: this.properties.etag
    });
    this.currentVersion++;
    // ... update current version
  }

  getVersion(versionId) {
    return this.versions[versionId];
  }
}

// 2. Add routes
router.get('/:container/*?versionId=:id', (req, res) => {
  const version = file.getVersion(req.params.id);
  res.send(version.content);
});
```

## Testing

### Run Tests
```bash
npm test
```

### Test Structure
Tests use Jest and Supertest for HTTP assertions:

```javascript
describe('Feature Group', () => {
  test('specific feature', async () => {
    const res = await request(app)
      .put('/container/file.txt')
      .expect(201);
    
    expect(res.body.path).toBe('file.txt');
  });
});
```

### Adding Tests

1. Create test file in `tests/` directory
2. Use `describe` for test groups
3. Use `test` for individual tests
4. Use `request(app)` to make HTTP calls
5. Use `expect()` for assertions

## Debugging

### Enable Detailed Logging

```javascript
// In server.js
app.use(morgan('dev')); // Add HTTP logging
```

### Console Debugging

```bash
# Run with debug output
DEBUG=* npm start

# Or in code
console.log('Variable:', variable);
console.trace('Stack trace');
```

### Using Node Inspector

```bash
# Start with debugging
node --inspect src/server.js

# Then visit chrome://inspect in Chrome
```

## Performance Considerations

### Current Limitations
- Single-threaded event loop
- All data in memory (not persisted)
- No clustering support
- Linear directory traversal

### Optimization Ideas
- Add object pooling for frequently created objects
- Implement LRU cache for popular files
- Consider lazy-loading for large files
- Add request batching for bulk operations

## Extending for Production

### To use as a production service:

1. **Add Persistence**
   ```javascript
   // Use LevelDB or SQLite for persistent storage
   const level = require('level');
   const db = level('./data');
   ```

2. **Add Authentication**
   ```javascript
   // Verify API keys or tokens
   const authenticateRequest = (req, res, next) => {
     if (!req.headers.authorization) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     next();
   };
   ```

3. **Add Access Control**
   ```javascript
   // Track permissions per resource
   class AccessControl {
     grant(user, resource, permission) { }
     check(user, resource, permission) { }
   }
   ```

4. **Add Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({ windowMs: 60000, max: 100 });
   app.use(limiter);
   ```

5. **Add Metrics/Monitoring**
   ```javascript
   // Track request count, response times, etc.
   const prometheus = require('prom-client');
   ```

## Deployment

### Docker Deployment
```bash
docker build -t adls-emulator:latest .
docker run -p 10000:10000 adls-emulator:latest
```

### Kubernetes Deployment
Create a manifest:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: adls-emulator
spec:
  replicas: 1
  selector:
    matchLabels:
      app: adls-emulator
  template:
    metadata:
      labels:
        app: adls-emulator
    spec:
      containers:
      - name: adls-emulator
        image: adls-emulator:latest
        ports:
        - containerPort: 10000
```

## Troubleshooting

### Memory Leak
```bash
# Monitor memory
npm run dev | grep -i memory

# Use heapdump for analysis
node --expose-gc src/server.js
```

### Slow Operations
```javascript
// Add timing
console.time('operation');
// ... operation ...
console.timeEnd('operation');
```

### File Not Found Issues
```javascript
// Enable verbose logging
StorageController.getPath = function(container, path) {
  console.log('Looking for path:', path);
  console.log('Container contents:', container.fileSystem);
  // ... rest of method
};
```

## API Compatibility

### Azure Storage Compatibility
The emulator follows Azure Blob Storage patterns but doesn't implement the full API. Key differences:

- ✅ Same URL structure: `/{container}/{blob-path}`
- ✅ Same HTTP methods: GET, PUT, DELETE
- ✅ Similar responses and error codes
- ❌ No shared access signatures (SAS)
- ❌ No authentication (no API keys/connection strings)
- ❌ No advanced features (snapshots, soft delete, etc.)

### SDK Integration
To use official Azure SDKs with this emulator:

```javascript
// Future: Custom endpoint support
const { BlobServiceClient } = require("@azure/storage-blob");
const client = BlobServiceClient.fromConnectionString(
  "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;" +
  "AccountKey=...;BlobEndpoint=http://localhost:10000/"
);
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Add tests for new functionality
4. Ensure all tests pass (`npm test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Azure Blob Storage REST API](https://learn.microsoft.com/en-us/rest/api/storageservices/blob-service-rest-api)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Jest Testing Framework](https://jestjs.io/)

## Support

For questions or issues:
1. Check existing documentation
2. Review examples
3. Check test cases
4. Open an issue with detailed description
