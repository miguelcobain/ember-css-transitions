# Animating insert/destroy

This addon provides a `{{css-transition}}` [modifier](https://blog.emberjs.com/2019/03/06/coming-soon-in-ember-octane-part-4.html)
that essentially applies certain classes at the correct timing to allow you to define
the initial and final states and what happens in between. All of this just using CSS.

## Transition Classes

There are six classes applied for enter/leave transitions, all of them **prefixed** with the given `name` argument (either the named `name` argument or the first positional argument):

1. `${name}-enter`: Starting state for enter. Added before element is inserted, removed one frame after element is inserted.

2. `${name}-enter-active`: Active state for enter. Applied during the entire entering phase. Added before element is inserted, removed when transition/animation finishes. This class can be used to define the duration, delay and easing curve for the entering transition.

3. `${name}-enter-to`: Ending state for enter. Added one frame after element is inserted (at the same time `${name}-enter` is removed), removed when transition/animation finishes.

4. `${name}-leave`: Starting state for leave. Added immediately when a leaving transition is triggered, removed after one frame.

5. `${name}-leave-active`: Active state for leave. Applied during the entire leaving phase. Added immediately when leave transition is triggered, removed when the transition/animation finishes. This class can be used to define the duration, delay and easing curve for the leaving transition.

6. `${name}-leave-to`: Ending state for leave. Added one frame after a leaving transition is triggered (at the same time `${name}-leave` is removed), removed when the transition/animation finishes.

Each of these classes will be prefixed with the name of the transition. If you use `{{css-transition "my-transition"}}` or `{{css-transition name="my-transition"}}` for example, then the enter class would be `my-transition-enter`.

`${name}-enter-active` and `${name}-leave-active` give you the ability to specify different easing curves for enter/leave transitions, which you’ll see an example of in the following section.

Here is a diagram taken from the [VueJS docs](https://vuejs.org/v2/guide/transitions.html#Transition-Classes) that explains this in a more visual way:

<img src={{root-url "transition.png"}} alt="VueJS transition classes">

## CSS Transitions

Let's look at one example:

{{#docs-demo as |demo|}}
  {{#demo.example name="slide-fade.hbs"}}
    <button class="docs-btn" {{on "click" (fn (mut this.show) (not show))}}>
      Toggle
    </button>

    {{#if this.show}}
      <div {{css-transition "slide-fade"}}>
        <h1>Hello world</h1>
      </div>
    {{/if}}
  {{/demo.example}}

  {{demo.snippet "slide-fade.css"}}
  {{demo.snippet "slide-fade.hbs"}}
{{/docs-demo}}

## Custom Transition Classess

Each individual class can also be specified independently by providing the following arguments:

- enterClass
- enterActiveClass
- enterToClass
- leaveClass
- leaveActiveClass
- leaveToClass

This is perfect for libraries like [Animate.css](https://animate.style/) and [Tailwind CSS](https://tailwindcss.com/).
Here is an example with TailwindCSS-like styles:

{{#docs-demo as |demo|}}
  {{#demo.example name="insert-destroy-verbose.hbs"}}
    <button class="docs-btn" {{on "click" (fn (mut this.show2) (not show2))}}>
      Toggle
    </button>

    {{#if this.show2}}
      <div {{css-transition
        enterClass="opacity-0 max-h-0"
        enterActiveClass="transition-all duration-500 ease-in-out"
        enterToClass="opacity-100 max-h-12"
        leaveClass="opacity-100 max-h-12"
        leaveActiveClass="transition-all duration-500 ease-in-out"
        leaveToClass="opacity-0 max-h-0"}}>
        <h1>Hello world</h1>
      </div>
    {{/if}}
  {{/demo.example}}

  {{demo.snippet "insert-destroy-verbose.hbs"}}
  {{demo.snippet "insert-destroy-verbose.css"}}
{{/docs-demo}}


You're free to customize your element like you normally would. The modifier will only apply and remove the transition classes and nothing else.
