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

You're free to customize your element like you normally would. The modifier will only apply and remove the classes and nothing else.
