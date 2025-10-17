# Testing the ADLS Gen2 Emulator with HTTP Client

## 📄 Using the `test-endpoints.http` File

This file contains comprehensive REST API tests for all ADLS Gen2 emulator endpoints. It's designed to work with:

- **VS Code REST Client** (Recommended)
- **Postman**
- **Insomnia**
- **Thunder Client**
- **Any HTTP client that supports .http files**

---

## 🚀 Setup

### Option 1: VS Code REST Client Extension (Recommended)

1. Install the extension:
   ```
   ext install humao.rest-client
   ```

2. Open `test-endpoints.http` in VS Code

3. Click the **"Send Request"** link that appears above each request

### Option 2: Import into Postman

1. Open Postman
2. Click **"Import"** → **"File"** → Select `test-endpoints.http`
3. Run the requests from the collection

### Option 3: Use with cURL

Convert requests manually or use a tool to convert .http to cURL format.

---

## 📋 Test Sections

The file is organized into logical sections:

### 1. **Health Check** (1 test)
   - Verify emulator is running

### 2. **Container Operations** (4 tests)
   - Create container
   - List containers
   - List contents
   - Delete container

### 3. **File Operations - Basic** (4 tests)
   - Upload text file
   - Download file
   - Update content
   - Delete file

### 4. **File Operations - JSON** (3 tests)
   - Upload JSON
   - Download JSON
   - Update JSON

### 5. **File Operations - CSV** (3 tests)
   - Upload CSV
   - Download CSV
   - Delete CSV

### 6. **Directory Operations** (3 tests)
   - Create directory
   - List directory
   - Delete directory

### 7. **Nested Operations** (5 tests)
   - Create deep hierarchy
   - Upload to nested path
   - List nested directory
   - Download from nested path
   - Delete nested items

### 8. **Bulk Operations** (7 tests)
   - Upload multiple files
   - List bulk directory
   - Delete multiple files

### 9. **Data Analytics Scenario** (8 tests)
   - Create analytics structure
   - Upload metrics
   - Upload results
   - Verify data

### 10. **Document Scenario** (7 tests)
   - Create document hierarchy
   - Upload reports
   - List directories
   - Download documents

### 11. **Metadata Operations** (3 tests)
   - Create file
   - Get with headers
   - Update metadata

### 12. **Error Handling** (4 tests)
   - Test 404 responses
   - Invalid paths
   - Non-existent items

### 13. **Cleanup** (1 section)
   - Remove all test data

### 14. **Performance Test** (2 tests)
   - Upload large file
   - Download large file

### 15. **Sequential Workflow** (10 tests)
   - Complete start-to-finish workflow

---

## 🎯 Quick Start with VS Code

1. **Start the emulator:**
   ```bash
   npm start
   ```

2. **Open the test file:**
   ```
   test-endpoints.http
   ```

3. **Run individual requests:**
   - Hover over any request
   - Click "Send Request" link
   - View response in side panel

4. **Run sequentially:**
   - Click the request in order
   - Each request depends on previous ones
   - Follow the numbered sections

---

## 📊 Variables

The file uses variables for easy customization:

```
@baseUrl = http://localhost:10000          # Server URL
@containerName = test-container             # Container to test
@fileName = test-file.txt                   # Test filename
@jsonFileName = data.json                   # JSON file name
@directoryName = test-directory             # Directory name
@nestedPath = level1/level2/level3          # Deep path
```

### Modify Variables

Edit these at the top of the file to customize:

```
@baseUrl = http://localhost:3000            # Different port
@containerName = my-container               # Your container
```

---

## ✅ Test Execution Order

### Sequential Testing (Recommended)

Run tests in this order for best results:

1. ✅ Health Check
2. ✅ Container Operations (create → list → contents → delete)
3. ✅ File Operations
4. ✅ Directory Operations
5. ✅ Bulk Operations
6. ✅ Data Analytics Scenario
7. ✅ Document Scenario
8. ✅ Cleanup

### Independent Testing

Most sections are independent and can run in any order.

---

## 🔍 Response Verification

Each response includes:

- **Status Code** - HTTP status (200, 201, 404, etc.)
- **Headers** - Response headers with metadata
- **Body** - JSON response with details

