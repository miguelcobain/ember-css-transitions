'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

let macrosConfig;

// Intentionally not add macros config if env variable not set
// so that we test in CI all the scenarios:
//  - USE_TEST_WAITERS=true
//  - USE_TEST_WAITERS=false
//  - USE_TEST_WAITERS not set
if (process.env.USE_TEST_WAITERS !== undefined) {
  macrosConfig = {
    '@embroider/macros': {
      setConfig: {
        'ember-css-transitions': {
          useTestWaiters: process.env.USE_TEST_WAITERS !== 'false',
        },
      },
    },
  };
}

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-cli-babel': { enableTypeScriptTransform: true },

    autoImport: {
      watchDependencies: ['ember-css-transitions'],
    },
    ...macrosConfig,
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
