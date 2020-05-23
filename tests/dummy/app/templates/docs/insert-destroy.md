# Animating insert/destroy

This addon provides a `{{css-transition}}` [modifier](https://blog.emberjs.com/2019/03/06/coming-soon-in-ember-octane-part-4.html)
that essentially applies certain classes at the correct timing to allow you to define
the initial and final states and what happens in between. All of this just using CSS.

Let's look at one example:

{{#docs-demo as |demo|}}
  {{#demo.example name="insert-destroy.hbs"}}
    <button class="docs-btn" {{on "click" (action (mut this.show) (not show))}}>
      Press me
    </button>

    {{#if this.show}}
      <div {{css-transition "example"}}>
        <h1>Hello world</h1>
      </div>
    {{/if}}
  {{/demo.example}}

  {{demo.snippet "insert-destroy.hbs"}}
  {{demo.snippet "insert-destroy.css"}}
{{/docs-demo}}

<aside>
  Notice how the positional argument is used for the prefix of the css classes you define.
</aside>

## **Manually specifying class names**

Each individual class can also be specified independently like below.

{{#docs-demo as |demo|}}
  {{#demo.example name="insert-destroy-verbose.hbs"}}
    <button class="docs-btn" {{on "click" (action (mut this.show2) (not show2))}}>
      Press me
    </button>

    {{#if this.show2}}
      <div {{css-transition (hash enter="opacity-0 max-h-0" enterActive="duration-500 opacity-100 max-h-12" leave="opacity-100 max-h-12" leaveActive="opacity-0 duration-500 max-h-0")}}>
        <h1>Hello world</h1>
      </div>
    {{/if}}
  {{/demo.example}}

  {{demo.snippet "insert-destroy-verbose.hbs"}}
  {{demo.snippet "insert-destroy-verbose.css"}}
{{/docs-demo}}

You're free to customize your element like you normally would. The modifier will only apply and remove the classes and nothing else.
