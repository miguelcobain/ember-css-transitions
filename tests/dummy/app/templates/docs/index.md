# Introduction

`ember-css-transitions` provides some utilities that help you define animations purely in CSS.

This can be thought of a port of Vue's transitions for Ember.

To install it run:

```bash
ember install ember-css-transitions
```

In its simplest form, this modifier allows you top write css animations in the following form:

{{#docs-demo as |demo|}}
  {{#demo.example name="intro-example.hbs"}}
    <button class="docs-btn" {{on "click" (fn (mut this.show) (not this.show))}}>
      Toggle
    </button>

    {{#if this.show}}
      <div {{css-transition "fade"}}>
        hello
      </div>
    {{/if}}

  {{/demo.example}}

  {{demo.snippet "intro-example.css"}}
  {{demo.snippet "intro-example.hbs"}}
{{/docs-demo}}

This addon is also has a good synergy with libraries like [Animate.css](https://animate.style/) and [Tailwind CSS](https://tailwindcss.com/) because it allows
customization of the class names that are applied.

Check out the other sections of the docs for more info on how to use the addon.
