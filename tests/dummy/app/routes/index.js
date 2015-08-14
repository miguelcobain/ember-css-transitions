import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    toggleShow: function () {
      this.controller.set('show', !this.controller.get('show'));
    }
  }
});
