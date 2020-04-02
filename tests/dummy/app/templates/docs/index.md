# Introduction

`ember-css-transitions` provides some utilities that help you define animations purely in CSS.

This can be thought of a port of angular's ng-animate or react-animation for Ember.

To install it just run:

```bash
ember install ember-css-transitions
```

The kind of CSS you'll be writing is of the following structure:


```css
.example-enter {
  /* enter initial state */
  opacity: 0;
}

.example-enter.example-enter-active {
  /* enter final state and how to transition to it */
  opacity: 1;
  transition: opacity 0.5s ease-in;
}

.example-leave {
  /* leave initial state */
  opacity: 1;
}

.example-leave.example-leave-active {
  /* leave final state and how to transition to it */
  opacity: 0;
  transition: opacity 0.5s ease-in;
}
```


Check out the other sections of the docs for more info on how to use the addon.
