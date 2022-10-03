// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('batu@king.com', 'sad').expect(401));

  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));
});
