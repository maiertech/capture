const capture = require('../api/capture');

test('invalid url (invalid syntax)', async () => {
  const params = {
    url: 'invalid',
    device: 'iPhone X',
  };
  const request = {
    body: params,
  };
  const response = { json: jest.fn(), status: jest.fn() };
  await capture(request, response);
  expect(response.status).toHaveBeenCalledTimes(1);
  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledTimes(1);
  expect(response.json).toHaveBeenCalledWith([
    {
      param: 'url',
      value: 'invalid',
      message: 'Invalid URL.',
    },
  ]);
});

test('invalid url (unresolvable)', async () => {
  const params = {
    url: 'https://invalid.maier.tech',
    device: 'iPhone X',
  };
  const request = {
    body: params,
  };
  const response = { json: jest.fn(), status: jest.fn() };
  await capture(request, response);
  expect(response.status).toHaveBeenCalledTimes(1);
  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledTimes(1);
  expect(response.json).toHaveBeenCalledWith([
    {
      param: 'url',
      value: 'https://invalid.maier.tech',
      message: 'Invalid URL.',
    },
  ]);
});

test('invalid device param', async () => {
  const params = {
    url: 'https://www.google.com/',
    device: 'invalid',
  };
  const request = {
    body: params,
  };
  const response = { json: jest.fn(), status: jest.fn() };
  await capture(request, response);
  expect(response.status).toHaveBeenCalledTimes(1);
  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledTimes(1);
  expect(response.json).toHaveBeenCalledWith([
    {
      param: 'device',
      value: 'invalid',
      message: 'Invalid device.',
    },
  ]);
});
