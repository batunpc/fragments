// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

const validGetReq = (url) => {
  return request(app).get(url).auth('user1@email.com', 'password1');
};

describe('GET /v1/fragments', () => {
  test('incorrect credentials are denied', async () => {
    await request(app).get('/v1/fragments').auth('batu@king.com', 'sad').expect(401);
  });
  test('unauthenticated', async () => {
    await request(app).get('/v1/fragments').expect(401);
  });

  test('authenticated users can have empty array of fragments', async () => {
    const response = await validGetReq('/v1/fragments');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', data: [] });
  });

  test('authenticated users get a fragments array of ids: user with fragments', async () => {
    const req = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('Chewbacca!');
    const body = JSON.parse(req.text);

    const fragmentId = body.fragment.id;
    const response = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(expect.arrayContaining([fragmentId]));
    expect(response.body).toEqual({ status: 'ok', data: [fragmentId] });
  });

  test('request fail', async () => {
    Fragment.byUser = jest.fn().mockRejectedValue(new Error('Fragment not found'));
    const res = await validGetReq('/v1/fragments');
    expect(res.status).toBe(404);
  });
});
