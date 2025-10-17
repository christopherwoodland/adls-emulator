# Azure Data Lake Storage Gen2 Emulator

A local emulator for Azure Data Lake Storage Gen2 (ADLS Gen2) that allows you to develop and test applications without connecting to Azure.

## Features

- ✅ **Hierarchical Namespace** - Full directory structure support
- ✅ **Container Management** - Create and manage containers
- ✅ **File Operations** - Upload, download, update, and delete files
- ✅ **Directory Operations** - Create and manage directories
- ✅ **Metadata Support** - File properties including ETags, timestamps, and sizes
- ✅ **REST API** - Full REST API compatible with Azure Blob Storage patterns
- ✅ **Docker Support** - Run as a container for easy deployment
- ✅ **In-Memory Storage** - Fast, lightweight storage for development

## Installation

### Prerequisites
- Node.js 16+ or Docker

### Local Installation

```bash
cd adls-emulator
npm install
npm start
```

The emulator will start on `http://localhost:10000`

### Docker Installation

```bash
docker-compose up -d
```

This will start the emulator in a Docker container and expose it on port 10000.

## API Reference

### Base URL
```
http://localhost:10000
```

### Container Operations

#### Create a Container
```bash
curl -X PUT http://localhost:10000/mycontainer
```

**Response:**
```json
{
  "container": {
    "id": "uuid",
    "name": "mycontainer",
    "properties": {
      "createdTime": "2025-10-17T...",
      "modifiedTime": "2025-10-17T...",
      "etag": "uuid"
    }
  },
  "message": "Container 'mycontainer' created successfully"
}
```

#### List All Containers
```bash
curl -X GET http://localhost:10000/
```

**Response:**
```json
{
  "containers": [
    {
      "id": "uuid",
      "name": "mycontainer",
      "properties": {
        "createdTime": "2025-10-17T...",
        "modifiedTime": "2025-10-17T...",
        "etag": "uuid"
      }
    }
  ],
  "count": 1
}
```

#### List Container Contents
```bash
curl -X GET http://localhost:10000/mycontainer
```

**Response:**
```json
{
  "container": "mycontainer",
  "contents": [
    {
      "name": "dir1",
      "isDirectory": true,
      "item": {}
    },
    {
      "name": "file1.txt",
      "isDirectory": false,
      "item": { ... }
    }
  ],
  "count": 2
}
```

#### Delete a Container
```bash
curl -X DELETE http://localhost:10000/mycontainer
```

### File Operations

#### Upload/Create a File
```bash
curl -X PUT http://localhost:10000/mycontainer/path/to/file.txt \
  -H "Content-Type: text/plain" \
  -d "Hello, World!"
```

**Response:**
```json
{
  "path": "path/to/file.txt",
  "type": "file",
  "properties": {
    "createdTime": "2025-10-17T...",
    "modifiedTime": "2025-10-17T...",
    "etag": "uuid",
    "size": 13
  },
  "message": "File 'path/to/file.txt' uploaded successfully"
}
```

#### Download a File
```bash
curl -X GET http://localhost:10000/mycontainer/path/to/file.txt
```

**Response:** Raw file content with headers:
- `Content-Type`: File's content type
- `ETag`: File's entity tag
- `Content-Length`: File size in bytes

#### Update File Content
```bash
curl -X PUT http://localhost:10000/mycontainer/path/to/file.txt \
  -H "Content-Type: text/plain" \
  -d "Updated content"
```

#### Delete a File
```bash
curl -X DELETE http://localhost:10000/mycontainer/path/to/file.txt
```

### Directory Operations

#### Create a Directory
```bash
curl -X PUT http://localhost:10000/mycontainer/path/to/directory?directory
```

**Response:**
```json
{
  "path": "path/to/directory",
  "type": "directory",
  "message": "Directory 'path/to/directory' created successfully"
}
```

#### List Directory Contents
```bash
curl -X GET http://localhost:10000/mycontainer/path/to/directory
```

**Response:**
```json
{
  "path": "path/to/directory",
  "type": "directory",
  "contents": [
    {
      "name": "subdir",
      "isDirectory": true
    },
    {
      "name": "file.txt",
      "isDirectory": false
    }
  ],
  "count": 2
}
```

#### Delete a Directory (must be empty)
```bash
curl -X DELETE http://localhost:10000/mycontainer/path/to/directory
```

