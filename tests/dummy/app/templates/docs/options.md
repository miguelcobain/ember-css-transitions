# Options

## Actions

You can pass in two special arguments as functions that will be called *when the animation finishes*.
The arguments are called `didTransitionIn` or `didTransitionOut`.

Here is a simple example that uses both:

{{#docs-demo as |demo|}}
  {{#demo.example name="actions.hbs"}}
    <button class="docs-btn" {{on "click" (action (mut this.show) (not show))}}>
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
