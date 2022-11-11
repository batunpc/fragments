const app = require('../../src/app');
const request = require('supertest');

const validPostReq = (url, type, data) => {
  return request(app)
    .post(`${url}`)
    .auth('user1@email.com', 'password1')
    .set('Content-Type', type)
    .send(data);
};
const dateRegex = new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
describe('GET /v1/fragments/:id/info', () => {
  test('will display fragments info if accurate id provided and auth succeed', async () => {
    const req = await validPostReq('/v1/fragments', 'text/plain', 'frag');
    const body = JSON.parse(req.text);
    const fragmentId = body.fragment.id;
    const response = await request(app)
      .get(`/v1/fragments/${fragmentId}/info`)
      .auth('user1@email.com', 'password1')
      .expect(200);
    const created = response.body.fragment.created;
    const updated = response.body.fragment.updated;
    const type = response.body.fragment.type;
    const size = response.body.fragment.size;

    expect(created).toMatch(dateRegex);
    expect(updated).toMatch(dateRegex);
    expect(type).toEqual('text/plain');
    expect(size).toBe(4);
  });

  test('will display 404 if invalid id provided', async () => {
    await request(app)
      .get('/v1/fragments/404-/info')
      .auth('user1@email.com', 'password1')
      .expect(404);
  });
});

describe('GET /v1/fragments/:id.ext - written for the file fragments.js', () => {
  // test('getExtension will return the corresponding content type', async () => {
  //   const req = await validPostReq('/v1/fragments', 'text/plain', 'frag');
  //   const body = JSON.parse(req.text);
  //   const fragmentId = body.fragment.id;
  //   const response = await request(app)
  //     .get(`/v1/fragments/${fragmentId}.txt`)
  //     .auth('user1@email.com', 'password1')
  //     .expect(200);
  //   expect(response.type).toBe('text/plain');
  //   const response2 = await request(app)
  //     .get(`/v1/fragments/${fragmentId}.md`)
  //     .auth('user1@email.com', 'password1')
  //     .expect(200);
  //   expect(response2.type).toBe('text/markdown');
  //   const response3 = await request(app)
  //     .get(`/v1/fragments/${fragmentId}.html`)
  //     .auth('user1@email.com', 'password1')
  //     .expect(200);
  //   expect(response3.type).toBe('text/html');
  // });
});
