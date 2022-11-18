# `@ember/test-waiters` integration

`css-transition` has optional opt-in integration with [`@ember/test-waiters`](https://github.com/emberjs/ember-test-waiters).

By default, any test helpers provided by [`@ember/test-helpers`](https://github.com/emberjs/ember-test-helpers)
won't await the transition in and transition out animations.
In many cases this is fine and does not cause any issues
as `css-transition` has built-in protection from causing any errors
should the application under test be destroyed before animation completes.

However, there is number of use case when you'd like to await for animation completion.
To do so, you need to provide `useTestWaiters` configuration option via
[`@embroider/macros`](https://github.com/embroider-build/embroider/tree/main/packages/macros#setting-configuration-from-an-ember-app):

```js
const app = new EmberApp(defaults, {
  '@embroider/macros': {
    setConfig: {
      'ember-css-transitions': {
        useTestWaiters: true
      }
    }
  },
  // other options
});
```
