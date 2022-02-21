# Animating class add/removal

Another common use case is to animate between two states and not just the insertion and removal of an element.
In this case just the act of insert/removing a class should be enough and this addon is not needed.

Here is an example of such an animation:

{{#docs-demo as |demo|}}
  {{#demo.example name="class-add-removal-verbose.hbs"}}
    <button class="docs-btn" {{on "click" (fn (mut this.isImportant) (not this.isImportant))}}>
      Toggle
    </button>

    <div class={{if this.isImportant "text-red-600 text-2xl duration-1000" "text-black text-base duration-200"}}>
      <h1>A very important text.</h1>
    </div>

  {{/demo.example}}

  {{demo.snippet "class-add-removal-verbose.hbs"}}
  {{demo.snippet "class-add-removal-verbose.css"}}
{{/docs-demo}}
