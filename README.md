# Capture API

Take a screenshot of a website.

## Endpoints

- `POST https://capture.maier.tech/api`

## Parameters

- `url` (required): Capture screenshot of this URL.
- `device` (required): Device name from O[Puppeteer's `DeviceDescriptors` module](https://github.com/GoogleChrome/puppeteer/blob/master/lib/DeviceDescriptors.js), e.g., `iPhone X landscape`.

## Example Requests

## Response

Returns a screenshot in PNG format.

## Errors

## Node version

This API is built with [`chrome-aws-lambda`](https://github.com/alixaxel/chrome-aws-lambda), which [requires Node v8.10.x to work properly](https://github.com/alixaxel/chrome-aws-lambda#usage). This Node version is also the [default version for Zeit Now v2](https://zeit.co/docs/v2/advanced/builders#node.js-version).

For clarity, `package.json` should include the following entry:

```
"engines": {
  "node": "8.10.x"
}
```

However, this would break the following `devDependecies`: latest `lint-staged` and `now`. Since Node `8.10.x` is currently Zeit Now's default, we can leave the `engines` entry out and set `.nvmrc` to `v8` to make everything work locally.
