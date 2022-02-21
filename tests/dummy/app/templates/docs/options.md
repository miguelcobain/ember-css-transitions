# Options

## Actions

You can pass in two special arguments as functions that will be called _when the animation finishes_.
The arguments are called `didTransitionIn` or `didTransitionOut`.

Here is a simple example that uses both:

{{#docs-demo as |demo|}}
  {{#demo.example name="actions.hbs"}}
    <button class="docs-btn" {{on "click" (action (mut this.show) (not this.show))}}>
      Toggle
    </button>

    {{#if this.show}}
      <div {{css-transition "slide-fade"
        didTransitionIn=this.didTransitionIn
        didTransitionOut=this.didTransitionOut}}>
        <h1>Hello world</h1>
      </div>
    {{/if}}

  {{/demo.example}}

  {{demo.snippet "actions.hbs"}}
  {{demo.snippet "actions.js"}}
{{/docs-demo}}

## Enabling/Disabling

You can pass a special argument called `isEnabled` to enable or prevent the modifier
to be executed.
It defaults to `true`. Therefore, you can pass `isEnabled=false` to disable
transitions or you can omit this option to keep the modifier enabled.

This option is usually useful for building shared components that developers might
want to disable animations/transitions in a given feature/use case.

In the demo below you will not see any animations.

{{#docs-demo as |demo|}}
  {{#demo.example name="is-enabled.hbs"}}
    <button class="docs-btn" {{on "click" (fn (mut this.show2) (not this.show2))}}>
      Toggle
    </button>

    {{#if this.show2}}
      <div {{css-transition "slide-fade" isEnabled=false}}>
        <h1>Hello world</h1>
      </div>
    {{/if}}

  {{/demo.example}}

  {{demo.snippet "is-enabled.hbs"}}
{{/docs-demo}}

## `parentSelector`

Sometimes the things you want to animate are nested deep in the DOM. Because our modifier uses clones
to animate leave transitions, it might happen that at the time to add the clone, the parent element no longer
exists. The `parentSelector` argument allows you to specify a selector to use as the element to clone.
Generally, the correct element is the one imediately inside the `{{#if` statement. See [#61](https://github.com/peec/ember-css-transitions/issues/61)
for more information on this issue.

<aside>
  This feature requires <a href="https://caniuse.com/element-closest" class="docs-md__a" target="_blank">Element.closest()</a>.
  If you need IE11 support, you can consider using <a href="https://github.com/miguelcobain/ember-cli-element-closest-polyfill" class="docs-md__a" target="_blank">ember-cli-element-closest-polyfill</a>.
</aside>

{{#docs-demo as |demo|}}
  {{#demo.example name="parent-selector.hbs"}}
    <button class="docs-btn" {{on "click" (fn (mut this.show3) (not this.show3))}}>
      Toggle
    </button>

    {{#if this.show3}}
      <div class="parent">
        <div>
          <div {{css-transition "slide-fade" parentSelector=".parent"}}>
            <h1>Hello world</h1>
          </div>
        </div>
      </div>
    {{/if}}

  {{/demo.example}}

  {{demo.snippet "parent-selector.hbs"}}
{{/docs-demo}}
