import type CssTransitionModifier from './modifiers/css-transition';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'css-transition': typeof CssTransitionModifier;
    CssTransition: typeof CssTransitionModifier;
  }
}
