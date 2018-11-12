# Mixin

A mixin is also provided so you can make your own component animatable.

The mixin can be imported using:

```js
import TransitionMixin from 'ember-css-transitions/mixins/transition-mixin';
```

Here is an example of a custom component that uses this Mixin:

{{#docs-demo as |demo|}}
  {{#demo.example name="demo2-template.hbs"}}
    <button
      class="docs-btn"
      onclick={{action (action (mut show2) (if show2 false true))}}
    >
      Press me
    </button>

    {{#if show2}}
      {{test-component}}
    {{/if}}
  {{/demo.example}}

  {{demo.snippet "demo2-template.hbs"}}
  {{demo.snippet "demo-styles.css"}}
  {{demo.snippet "demo-component.js" label="component.js"}}
{{/docs-demo}}
