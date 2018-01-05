import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    toggleShow() {
      this.controller.set('show', !this.controller.get('show'));
    },

    toggleShow2() {
      this.controller.set('show2', !this.controller.get('show2'));
    },

    toggleClass() {
      this.controller.toggleProperty('closed');
    }
  }
});
