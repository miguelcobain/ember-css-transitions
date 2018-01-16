import Component from '@ember/component';
import TransitionMixin from 'ember-css-transitions/mixins/transition-mixin';

export default Component.extend(TransitionMixin, {
  transitionClassNameBindings: ['closed:is-closed'],
  closed: false
});
