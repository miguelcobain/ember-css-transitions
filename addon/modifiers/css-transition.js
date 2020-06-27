import Modifier from 'ember-modifier';
import { dasherize } from '@ember/string';

import { nextTick, sleep, computeTimeout } from 'ember-css-transitions/utils/transition-utils';

/**
  Modifier that applies classes. Usage:

  ```hbs
  <div {{css-transition "example"}}>
    <p>Hello world</p>
  </div>
  ```

  @class CssTransitionModifier
  @argument didTransitionIn
  @argument didTransitionOut
  @public
*/
export default class CssTransitionModifier extends Modifier {

  clone = null;
  parentElement = null;
  nextElementSibling = null;
  installed = false;

  get el() {
    return this.clone || this.element;
  }

  get transitionClass() {
    return this.args.positional[0];
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

  didUpdateArguments() {
    if (this.args.named.isEnabled === false) {
      return;
    }

    this.guardedRun(this.transitionClassChange);
  }

  ignoredArgs = ['didTransitionIn', 'didTransitionOut', 'isEnabled'];

  get validArgs() {
    return Object.keys(this.args.named).filter(i => !this.ignoredArgs.includes(i));
  }

  applyClasses() {
    for (let key of this.validArgs) {
      let value = this.args.named[key];

      if (value) {
        let className = dasherize(key);
        this.addClass(className);
      }
    }
  }

  addClone() {
    let original = this.element;
    let parentElement = original.parentElement || this.parentElement;
    let nextElementSibling = original.nextElementSibling || this.nextElementSibling;

    if (nextElementSibling && (nextElementSibling.parentElement !== parentElement)) {
      nextElementSibling = null;
    }

    let clone = original.cloneNode(true);

    clone.setAttribute('id', `${original.id}_clone`);

    parentElement.insertBefore(clone, nextElementSibling);

    this.clone = clone;
  }

  removeClone() {
    if (this.clone.isConnected && this.clone.parentNode !== null) {
      this.clone.parentNode.removeChild(this.clone);
    }
  }

  *transitionIn() {
    this.applyClasses();

    let transitionClass = this.transitionClass;

    if (transitionClass) {
      let animationType = 'enter';
      let className = `${transitionClass}-${animationType}`;
      this.addClass(className);

      yield nextTick();
      yield* this.transition('enter', transitionClass);

      if (this.args.named.didTransitionIn) {
        this.args.named.didTransitionIn();
      }
    }

    this.installed = true;
  }

  *transitionOut() {
    let transitionClass = this.transitionClass;

    if (transitionClass) {
      // We can't stop ember from removing the element
      // so we clone the element to animate it out
      this.addClone();
      yield nextTick();

      yield* this.transition('leave', transitionClass);

      this.removeClone();

      if (this.args.named.didTransitionOut) {
        this.args.named.didTransitionOut();
      }

      this.clone = null;
    }
  }

  prev = {};

  *transitionClassChange() {
    for (let key of this.validArgs) {
      let prevValue = this.prev[key];
      let value = this.args.named[key];
      this.prev[key] = value; // update previous value

      if (prevValue !== value) {
        let className = dasherize(key);

        if (value) {
          this.addClass(className);
          yield* this.transition('add', className);

          if (this.args.named.didTransitionIn) {
            this.args.named.didTransitionIn(className);
          }
        } else {
          yield* this.transition('remove', className);

          if (this.args.named.didTransitionOut) {
            this.args.named.didTransitionOut(className);
          }
        }
      }
    }
  }

  /**
   * Transitions the element.
   *
   * @private
   * @method transition
   * @param {String} animationType The animation type, e.g. "enter" or "leave".
   * @param {String} transitionClass The name of the class with the transition defined
   * @return {Generator}
   */
  *transition(animationType, transitionClass) {
    let element = this.el;

    let className = `${transitionClass}-${animationType}`;
    let activeClassName = `${className}-active`;

    // add first class right away
    this.addClass(className);

    yield nextTick();

    // This is for to force a repaint,
    // which is necessary in order to transition styles when adding a class name.
    element.scrollTop;
    // add active class after repaint
    this.addClass(activeClassName);

    // if we're animating a class removal
    // we need to remove the class
    if (animationType === 'remove') {
      this.removeClass(transitionClass);
    }

    // wait for ember to apply classes
    // set timeout for animation end
    yield sleep(computeTimeout(element) || 0);

    this.removeClass(className);
    this.removeClass(activeClassName);
  }

  addClass(className) {
    this.el.classList.add(className);
  }

  removeClass(className) {
    this.el.classList.remove(className);
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
