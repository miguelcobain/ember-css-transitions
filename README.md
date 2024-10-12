# Ember CSS Transitions [![Build Status](https://github.com/miguelcobain/ember-css-transitions/actions/workflows/ci.yml/badge.svg)](https://github.com/miguelcobain/ember-css-transitions/actions?query=workflow%3ACI) [![Ember Observer Score](https://emberobserver.com/badges/ember-css-transitions.svg)](https://emberobserver.com/addons/ember-css-transitions)

This addon provides a nice way of defining CSS Transitions for Ember Components. Which means, only css based animations for performance - and no animation library needed.

Ember CSS Transitions is heavily inspired (and CSS compatible) with [Vue's CSS Transitions](https://vuejs.org/v2/guide/transitions.html).

Animations are completely based on CSS classes.

## Documentation

- [https://miguelcobain.github.io/ember-css-transitions/](https://miguelcobain.github.io/ember-css-transitions/)

## How it works

Ultimately you define your animations and transitions with only css like:

```css
/* initial state */
.example-enter,
.example-leave-to {
  opacity: 0;
}

/* final state */
.example-enter-to,
.example-leave {
  opacity: 1;
}

/* easings */
.example-enter-active,
.example-leave-active {
  transition: opacity 0.5s ease-in;
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

If you are using [TailwindUI](https://tailwindui.com) then you will see transition instructions included in the code, as in this example:

```hbs
<!--
  Slide-over panel, show/hide based on slide-over state.

  Entering: "transform transition ease-in-out duration-500 sm:duration-700"
    From: "translate-x-full"
    To: "translate-x-0"
  Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
    From: "translate-x-0"
    To: "translate-x-full"
-->
```

You should map these instructions to this addon's API in the following way:

| TailwindUI | Addon            |
| ---------- | ---------------- |
| Entering   | enterActiveClass |
| From       | enterClass       |
| To         | enterToClass     |
| Leaving    | leaveActiveClass |
| From       | leaveClass       |
| To         | leaveToClass     |

Check out the homepage for more detailed documentation: [https://miguelcobain.github.io/ember-css-transitions/](https://miguelcobain.github.io/ember-css-transitions/)

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

## Glint usage

`css-transition` ships [Glint](https://github.com/typed-ember/glint) types,
which allow you when using TypeScript to get strict type checking in your templates.

Unless you are using [strict mode](http://emberjs.github.io/rfcs/0496-handlebars-strict-mode.html) templates
(via [first class component templates](http://emberjs.github.io/rfcs/0779-first-class-component-templates.html)),
Glint needs a [Template Registry](https://typed-ember.gitbook.io/glint/using-glint/ember/template-registry)
that contains entries for the element modifier provided by this addon.
To add these registry entries automatically to your app, you just need to import `ember-css-transitions/template-registry`
from somewhere in your app. When using Glint already, you will likely have a file like
`types/glint.d.ts` where you already import glint types, so just add the import there:

```ts
import '@glint/environment-ember-loose';

import type CssTransitionsRegistry from 'ember-css-transitions/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends CssTransitionsRegistry, /* other addon registries */ {
    // local entries
  }
}
```

## Usage with `<template>` tag

For usage in `gts` or `gjs` files, modifier is exported from the index:

```hbs
import { cssTransition } from 'ember-css-transitions';

<template>
  <div
    {{cssTransition
      enterClass="opacity-0"
      enterActiveClass="transition-opacity duration-500 ease-in-out"
      enterToClass="opacity-100"
      leaveClass="opacity-100"
      leaveActiveClass="transition-opacity duration-500 ease-in-out"
      leaveToClass="opacity-0"
    }}
  >
    <h1>Hello world</h1>
  </div>
</template>
```
## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
