/* global window */

export default {
  canUseDom () {
    return !!(
      typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement
    );
  }
};
