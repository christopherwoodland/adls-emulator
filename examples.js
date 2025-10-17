#!/usr/bin/env node

/**
 * ADLS Gen2 Emulator - Usage Examples
 * 
 * This file demonstrates how to use the ADLS Gen2 emulator for various tasks.
 */

const axios = require('axios');

const API_BASE = process.env.ADLS_ENDPOINT || 'http://localhost:10000';

// Utility function for API calls with error handling
async function apiCall(method, path, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${API_BASE}${path}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
    throw error;
  }
}

// Example 1: Container Management
async function example1_ContainerManagement() {
  console.log('\n=== Example 1: Container Management ===\n');
  
  try {
    // Create a container
    console.log('Creating container...');
    const created = await apiCall('PUT', '/mydata');
    console.log('✓ Container created:', created.container.name);
    
    // List all containers
    console.log('\nListing containers...');
    const list = await apiCall('GET', '/');
    console.log(`✓ Found ${list.count} container(s):`);
    list.containers.forEach(c => console.log(`  - ${c.name}`));
  } catch (error) {
    console.error('Example 1 failed:', error.message);
  }
}

// Example 2: File Upload and Download
async function example2_FileOperations() {
  console.log('\n=== Example 2: File Upload and Download ===\n');
  
  try {
    // Ensure container exists
    await apiCall('PUT', '/mydata').catch(() => {});
    
    // Upload a text file
    console.log('Uploading text file...');
    const textContent = 'Hello, Azure Data Lake Storage!';
    const uploaded = await apiCall(
      'PUT',
      '/mydata/documents/readme.txt',
      textContent,
      { 'Content-Type': 'text/plain' }
    );
    console.log('✓ File uploaded:', uploaded.path);
    console.log('  Size:', uploaded.properties.size, 'bytes');
    console.log('  ETag:', uploaded.properties.etag);
    
    // Download the file
    console.log('\nDownloading file...');
    const response = await axios.get(`${API_BASE}/mydata/documents/readme.txt`);
    console.log('✓ File downloaded');
    console.log('  Content:', response.data);
    
    // Upload JSON data
    console.log('\nUploading JSON file...');
    const jsonData = {
      name: 'John Doe',
      email: 'john@example.com',
      department: 'Engineering',
    };
    const jsonUploaded = await apiCall(
      'PUT',
      '/mydata/data/profile.json',
      JSON.stringify(jsonData),
      { 'Content-Type': 'application/json' }
    );
    console.log('✓ JSON file uploaded:', jsonUploaded.path);
  } catch (error) {
    console.error('Example 2 failed:', error.message);
  }
}

// Example 3: Directory Management
async function example3_DirectoryManagement() {
  console.log('\n=== Example 3: Directory Management ===\n');
  
  try {
    // Ensure container exists
    await apiCall('PUT', '/mydata').catch(() => {});
    
    // Create directories
    console.log('Creating directory structure...');
    await apiCall('PUT', '/mydata/projects?directory');
    console.log('✓ Created /projects');
    
    await apiCall('PUT', '/mydata/projects/2024?directory');
    console.log('✓ Created /projects/2024');
    
    await apiCall('PUT', '/mydata/projects/2024/Q1?directory');
    console.log('✓ Created /projects/2024/Q1');
    
    // Upload files in subdirectories
    console.log('\nUploading files to subdirectories...');
    await apiCall(
      'PUT',
      '/mydata/projects/2024/Q1/report.txt',
      'Q1 Report Data',
      { 'Content-Type': 'text/plain' }
    );
    console.log('✓ Uploaded /projects/2024/Q1/report.txt');
    
    // List directory contents
    console.log('\nListing directory contents...');
    const contents = await apiCall('GET', '/mydata/projects/2024/Q1');
    console.log('✓ Contents of /projects/2024/Q1:');
    contents.contents.forEach(item => {
      const type = item.isDirectory ? '[DIR]' : '[FILE]';
      console.log(`  ${type} ${item.name}`);
    });
  } catch (error) {
    console.error('Example 3 failed:', error.message);
  }
}

