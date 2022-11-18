




## v4.3.2 (2022-11-18)

#### :bug: Bug Fix
* [#117](https://github.com/miguelcobain/ember-css-transitions/pull/117) Handle no ownConfig scenario (for real) ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 1
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))

## v4.3.1 (2022-11-18)

#### :bug: Bug Fix
* [#116](https://github.com/miguelcobain/ember-css-transitions/pull/116) Handle no ownConfig scenario ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 1
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))

## v4.3.0 (2022-11-18)

#### :rocket: Enhancement
* [#113](https://github.com/miguelcobain/ember-css-transitions/pull/113) Add opt-in integration with @ember/test-waiters ([@SergeAstapov](https://github.com/SergeAstapov))
* [#109](https://github.com/miguelcobain/ember-css-transitions/pull/109) Update glint import path to template-registry ([@SergeAstapov](https://github.com/SergeAstapov))

#### :memo: Documentation
* [#115](https://github.com/miguelcobain/ember-css-transitions/pull/115) Add Glint support page to docs ([@SergeAstapov](https://github.com/SergeAstapov))

#### :house: Internal
* [#114](https://github.com/miguelcobain/ember-css-transitions/pull/114) Fix flaky tests ([@SergeAstapov](https://github.com/SergeAstapov))
* [#112](https://github.com/miguelcobain/ember-css-transitions/pull/112) Rename addon folder to ember-css-transitions ([@SergeAstapov](https://github.com/SergeAstapov))
* [#111](https://github.com/miguelcobain/ember-css-transitions/pull/111) update v2 addon setup ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 1
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))

## v4.2.0 (2022-09-21)

#### :rocket: Enhancement
* [#103](https://github.com/miguelcobain/ember-css-transitions/pull/103) remove class properties transpilation ([@SergeAstapov](https://github.com/SergeAstapov))
* [#95](https://github.com/miguelcobain/ember-css-transitions/pull/95) feat: Add glint types ([@muziejus](https://github.com/muziejus))
* [#98](https://github.com/miguelcobain/ember-css-transitions/pull/98) Replace use of RSVP with native Promise ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 2
- Moacir P. de Sá Pereira ([@muziejus](https://github.com/muziejus))
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))

## v4.1.0 (2022-04-28)

#### :rocket: Enhancement
* [#87](https://github.com/miguelcobain/ember-css-transitions/pull/87) Make compatible with ember-modifier 4.x ([@SergeAstapov](https://github.com/SergeAstapov))

#### :memo: Documentation
* [#92](https://github.com/miguelcobain/ember-css-transitions/pull/92) update github url ([@SergeAstapov](https://github.com/SergeAstapov))
* [#91](https://github.com/miguelcobain/ember-css-transitions/pull/91) add v4 changelog ([@SergeAstapov](https://github.com/SergeAstapov))
* [#89](https://github.com/miguelcobain/ember-css-transitions/pull/89) Improve contributing docs ([@SergeAstapov](https://github.com/SergeAstapov))

#### :house: Internal
* [#93](https://github.com/miguelcobain/ember-css-transitions/pull/93) run `npx ember-cli-update --to=4.3.0` to align with blueprint ([@SergeAstapov](https://github.com/SergeAstapov))
* [#88](https://github.com/miguelcobain/ember-css-transitions/pull/88) Extract docs into separate app ([@SergeAstapov](https://github.com/SergeAstapov))
* [#85](https://github.com/miguelcobain/ember-css-transitions/pull/85)  move `.md` files to published package ([@SergeAstapov](https://github.com/SergeAstapov))
* [#81](https://github.com/miguelcobain/ember-css-transitions/pull/81) Update release-it config ([@SergeAstapov](https://github.com/SergeAstapov))
* [#80](https://github.com/miguelcobain/ember-css-transitions/pull/80) Add `publishConfig.registry` to addon/package.json ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 1
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))

## v4.0.0 (2022-03-17)

#### 🚨 Breaking Change
* [#77](https://github.com/miguelcobain/ember-css-transitions/pull/77) Convert to addon v2 ([@AnastasiiaPlutalova](https://github.com/AnastasiiaPlutalova))

#### 🏠 Internal
* [#78](https://github.com/miguelcobain/ember-css-transitions/pull/78) fix addon .npmignore entries ([@SergeAstapov](https://github.com/SergeAstapov))
* [#76](https://github.com/miguelcobain/ember-css-transitions/pull/76) Converting to monorepo ([@AnastasiiaPlutalova](https://github.com/AnastasiiaPlutalova))

#### Committers: 2
- AnastasiiaPlutalova ([@AnastasiiaPlutalova](https://github.com/AnastasiiaPlutalova))
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))

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
