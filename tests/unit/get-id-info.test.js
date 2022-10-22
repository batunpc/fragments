const app = require('../../src/app');
const request = require('supertest');
const fragment = require('../../src/model/fragment');

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
    const req = await validPostReq('/v1/fragments', fragment.validTypes[0], 'frag');
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
    expect(type).toBe(fragment.validTypes[0]);
    expect(size).toBe(4);
  });

  test('will display 404 if invalid id provided', async () => {
    await request(app).get('/v1/fragments/404-').auth('user1@email.com', 'password1').expect(404);
  });
});
