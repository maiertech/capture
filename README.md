# Capture API

Take a screenshot of a website.

## Endpoints

- `POST https://capture.maier.tech/api`

## Parameters

- `url` (required): Capture screenshot of this URL.
- `device` (required): Device name from [Puppeteer's `DeviceDescriptors` module](https://github.com/GoogleChrome/puppeteer/blob/master/lib/DeviceDescriptors.js), e.g., `iPhone X landscape`.

## Example Request

Capture screenshot of https://www.google.com with iPhone X:

```
curl --request POST \
  --url https://capture.maier.tech/api \
  --header 'content-type: application/json' \
  --data '{
	"url": "https://www.google.com",
	"device": "iPhone X"
}'
```

Note that the screenshot is always taken with [Puppeteer](https://pptr.dev/) using the resolution and pixel density of the device provided as `device` parameter.

## Response

Returns a screenshot in PNG format with the resolution and pixel density of the corresponding `device`.

## Errors

## Node version

This API is built with [`chrome-aws-lambda`](https://github.com/alixaxel/chrome-aws-lambda), which [requires Node v8.10.x to work properly](https://github.com/alixaxel/chrome-aws-lambda#usage). This Node version is also the [default version for Zeit Now v2](https://zeit.co/docs/v2/advanced/builders#node.js-version).

`package.json` should include the following entry:

```
"engines": {
  "node": "8.10.x"
}
```

However, this would break `devDependecies` `lint-staged` and `now`, which require a Node version newer than `8.10.x`. To solve this problem we put

```
"engines": {
  "node": "^8.10"
}
```

and set `.nvmrc` to `v8` to make everything work locally.

## Running the Capture API locally

Dependency [`chrome-aws-lambda`](https://github.com/alixaxel/chrome-aws-lambda) does not run locally on a Mac. The dos mention [this workaround](https://github.com/alixaxel/chrome-aws-lambda/wiki/HOWTO:-Local-Development#workaround) to address the issue. Adding `puppeteer` to `devDependencies` triggers `puppeteer` to be used instaed of `puppeteer-core`.

The current lambda is written using [Zeit's helpers for serverless functions](https://zeit.co/blog/now-node-helpers). This makes writing serverless functions easy but comes with the drawback that the serverless function can be executed only in a Zeit environment. For local execution this means you have to use `now dev` to run the serverless function locally.

`now dev` breaks above mentioned workaround and therefore, it is not possible to run the Capture API locally. You will see this error:

```
{
  "message": "Failed to capture screenshot: Failed to launch chrome!\n/tmp/chromium: /tmp/chromium: cannot execute binary file\n\n\nTROUBLESHOOTING: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md\n"
}
```

which is caused by the labmda trying to run an AWS compatible puppeteer on a Mac. You can track this issue [here](https://github.com/maiertech/capture/issues/7).
