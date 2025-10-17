# ADLS Gen2 Emulator - cURL Command Reference
# 
# Use these commands to quickly test the emulator
# Base URL: http://localhost:10000

### HEALTH CHECK ###

# Check if emulator is running
curl -i http://localhost:10000/health


### CONTAINER OPERATIONS ###

# Create a container
curl -i -X PUT http://localhost:10000/mydata

# List all containers
curl -i http://localhost:10000/

# List container contents
curl -i http://localhost:10000/mydata

# Delete a container
curl -i -X DELETE http://localhost:10000/mydata


### DIRECTORY OPERATIONS ###

# Create a directory
curl -i -X PUT http://localhost:10000/mydata/documents?directory

# List directory contents
curl -i http://localhost:10000/mydata/documents

# Create nested directories
curl -i -X PUT http://localhost:10000/mydata/data/raw/2024?directory

# Delete an empty directory
curl -i -X DELETE http://localhost:10000/mydata/documents


### FILE OPERATIONS ###

# Upload a text file
curl -i -X PUT http://localhost:10000/mydata/readme.txt \
  -H "Content-Type: text/plain" \
  -d "Hello, Azure Data Lake Storage!"

# Upload a JSON file
curl -i -X PUT http://localhost:10000/mydata/data.json \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'

# Upload to nested path
curl -i -X PUT http://localhost:10000/mydata/documents/reports/sales.csv \
  -H "Content-Type: text/csv" \
  -d "id,amount,date
1,1000,2024-01-01
2,2000,2024-01-02"

# Upload binary file (image)
curl -i -X PUT http://localhost:10000/mydata/images/logo.png \
  --data-binary @/path/to/logo.png

# Download a file
curl -i http://localhost:10000/mydata/readme.txt

# Download to file
curl -o readme.txt http://localhost:10000/mydata/readme.txt

# Update file content
curl -i -X PUT http://localhost:10000/mydata/readme.txt \
  -H "Content-Type: text/plain" \
  -d "Updated content"

# Delete a file
curl -i -X DELETE http://localhost:10000/mydata/readme.txt


### BULK OPERATIONS ###

# Upload multiple files
for i in {1..5}; do
  curl -X PUT http://localhost:10000/mydata/logs/log-$i.txt \
    -H "Content-Type: text/plain" \
    -d "Log entry $i"
done

# List all files in a directory
curl http://localhost:10000/mydata/logs | jq '.contents'


### DATA ANALYTICS SCENARIO ###

# Create data lake structure
curl -X PUT http://localhost:10000/analytics?
curl -X PUT http://localhost:10000/analytics/raw?directory
curl -X PUT http://localhost:10000/analytics/processed?directory
curl -X PUT http://localhost:10000/analytics/results?directory

# Upload raw data
curl -X PUT http://localhost:10000/analytics/raw/data.csv \
  -H "Content-Type: text/csv" \
  -d "id,value,timestamp
1,100,2024-01-01T00:00:00Z
2,200,2024-01-02T00:00:00Z
3,150,2024-01-03T00:00:00Z"

# Upload processing results
curl -X PUT http://localhost:10000/analytics/results/summary.json \
  -H "Content-Type: application/json" \
  -d '{
    "processed_at":"2024-01-04T00:00:00Z",
    "records_processed":3,
    "success":true
  }'


### ERROR HANDLING TESTS ###

# Try to access non-existent container (should return 404)
curl -i http://localhost:10000/nonexistent

# Try to access non-existent file (should return 404)
curl -i http://localhost:10000/mydata/nonexistent.txt

# Try to delete non-empty directory (should return error)
curl -i -X DELETE http://localhost:10000/mydata


### PRETTY-PRINT JSON RESPONSES ###

# List containers (formatted)
curl http://localhost:10000/ | jq '.'

# List directory contents (formatted)
curl http://localhost:10000/mydata | jq '.contents'

# Upload with formatted response
curl -s -X PUT http://localhost:10000/mydata/test.txt \
  -H "Content-Type: text/plain" \
  -d "test" | jq '.'


### MEASURE PERFORMANCE ###

# Time a request
time curl -X PUT http://localhost:10000/mydata/perf-test.txt \
  -H "Content-Type: text/plain" \
  -d "test content"

# Get response headers
curl -i http://localhost:10000/mydata/perf-test.txt | head -20


### SCRIPTING EXAMPLES ###

# Bash: Upload all .txt files from current directory
#!/bin/bash
for file in *.txt; do
  echo "Uploading $file..."
  curl -X PUT http://localhost:10000/mydata/uploads/$file \
    -H "Content-Type: text/plain" \
    --data-binary @"$file"
done

# PowerShell: Upload multiple files
Get-ChildItem *.txt | ForEach-Object {
  $content = Get-Content $_.Name -Raw
  Invoke-WebRequest -Uri "http://localhost:10000/mydata/uploads/$($_.Name)" `
    -Method Put `
    -Body $content `
    -ContentType "text/plain"
}

# Python: List all files
#!/usr/bin/env python3
import requests
import json

response = requests.get('http://localhost:10000/mydata')
data = response.json()
for item in data['contents']:
  print(f"{'[DIR]' if item['isDirectory'] else '[FILE]'} {item['name']}")


### ADVANCED SCENARIOS ###

# Create multi-level hierarchy
curl -X PUT http://localhost:10000/mydata/projects/2024/Q1/reports?directory
curl -X PUT http://localhost:10000/mydata/projects/2024/Q2/reports?directory
curl -X PUT http://localhost:10000/mydata/projects/2024/Q3/reports?directory
curl -X PUT http://localhost:10000/mydata/projects/2024/Q4/reports?directory

# Upload to each quarter
for Q in Q1 Q2 Q3 Q4; do
  curl -X PUT http://localhost:10000/mydata/projects/2024/$Q/reports/summary.txt \
    -H "Content-Type: text/plain" \
    -d "Summary for $Q"
done

# Verify structure
curl http://localhost:10000/mydata | jq '.contents'


### CLEANUP ###

# Delete everything for a fresh start
# Note: Must delete files before directories, directories before containers

# Delete all files in a directory
for file in $(curl -s http://localhost:10000/mydata | jq -r '.contents[] | select(.isDirectory | not) | .name'); do
  curl -X DELETE http://localhost:10000/mydata/$file
done

# Delete container
curl -X DELETE http://localhost:10000/mydata


### TIPS ###

# Use -i to see headers
curl -i http://localhost:10000/mydata

# Use -v for verbose output
curl -v http://localhost:10000/mydata

# Use -s for silent mode (only output data)
curl -s http://localhost:10000/mydata | jq '.'

# Use jq to format JSON
curl -s http://localhost:10000/ | jq '.containers[] | .name'

# Save response to file
curl -o response.json http://localhost:10000/mydata

# Time request
time curl http://localhost:10000/health

# Check HTTP status only
curl -o /dev/null -s -w "%{http_code}\n" http://localhost:10000/health
