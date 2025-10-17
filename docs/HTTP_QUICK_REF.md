# HTTP Testing Quick Reference

## 📄 Using test-endpoints.http in VS Code

### Installation
```bash
# Install REST Client extension
code --install-extension humao.rest-client
```

### Quick Start
1. Open `test-endpoints.http`
2. Hover over any request
3. Click "Send Request"
4. View response in right panel

---

## 🎯 Test Sections at a Glance

| Section | Tests | Purpose |
|---------|-------|---------|
| Health Check | 1 | Verify server running |
| Containers | 4 | Create, list, delete containers |
| Files - Basic | 4 | Text file operations |
| Files - JSON | 3 | JSON file operations |
| Files - CSV | 3 | CSV file operations |
| Directories | 3 | Directory management |
| Nested | 5 | Deep hierarchies |
| Bulk | 7 | Multiple files |
| Analytics | 8 | Data lake scenario |
| Documents | 7 | Document hierarchy |
| Metadata | 3 | File properties |
| Errors | 4 | Error handling |
| Cleanup | 1 | Remove test data |
| Performance | 2 | Large file test |
| Workflow | 10 | Complete end-to-end |

**Total: 65+ test requests**

---

## 🚀 Recommended Test Order

### Quick Test (5 minutes)
```
1. Health Check
2. Create Container
3. Upload File
4. Download File
5. Delete Container
```

### Full Test (15 minutes)
```
1. Health Check
2. Container Operations (all)
3. File Operations - Basic (all)
4. Directory Operations (all)
5. Bulk Operations (all)
6. Cleanup (all)
```

### Complete Test (30 minutes)
```
Run all sections in order
Follow the numbered comments
Complete workflow test at end
```

---

## 📝 Variables

Edit at top of file:

```
@baseUrl = http://localhost:10000
@containerName = test-container
@fileName = test-file.txt
@jsonFileName = data.json
@directoryName = test-directory
@nestedPath = level1/level2/level3
```

---

## 🔑 Key Request Types

### Create Container
```
PUT {{baseUrl}}/{{containerName}}
```

### Upload File
```
PUT {{baseUrl}}/{{containerName}}/file.txt
Content-Type: text/plain

File content here
```

### Download File
```
GET {{baseUrl}}/{{containerName}}/file.txt
```

### Create Directory
```
PUT {{baseUrl}}/{{containerName}}/dirname?directory
```

### List Directory
```
GET {{baseUrl}}/{{containerName}}/dirname
```

### Delete
```
DELETE {{baseUrl}}/{{containerName}}/path
```

### Update Metadata
```
PATCH {{baseUrl}}/{{containerName}}/file.txt
Content-Type: application/json

{"properties": {"description": "..."}}
```

---

## ✅ Expected Responses

### Success (201 Created)
```json
{
  "path": "file.txt",
  "type": "file",
  "properties": { ... },
  "message": "..."
}
```

### Success (200 OK)
```json
{
  "contents": [...],
  "count": 5
}
```

### Error (404 Not Found)
```json
{
  "error": "File not found"
}
```

### Error (409 Conflict)
```json
{
  "error": "Container 'name' already exists",
  "code": "ContainerAlreadyExists"
}
```

---

## 🎯 Common Workflows

### Upload & Verify
```
1. PUT - Create container
2. PUT - Upload file
3. GET - Download file
4. PATCH - Update metadata
5. DELETE - Delete file
6. DELETE - Delete container
```

### Create Structure
```
1. PUT - Create container
2. PUT - Create /data directory
3. PUT - Create /data/input directory
4. PUT - Create /data/output directory
5. PUT - Upload to /data/input
6. GET - List /data/input
```

### Complete Pipeline
```
1. PUT - Create analytics container
2. PUT - Create /raw directory
3. PUT - Create /results directory
4. PUT - Upload raw data
5. PUT - Upload results
6. GET - List contents
7. DELETE - Clean up
```

---

## 🔧 Tips & Tricks

### View Full Response
- Response appears in right panel
- Scroll to see full content
- Click tabs for headers/timeline

### Save Response
- Right-click response
- Select "Save"
- Choose location

### Modify & Rerun
- Edit request
- Change variables or body
- Click "Send Request"

### Check History
- Press Ctrl+H
- View previous requests
- Click to rerun

### Debug
- View response headers
- Check status code
- Read error message
- Verify variables

---

## ⚡ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Alt+R | Send Request |
| Ctrl+H | View History |
| Ctrl+Alt+H | Clear History |
| Ctrl+Shift+E | Toggle Explorer |

---

## 🐛 Troubleshooting

### "Cannot GET /health"
```
❌ Emulator not running
✅ Run: npm start
```

### "Cannot create container" (409)
```
❌ Container exists
✅ Use different name or delete first
```

### "File not found" (404)
```
❌ Wrong path or doesn't exist
✅ Check path in request
✅ Create container/file first
```

### "Connection refused"
```
❌ Wrong host/port
✅ Check: @baseUrl = http://localhost:10000
```

### "Invalid JSON"
```
❌ Malformed JSON body
✅ Validate JSON syntax
✅ Use online JSON validator
```

---

## 📊 Test Results

After running all tests, you should see:
- ✅ 200/201 responses for success
- ✅ 404 responses for "not found" tests
- ✅ 409 responses for conflicts
- ✅ Proper JSON responses
- ✅ Correct headers/metadata

---

## 🎓 Learning Resources

- **README.md** - Full API reference
- **CURL_EXAMPLES.md** - cURL alternatives
- **DEVELOPER.md** - Architecture details
- **examples.js** - Programmatic usage

---

## 💡 Next Steps

1. ✅ Install REST Client extension
2. ✅ Start emulator: `npm start`
3. ✅ Open `test-endpoints.http`
4. ✅ Run Health Check test
5. ✅ Follow the test sections

---

## 🎉 You're Ready!

Start with "Health Check" section and work through each test in order.

Happy testing! 🚀
