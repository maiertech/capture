const http = require('http');
const listen = require('test-listen');
const axios = require('axios');
const capture = require('../api/capture');

let server;
let localhost;

beforeAll(async () => {
  server = http.createServer(capture);
  localhost = await listen(server);
});

// Workaround for https://github.com/facebook/jest/issues/8554.
afterAll(done => {
  server.close(() => {
    setTimeout(done, 100);
  });
});

test('invalid url param', async () => {
  expect.assertions(1);
  try {
    await axios.post(localhost, {
      url: 'invalid',
      device: 'iPhone X',
    });
  } catch (error) {
    expect(error.response.data).toStrictEqual([
      { param: 'url', value: 'invalid', message: 'Invalid URL syntax' },
    ]);
  }
});

test('unresolvable url param', async () => {
  expect.assertions(1);
  try {
    await axios.post(localhost, {
      url: 'https://invalid.maier.tech',
      device: 'iPhone X',
    });
  } catch (error) {
    expect(error.response.data).toStrictEqual([
      {
        param: 'url',
        value: 'https://invalid.maier.tech',
        message: 'Cannot resolve URL (Request failed with status code 404)',
      },
    ]);
  }
});

test('invalid device param', async () => {
  expect.assertions(1);
  try {
    await axios.post(localhost, {
      url: 'https://www.google.com/',
      device: 'invalid',
    });
  } catch (error) {
    expect(error.response.data).toStrictEqual([
      {
        param: 'device',
        value: 'invalid',
        message: 'Invalid device',
      },
    ]);
  }
});
