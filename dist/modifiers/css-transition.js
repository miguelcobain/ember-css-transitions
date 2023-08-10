import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import { macroCondition, getOwnConfig, dependencySatisfies } from '@embroider/macros';
import { buildWaiter } from '@ember/test-waiters';
import { later } from '@ember/runloop';

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

/**
 * Function that returns a promise that resolves after DOM changes
 * have been flushed and after a browser repaint.
 *
 * @function nextTick
 * @export nextTick
 * @return {Promise} the promise
 */
function nextTick() {
  return new Promise(resolve => {
    window.requestAnimationFrame(() => resolve());
  });
}

/**
 * Function that returns a promise that resolves after `ms` milliseconds.
 *
 * @function sleep
 * @export sleep
 * @param {number} ms number of milliseconds after which the promise will resolve
 * @return {Promise} the promise that will resolve after `ms` milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => {
    later(() => resolve(), ms);
  });
}

/**
 * Computes the time a css animation will take.
 * Uses `getComputedStyle` to get durations and delays.
 *
 * @function computeTimeout
 * @export computeTimeout
 * @param {Element} element element used calculate the animation duration based on `getComputedStyle`
 * @return {number} the calculated animation duration + delay
 */
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
  let maxDuration = Math.max(parseFloat(animationDuration) * parseFloat(animationIterationCount), parseFloat(transitionDuration));
  return (maxDelay + maxDuration) * 1000;
}

