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

Dependency [`chrome-aws-lambda`](https://github.com/alixaxel/chrome-aws-lambda) does not run locally. In order to make [this workaround](https://github.com/alixaxel/chrome-aws-lambda/wiki/HOWTO:-Local-Development#workaround) work on for deployments to Zeit Now, we need to add

```
"build": {
  "env": {
    "NODE_ENV": "production"
  }
},
```

to `now.json`. This ensures that `devDependencies` are not installed for the build. Now you can run

```
yarn start
```

locally and use a REST client such as [Insomnia](https://insomnia.rest/) to run API queries against http://localhost:3000/api. This command launches [`now dev`](https://zeit.co/docs/v2/serverless-functions/introduction#local-development) under the hood.

Running the capture API locally on a Mac is currently broken and results in this error

```
{
  "message": "Failed to capture screenshot: Failed to launch chrome!\n/tmp/chromium: /tmp/chromium: cannot execute binary file\n\n\nTROUBLESHOOTING: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md\n"
}
```

See [this issue](https://github.com/maiertech/capture/issues/7).
