# Shypple Frontend

Build status: [![CircleCI](https://circleci.com/gh/shypple/shypple-dashboard.svg?style=svg&circle-token=a43a5164740c37a29938d934cf9a9d151433bd20)](https://circleci.com/gh/shypple/shypple-dashboard)

This repository contains website of Shypple company made with React.

## Requirements
To run you will require:
- nodeJS >= 10.12.0
- npm >= 6.4.1

Optional:
- nginx

## Initialisation
Clone project from GitHub.

Run `npm install` to gather dependencies

Create `local.json` file at `src/config` with:

```
{

  "selfURL": "FRONTEND_PATH",
  "baseURL": "BACKEND_PATH",
  "wsURL": "ws://BACKEND_PATH/cable",
  "googleAPIKey": "GOOGLE_API_KEY",
  "requestTimeout": 1e5
}
```

## Development mode
To run app with webpack development server use `npm run start`. It will start dev server on `http://localhost:3000`.

Make sure that backend is launched.

## Automatic testing
To run tests run `npm run test`. It will run all tests in files with `.test.ts` and `.test.tsx` ends

## Deployment
Continuous inspection and deployment uses `npm ci` which only uses `package-lock.json` to install packages.
Please make sure you keep this file synced. You can check this by running `npm audit`.
