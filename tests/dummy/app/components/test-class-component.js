import Ember from 'ember';
import TransitionMixin from 'ember-css-transitions/mixins/transition-mixin';

export default Ember.Component.extend(TransitionMixin, {
  transitionTriggers: ['closed:is-closed'],
  closed: false
});