### Example Response (Create Container):
```json
{
  "container": {
    "id": "uuid",
    "name": "test-container",
    "properties": {
      "createdTime": "2024-01-05T10:00:00.000Z",
      "modifiedTime": "2024-01-05T10:00:00.000Z",
      "etag": "uuid"
    }
  },
  "message": "Container 'test-container' created successfully"
}
```

---

## 🐛 Troubleshooting

### "Cannot GET /health"
- Ensure emulator is running: `npm start`
- Check port is correct (default: 10000)

### "Cannot create container" (409 error)
- Container already exists
- Delete it first or use different name

### "File not found" (404 error)
- Container or file doesn't exist
- Create it first or check the path

### Response shows error
- Check the error message in response body
- Follow the suggested fix

---

## 💾 Response History

VS Code REST Client saves responses. Access them with:
- **Ctrl+H** - View response history
- **Ctrl+Alt+H** - Clear history

---

## 🎬 Running Specific Sections

### Test Only Containers:
1. Go to **CONTAINER OPERATIONS** section
2. Click each "Send Request" link in order

### Test Only Files:
1. Go to **FILE OPERATIONS** sections
2. Run each file operation test

### Test Complete Workflow:
1. Go to **SEQUENTIAL WORKFLOW TEST** section
2. Run requests 1-10 in order

---

## 📝 Custom Requests

Add your own requests by following the format:

```
### GET - Your Request Name
GET {{baseUrl}}/your-path
Header-Name: Header-Value

Optional request body
```

Example:
```
### PUT - Upload My Custom File
PUT {{baseUrl}}/mycontainer/myfile.txt
Content-Type: text/plain

My custom content here
```

---

## 🔗 Environment Setup

For advanced usage, create a `.rest-client.env.json` file:

```json
{
  "dev": {
    "baseUrl": "http://localhost:10000",
    "containerName": "dev-container"
  },
  "production": {
    "baseUrl": "https://storage.azure.com",
    "containerName": "prod-container"
  }
}
```

Then reference in the test file:
```
@baseUrl = {{$dotenv baseUrl}}
```

---

## 📊 Performance Testing

The file includes performance tests. To measure:

1. Run a request with large file
2. Check response time in VS Code
3. Compare with other requests
4. Monitor memory usage

---

## 🎯 Common Workflows

### Upload and Download Workflow:
1. Create container (PUT)
2. Upload file (PUT)
3. Download file (GET)
4. Delete file (DELETE)
5. Delete container (DELETE)

### Create Structure Workflow:
1. Create container
2. Create directories
3. Upload files
4. List contents
5. Verify files
6. Cleanup

### Analytics Pipeline Workflow:
1. Create analytics container
2. Create raw/processed/results dirs
3. Upload raw data
4. Upload results
5. List all contents
6. Download verification

---

## 🚀 Tips & Tricks

### Tip 1: Save Responses
Click "Save" button to save response to file

### Tip 2: Use History
Access previous request responses

### Tip 3: Compare Responses
Open response side-by-side with test file

### Tip 4: Debug Headers
View all response headers for debugging

### Tip 5: Edit Variables
Change @baseUrl to test different endpoints

---

## 📚 Related Files

- **README.md** - Full API documentation
- **CURL_EXAMPLES.md** - cURL command alternatives
- **examples.js** - Programmatic usage
- **tests/api.test.js** - Automated tests

---

## ✨ Advanced Features

### Pre-Request Scripts
Add JavaScript to run before requests:
```
@timestamp = {{$timestamp}}
@guid = {{$uuid}}
```

### Dynamic Values
```
@date = {{$datetime "2024-01-05"}}
@now = {{$now}}
```

### Response Processing
Save values from responses for later use:
```
@containerId = {{response.body.container.id}}
```

---

## 🎓 Learning Path

1. **Beginner** - Run Health Check section
2. **Intermediate** - Test Container and File sections
3. **Advanced** - Run complete workflows
4. **Expert** - Modify tests and create custom scenarios

---

## 📞 Support

For issues:
1. Check test file variables
2. Verify emulator is running
3. Review error response messages
4. Check README.md for endpoint details
5. Run `npm test` for automated testing

---

## 🎉 Next Steps

1. ✅ Open `test-endpoints.http` in VS Code
2. ✅ Install REST Client extension
3. ✅ Start the emulator (`npm start`)
4. ✅ Click "Send Request" on first test
5. ✅ View response in side panel
6. ✅ Continue with other tests

Happy testing! 🚀
