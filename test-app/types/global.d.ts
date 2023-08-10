import '@glint/environment-ember-loose';
import '@glint/environment-ember-template-imports';

import type CssTransitionsRegistry from 'ember-css-transitions/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  // Remove this once entries have been added! 👇
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export default interface Registry
    extends CssTransitionsRegistry /* other addon registries */ {
    // local entries
  }
}
