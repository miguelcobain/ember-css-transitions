# How To Contribute

This repo is divided into multiple packages using Yarn workspaces:

- `ember-css-transitions` is the actual `ember-css-transitions` addon
- `docs` documentation app for `ember-css-transitions` Ember.js addon
- `test-app` contains `ember-css-transitions` test suite

## Installation

* `git clone https://github.com/miguelcobain/ember-css-transitions.git`
* `cd ember-css-transitions`
* `yarn install`

## Linting

* `yarn lint`
* `yarn lint:fix`

## Running tests

* `cd ember-css-transitions && yarn start` – Builds the addon in "watch mode" so changes picked up by test app.
* `cd test-app && ember test` – Runs the test suite on the current Ember version
* `cd test-app && ember test --server` – Runs the test suite in "watch mode"
* `cd test-app && ember try:each` – Runs the test suite against multiple Ember versions

During development, if you'd like test app to pick up changes in the addon, make sure to run both
`cd ember-css-transitions && yarn start` and `cd test-app && ember test --server` in different terminals.

## Running the test application

* `cd test-app && ember serve`
* Visit the test application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://cli.emberjs.com/release/](https://cli.emberjs.com/release/).
