import type CssTransitionModifier from './modifiers/css-transition';

export default interface AwesomeAddonRegistry {
  'css-transition': typeof CssTransitionModifier;
}
