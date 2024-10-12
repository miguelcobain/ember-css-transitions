import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import {
  dependencySatisfies,
  getOwnConfig,
  macroCondition,
} from '@embroider/macros';
import { buildWaiter } from '@ember/test-waiters';

import { nextTick, sleep, computeTimeout } from '../utils/transition-utils.js';

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
    },
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
    element = null;
    clone = null;
    parentElement = null;
    nextElementSibling = null;
    installed = false;
    finishedTransitionIn = false;
    isEnabled = true;
    parentSelector;

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
    didTransitionIn;

    /**
     * @property didTransitionOut
     * @type {(Function|undefined)}
     * @private
     */
    didTransitionOut;

    /**
     * @property transitionName
     * @type {(String|undefined)}
     * @private
     */
    transitionName;

    /**
     * @property enterClass
     * @type {(String|undefined)}
     * @private
     */
    enterClass;

    /**
     * @property enterActiveClass
     * @type {(String|undefined)}
     * @private
     */
    enterActiveClass;

    /**
     * @property enterToClass
     * @type {(String|undefined)}
     * @private
     */
    enterToClass;

    /**
     * @property leaveClass
     * @type {(String|undefined)}
     * @private
     */
    leaveClass;

    /**
     * @property leaveActiveClass
     * @type {(String|undefined)}
     * @private
     */
    leaveActiveClass;

    /**
     * @property leaveToClass
     * @type {(String|undefined)}
     * @private
     */
    leaveToClass;

    constructor(owner, args) {
      super(owner, args);

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

      this.enterClass =
        named.enterClass ||
        (this.transitionName && `${this.transitionName}-enter`);

      this.enterActiveClass =
        named.enterActiveClass ||
        (this.transitionName && `${this.transitionName}-enter-active`);

      this.enterToClass =
        named.enterToClass ||
        (this.transitionName && `${this.transitionName}-enter-to`);

      this.leaveClass =
        named.leaveClass ||
        (this.transitionName && `${this.transitionName}-leave`);

      this.leaveActiveClass =
        named.leaveActiveClass ||
        (this.transitionName && `${this.transitionName}-leave-active`);

      this.leaveToClass =
        named.leaveToClass ||
        (this.transitionName && `${this.transitionName}-leave-to`);
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
      let nextElementSibling =
        original.nextElementSibling || this.nextElementSibling;

      if (
        nextElementSibling &&
        nextElementSibling.parentElement !== parentElement
      ) {
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
          toClassName: this.enterToClass,
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
          toClassName: this.leaveToClass,
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
    *transition({ className, activeClassName, toClassName }) {
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
        let { value, done } = gen.next();
        isDone = done;
        await value;
      }

      waiter.endAsync(token);
    }
  }

  modifier = CssTransitionModifier;
} else {
  modifier = class extends Modifier {
    clone = null;
    parentElement = null;
    nextElementSibling = null;
    installed = false;

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
      return (
        this.args.named.enterClass ||
        (this.transitionName && `${this.transitionName}-enter`)
      );
    }

    /**
     * @property enterActiveClass
     * @type {(String|undefined)}
     * @private
     * @readonly
     */
    get enterActiveClass() {
      return (
        this.args.named.enterActiveClass ||
        (this.transitionName && `${this.transitionName}-enter-active`)
      );
    }

    /**
     * @property enterToClass
     * @type {(String|undefined)}
     * @private
     * @readonly
     */
    get enterToClass() {
      return (
        this.args.named.enterToClass ||
        (this.transitionName && `${this.transitionName}-enter-to`)
      );
    }

    /**
     * @property leaveClass
     * @type {(String|undefined)}
     * @private
     * @readonly
     */
    get leaveClass() {
      return (
        this.args.named.leaveClass ||
        (this.transitionName && `${this.transitionName}-leave`)
      );
    }

    /**
     * @property leaveActiveClass
     * @type {(String|undefined)}
     * @private
     * @readonly
     */
    get leaveActiveClass() {
      return (
        this.args.named.leaveActiveClass ||
        (this.transitionName && `${this.transitionName}-leave-active`)
      );
    }

    /**
     * @property leaveToClass
     * @type {(String|undefined)}
     * @private
     * @readonly
     */
    get leaveToClass() {
      return (
        this.args.named.leaveToClass ||
        (this.transitionName && `${this.transitionName}-leave-to`)
      );
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
      let nextElementSibling =
        original.nextElementSibling || this.nextElementSibling;

      if (
        nextElementSibling &&
        nextElementSibling.parentElement !== parentElement
      ) {
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
          toClassName: this.enterToClass,
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
          toClassName: this.leaveToClass,
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
    *transition({ className, activeClassName, toClassName }) {
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
        let { value, done } = gen.next();
        isDone = done;
        await value;
      }

      waiter.endAsync(token);
    }
  };
}

export default modifier;
