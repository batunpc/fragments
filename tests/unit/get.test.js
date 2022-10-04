// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  test('incorrect credentials are denied', async () => {
    await request(app).get('/v1/fragments').auth('batu@king.com', 'sad').expect(401);
  });
  test('unauthenticated', async () => {
    await request(app).get('/v1/fragments').expect(401);
  });

  test('authenticated users can have empty array of fragments', async () => {
    const response = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', fragment: [] });
  });

  test('authenticated users get a fragments array of ids: user with fragments', async () => {
    const user = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('Chewbacca!');
    const id = user.body.fragment.id;
    const response = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');

    expect(response.status).toBe(200);
    expect(response.body.fragment).toEqual(expect.arrayContaining([id]));
    expect(response.body).toEqual({ status: 'ok', fragment: [id] });
  });
});