### Health Check

```bash
curl -X GET http://localhost:10000/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Azure Data Lake Storage Gen2 Emulator",
  "timestamp": "2025-10-17T..."
}
```

## Usage Examples

### Using with Node.js/JavaScript

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:10000';

// Create container
await axios.put(`${API_BASE}/mycontainer`);

// Create directory
await axios.put(`${API_BASE}/mycontainer/data?directory`);

// Upload file
await axios.put(`${API_BASE}/mycontainer/data/file.txt`, 'Hello, World!', {
  headers: { 'Content-Type': 'text/plain' }
});

// Download file
const response = await axios.get(`${API_BASE}/mycontainer/data/file.txt`);
console.log(response.data); // "Hello, World!"

// List directory
const dir = await axios.get(`${API_BASE}/mycontainer/data`);
console.log(dir.data.contents);
```

### Using with Python

```python
import requests

API_BASE = 'http://localhost:10000'

# Create container
requests.put(f'{API_BASE}/mycontainer')

# Create directory
requests.put(f'{API_BASE}/mycontainer/data?directory')

# Upload file
requests.put(
    f'{API_BASE}/mycontainer/data/file.txt',
    data='Hello, World!',
    headers={'Content-Type': 'text/plain'}
)

# Download file
response = requests.get(f'{API_BASE}/mycontainer/data/file.txt')
print(response.text)

# List directory
response = requests.get(f'{API_BASE}/mycontainer/data')
print(response.json()['contents'])
```

### Using with Azure SDK (Future Support)

The emulator is designed to eventually support Azure Storage SDKs by modifying the connection endpoint. This allows you to use the official SDKs against the local emulator.

## Development

### Project Structure
```
adls-emulator/
├── src/
│   ├── server.js              # Main Express application
│   ├── models/
│   │   ├── Container.js       # Container model
│   │   ├── Directory.js       # Directory model
│   │   └── File.js            # File model
│   ├── controllers/
│   │   └── StorageController.js # Business logic
│   └── routes/
│       ├── health.js          # Health check endpoint
│       ├── blob.js            # Blob API routes
│       └── filesystem.js      # HDFS compatibility (future)
├── tests/                      # Test files
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### Running in Development Mode

```bash
npm install
npm run dev
```

This uses `nodemon` to automatically restart the server on file changes.

### Running Tests

```bash
npm test
```

## Configuration

The emulator can be configured using environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `10000` | Server port |
| `NODE_ENV` | `development` | Node environment |

Example:
```bash
PORT=3000 npm start
```

## Limitations

- **In-Memory Storage**: Data is not persisted to disk. Restart will clear all data.
- **No Authentication**: All endpoints are publicly accessible (no API keys required).
- **No Permissions**: POSIX ACLs and RBAC are not implemented.
- **Limited Concurrency**: Single-threaded nature may not reflect production performance.
- **No Blob Tiers**: All files use the same tier (no hot/cool/archive tiers).
- **No Advanced Features**: Snapshots, soft delete, versioning not yet implemented.

## Roadmap

- [ ] Data persistence to local filesystem
- [ ] POSIX ACL support
- [ ] Blob versioning
- [ ] Soft delete and retention policies
- [ ] Lifecycle management policies
- [ ] WebHDFS (HDFS) compatibility
- [ ] Azure Storage SDK integration
- [ ] Performance metrics and monitoring
- [ ] Better error messages with Azure-compatible error codes
- [ ] Support for concurrent operations

## Troubleshooting

### Port Already in Use
If port 10000 is already in use, you can specify a different port:
```bash
PORT=3000 npm start
```

### Container Not Found
Ensure you've created the container first:
```bash
curl -X PUT http://localhost:10000/mycontainer
```

### File Not Found
Check the exact path and ensure all parent directories exist. You can create directories with:
```bash
curl -X PUT http://localhost:10000/mycontainer/path/to/dir?directory
```

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

MIT

## Related Resources

- [Azure Data Lake Storage Gen2 Documentation](https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction)
- [Azure Blob Storage REST API](https://learn.microsoft.com/en-us/rest/api/storageservices/blob-service-rest-api)
- [Apache Hadoop HDFS](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html)

## Support

For issues, questions, or suggestions, please open an issue on the project repository.
