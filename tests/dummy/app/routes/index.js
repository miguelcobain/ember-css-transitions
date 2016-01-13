import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    toggleShow: function () {
      this.controller.set('show', !this.controller.get('show'));
    },

    toggleShow2: function () {
      this.controller.set('show2', !this.controller.get('show2'));
    },

    toggleClass() {
      this.controller.toggleProperty('closed');
    }
  }
});
