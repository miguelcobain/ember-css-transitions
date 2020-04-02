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


  get el() {
    return this.clone || this.element;
  }

  get transitionClass() {
    return this.args.positional[0];
  }

  async didInstall() {
    this.applyClasses();

    let transitionClass = this.transitionClass;

    if (transitionClass) {
      let animationType = 'enter';
      let className = `${transitionClass}-${animationType}`;
      this.addClass(className);

      await nextTick();
      await this.transition('enter', transitionClass);

      if (this.args.named.didTransitionIn) {
        this.args.named.didTransitionIn();
      }
    }

    this.parentElement = this.element.parentElement;
    this.nextElementSibling = this.element.nextElementSibling;
  }

  async willRemove() {
    let transitionClass = this.transitionClass;

    if (transitionClass) {
      // We can't stop ember from removing the element
      // so we clone the element to animate it out
      this.addClone();
      await nextTick();

      await this.transition('leave', transitionClass);

      this.removeClone();

      if (this.args.named.didTransitionOut) {
        this.args.named.didTransitionOut();
      }

      this.clone = null;
    }
  }

  prev = {};

  ignoredArgs = ['didTransitionIn', 'didTransitionOut'];

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

  async didUpdateArguments() {
    for (let key of this.validArgs) {
      let prevValue = this.prev[key];
      let value = this.args.named[key];
      this.prev[key] = value; // update previous value

      if (prevValue !== value) {
        let className = dasherize(key);

        if (value) {
          this.addClass(className);
          await this.transition('add', className);

          if (this.args.named.didTransitionIn) {
            this.args.named.didTransitionIn(className);
          }
        } else {
          await this.transition('remove', className);

          if (this.args.named.didTransitionOut) {
            this.args.named.didTransitionOut(className);
          }
        }
      }
    }
  }

  addClone() {
    let original = this.element;
    let parentElement = original.parentElement || this.parentElement;
    let nextElementSibling = original.nextElementSibling || this.nextElementSibling;
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

  /**
   * Transitions the element.
   *
   * @private
   * @method transition
   * @param {String} animationType The animation type, e.g. "enter" or "leave".
   * @param {String} transitionClass The name of the class with the transition defined
   * @return {Promise}
   */
  async transition(animationType, transitionClass) {
    let element = this.el;

    let className = `${transitionClass}-${animationType}`;
    let activeClassName = `${className}-active`;

    // add first class right away
    this.addClass(className);

    await nextTick()

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
    await sleep(computeTimeout(element) || 0);

    this.removeClass(className);
    this.removeClass(activeClassName);
  }

  addClass(className) {
    this.el.classList.add(className);
  }

  removeClass(className) {
    this.el.classList.remove(className);
  }

}