// Example 4: Bulk Operations
async function example4_BulkOperations() {
  console.log('\n=== Example 4: Bulk Operations ===\n');
  
  try {
    // Ensure container exists
    await apiCall('PUT', '/mydata').catch(() => {});
    
    const files = [
      { path: 'logs/2024-01-01.log', content: 'Log entry 1' },
      { path: 'logs/2024-01-02.log', content: 'Log entry 2' },
      { path: 'logs/2024-01-03.log', content: 'Log entry 3' },
    ];
    
    console.log('Uploading multiple files...');
    for (const file of files) {
      await apiCall(
        'PUT',
        `/mydata/${file.path}`,
        file.content,
        { 'Content-Type': 'text/plain' }
      );
      console.log(`✓ Uploaded ${file.path}`);
    }
    
    // List all files in logs directory
    console.log('\nListing uploaded logs...');
    const logs = await apiCall('GET', '/mydata/logs');
    console.log(`✓ Found ${logs.count} log files`);
    logs.contents.forEach(item => {
      console.log(`  - ${item.name}`);
    });
  } catch (error) {
    console.error('Example 4 failed:', error.message);
  }
}

// Example 5: Data Analytics Scenario
async function example5_AnalyticsScenario() {
  console.log('\n=== Example 5: Data Analytics Scenario ===\n');
  
  try {
    // Setup container for data analytics
    await apiCall('PUT', '/analytics').catch(() => {});
    
    console.log('Setting up analytics data lake...');
    
    // Create directory structure
    const dirs = [
      '/analytics/raw-data',
      '/analytics/processed-data',
      '/analytics/results',
    ];
    
    for (const dir of dirs) {
      await apiCall('PUT', `${dir}?directory`);
      console.log(`✓ Created ${dir}`);
    }
    
    // Upload sample CSV data
    console.log('\nUploading sample data...');
    const csvData = `id,name,value,timestamp
1,metric-a,100,2024-01-01T00:00:00Z
2,metric-b,200,2024-01-02T00:00:00Z
3,metric-c,150,2024-01-03T00:00:00Z`;
    
    await apiCall(
      'PUT',
      '/analytics/raw-data/metrics.csv',
      csvData,
      { 'Content-Type': 'text/csv' }
    );
    console.log('✓ Uploaded metrics.csv');
    
    // Upload processing results
    const results = {
      processed_at: new Date().toISOString(),
      records_processed: 3,
      success: true,
    };
    
    await apiCall(
      'PUT',
      '/analytics/results/summary.json',
      JSON.stringify(results, null, 2),
      { 'Content-Type': 'application/json' }
    );
    console.log('✓ Uploaded summary.json');
    
    // List all directories
    console.log('\nListing analytics structure...');
    const analytics = await apiCall('GET', '/analytics');
    console.log('✓ Analytics container contents:');
    analytics.contents.forEach(item => {
      const type = item.isDirectory ? '[DIR]' : '[FILE]';
      console.log(`  ${type} ${item.name}`);
    });
  } catch (error) {
    console.error('Example 5 failed:', error.message);
  }
}

// Example 6: File Deletion and Cleanup
async function example6_DeletionAndCleanup() {
  console.log('\n=== Example 6: File Deletion and Cleanup ===\n');
  
  try {
    // Ensure container exists
    await apiCall('PUT', '/mydata').catch(() => {});
    
    // Create test files
    console.log('Creating test files for deletion...');
    await apiCall('PUT', '/mydata/test/file1.txt', 'content1', { 'Content-Type': 'text/plain' });
    await apiCall('PUT', '/mydata/test/file2.txt', 'content2', { 'Content-Type': 'text/plain' });
    console.log('✓ Created test files');
    
    // List before deletion
    console.log('\nBefore deletion:');
    let contents = await apiCall('GET', '/mydata/test');
    console.log(`✓ Found ${contents.count} files`);
    
    // Delete individual file
    console.log('\nDeleting file1.txt...');
    await apiCall('DELETE', '/mydata/test/file1.txt');
    console.log('✓ File deleted');
    
    // List after deletion
    console.log('\nAfter deletion:');
    contents = await apiCall('GET', '/mydata/test');
    console.log(`✓ Found ${contents.count} files remaining`);
  } catch (error) {
    console.error('Example 6 failed:', error.message);
  }
}

// Main execution
async function runExamples() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║     ADLS Gen2 Emulator - Usage Examples                        ║');
  console.log('║     Endpoint: ' + API_BASE.padEnd(49) + '║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  
  // Check if emulator is running
  try {
    await apiCall('GET', '/health');
    console.log('✓ Emulator is running\n');
  } catch (error) {
    console.error('✗ Emulator is not running at', API_BASE);
    console.error('  Please start the emulator first: npm start');
    process.exit(1);
  }
  
  // Run examples
  await example1_ContainerManagement();
  await example2_FileOperations();
  await example3_DirectoryManagement();
  await example4_BulkOperations();
  await example5_AnalyticsScenario();
  await example6_DeletionAndCleanup();
  
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║     All examples completed!                                    ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
}

// Run if executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = { apiCall };
