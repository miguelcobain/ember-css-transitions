# Introduction

`ember-css-transitions` provides some utilities that help you define animations purely in CSS.

This can be thought of a port of Vue's transitions for Ember.

To install it run:

```bash
ember install ember-css-transitions
```


This addon is perfect for libraries like [Animate.css](https://animate.style/) and [Tailwind CSS](https://tailwindcss.com/). If you write your own css it will be of the following structure:


```css
.example-enter {
  /* enter initial state */
  opacity: 0;
}

.example-enter-active {
  /* define the duration, delay and easing curve for the entering transition */
  transition: opacity 0.5s ease-in;
}

.example-enter-to {
  /* enter final state */
  opacity: 1;
}

.example-leave {
  /* leave initial state */
  opacity: 1;
}

.example-leave-active {
  /* define the duration, delay and easing curve for the leaving transition */
  transition: opacity 0.5s ease-in;
}

.example-leave-active {
  /* leave final state */
  opacity: 0;
}
```

Check out the other sections of the docs for more info on how to use the addon.
