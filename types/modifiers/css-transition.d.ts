import Modifier from 'ember-modifier';

export interface CssTransitionSignature {
  Element?: HTMLElement;
  Args: {
    Positional?: [transitionName: string];
    Named: {
      didTransitionIn?: () => void;
      didTransitionOut?: () => void;
      enterClass?: string;
      enterActiveClass?: string;
      enterToClass?: string;
      isEnabled?: boolean;
      leaveClass?: string;
      leaveActiveClass?: string;
      leaveToClass?: string;
      name?: string;
      parentSelector?: string;
    };
  };
}

export default class CssTransitionModifier extends Modifier<CssTransitionSignature> {}
