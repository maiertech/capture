const capture = require('../api/capture');

test('invalid url param', () => {
  const params = {
    url: 'invalid',
    device: 'iPhone X',
  };
  const request = {
    method: 'POST',
    body: params,
  };
  const response = { json: jest.fn(), status: jest.fn() };
  capture(request, response);
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

test('invalid device param', () => {
  const params = {
    url: 'https://www.google.com/',
    device: 'invalid',
  };
  const request = {
    method: 'POST',
    body: params,
  };
  const response = { json: jest.fn(), status: jest.fn() };
  capture(request, response);
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

/*
test('valid device', async () => {await new Promise(t => {
  const response = await axios.post(localhost, {
    device: 'iPhone X',
    url: 'https://google.com',
  });
  t.is(response.status, 200);
})});

test('valid URL: https', async () => {await new Promise(t => {
  const response = await axios.post(localhost, {
    device: 'iPhone X',
    url: 'https://google.com',
  });
  t.is(response.status, 200);
})});

test('valid URL: http', async () => {await new Promise(t => {
  const response = await axios.post(localhost, {
    device: 'iPhone X',
    url: 'http://google.com',
  });
  t.is(response.status, 200);
})});

test('invalid URL: localhost', async () => {await new Promise(t => {
  try {
    await axios.post(localhost, {
      device: 'iPhone X landscape',
      url: 'http://localhost:8000',
    });
    // If axios does not throw error, fail test.
    t.fail();
  } catch (error) {
    t.is(error.response.status, 422);
    t.deepEqual(error.response.data.errors[0], {
      location: 'body',
      msg: 'Invalid value',
      param: 'url',
      value: 'http://localhost:8000',
    });
  }
})});

test('invalid URL: typo', async () => {await new Promise(t => {
  try {
    await axios.post(localhost, {
      device: 'iPhone X landscape',
      url: 'https:/maier.tech',
    });
    // If axios does not throw error, fail test.
    t.fail();
  } catch (error) {
    t.is(error.response.status, 422);
    t.deepEqual(error.response.data.errors[0], {
      location: 'body',
      msg: 'Invalid value',
      param: 'url',
      value: 'https:/maier.tech',
    });
  }
})});
*/
