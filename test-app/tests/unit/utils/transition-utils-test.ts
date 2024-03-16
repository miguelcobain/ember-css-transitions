import { module, test } from 'qunit';
import {
  computeTimeout,
  nextTick,
  sleep,
} from 'ember-css-transitions/utils/transition-utils';

module('Unit | Utility | transition-utils', function () {
  test('nextTick exists', function (assert) {
    assert.strictEqual(typeof nextTick, 'function');
  });

  test('sleep exists', function (assert) {
    assert.strictEqual(typeof sleep, 'function');
  });

  test('computeTimeout exists', function (assert) {
    assert.strictEqual(typeof computeTimeout, 'function');
  });
});
