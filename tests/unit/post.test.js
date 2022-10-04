const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments ', () => {
  test('Invalid credentials should be unauthorized', async () => {
    await request(app).post('/v1/fragments').auth('batu@king.com', 'batuking');
    expect(401);
  });

  test('Unauthenticated requests', async () => {
    await request(app).post('/v1/fragments');
    expect(401);
  });

  test('authenticated users can create a plain text fragment', async () => {
    const fragment = ['id', 'ownerId', 'created', 'updated', 'type', 'size'];
    process.env.API_URL = 'true';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('palpatine');

    const body = JSON.parse(res.text);

    expect(res.statusCode).toBe(201);
    expect(body.fragment.type).toBe('text/plain');
    expect(body.fragment.size).toEqual(9); //palpatine
    expect(Object.keys(body.fragment)).toEqual(expect.arrayContaining(fragment));
  });

  test('response include a Location header with a URL to GET the fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('bobafett');
    expect(res.statusCode).toBe(201);
    expect(res.headers).toHaveProperty('location');
    expect(res.header.location).toEqual(expect.stringContaining('/v1/fragments/'));
  });

  test('get unsupported type error', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/gif');
    expect(415);
  });

  test('Internal server error', async () => {
    await request(app).post('/v1/fragments').auth('user1@email.com', 'password1');
  });

  // check if API_URL is undefined
  test('API_URL is undefined', async () => {
    process.env.API_URL = '';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('palpatine');
    expect(res.headers.location).toBe(undefined);
  });
});
