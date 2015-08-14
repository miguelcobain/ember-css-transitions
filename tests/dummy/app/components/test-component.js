import Ember from 'ember';
import TransitionMixin from 'ember-css-transtions/mixins/transition-mixin';

export default Ember.Component.extend(TransitionMixin, {
  transitionClass: 'example'
});
