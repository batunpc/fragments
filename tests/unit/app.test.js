const request = require('supertest');

const app = require('../../src/app');

describe('Error handling middleware', () => {
  test('Error 404 -- route does not exist', async () => {
    const res = await request(app).get('/boba-fett');
    expect(res.statusCode).toBe(404);
  });
});
