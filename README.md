# Capture API

Take a screenshot of a website.

## Endpoints

- `POST https://capture.maier.tech/api`

## Parameters

- `url` (required): Capture screenshot of this URL.
- `device` (required): Device name from [Puppeteer's `DeviceDescriptors` module](https://github.com/GoogleChrome/puppeteer/blob/master/lib/DeviceDescriptors.js), e.g., `iPhone X landscape`.

## Example Request

Capture screenshot of https://www.google.com with iPhone X (portait):

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

To be done.

## Running the Capture API locally

Run

```
yarn run dev
```

to launch the API locally at

```
http://localhost:3000
```

(or any other path such as http://localhost:3000/api) using [micro-dev](https://github.com/zeit/micro-dev).

It is not possible to launch the API locally using `now dev`. Dependency [`chrome-aws-lambda`](https://github.com/alixaxel/chrome-aws-lambda) does not run on a Mac. Its docs mention [a workaround](https://github.com/alixaxel/chrome-aws-lambda/wiki/HOWTO:-Local-Development#workaround) to address the issue. Adding `puppeteer` to `devDependencies` triggers the use of `puppeteer` (which runs on a Mac) instead of `puppeteer-core`.

This workaround breaks with `now dev` because it compiles the lambda and its dependecies into a single file using [ncc](https://github.com/zeit/ncc). You will see this error:

```
{
  "message": "Failed to capture screenshot: Failed to launch chrome!\n/tmp/chromium: /tmp/chromium: cannot execute binary file\n\n\nTROUBLESHOOTING: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md\n"
}
```

which is caused by the lambda trying to launch a Linux executable on Mac.

Also note that we cannot use [Zeit's helpers for serverless functions](https://zeit.co/blog/now-node-helpers) because this would make it impossible to run the API locally with micro-dev. Using [micro](https://github.com/zeit/micro) to parse the request body and send a response provides convenience similar to using Zeit's helpers for serverless functions. A side effect of using micro and micro-dev is that the lambda can be debugged locally.
