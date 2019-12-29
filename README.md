# Ember CSS Transitions [![Build Status](https://travis-ci.org/peec/ember-css-transitions.svg)](https://travis-ci.org/peec/ember-css-transitions.svg) [![Ember Observer Score](http://emberobserver.com/badges/ember-css-transitions.svg)](http://emberobserver.com/addons/ember-css-transitions)

This addon provides a nice way of defining CSS Transitions for Ember Components. Which means, only css based animations for performance - and no animation library needed.

Ember CSS Transitions is heavily inspired (and CSS compatible) with:

- [React's CSS Transitions](https://facebook.github.io/react/docs/animation.html) (the implementation is mostly based on React)
- [Angular's CSS Transitions](https://docs.angularjs.org/api/ngAnimate)

Animations are completely based on CSS classes. As long as you have a CSS class attached to a HTML element, you can apply animations to it.


## Documentation

- [http://peec.github.io/ember-css-transitions/](http://peec.github.io/ember-css-transitions/)

## How it works

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

```hbs
<div {{css-transition "example"}}>
  <h1>Hello world</h1>
</div>
```

Check out the homepage for more detailed documentation: [http://peec.github.io/ember-css-transitions/](http://peec.github.io/ember-css-transitions/)

## Install

Run:

```
ember install ember-css-transitions

```

**Note** Using ember-cli-autoprefixer is suggested for CSS transitions:

```
ember install ember-cli-autoprefixer
```

## Tested in the following browsers / platforms:

- [x] IE 10
- [x] IE 11
- [x] Microsoft Edge
- [x] Chrome
- [x] Firefox
- [x] Safari
- [x] Android
- [x] iPhone

Note: **IE9** does not support CSS3 transitions / animations. They must live with no animations / transitions.

## Contribute

* `git clone <repository-url>` this repository
* `cd my-addon`
* `npm install`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
