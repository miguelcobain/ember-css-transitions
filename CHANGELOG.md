# v2.0.0

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
  transition: opacity .5s ease-in;
}
.example-leave {
  opacity: 1;
}

.example-leave.example-leave-active {
  opacity: 0;
  transition: opacity .5s ease-in;
}
```

After: 
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
