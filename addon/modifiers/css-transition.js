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

  get transitionName() {
    let positionalArgument = this.args.positional[0];
    if (typeof positionalArgument === 'string') {
      return positionalArgument
    } else {
      return null;
    }
  }

  get transitionHash() {
    let positionalArgument = this.args.positional[0];
    if (typeof positionalArgument === 'object') {
      return positionalArgument
    } else {
      return null;
    }
  }

  get enterClass() {
   if (this.transitionName) {
     return `${this.transitionName}-enter`
   } else if (this.transitionHash) {
     return this.transitionHash.enter;
   } else {
     return null;
   }
  }

  get enterActiveClass() {
   if (this.transitionName) {
     return `${this.transitionName}-enter-active`
   } else if (this.transitionHash) {
     return this.transitionHash.enterActive || `${this.transitionHash.enter}-active`;
   } else {
     return null;
   }
  }

  get leaveClass() {
   if (this.transitionName) {
     return `${this.transitionName}-leave`
   } else if (this.transitionHash) {
     return this.transitionHash.leave;
   } else {
     return null;
   }
  }

  get leaveActiveClass() {
   if (this.transitionName) {
     return `${this.transitionName}-leave-active`
   } else if (this.transitionHash) {
     return this.transitionHash.leaveActive || `${this.transitionHash.leave}-active`;
   } else {
     return null;
   }
  }

  addClassNames(className) {
    return `${className}-add`;
  }

  addActiveClassNames(className) {
    return `${className}-add-active`;
  }

  removeClassNames(className) {
    return `${className}-remove`;
  }

  removeActiveClassNames(className) {
    return `${className}-remove-active`;
  }

  async didInstall() {
    if (this.enterClass) {
      await this.transition({
        className: this.enterClass,
        activeClassName: this.enterActiveClass
      });

      if (this.args.named.didTransitionIn) {
        this.args.named.didTransitionIn();
      }
    }

    this.parentElement = this.element.parentElement;
    this.nextElementSibling = this.element.nextElementSibling;
  }

  async willRemove() {
    if (this.leaveClass) {
      // We can't stop ember from removing the element
      // so we clone the element to animate it out
      this.addClone();
      await nextTick();

      await this.transition({
        className: this.leaveClass,
        activeClassName: this.leaveActiveClass
      });

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

          await this.transition({
            className: this.addClassNames(className),
            activeClassName: this.addActiveClassNames(className)
          });

          if (this.args.named.didTransitionIn) {
            this.args.named.didTransitionIn(className);
          }
        } else {
          this.removeClass(className);

          await this.transition({
            className: this.removeClassNames(className),
            activeClassName: this.removeActiveClassNames(className)
          });

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
   * @return {Promise}
   */
  async transition({ className, activeClassName }) {
    let element = this.el;

    // add first class right away
    this.addClass(className);

    await nextTick();

    // This is for to force a repaint,
    // which is necessary in order to transition styles when adding a class name.
    element.scrollTop;

    // add active class after repaint
    this.addClass(activeClassName);

    // wait for ember to apply classes
    // set timeout for animation end
    await sleep(computeTimeout(element) || 0);

    this.removeClass(className);
    this.removeClass(activeClassName);
  }

  addClass(className) {
    this.el.classList.add(...className.split(' '));
  }

  removeClass(className) {
    this.el.classList.remove(...className.split(' '));
  }

}
