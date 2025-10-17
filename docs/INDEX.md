# ADLS Gen2 Emulator - Project Index

## 📋 Project Contents

### 🚀 Quick Links
- **Start Here**: [QUICKSTART.md](./QUICKSTART.md) - Get running in 5 minutes
- **API Reference**: [README.md](./README.md) - Complete endpoint documentation
- **Code Examples**: [examples.js](./examples.js) - Working code samples
- **Architecture**: [DEVELOPER.md](./DEVELOPER.md) - How it works internally
- **cURL Commands**: [CURL_EXAMPLES.md](./CURL_EXAMPLES.md) - REST API command reference

---

## 📁 Project Structure

```
adls-emulator/
│
├── 📄 Core Files
│   ├── package.json              - Dependencies and npm scripts
│   ├── .env                      - Environment variables
│   ├── .gitignore                - Git ignore rules
│   └── examples.js               - Working code examples
│
├── 🐳 Deployment
│   ├── Dockerfile                - Docker image definition
│   ├── docker-compose.yml        - Docker Compose configuration
│   └── setup.ps1                 - Windows PowerShell setup script
│
├── 📚 Documentation
│   ├── README.md                 - Complete API documentation (START HERE!)
│   ├── QUICKSTART.md             - Quick start guide for all platforms
│   ├── DEVELOPER.md              - Developer guide and architecture
│   ├── CURL_EXAMPLES.md          - cURL command reference
│   ├── SUMMARY.md                - Project overview and summary
│   └── INDEX.md                  - This file
│
├── 📁 src/
│   ├── server.js                 - Express server setup
│   │
│   ├── models/
│   │   ├── Container.js          - Container abstraction (file system root)
│   │   ├── File.js               - File model with content storage
│   │   └── Directory.js          - Directory metadata model
│   │
│   ├── controllers/
│   │   └── StorageController.js  - Main business logic controller
│   │
│   └── routes/
│       ├── health.js             - Health check endpoint
│       ├── blob.js               - Main REST API routes
│       └── filesystem.js         - DFS/HDFS compatibility (future)
│
└── 📁 tests/
    └── api.test.js               - Jest test suite (15+ tests)
```

---

## ✨ Key Features

### ✅ Implemented
- Hierarchical file system (directories and subdirectories)
- Container management (create, list, delete)
- File operations (upload, download, update, delete)
- Directory operations (create, list, delete)
- File metadata (timestamps, ETags, sizes)
- REST API compatible with Azure patterns
- Docker support
- Comprehensive test suite
- Health check endpoint
- Proper HTTP error handling

### 🔄 In Development
- Data persistence to disk
- POSIX ACL support
- Blob versioning
- Soft delete and retention

### 🔮 Future
- WebHDFS/HDFS compatibility
- Azure Storage SDK integration
- Performance monitoring
- Clustering support

---

## 📖 Documentation Guide

### For First-Time Users
1. Start with [QUICKSTART.md](./QUICKSTART.md)
2. Try the examples from [CURL_EXAMPLES.md](./CURL_EXAMPLES.md)
3. Run `npm run examples` to see real scenarios

### For Developers
1. Read [DEVELOPER.md](./DEVELOPER.md) for architecture
2. Review `src/` directory structure
3. Check `tests/api.test.js` for usage patterns

### For API Users
1. Refer to [README.md](./README.md) for endpoint reference
2. Use [CURL_EXAMPLES.md](./CURL_EXAMPLES.md) for command samples
3. Check examples in [examples.js](./examples.js)

### For DevOps
1. See Docker setup in [QUICKSTART.md](./QUICKSTART.md)
2. Review `Dockerfile` and `docker-compose.yml`
3. Use `setup.ps1` for Windows setup

---

## 🛠️ Available Commands

```bash
# Installation
npm install              # Install dependencies

# Running
npm start               # Start production server
npm run dev             # Start with auto-reload (development)
npm run examples        # Run example scenarios
npm test                # Run test suite

# Docker
npm run docker:build    # Build Docker image
npm run docker:run      # Run Docker container
docker-compose up       # Start with Docker Compose

# Windows PowerShell
.\setup.ps1 -Action install    # Install dependencies
.\setup.ps1 -Action start      # Start emulator
.\setup.ps1 -Action test       # Run tests
.\setup.ps1 -Action docker     # Use Docker
```

---

## 🚀 Getting Started (30 seconds)

