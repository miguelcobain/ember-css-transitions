import Ember from 'ember';
const {
  Mixin, RSVP, computed, run, testing, $, A,
  String: { dasherize }
} = Ember;

/**
 * @private
 * T (period) = 1 / f (frequency)
 * TICK = 1 / 60hz = 0,01667s = 17ms
 */
const TICK = 17;

/**
 * @public
 * This function performs some logic after a browser repaint.
 * While on testing or if raf not available, use a run-loop friendly equivalent.
 * This also makes the tests work as expected.
 */
export const rAF = testing || !window.requestAnimationFrame ? function(fn) {
  return run.later(fn, TICK);
} : window.requestAnimationFrame;

/**
 * @public
 * This function is the counterpart of rAF. It will cancel a previously
 * scheduled task with rAF. If on testing or when rAF isn't available
 * we default to `run.cancel`.
 */
export const cAF = testing || !window.cancelAnimationFrame ? function(requestID) {
  return run.cancel(requestID);
} : window.cancelAnimationFrame;

/**
 * @public
 * Performs some logic after DOM changes have been flushed
 * and after a browser repaint.
 */
export function nextTick() {
  return new RSVP.Promise((resolve) => {
    run.schedule('afterRender', () => {
      rAF(() => {
        resolve();
      });
    });
  });
}

/**
 * @private
 * Computes the time a css animation will take.
 * Uses `getComputedStyle` to get durations and delays.
 */
export function computeTimeout(element) {
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

/**
 * @public
 * @class TransitionMixin
 * @extends Ember.Mixin
 */
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

  'transition-class': computed.alias('transitionClass'),
  transitionName: computed.alias('transitionClass'),

  init() {
    this._super(...arguments);
    this.transitionClasses = A();
    this.transitionTimeouts = [];
    this._setupTriggerObservers();
  },

  /**
   * @private
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

      // if we're animating a class removal
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
          if (finishCallback) {
            finishCallback();
          }
        }, computeTimeout(element) || 0);
        this.transitionTimeouts.push(timeout);
      });
    });
  },

  didInsertElement() {
    this._super(...arguments);

    let transitionClass = this.get('transitionName');
    if (transitionClass) {
      run.schedule('afterRender', () => {
        this.transition('enter', transitionClass, this.didTransitionIn);
      });
    }
  },

  willDestroyElement() {
    this._super(...arguments);

    this._teardownTriggerObservers();
    this.transitionTimeouts.forEach((t) => clearTimeout(t));

    let transitionClass = this.get('transitionName');
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
   * @public
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
   * @public
   * Called after transition in was done. Will always be called after didInsertElement.
   */
  didTransitionIn() { },

  /**
   * @public
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
   * @property transitionClassNameBindings
   * @type Array
   * @default []
   * @public
   */
  transitionClassNameBindings: [],

  _setupTriggerObservers() {
    this._observers = {};
    this.get('transitionClassNameBindings').forEach((classExp) => {
      let [propName, className] = classExp.split(':');
      if (!className) {
        className = dasherize(propName);
      }

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
      this.get('transitionClassNameBindings').forEach((classExp) => {

        let [propName] = classExp.split(':');

        this.removeObserver(propName, this, this._observers[propName]);
        delete this._observers[propName];
      });
    }
  }

});
