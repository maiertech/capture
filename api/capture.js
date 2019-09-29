const validator = require('validator');
const { devices } = require('puppeteer-core');
const chrome = require('chrome-aws-lambda');
const axios = require('axios');

// The puppeteer getter returns `puppeteer` when running locally and `puppeteer-core` when running on AWS.
// https://github.com/alixaxel/chrome-aws-lambda/wiki/HOWTO:-Local-Development#workaround
const puppeteer = chrome.puppeteer;

// device: string.
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

module.exports = async (request, response) => {
  const url = request.body.url;
  const device = request.body.device;

  // Validate request parameters.
  const validations = [
    {
      param: 'url',
      value: url,
      message: 'Invalid URL.',
      validate: async () => {
        // Check if URL is syntactically correct.
        if (
          !validator.isURL(url, {
            protocols: ['http', 'https'],
            require_protocol: true,
          })
        ) {
          return false;
        }
        // Check if URL can be resolved.
        try {
          await axios.head(url);
        } catch (error) {
          return false;
        }
        return true;
      },
    },
    {
      param: 'device',
      value: device,
      message: 'Invalid device.',
      // This validation must return promise, too.
      validate: () => {
        if (devices[device]) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      },
    },
  ];

  // Run all validations and wait until all validation promises have resolved.
  const results = await Promise.all(
    validations.map(validation => validation.validate())
  );

  // Filter validations and keep only validations to convert them to error messages.
  const errors = validations
    .filter((validation, index) => !results[index])
    .map(({ param, value, message }) => ({ param, value, message }));

  if (errors.length !== 0) {
    response.status(400);
    response.json(errors);
    return;
  }

  // Must use try catch syntax instead of adding .catch().
  // Otherwise it is not possible to exit from lambda.
  let screenshot;
  try {
    screenshot = await capture({ device, url });
  } catch (error) {
    response.status(500);
    response.json({
      message: `Failed to capture screenshot: ${error.message}`,
    });
    return;
  }

  // Return screenshot.
  response.setHeader('Content-Type', 'image/png');
  response.status(200);
  response.send(screenshot);
};
