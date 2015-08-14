import Ember from 'ember';
import TransitionMixinMixin from '../../../mixins/transition-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | transition mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var TransitionMixinObject = Ember.Object.extend(TransitionMixinMixin);
  var subject = TransitionMixinObject.create();
  assert.ok(subject);
});
