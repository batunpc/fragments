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

  test('The fragment has valid UUID and ISO Date', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('palpatine');

    const fragmentId = JSON.parse(res.text).fragment.id;
    const fragment = JSON.parse(res.text).fragment;

    const uuidRegex = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
    );
    const dateRegex = new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);

    expect(uuidRegex.test(fragmentId)).toBe(true);
    expect(dateRegex.test(fragment.created)).toBe(true);
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
});
