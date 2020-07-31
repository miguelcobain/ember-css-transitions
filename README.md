# Ember CSS Transitions [![Build Status](https://travis-ci.org/peec/ember-css-transitions.svg?branch=master)](https://travis-ci.org/peec/ember-css-transitions) [![Ember Observer Score](https://emberobserver.com/badges/ember-css-transitions.svg)](https://emberobserver.com/addons/ember-css-transitions)

This addon provides a nice way of defining CSS Transitions for Ember Components. Which means, only css based animations for performance - and no animation library needed.

Ember CSS Transitions is heavily inspired (and CSS compatible) with [Vue's CSS Transitions](https://vuejs.org/v2/guide/transitions.html).

Animations are completely based on CSS classes.

## Documentation

- [https://peec.github.io/ember-css-transitions/](https://peec.github.io/ember-css-transitions/)

## How it works

Utimately you define your animations and transitions with only css like:

```css
/* initial state */
.example-enter, .example-leave-to {
  opacity: 0;
}

/* final state */
.example-enter-to, .example-leave {
  opacity: 1;
}

/* easings */
.example-enter-active, .example-leave-active {
  transition: opacity .5s ease-in;
}
```

And using the included modifier like:

```hbs
<div {{css-transition "example"}}>
  <h1>Hello world</h1>
</div>
```

or by manually specifying classes, perfect for libraries like [Animate.css](https://animate.style/) and [Tailwind CSS](https://tailwindcss.com/).

```hbs
{{!-- Using Tailwind CSS provided classes --}}
<div {{css-transition
  enterClass="opacity-0"
  enterActiveClass="transition-opacity duration-500 ease-in-out"
  enterToClass="opacity-100"
  leaveClass="opacity-100"
  leaveActiveClass="transition-opacity duration-500 ease-in-out"
  leaveToClass="opacity-0"}}>
  <h1>Hello world</h1>
</div>
```

Check out the homepage for more detailed documentation: [https://peec.github.io/ember-css-transitions/](https://peec.github.io/ember-css-transitions/)

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
