# v3.1.0

#### ✨ Features

- a new `parentSelector` argument is supported. This allows you to specify which part of the DOM is going to be destroyed.
  This might fix some of the leave transitions. See [#61](https://github.com/peec/ember-css-transitions/issues/61) for detailed information.

# v3.0.0

#### 🚨 Breaking Changes

- Drop Node.js 10 support ([#69](https://github.com/peec/ember-css-transitions/pull/69))

#### 🏗 Chores

- update ember-modifier to v3 ([#68](https://github.com/peec/ember-css-transitions/pull/68))
- move `ember-cli-htmlbars` to `devDependencies` ([#67](https://github.com/peec/ember-css-transitions/pull/67]))
- replace Travis with GH Actions ([#71](https://github.com/peec/ember-css-transitions/pull/71))
- update ember-cli project and dependencies

# v2.1.0

#### 🏗 Chores

- update ember-modifier to v2 ([#45](https://github.com/peec/ember-css-transitions/pull/45))

# v2.0.0

#### 🚨 Breaking Changes

- The timings and class names have changed to conform vue's transitions. The main advantage is the
  excellent interoperability with popular css libraries like TailwindCSS or Animate.css.
  Here is a before and after example of a style were were using on the docs.

Before:

```css
.example-enter {
  opacity: 0;
}

.example-enter.example-enter-active {
  opacity: 1;
  transition: opacity 0.5s ease-in;
}
.example-leave {
  opacity: 1;
}

.example-leave.example-leave-active {
  opacity: 0;
  transition: opacity 0.5s ease-in;
}
```

After:

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

Check the documentation to understand exactly what has changed and how you should update your styles: http://peec.github.io/ember-css-transitions/docs/insert-destroy

#### ✨ Features

- You can now pass in custom class names.

# v1.1.0

#### ✨ Features

- there is now an `isEnabled` argument that enables/disables animation

#### 🐛 Bugfixes

- fixes various failures when an element is removed soon after it is added

# v1.0.0

#### 🚨 Breaking Changes

- Addon no longer provides a mixin or component. A modifier is now provided to accomplish the same things as previously and also it is much more in line with the Octane programming model.
- You'll need at least ember 3.8
