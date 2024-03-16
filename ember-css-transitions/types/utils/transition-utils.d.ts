declare module 'ember-css-transitions/utils/transition-utils' {
  /**
   * Function that returns a promise that resolves after `ms` milliseconds
   *
   * @function sleep
   * @param {number} ms number of milliseconds to wait
   * @return {Promise<void>} the promise
   */
  export function sleep(ms: number): Promise<void>;

  /**
   * Computes the time a css animation will take.
   * Uses `getComputedStyle` to get durations and delays.
   *
   * @function computeTimeout
   * @param {Element} element element used calculate the animation duration based on `getComputedStyle`
   * @return {number} the calculated animation duration + delay
   */
  export function computeTimeout(element: Element): number;

  /**
   * Function that returns a promise that resolves after DOM changes
   * have been flushed and after a browser repaint.
   *
   * @function nextTick
   * @return {Promise<void>} the promise
   */
  export function nextTick(): Promise<void>;
}
