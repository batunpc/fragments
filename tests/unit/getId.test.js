// tests/unit/get-id.test.js

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
    const res = await request(app).get('/v1/fragments/404-').auth('user1@email.com', 'password1');
    expect(res.status).toBe(404);
  });

  test('successfully created fragment data', async () => {
    const req = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('frag');
    const body = JSON.parse(req.text);
    const fragmentId = body.fragment.id;
    const response = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');
    expect(response.status).toBe(200);
  });
});
