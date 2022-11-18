Glint

`css-transition` ships [Glint](https://github.com/typed-ember/glint) types,
which allow you when using TypeScript to get strict type checking in your templates.

Unless you are using [strict mode](http://emberjs.github.io/rfcs/0496-handlebars-strict-mode.html) templates
(via [first class component templates](http://emberjs.github.io/rfcs/0779-first-class-component-templates.html)),
Glint needs a [Template Registry](https://typed-ember.gitbook.io/glint/using-glint/ember/template-registry)
that contains entries for the element modifier provided by this addon.

To add these registry entries automatically to your app, you just need to import `ember-css-transitions/template-registry`
from somewhere in your app. When using Glint already, you will likely have a file like
`types/glint.d.ts` where you already import glint types, so just add the import there:

```ts
import '@glint/environment-ember-loose';

import type CssTransitionsRegistry from 'ember-css-transitions/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends CssTransitionsRegistry, /* other addon registries */ {
    // local entries
  }
}
```
