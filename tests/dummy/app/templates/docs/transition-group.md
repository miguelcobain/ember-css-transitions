# `transition-group` component

This component essentially applies certain classes at the correct timing to allow you to define
the intial and end states and what happens in between. All of this just using CSS.

Let's look at one example:

{{#docs-demo as |demo|}}
  {{#demo.example name="demo-template.hbs"}}
    <button
      class="docs-btn"
      onclick={{action (action (mut show) (if show false true))}}
    >
      Press me
    </button>

    {{#if show}}
      {{#transition-group transitionClass="example"}}
        <h1>I am using  <code>transition-group</code> component.</h1>
      {{/transition-group}}
    {{/if}}
  {{/demo.example}}

  {{demo.snippet "demo-template.hbs"}}
  {{demo.snippet "demo-styles.css"}}
{{/docs-demo}}
