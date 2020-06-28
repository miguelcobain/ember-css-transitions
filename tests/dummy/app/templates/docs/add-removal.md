# Animating class add/removal

Another common use case is to animate between two states and not just the insertion and removal of an element.

For this case, the `{{css-transition}}` modifier can animate adding and removing a class.
To do this you just need to pass in a named argument to the modifier, and it will use the argument name and apply
the correct intermediate classes for animation based on the argument value.

Let's look at an example of adding/removing an `is-important` class:

{{#docs-demo as |demo|}}
  {{#demo.example name="class-add-removal.hbs"}}
    <button class="docs-btn" {{on "click" (action (mut this.isImportant) (not this.isImportant))}}>
      Press me {{#if this.isImportant}}(Make un-important){{else}}(Make important){{/if}}
    </button>

    <div {{css-transition state=(if this.isImportant "is-important")}}>
      <h1>A very important text.</h1>
    </div>

  {{/demo.example}}

  {{demo.snippet "class-add-removal.hbs"}}
  {{demo.snippet "class-add-removal.css"}}
{{/docs-demo}}

<aside>
  Notice how the state argument's value is used for the prefix of the css classes you define.
</aside>

## **Manually specifying class names**

Sometimes you don't need this modifier to animate state changes.

{{#docs-demo as |demo|}}
  {{#demo.example name="class-add-removal-verbose.hbs"}}
    <button class="docs-btn" {{on "click" (action (mut this.isImportant2) (not this.isImportant2))}}>
      Press me {{#if this.isImportant2}}(Make un-important){{else}}(Make Important){{/if}}
    </button>

    <div class="{{if this.isImportant2 'text-red-600 text-2xl duration-1000' 'text-black text-base duration-200'}}">
      <h1>A very important text.</h1>
    </div>

  {{/demo.example}}

  {{demo.snippet "class-add-removal-verbose.hbs"}}
  {{demo.snippet "class-add-removal-verbose.css"}}
{{/docs-demo}}
