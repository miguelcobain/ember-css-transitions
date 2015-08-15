# Ember CSS Transitions [![Build Status](https://travis-ci.org/peec/ember-css-transitions.svg)](https://travis-ci.org/peec/ember-css-transitions.svg) [![Ember Observer Score](http://emberobserver.com/badges/ember-css-transtions.svg)](http://emberobserver.com/addons/ember-css-transtions)

This addon provides a nice way of defining CSS Transitions for Ember Components. Which means, only css based animations for performance - and no animation library needed.

Ember CSS Transitions is heavily inspired (and CSS compatible) with:

- [React's CSS Transitions](https://facebook.github.io/react/docs/animation.html) (mostly from React)
- [Angular's CSS Transitions](https://docs.angularjs.org/api/ngAnimate)

Animations are completely based on CSS classes. As long as you have a CSS class attached to a HTML element, you can apply animations to it.

**Utimately you define your animations and transitions with ONLY CSS.**

```css
.example-enter {
  opacity: 0.01;
}

.example-enter.example-enter-active {
  opacity: 1;
  transition: opacity .5s ease-in;
}
.example-leave {
  opacity: 1;
}

.example-leave.example-leave-active {
  opacity: 0.01;
  transition: opacity .5s ease-in;
}
```

There are two ways of defining transitions, 
And if you use the `{{transition-group}}` component you can then do something like this ( there is also a mixin you can use for custom components):

```handlebars
{{#if shouldShowThis}}
    {{#transition-group transition-class="example"}}
        This is animated in.
    {{/transition-group}}
{{/if}}
```

`ember-css-transitions` will automatically manage the lifecycle of the css classes applied so that it makes the animation on `didInsertElement` and `willDestroyElement`. It adds `enter` suffix and `enter-active` when `didInsertElement` is applied. The same for `willDestroyElement`, but then it adds `yourclass-leave` and `yourclass-leave-active`.


For example and docs, see: [http://peec.github.io/ember-css-transitions/](http://peec.github.io/ember-css-transitions/)

## Install

Install it is simple:

```
ember install ember-css-transitions
```


## Documentation

- [http://peec.github.io/ember-css-transitions/](http://peec.github.io/ember-css-transitions/)


## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
