'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['ember-css-transitions'],
    },
    'ember-cli-addon-docs': {
      documentingAddonAt: '../ember-css-transitions',
    },
  });

  return app.toTree();
};
