import Ember from 'ember';

const __DEV__ = Ember.environment === 'development';
const TICK = 17;
const NO_EVENT_TIMEOUT = 5000;
var noEventListener = null;

if (__DEV__) {
  noEventListener = function() {
    Ember.Logger.warn(
      'transition(): tried to perform an animation without ' +
      'an animationend or transitionend event after timeout (' +
      `${NO_EVENT_TIMEOUT}ms). You should either disable this` +
      'transition in JS or add a CSS animation/transition.'
    );
  };
}

export default Ember.Mixin.create({
  transitionEvents: Ember.inject.service('transition-events'),

  transitionClass: 'ember',

  _transitionOnInit: Ember.on('init', function () {
    this.classNameQueue = [];
  }),

  transition: function(node, animationType, finishCallback) {
    var _self = this;
    var $element = Ember.$(node);


    if (!node) {
      if (finishCallback) {
        finishCallback();
      }
      return;
    }

    var className = this.get('transitionClass') + '-' + animationType;
    var activeClassName = className + '-active';


    var noEventTimeout = null;

    var endListener = function(e) {
      if (e && e.target !== node) {
        return;
      }
      if (__DEV__) {
        clearTimeout(noEventTimeout);
      }

      $element.removeClass(className);
      $element.removeClass(activeClassName);

      _self.get('transitionEvents').removeEndEventListener(node, endListener);

      // Usually this optional callback is used for informing an owner of
      // a leave animation and telling it to remove the child.
      if (finishCallback) {
        finishCallback();
      }
    };

    this.get('transitionEvents').addEndEventListener(node, endListener);

    $element.addClass(className);

    // Need to do this to actually trigger a transition.
    this.queueClass($element, activeClassName);

    if (__DEV__) {
      noEventTimeout = setTimeout(noEventListener, NO_EVENT_TIMEOUT);
    }
  },

  queueClass: function($element, className) {
    var _self = this;

    this.classNameQueue.push(className);

    if (!this.timeout) {
      this.timeout = setTimeout(function () {
        _self.flushClassNameQueue($element);
      }, TICK);
    }
  },

  flushClassNameQueue: function($element) {
    this.classNameQueue.forEach(function (className) {
      $element.addClass(className);
    });
    this.classNameQueue = [];
    this.timeout = null;
  },

  _transitionDestroyElement: Ember.on('willDestroyElement', function () {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    // This is currently the only way of doing this ( since willDestroyElement is not promise based.).
    var clone = this.$().clone();
    this.$().parent().append(clone);

    this.transition(clone[0], 'leave', function () {
      clone.remove();
    });
  }),



  _transitionInsertElement: Ember.on('didInsertElement', function () {
    this.transition(this.get('element'), 'enter', function () {

    });
  }),






});
