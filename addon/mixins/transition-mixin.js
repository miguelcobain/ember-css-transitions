import Ember from 'ember';
const { Mixin, inject, computed, run } = Ember;

const __DEV__ = Ember.environment === 'development';
const TICK = 17;
const NO_EVENT_TIMEOUT = 5000;
var noEventListener = null,
    EMPTY_ARRAY = [];

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

export default Mixin.create({

  classNameBindings: ['joinedTransitionClasses'],

  joinedTransitionClasses: computed('transitionClasses.[]', function() {
    return this.get('transitionClasses').join(' ');
  }),

  addClass(className, $element) {
    if (!this.get('isDestroying')) {
      this.get('transitionClasses').addObject(className);
    } else {
      $element.addClass(className);
    }
  },

  removeClass(className, $element) {
    if (!this.get('isDestroying')) {
      this.get('transitionClasses').removeObject(className);
    } else {
      $element.removeClass(className);
    }
  },

  transitionEvents: inject.service('transition-events'),

  shouldTransition: computed.bool('transitionClass'),

  'transition-class': computed.alias('transitionClass'),

  init() {
    this._super(...arguments);
    this.classNameQueue = [];
    this.transitionClasses = Ember.A();
  },

  /**
   * Transitions a DOMElement.
   * @param DOMElement node Dom node to add transition classes to.
   * @param animationType The animation type, e.g. "enter" or "leave".
   * @param finishCallback The callback to use when transition was finished.
   */
  transitionDomNode(node, transitionClass, animationType, finishCallback) {
    let $element = Ember.$(node);

    if (!node) {
      if (finishCallback) {
        finishCallback();
      }
      return;
    }

    var className = transitionClass + '-' + animationType;
    var activeClassName = className + '-active';

    var noEventTimeout = null;

    var endListener = e => {
      run(() => {
        if (e && e.target !== node) { return; }
        if (__DEV__) { clearTimeout(noEventTimeout); }

        this.removeClass(className, $element);
        this.removeClass(activeClassName, $element);

        this.get('transitionEvents').removeEndEventListener(node, endListener);

        // Usually this optional callback is used for informing an owner of
        // a leave animation and telling it to remove the child.
        if (finishCallback) {
          finishCallback();
        }
      });
    };

    this.get('transitionEvents').addEndEventListener(node, endListener);

    this.addClass(className, $element);

    // Need to do this to actually trigger a transition.
    this.queueClass($element, activeClassName);

    if (__DEV__) {
      noEventTimeout = setTimeout(noEventListener, NO_EVENT_TIMEOUT);
    }
  },

  /**
   * Queues a class on a jQuery Element.
   * Sets a timeout based on TICK, after TICK is done it sets the classes on the $element.
   * @param $element
   * @param className
   */
  queueClass($element, className) {
    this.classNameQueue.push(className);

    if (!this.timeout) {
      this.timeout = run.later(this, this.flushClassNameQueue, $element, TICK);
    }
  },

  /**
   * Flushes queued classes on the $element given and resets the timer.
   * @param $element The element to apply classNameQueue on.
   */
  flushClassNameQueue($element) {
    // Add classes one and one to ensure animation correctness: e.g.: x-enter, x-enter-active
    this.classNameQueue.forEach(className => {
        this.addClass(className, $element);
    });
    this.classNameQueue = [];
    this.timeout = null;
  },

  willDestroyElement() {
    if (this.get('shouldTransition')) {
      if (this.timeout) {
        run.cancel(this.timeout);
      }
      // This is currently the only way of doing this (since willDestroyElement is not promise based).
      var clone = this.$().clone();
      var parent = this.$().parent();
      var idx = parent.children().index(this.$());
      run.scheduleOnce('afterRender', () => {
        this.addDestroyedElementClone(parent, idx, clone);
        this.transitionDomNode(clone[0], this.get('transitionClass'), 'leave', () => {
          this.didTransitionOut(clone);
        });
      });
    }
  },

  /**
   * Default placement  of the cloned element when being destroyed.
   */
  addDestroyedElementClone(parent, idx, clone) {
    if (idx === 0) {
      parent.prepend(clone);
    } else {
      Ember.$(parent.children()[idx - 1]).after(clone);
    }
  },

  /**
   * Called after transition in was done. Will always be called after didInsertElement.
   */
  didTransitionIn: Ember.K,

  /**
   * Called when the transition out is called.
   * @param clone The cloned jQuery element. Normally .remove() should be called to remove the element after transition is done.
   */
  didTransitionOut(clone) {
    clone.remove();
  },

  didInsertElement() {
    if (this.get('shouldTransition')) {
      run.scheduleOnce('afterRender', () => {
        this.transitionDomNode(this.get('element'), this.get('transitionClass'), 'enter', this.didTransitionIn);
      });
    }
  },

  /**
   * A list of properties that can control the transitions.  Functions just like
   * Ember.Component.classNameBindings, and can be formatted in the same way.
   *
   * @property transitionTriggers
   * @type Array
   * @default []
   * @public
   */
  transitionTriggers: EMPTY_ARRAY,

  _triggerTransitions(newAttrs) {
    let transitionTriggers = this.get('transitionTriggers');
    transitionTriggers.forEach(value => {
      let [propName, className] = value.split(':');
      if (!className) { className = Ember.String.dasherize(propName); }

      if (newAttrs[propName].value) {
        this.addClass(className, this.$());
        this.transitionDomNode(this.get('element'), className, 'add');
      } else {
        this.transitionDomNode(this.get('element'), className, 'remove', () => {
          this.removeClass(className, this.$());
        });
      }
    });
  },

  didUpdateAttrs(options) {
    this._super(...arguments);
    this._triggerTransitions(options.newAttrs);
  }

});
