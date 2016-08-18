import Ember from 'ember';
import TransitionMixin from 'ember-css-transitions/mixins/transition-mixin';
const { Component } = Ember;

export default Component.extend(TransitionMixin, {
  transitionTriggers: ['closed:is-closed'],
  closed: false
});
