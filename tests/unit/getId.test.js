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
});

describe('GET /v1/fragments/:id.ext', () => {
  test('getExt will return the corresponding content type', async () => {
    // post a fragment
    const req = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('frag');

    const body = JSON.parse(req.text);
    const response = await request(app)
      .get(`/v1/fragments/${body.fragment.id}.txt`)
      .auth('user1@email.com', 'password1');

    expect(response.status).toBe(200);
  });
});
