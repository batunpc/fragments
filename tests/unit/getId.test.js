// tests/unit/getId.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('should deny invalid credentials', async () => {
    await request(app).get('/v1/fragments/123').auth('batu@king.com', 'sad').expect(401);
  });
  test('unauthenticated users cannot access the route', async () => {
    await request(app).get('/v1/fragments').expect(401);
  });

  test('should return a 404 for an invalid fragment id', async () => {
    const response = await request(app)
      .get('/v1/fragments/123')
      .auth('user1@email.com', 'password1');
    expect(response.status).toBe(404);
  });
});
