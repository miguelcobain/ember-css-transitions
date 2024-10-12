# How To Contribute

This repo is divided into multiple packages using Yarn workspaces:

- `ember-css-transitions` is the actual `ember-css-transitions` addon
- `docs` documentation app for `ember-css-transitions` Ember.js addon
- `test-app` contains `ember-css-transitions` test suite

## Installation

- `git clone https://github.com/miguelcobain/ember-css-transitions.git`
- `cd ember-css-transitions`
- `pnpm install`

## Linting

- `pnpm lint`
- `pnpm lint:fix`

## Building the addon

- `cd ember-css-transitions`
- `pnpm build`

## Running tests

- `cd test-app`
- `pnpm test` – Runs the test suite on the current Ember version
- `pnpm test:watch` – Runs the test suite in "watch mode"

## Running the test application

- `cd test-app`
- `pnpm start`
- Visit the test application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://cli.emberjs.com/release/](https://cli.emberjs.com/release/).
