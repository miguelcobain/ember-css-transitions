# Animating class add/removal

Another common use case is to animate between two states and not just the insertion and removal of an element.

For this case, the `{{css-transition}}` modifier can animate adding and removing a class.
To do this you just need to pass in a named argument to the modifier, and it will use the argument name and apply
the correct intermediate classes for animation based on the argument value.

Let's look at an example of adding/removing an `is-important` class:

{{#docs-demo as |demo|}}
  {{#demo.example name="class-add-removal.hbs"}}
    <button class="docs-btn" {{on "click" (action (mut this.isImportant) (not this.isImportant))}}>
      Press me
    </button>

    <div {{css-transition isImportant=this.isImportant}}>
      <h1>A very important text.</h1>
    </div>

  {{/demo.example}}

  {{demo.snippet "class-add-removal.hbs"}}
  {{demo.snippet "class-add-removal.css"}}
{{/docs-demo}}

<aside>
  Notice that the class name is a "dasherized" version of the argument name.
  In this case <code>isImportant</code> becomes <code>is-important</code>.
</aside>
