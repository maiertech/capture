const validator = require('validator');
const { devices } = require('puppeteer-core');
const chrome = require('chrome-aws-lambda');
const axios = require('axios');
const { json, send } = require('micro');

// The puppeteer getter returns `puppeteer` when running locally and `puppeteer-core` when running on AWS.
// https://github.com/alixaxel/chrome-aws-lambda/wiki/HOWTO:-Local-Development#workaround
const puppeteer = chrome.puppeteer;

// Use Puppeteer to capture screenshot.
async function capture({ device, url }) {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  });
  const { userAgent, viewport } = devices[device];
  const page = await browser.newPage();
  await page.emulate({ userAgent, viewport });
  await page.goto(url, { waitUntil: ['load', 'networkidle0'] });
  const screenshot = await page.screenshot();
  await browser.close();
  return screenshot;
}

// Use Micro to process request and response.
module.exports = async (request, response) => {
  const { url, device } = await json(request);

  // Validate request parameters.
  const validations = [
    {
      param: 'url',
      value: url,
      validate: async () => {
        // Check if URL is syntactically correct.
        if (
          !validator.isURL(url, {
            protocols: ['http', 'https'],
            require_protocol: true,
          })
        ) {
          return {
            valid: false,
            message: 'Invalid URL syntax',
          };
        }
        // Check if URL can be resolved.
        try {
          await axios.head(url);
        } catch (error) {
          return {
            valid: false,
            message: `Cannot resolve URL (${error.message})`,
          };
        }
        return { valid: true };
      },
    },
    {
      param: 'device',
      value: device,
      // This validation must return promise, too.
      validate: () => {
        if (devices[device]) {
          return Promise.resolve({ valid: true });
        }
        return Promise.resolve({ valid: false, message: 'Invalid device' });
      },
    },
  ];

  // Run all validations.
  const validated = validations.map(({ param, value, validate }) => ({
    param,
    value,
    result: validate(),
  }));

  // Await all validation promises.
  const promises = await Promise.all(validated.map(({ result }) => result));

  // Create array with param, value and validation result (from promise).
  const results = validated.map((validation, index) => ({
    ...validation,
    result: promises[index],
  }));

  // Filter results and keep only failed validations to convert them to error messages.
  const errors = results
    .filter(({ result }) => !result.valid)
    .map(({ param, value, result }) => ({
      param,
      value,
      message: result.message,
    }));

  if (errors.length !== 0) {
    send(response, 400, errors);
    return;
  }

  // Must use try catch syntax instead of adding .catch().
  // Otherwise it is not possible to exit from lambda.
  let screenshot;
  try {
    screenshot = await capture({ device, url });
  } catch (error) {
    send(response, 500, {
      message: `Failed to capture screenshot: ${error.message}`,
    });
    return;
  }

  // Return screenshot.
  response.setHeader('Content-Type', 'image/png');
  send(response, 200, screenshot);
};
