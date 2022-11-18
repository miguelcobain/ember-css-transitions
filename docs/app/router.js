import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from 'ember-css-transitions-docs/config/environment';

export default class Router extends AddonDocsRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  docsRoute(this, function () {
    this.route('insert-destroy');
    this.route('add-removal');
    this.route('options');
    this.route('glint');
    this.route('test-waiters');
  });
});
