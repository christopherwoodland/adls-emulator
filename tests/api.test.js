const request = require('supertest');
const app = require('../src/server');

describe('ADLS Gen2 Emulator API', () => {
  // Container tests
  describe('Container Operations', () => {
    test('should create a container', async () => {
      const res = await request(app)
        .put('/test-container')
        .expect(201);

      expect(res.body.container).toBeDefined();
      expect(res.body.container.name).toBe('test-container');
      expect(res.body.message).toContain('created successfully');
    });

    test('should list containers', async () => {
      await request(app).put('/list-test-1');
      await request(app).put('/list-test-2');

      const res = await request(app)
        .get('/')
        .expect(200);

      expect(res.body.containers).toBeDefined();
      expect(res.body.count).toBeGreaterThanOrEqual(2);
    });

    test('should fail to create duplicate container', async () => {
      await request(app).put('/dup-container');

      const res = await request(app)
        .put('/dup-container')
        .expect(409);

      expect(res.body.error).toContain('already exists');
    });

    test('should list container contents', async () => {
      const container = 'content-test';
      await request(app).put(`/${container}`);

      const res = await request(app)
        .get(`/${container}`)
        .expect(200);

      expect(res.body.container).toBe(container);
      expect(res.body.contents).toBeInstanceOf(Array);
    });
  });

  // File operations tests
  describe('File Operations', () => {
    beforeEach(async () => {
      await request(app).put('/file-test-container');
    });

    test('should upload a file', async () => {
      const res = await request(app)
        .put('/file-test-container/test.txt')
        .set('Content-Type', 'text/plain')
        .send('Hello, World!')
        .expect(201);

      expect(res.body.path).toBe('test.txt');
      expect(res.body.type).toBe('file');
      expect(res.body.properties.size).toBe(13);
    });

    test('should download a file', async () => {
      await request(app)
        .put('/file-test-container/download-test.txt')
        .set('Content-Type', 'text/plain')
        .send('Test Content');

      const res = await request(app)
        .get('/file-test-container/download-test.txt')
        .expect(200);

      expect(res.text).toBe('Test Content');
      expect(res.get('Content-Type')).toContain('text/plain');
    });

    test('should update file content', async () => {
      await request(app)
        .put('/file-test-container/update-test.txt')
        .set('Content-Type', 'text/plain')
        .send('Original');

      const res = await request(app)
        .put('/file-test-container/update-test.txt')
        .set('Content-Type', 'text/plain')
        .send('Updated')
        .expect(201);

      expect(res.body.properties.size).toBe(7);

      const download = await request(app)
        .get('/file-test-container/update-test.txt');

      expect(download.text).toBe('Updated');
    });

    test('should delete a file', async () => {
      await request(app)
        .put('/file-test-container/delete-test.txt')
        .set('Content-Type', 'text/plain')
        .send('To Delete');

      await request(app)
        .delete('/file-test-container/delete-test.txt')
        .expect(204);

      await request(app)
        .get('/file-test-container/delete-test.txt')
        .expect(404);
    });

    test('should upload nested file', async () => {
      const res = await request(app)
        .put('/file-test-container/dir1/dir2/nested.json')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ test: 'data' }))
        .expect(201);

      expect(res.body.path).toBe('dir1/dir2/nested.json');
    });
  });

  // Directory operations tests
  describe('Directory Operations', () => {
    beforeEach(async () => {
      await request(app).put('/dir-test-container');
    });

    test('should create a directory', async () => {
      const res = await request(app)
        .put('/dir-test-container/my-dir?directory')
        .expect(201);

      expect(res.body.path).toBe('my-dir');
      expect(res.body.type).toBe('directory');
    });

    test('should list directory contents', async () => {
      await request(app)
        .put('/dir-test-container/test-dir?directory');

      await request(app)
        .put('/dir-test-container/test-dir/file1.txt')
        .send('content1');

      await request(app)
        .put('/dir-test-container/test-dir/file2.txt')
        .send('content2');

      const res = await request(app)
        .get('/dir-test-container/test-dir')
        .expect(200);

      expect(res.body.type).toBe('directory');
      expect(res.body.contents.length).toBe(2);
    });

    test('should create nested directories', async () => {
      const res = await request(app)
        .put('/dir-test-container/a/b/c?directory')
        .expect(201);

      expect(res.body.path).toBe('a/b/c');
    });
  });

  // Health check test
  describe('Health Check', () => {
    test('should return healthy status', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toContain('Emulator');
    });
  });
});
