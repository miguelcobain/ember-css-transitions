import Ember from 'ember';
const { Mixin, RSVP, inject, computed, run, testing, $ } = Ember;

const __DEV__ = Ember.environment === 'development';
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

/**
 * T (period) = 1 / f (frequency)
 * TICK = 1 / 60hz = 0,01667s = 17ms
 */
const TICK = 17;

/**
 * This function performs some logic after a browser
 * repaint. While on testing, use a run-loop friendly equivalent.
 * This makes the tests work as expected.
 */
export const rAF = testing ? function(fn) {
  return run.later(fn, TICK);
} : window.requestAnimationFrame;

/**
 * Performs some logic after DOM changes have been flushed
 * and after a browser repaint.
 */
export function nextTick() {
  return new RSVP.Promise((resolve) => {
    run.schedule('afterRender', () => {
      rAF(() => { resolve(); });
    });
  });
}

function computeTimeout(element) {
  let {
    transitionDuration,
    transitionDelay,
    animationDuration,
    animationDelay,
    animationIterationCount
  } = window.getComputedStyle(element);

  // `getComputedStyle` returns durations and delays in the Xs format.
  // Conveniently if `parseFloat` encounters a character other than a sign (+ or -),
  // numeral (0-9), a decimal point, or an exponent, it returns the value up to that point
  // and ignores that character and all succeeding characters.

  let maxDelay = Math.max(parseFloat(animationDelay), parseFloat(transitionDelay));
  let maxDuration = Math.max(parseFloat(animationDuration) *
    parseFloat(animationIterationCount), parseFloat(transitionDuration));

  return (maxDelay + maxDuration) * 1000;
}

export default Mixin.create({

  classNameBindings: ['joinedTransitionClasses'],

  joinedTransitionClasses: computed('transitionClasses.[]', function() {
    return this.get('transitionClasses').join(' ');
  }),

  addClass(className, element) {
    if (!this.get('isDestroying')) {
      this.get('transitionClasses').addObject(className);
    } else {
      $(element).addClass(className);
    }
  },

  removeClass(className, element) {
    if (!this.get('isDestroying')) {
      this.get('transitionClasses').removeObject(className);
    } else {
      $(element).removeClass(className);
    }
  },

  transitionEvents: inject.service('transition-events'),

  'transition-class': computed.alias('transitionClass'),
  transitionName: computed.alias('transitionClass'),

  init() {
    this._super(...arguments);
    this.transitionClasses = Ember.A();
    this.transitionTimeouts = [];
    this._setupTriggerObservers();
  },

  /**
   * Transitions the element.
   * @param animationType The animation type, e.g. "enter" or "leave".
   * @param transitionClass The name of the class with the transition defined
   * @return Promise
   */
  transition(animationType, transitionClass, finishCallback) {
    // we may need to animate the clone if the element was destroyed
    let element = this.clone ? this.clone.get(0) : this.element;

    let className = `${transitionClass}-${animationType}`;
    let activeClassName = `${className}-active`;

    // add first class right away
    this.addClass(className, element);

    nextTick().then(() => {
      // add active class after repaint
      this.addClass(activeClassName, element);

      // if we're animation a class removal
      // we need to remove the class
      if (animationType === 'remove') {
        this.removeClass(transitionClass);
      }

      // wait for ember to apply classes
      run.schedule('afterRender', () => {
        // set timeout for animation end
        let timeout = run.later(() => {
          this.removeClass(className, element);
          this.removeClass(activeClassName, element);
          if (finishCallback) { finishCallback(); }
        }, computeTimeout(element));
        this.transitionTimeouts.push(timeout);
      });
    });
  },

  didInsertElement() {
    this._super(...arguments);

    let transitionClass = this.get('transitionClass');
    if (transitionClass) {
      run.schedule('afterRender', () => {
        this.transition('enter', this.get('transitionClass'), this.didTransitionIn);
      });
    }
  },

  willDestroyElement() {
    this._super(...arguments);

    this._teardownTriggerObservers();
    this.transitionTimeouts.forEach((t) => clearTimeout(t));

    let transitionClass = this.get('transitionClass');
    if (transitionClass) {
      // We can't stop ember from removing the element
      // so we clone the element to animate it out
      let clone = this.clone = this.$().clone();
      clone.attr('id', `${this.elementId}_clone`);
      this.addDestroyedElementClone(this.$(), clone);

      nextTick().then(() => {
        this.transition('leave', transitionClass, () => {
          this.didTransitionOut();
          delete this.clone;
        });
      });
    }
  },

  /**
   * Default placement of the cloned element when being destroyed.
   */
  addDestroyedElementClone(original, clone) {
    if (original.prev().length) {
      original.prev().after(clone);
    } else {
      original.parent().prepend(clone);
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
  didTransitionOut() {
    this.clone.remove();
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

  _setupTriggerObservers() {
    this._observers = {};
    this.get('transitionTriggers').forEach((classExp) => {
      let [propName, className] = classExp.split(':');
      if (!className) { className = Ember.String.dasherize(propName); }

      // create observer function
      this._observers[propName] = function() {
        let value = this.get(propName);
        if (value) {
          this.addClass(className, this.element);
          this.transition('add', className);
        } else {
          this.transition('remove', className);
        }
      };

      // if value starts as true, add it immediatly
      let value = this.get(propName);
      if (value) {
        this.get('transitionClasses').addObject(className);
      }

      // add observer
      this.addObserver(propName, this, this._observers[propName]);
    });
  },

  _teardownTriggerObservers() {
    if (this._observers) {
      this.get('transitionTriggers').forEach((classExp) => {

        let [propName] = classExp.split(':');

        this.removeObserver(propName, this, this._observers[propName]);
        delete this._observers[propName];
      });
    }
  }

});
