import { later } from '@ember/runloop';

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

export { computeTimeout, nextTick, sleep };
//# sourceMappingURL=transition-utils.js.map
