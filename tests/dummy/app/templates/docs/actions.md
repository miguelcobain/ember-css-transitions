# Actions

You can pass in two special arguments as functions that will be called *when the animation finishes*.
The arguments are called `didTransitionIn` or `didTransitionOut`.

Here is a simple example that uses both:

{{#docs-demo as |demo|}}
  {{#demo.example name="actions.hbs"}}
    <button class="docs-btn" {{on "click" (action (mut this.show) (not show))}}>
      Press me
    </button>

    {{#if this.show}}
      <div
        {{css-transition "example"
          didTransitionIn=this.didTransitionIn
          didTransitionOut=this.didTransitionOut}}
      >
        <h1>Hello world</h1>
      </div>
    {{/if}}
  {{/demo.example}}

  {{demo.snippet "actions.hbs"}}
  {{demo.snippet "actions.js"}}
{{/docs-demo}}

