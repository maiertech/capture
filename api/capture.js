const validator = require('validator');
const { devices } = require('puppeteer-core');
const chrome = require('chrome-aws-lambda');

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
      validate: () =>
        validator.isURL(url, {
          protocols: ['http', 'https'],
          require_protocol: true,
        }),
    },
    {
      param: 'device',
      value: device,
      message: 'Invalid device.',
      validate: () => devices[device],
    },
  ];

  // Every failed validation is converted into error message.
  const errors = validations
    .filter(validation => !validation.validate())
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
