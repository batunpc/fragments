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
    const res = await request(app).get('/v1/fragments/123').auth('user1@email.com', 'password1');
    expect(res.status).toBe(404);
  });

  test('should return a 200 and fragmen data for a valid fragment id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    const id = JSON.parse(res.text).fragment.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.status).toBe(200);
    //TODO: convert This is fragment to buffer and compare
  });
});