let waiter;
if (macroCondition(getOwnConfig()?.useTestWaiters)) {
  waiter = buildWaiter('ember-css-transitions');
} else {
  waiter = {
    beginAsync() {
      /* fake */
    },
    endAsync() {
      /* fake */
    }
  };
}
let modifier;
if (macroCondition(dependencySatisfies('ember-modifier', '>=3.2.0 || 4.x'))) {
  /**
    Modifier that applies classes. Usage:
     ```hbs
    <div {{css-transition name="example"}}>
    <p>Hello world</p>
    </div>
    ```
     @class CssTransitionModifier
    @argument {Function} [didTransitionIn]
    @argument {Function} [didTransitionOut]
    @public
   */
  class CssTransitionModifier extends Modifier {
    /**
     * @property el
     * @type {(HTMLElement|undefined)}
     * @private
     * @readonly
     */
    get el() {
      return this.clone || this.element;
    }

    /**
     * @property didTransitionIn
     * @type {(Function|undefined)}
     * @private
     */

    constructor(owner, args) {
      super(owner, args);
      _defineProperty(this, "element", null);
      _defineProperty(this, "clone", null);
      _defineProperty(this, "parentElement", null);
      _defineProperty(this, "nextElementSibling", null);
      _defineProperty(this, "installed", false);
      _defineProperty(this, "finishedTransitionIn", false);
      _defineProperty(this, "isEnabled", true);
      _defineProperty(this, "parentSelector", void 0);
      _defineProperty(this, "didTransitionIn", void 0);
      /**
       * @property didTransitionOut
       * @type {(Function|undefined)}
       * @private
       */
      _defineProperty(this, "didTransitionOut", void 0);
      /**
       * @property transitionName
       * @type {(String|undefined)}
       * @private
       */
      _defineProperty(this, "transitionName", void 0);
      /**
       * @property enterClass
       * @type {(String|undefined)}
       * @private
       */
      _defineProperty(this, "enterClass", void 0);
      /**
       * @property enterActiveClass
       * @type {(String|undefined)}
       * @private
       */
      _defineProperty(this, "enterActiveClass", void 0);
      /**
       * @property enterToClass
       * @type {(String|undefined)}
       * @private
       */
      _defineProperty(this, "enterToClass", void 0);
      /**
       * @property leaveClass
       * @type {(String|undefined)}
       * @private
       */
      _defineProperty(this, "leaveClass", void 0);
      /**
       * @property leaveActiveClass
       * @type {(String|undefined)}
       * @private
       */
      _defineProperty(this, "leaveActiveClass", void 0);
      /**
       * @property leaveToClass
       * @type {(String|undefined)}
       * @private
       */
      _defineProperty(this, "leaveToClass", void 0);
      registerDestructor(this, () => {
        if (this.isEnabled === false || !this.finishedTransitionIn) {
          return;
        }
        this.guardedRun(this.transitionOut);
      });
    }
    modify(element, positional, named) {
      this.element = element;
      this.setupProperties(positional, named);
      if (named.isEnabled === false || this.installed) {
        return;
      }
      this.installed = true;
      let el = this.getElementToClone();
      this.parentElement = el.parentElement;
      this.nextElementSibling = el.nextElementSibling;
      this.guardedRun(this.transitionIn);
    }
    setupProperties(positional, named) {
      this.isEnabled = named.isEnabled !== false;
      this.transitionName = positional[0] || named.name;
      this.didTransitionIn = named.didTransitionIn;
      this.didTransitionOut = named.didTransitionOut;
      this.parentSelector = named.parentSelector;
      this.enterClass = named.enterClass || this.transitionName && `${this.transitionName}-enter`;
      this.enterActiveClass = named.enterActiveClass || this.transitionName && `${this.transitionName}-enter-active`;
      this.enterToClass = named.enterToClass || this.transitionName && `${this.transitionName}-enter-to`;
      this.leaveClass = named.leaveClass || this.transitionName && `${this.transitionName}-leave`;
      this.leaveActiveClass = named.leaveActiveClass || this.transitionName && `${this.transitionName}-leave-active`;
      this.leaveToClass = named.leaveToClass || this.transitionName && `${this.transitionName}-leave-to`;
    }

    /**
     * Adds a clone to the parentElement, so it can be transitioned out.
     *
     * @private
     * @method addClone
     */
    addClone() {
      let original = this.getElementToClone();
      let parentElement = original.parentElement || this.parentElement;
      let nextElementSibling = original.nextElementSibling || this.nextElementSibling;
      if (nextElementSibling && nextElementSibling.parentElement !== parentElement) {
        nextElementSibling = null;
      }
      let clone = original.cloneNode(true);
      clone.setAttribute('id', `${original.id}_clone`);
      parentElement.insertBefore(clone, nextElementSibling);
      this.clone = clone;
    }

    /**
     * Finds the correct element to clone. If `parentSelector` is present, we will
     * use the closest parent element that matches that selector. Otherwise, we use
     * the element's immediate parentElement directly.
     *
     * @private
     * @method getElementToClone
     */
    getElementToClone() {
      if (this.parentSelector) {
        return this.element.closest(this.parentSelector);
      } else {
        return this.element;
      }
    }

    /**
     * Removes the clone from the parentElement
     *
     * @private
     * @method removeClone
     */
    removeClone() {
      if (this.clone.isConnected && this.clone.parentNode !== null) {
        this.clone.parentNode.removeChild(this.clone);
      }
    }
    *transitionIn() {
      if (this.enterClass) {
        yield* this.transition({
          className: this.enterClass,
          activeClassName: this.enterActiveClass,
          toClassName: this.enterToClass
        });
        if (this.didTransitionIn) {
          this.didTransitionIn();
        }
      }
      this.finishedTransitionIn = true;
    }
    *transitionOut() {
      if (this.leaveClass) {
        // We can't stop ember from removing the element
        // so we clone the element to animate it out
        this.addClone();
        yield nextTick();
        yield* this.transition({
          className: this.leaveClass,
          activeClassName: this.leaveActiveClass,
          toClassName: this.leaveToClass
        });
        this.removeClone();
        if (this.didTransitionOut) {
          this.didTransitionOut();
        }
        this.clone = null;
      }
    }

    /**
     * Transitions the element.
     *
     * @private
     * @method transition
     * @param {Object} args
     * @param {String} args.className the class representing the starting state
     * @param {String} args.activeClassName the class applied during the entire transition. This class can be used to define the duration, delay and easing curve.
     * @param {String} args.toClassName the class representing the finished state
     * @return {Generator}
     */
    *transition({
      className,
      activeClassName,
      toClassName
    }) {
      let element = this.el;

      // add first class right away
      this.addClass(className);
      this.addClass(activeClassName);
      yield nextTick();

      // This is for to force a repaint,
      // which is necessary in order to transition styles when adding a class name.
      element.scrollTop;

      // after repaint
      this.addClass(toClassName);
      this.removeClass(className);

      // wait for ember to apply classes
      // set timeout for animation end
      yield sleep(computeTimeout(element) || 0);
      this.removeClass(toClassName);
      this.removeClass(activeClassName);
    }

    /**
     * Add classNames to el.
     *
     * @private
     * @method addClass
     * @param {String} className
     */
    addClass(className) {
      this.el.classList.add(...className.trim().split(/\s+/));
    }

    /**
     * Remove classNames from el.
     *
     * @private
     * @method removeClass
     * @param {String} className
     */
    removeClass(className) {
      this.el.classList.remove(...className.trim().split(/\s+/));
    }
    async guardedRun(f, ...args) {
      const token = waiter.beginAsync();
      let gen = f.call(this, ...args);
      let isDone = false;

      // stop if the function doesn't have anything else to yield
      // or if the element is no longer present
      while (!isDone && this.el) {
        let {
          value,
          done
        } = gen.next();
        isDone = done;
        await value;
      }
      waiter.endAsync(token);
    }
  }
  modifier = CssTransitionModifier;
} else {
  modifier = class modifier extends Modifier {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "clone", null);
      _defineProperty(this, "parentElement", null);
      _defineProperty(this, "nextElementSibling", null);
      _defineProperty(this, "installed", false);
    }
    /**
     * @property el
     * @type {(HTMLElement|undefined)}
     * @private
     * @readonly
     */
    get el() {
      return this.clone || this.element;
    }

    /**
     * @property transitionName
     * @type {(String|undefined)}
     * @private
     * @readonly
     */
    get transitionName() {
      return this.args.positional[0] || this.args.named.name;
    }

    /**
     * @property enterClass
     * @type {(String|undefined)}
     * @private
     * @readonly
     */
    get enterClass() {
      return this.args.named.enterClass || this.transitionName && `${this.transitionName}-enter`;
    }

    /**
     * @property enterActiveClass
     * @type {(String|undefined)}
     * @private
     * @readonly
     */
    get enterActiveClass() {
      return this.args.named.enterActiveClass || this.transitionName && `${this.transitionName}-enter-active`;
    }

    /**
     * @property enterToClass
     * @type {(String|undefined)}
     * @private
     * @readonly
     */
    get enterToClass() {
      return this.args.named.enterToClass || this.transitionName && `${this.transitionName}-enter-to`;
    }

    /**
     * @property leaveClass
     * @type {(String|undefined)}
     * @private
     * @readonly
     */
    get leaveClass() {
      return this.args.named.leaveClass || this.transitionName && `${this.transitionName}-leave`;
    }

    /**
     * @property leaveActiveClass
     * @type {(String|undefined)}
     * @private
     * @readonly
     */
    get leaveActiveClass() {
      return this.args.named.leaveActiveClass || this.transitionName && `${this.transitionName}-leave-active`;
    }

    /**
     * @property leaveToClass
     * @type {(String|undefined)}
     * @private
     * @readonly
     */
    get leaveToClass() {
      return this.args.named.leaveToClass || this.transitionName && `${this.transitionName}-leave-to`;
    }
    didInstall() {
      if (this.args.named.isEnabled === false) {
        return;
      }
      let el = this.getElementToClone();
      this.parentElement = el.parentElement;
      this.nextElementSibling = el.nextElementSibling;
      this.guardedRun(this.transitionIn);
    }
    willRemove() {
      if (this.args.named.isEnabled === false || !this.installed) {
        return;
      }
      this.guardedRun(this.transitionOut);
    }

    /**
     * Adds a clone to the parentElement so it can be transitioned out
     *
     * @private
     * @method addClone
     */
    addClone() {
      let original = this.getElementToClone();
      let parentElement = original.parentElement || this.parentElement;
      let nextElementSibling = original.nextElementSibling || this.nextElementSibling;
      if (nextElementSibling && nextElementSibling.parentElement !== parentElement) {
        nextElementSibling = null;
      }
      let clone = original.cloneNode(true);
      clone.setAttribute('id', `${original.id}_clone`);
      parentElement.insertBefore(clone, nextElementSibling);
      this.clone = clone;
    }

    /**
     * Finds the correct element to clone. If `parentSelector` is present, we will
     * use the closest parent element that matches that selector. Otherwise we use
     * the element's immediate parentElement directly.
     *
     * @private
     * @method getElementToClone
     */
    getElementToClone() {
      if (this.args.named.parentSelector) {
        return this.element.closest(this.args.named.parentSelector);
      } else {
        return this.element;
      }
    }

    /**
     * Removes the clone from the parentElement
     *
     * @private
     * @method removeClone
     */
    removeClone() {
      if (this.clone.isConnected && this.clone.parentNode !== null) {
        this.clone.parentNode.removeChild(this.clone);
      }
    }
    *transitionIn() {
      if (this.enterClass) {
        yield* this.transition({
          className: this.enterClass,
          activeClassName: this.enterActiveClass,
          toClassName: this.enterToClass
        });
        if (this.args.named.didTransitionIn) {
          this.args.named.didTransitionIn();
        }
      }
      this.installed = true;
    }
    *transitionOut() {
      if (this.leaveClass) {
        // We can't stop ember from removing the element
        // so we clone the element to animate it out
        this.addClone();
        yield nextTick();
        yield* this.transition({
          className: this.leaveClass,
          activeClassName: this.leaveActiveClass,
          toClassName: this.leaveToClass
        });
        this.removeClone();
        if (this.args.named.didTransitionOut) {
          this.args.named.didTransitionOut();
        }
        this.clone = null;
      }
    }

    /**
     * Transitions the element.
     *
     * @private
     * @method transition
     * @param {Object} args
     * @param {String} args.className the class representing the starting state
     * @param {String} args.activeClassName the class applied during the entire transition. This class can be used to define the duration, delay and easing curve.
     * @param {String} args.toClassName the class representing the finished state
     * @return {Generator}
     */
    *transition({
      className,
      activeClassName,
      toClassName
    }) {
      let element = this.el;

      // add first class right away
      this.addClass(className);
      this.addClass(activeClassName);
      yield nextTick();

      // This is for to force a repaint,
      // which is necessary in order to transition styles when adding a class name.
      element.scrollTop;

      // after repaint
      this.addClass(toClassName);
      this.removeClass(className);

      // wait for ember to apply classes
      // set timeout for animation end
      yield sleep(computeTimeout(element) || 0);
      this.removeClass(toClassName);
      this.removeClass(activeClassName);
    }

    /**
     * Add classNames to el.
     *
     * @private
     * @method addClass
     * @param {String} className
     */
    addClass(className) {
      this.el.classList.add(...className.trim().split(/\s+/));
    }

    /**
     * Remove classNames from el.
     *
     * @private
     * @method removeClass
     * @param {String} className
     */
    removeClass(className) {
      this.el.classList.remove(...className.trim().split(/\s+/));
    }
    async guardedRun(f, ...args) {
      const token = waiter.beginAsync();
      let gen = f.call(this, ...args);
      let isDone = false;

      // stop if the function doesn't have anything else to yield
      // or if the element is no longer present
      while (!isDone && this.el) {
        let {
          value,
          done
        } = gen.next();
        isDone = done;
        await value;
      }
      waiter.endAsync(token);
    }
  };
}
var modifier$1 = modifier;

export { modifier$1 as default };
//# sourceMappingURL=css-transition.js.map
