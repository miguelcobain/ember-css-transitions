import Modifier from 'ember-modifier';

import {
  nextTick,
  sleep,
  computeTimeout,
} from 'ember-css-transitions/utils/transition-utils';

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
export default class CssTransitionModifier extends Modifier {
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

    this.parentElement = this.element.parentElement;
    this.nextElementSibling = this.element.nextElementSibling;

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
    let original = this.element;
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
   * @param {String} classNames
   */
  addClass(className) {
    this.el.classList.add(...className.trim().split(/\s+/));
  }

  /**
   * Remove classNames from el.
   *
   * @private
   * @method removeClass
   * @param {String} classNames
   */
  removeClass(className) {
    this.el.classList.remove(...className.trim().split(/\s+/));
  }

  async guardedRun(f, ...args) {
    let gen = f.call(this, ...args);
    let isDone = false;

    // stop if the function doesn't have anything else to yield
    // or if the element is no longer present
    while (!isDone && this.el) {
      let { value, done } = gen.next();
      isDone = done;
      await value;
    }
  }
}
