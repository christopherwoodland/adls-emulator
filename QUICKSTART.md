# Quick Start Guide

## 🚀 Getting Started with ADLS Gen2 Emulator

### Prerequisites
- Node.js 16+ installed ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- OR Docker installed ([Download](https://www.docker.com/))

---

## Option 1: Run Locally (No Docker)

### Step 1: Install Dependencies
```bash
cd adls-emulator
npm install
```

### Step 2: Start the Emulator
```bash
npm start
```

You should see:
```
============================================================
Azure Data Lake Storage Gen2 Emulator
============================================================
Server running at http://localhost:10000
...
============================================================
```

### Step 3: Test the Emulator
In a new terminal, run:

```bash
# Health check
curl http://localhost:10000/health

# Create a container
curl -X PUT http://localhost:10000/mydata

# Upload a file
curl -X PUT http://localhost:10000/mydata/hello.txt \
  -H "Content-Type: text/plain" \
  -d "Hello, World!"

# Download the file
curl http://localhost:10000/mydata/hello.txt

# List container contents
curl http://localhost:10000/mydata
```

---

## Option 2: Run with Docker

### Step 1: Build the Docker Image
```bash
docker-compose build
```

### Step 2: Start the Container
```bash
docker-compose up -d
```

### Step 3: Test the Emulator
```bash
# Health check
curl http://localhost:10000/health

# Create a container
curl -X PUT http://localhost:10000/mydata
```

### View Logs
```bash
docker-compose logs -f adls-emulator
```

### Stop the Container
```bash
docker-compose down
```

---

## Using the Emulator with Your Application

### JavaScript/Node.js Example

```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'http://localhost:10000'
});

// Create container
await client.put('/mycontainer');

// Upload file
await client.put('/mycontainer/data/file.txt', 'content', {
  headers: { 'Content-Type': 'text/plain' }
});

// Download file
const response = await client.get('/mycontainer/data/file.txt');
console.log(response.data);

// List directory
const list = await client.get('/mycontainer/data');
console.log(list.data.contents);
```

### Python Example

```python
import requests

BASE_URL = 'http://localhost:10000'

# Create container
requests.put(f'{BASE_URL}/mycontainer')

# Upload file
requests.put(
    f'{BASE_URL}/mycontainer/data/file.txt',
    data='Hello, World!',
    headers={'Content-Type': 'text/plain'}
)

# Download file
response = requests.get(f'{BASE_URL}/mycontainer/data/file.txt')
print(response.text)

# List directory
response = requests.get(f'{BASE_URL}/mycontainer/data')
print(response.json()['contents'])
```

### cURL Examples

```bash
# Create container
curl -X PUT http://localhost:10000/mydata

# Create directory
curl -X PUT http://localhost:10000/mydata/reports?directory

# Upload file
curl -X PUT http://localhost:10000/mydata/reports/data.csv \
  -H "Content-Type: text/csv" \
  -d @data.csv

# List directory
curl http://localhost:10000/mydata/reports

# Download file
curl http://localhost:10000/mydata/reports/data.csv > data.csv

# Delete file
curl -X DELETE http://localhost:10000/mydata/reports/data.csv

# Delete container
curl -X DELETE http://localhost:10000/mydata
```

---

## Run Examples

To see various usage patterns, run the examples script:

```bash
npm run examples
```

This will demonstrate:
- Container management
- File upload/download
- Directory creation
- Bulk operations
- Data analytics scenarios
- File deletion and cleanup

---

## Development Mode

For development with auto-reload on file changes:

```bash
npm install --save-dev  # If not already done
npm run dev
```

---

## Run Tests

To run the included test suite:

```bash
npm test
```

---

## Common Tasks

### Check if Emulator is Running
```bash
curl http://localhost:10000/health
```

### Change Port
```bash
PORT=3000 npm start
```

### View Server Logs
The emulator logs all requests to the console with timestamps.

### Stop the Emulator
Press `Ctrl+C` in the terminal where it's running.

---

## Troubleshooting

### Port 10000 Already in Use
```bash
# Use a different port
PORT=3001 npm start
```

### Module Not Found Error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Docker Container Won't Start
```bash
# Check logs
docker-compose logs adls-emulator

# Rebuild image
docker-compose build --no-cache
```

### Permission Denied (Mac/Linux)
```bash
# Grant execute permission
chmod +x examples.js
```

---

## Next Steps

1. 📖 Read the [README.md](./README.md) for detailed API documentation
2. 🎯 Check [examples.js](./examples.js) for code samples
3. 🧪 Run the test suite with `npm test`
4. 🔧 Modify the emulator code to add custom features

---

## Performance Tips

- Use directories to organize files logically
- Upload files in parallel for better throughput
- Use appropriate Content-Type headers
- Monitor memory usage for large files

---

## Support

For issues or questions:
1. Check the [README.md](./README.md) for API details
2. Review [examples.js](./examples.js) for usage patterns
3. Check the troubleshooting section above
4. Open an issue on the project repository

---

## What's Next?

The emulator supports:
- ✅ Hierarchical file structure
- ✅ Container management
- ✅ File upload/download
- ✅ Directory operations
- ✅ Metadata tracking
- ✅ REST API

Future enhancements:
- 🔄 Data persistence to disk
- 🔐 Access control lists (ACLs)
- 📊 Blob versioning
- 🗑️ Soft delete and retention
- 📈 Performance monitoring

Happy coding! 🎉