### Step 1: Install
```bash
npm install
```

### Step 2: Start
```bash
npm start
```

### Step 3: Test (in another terminal)
```bash
curl -X PUT http://localhost:10000/mydata
curl -X PUT http://localhost:10000/mydata/hello.txt \
  -H "Content-Type: text/plain" \
  -d "Hello!"
curl http://localhost:10000/mydata/hello.txt
```

Done! 🎉

---

## 🔌 API Endpoints Summary

### Containers
| Operation | Method | Endpoint |
|-----------|--------|----------|
| Create | PUT | `/{container}` |
| List | GET | `/` |
| Contents | GET | `/{container}` |
| Delete | DELETE | `/{container}` |

### Files
| Operation | Method | Endpoint |
|-----------|--------|----------|
| Upload | PUT | `/{container}/{path}` |
| Download | GET | `/{container}/{path}` |
| Delete | DELETE | `/{container}/{path}` |
| Metadata | PATCH | `/{container}/{path}` |

### Directories
| Operation | Method | Endpoint |
|-----------|--------|----------|
| Create | PUT | `/{container}/{path}?directory` |
| List | GET | `/{container}/{path}` |
| Delete | DELETE | `/{container}/{path}` |

### Health
| Operation | Method | Endpoint |
|-----------|--------|----------|
| Status | GET | `/health` |

---

## 📊 Project Statistics

- **Total Files**: 28
- **Lines of Code**: ~2,500+
- **Test Cases**: 15+
- **API Endpoints**: 8 (scalable)
- **Documentation Pages**: 6
- **Code Examples**: 50+

---

## 🎓 Use Cases

1. **Local Development** - No Azure costs, faster iteration
2. **Integration Testing** - Test Azure Storage code in CI/CD
3. **Training & Learning** - Understand Azure Data Lake concepts
4. **Prototyping** - Build data lake architectures locally
5. **Mock Testing** - Unit test with predictable local storage

---

## 🔐 Security & Limitations

### Current (Development)
- ⚠️ No authentication required
- ⚠️ No rate limiting
- ⚠️ All endpoints public
- ⚠️ In-memory storage (not persistent)

### For Production Use
- Add API key/token authentication
- Implement rate limiting
- Add HTTPS/TLS support
- Add persistent storage
- Implement access control

---

## 🆘 Help & Support

### Documentation
- 📖 [README.md](./README.md) - Complete API documentation
- ⚡ [QUICKSTART.md](./QUICKSTART.md) - Getting started
- 🏗️ [DEVELOPER.md](./DEVELOPER.md) - Architecture and extending
- 💻 [CURL_EXAMPLES.md](./CURL_EXAMPLES.md) - REST examples

### Code Examples
- 📝 [examples.js](./examples.js) - 6 real-world scenarios
- 🧪 [tests/api.test.js](./tests/api.test.js) - Test patterns

### Quick Tips
```bash
# Check if running
curl http://localhost:10000/health

# View server logs
npm start

# Debug a request
curl -v http://localhost:10000/mydata

# Pretty-print JSON
curl http://localhost:10000/ | jq '.'

# Use different port
PORT=3000 npm start
```

---

## 📞 Questions?

1. **Setup Issues** → Check [QUICKSTART.md](./QUICKSTART.md)
2. **API Questions** → See [README.md](./README.md)
3. **Code Examples** → Run `npm run examples`
4. **Architecture** → Read [DEVELOPER.md](./DEVELOPER.md)
5. **cURL Commands** → See [CURL_EXAMPLES.md](./CURL_EXAMPLES.md)

---

## 🎉 What's Next?

- [ ] Review the [QUICKSTART.md](./QUICKSTART.md)
- [ ] Run `npm install` and `npm start`
- [ ] Try the example commands in [CURL_EXAMPLES.md](./CURL_EXAMPLES.md)
- [ ] Run `npm run examples` to see real scenarios
- [ ] Check [README.md](./README.md) for full API details
- [ ] Integrate with your applications!

---

## 📝 Notes

- All data is stored in memory (not persisted)
- Perfect for development and testing
- Production use requires enhancements (see DEVELOPER.md)
- Docker support available for easy deployment
- Fully tested with comprehensive test suite

---

## 🙏 Thank You!

Happy coding with the ADLS Gen2 Emulator! 🚀

For more information, visit the [Azure Data Lake Storage documentation](https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction)
