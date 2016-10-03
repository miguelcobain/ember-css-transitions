import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('transition-group', 'Integration | Component | transition group', {
  integration: true
});

test('enter and leave transitions work', function(assert) {
  assert.expect(7);

  this.set('show', false);

  this.render(hbs`
    {{#if show}}
      {{#transition-group transitionName="example" class="transition-group-element"}}
        <p class="transition-group-content">Çup?</p>
      {{/transition-group}}
    {{/if}}
  `);

  assert.equal(this.$('.transition-group-element').length, 0, 'no element at first');

  this.set('show', true);

  assert.equal(this.$('.transition-group-element').length, 1, 'element is rendered');
  assert.equal(this.$('.transition-group-content').length, 1, 'its contents as well');

  let originalId = this.$('.transition-group-element').attr('id');

  assert.ok(this.$('.transition-group-element').hasClass('example-enter'), '-enter is immediately applied');

  return wait().then(() => {
    // transition should be happening now
    // TODO - test that -enter-active was added
    // assert.ok(this.$('.transition-group-element').hasClass('example-enter-active'), '-enter-active is applied after `afterRender` and a browser repaint');
    assert.notOk(this.$('.transition-group-element').hasClass('example-enter'), '-enter was removed');

    this.set('show', false);

    return wait();
  }).then(() => {
    // TODO - test that -leave and -leave-active were added
    // assert.ok(this.$(`#${originalId}_clone`).hasClass('example-leave'), '-leave is applied on clone');
    // assert.ok(this.$(`#${originalId}_clone`).hasClass('example-leave-active'), '-leave-active is applied after `afterRender` and a browser repaint on clone');

    assert.equal(this.$(`#${originalId}`).length, 0, 'original element is not present');
    assert.equal(this.$(`#${originalId}_clone`).length, 0, 'clone was removed');
  });
});

test('add and remove transitions work', function(assert) {
  assert.expect(5);

  this.set('closed', false);

  this.render(hbs`
    {{test-class-component closed=closed class="transition-group-element"}}
  `);

  assert.notOk(this.$('.transition-group-element').hasClass('is-closed'), 'element doesn\'t have class');

  this.set('closed', true);

  assert.ok(this.$('.transition-group-element').hasClass('is-closed-add'), '-add is immediately applied');

  return wait().then(() => {
    // transition should be happening now
    // TODO - test that -add-active was added
    // assert.ok(this.$('.transition-group-element').hasClass('is-closed-add-active'), '-add-active is applied after `afterRender` and a browser repaint');
    assert.notOk(this.$('.transition-group-element').hasClass('is-closed-add'), '-add was removed');
    assert.ok(this.$('.transition-group-element').hasClass('is-closed'), 'class was added');

    this.set('closed', false);

    return wait();
  }).then(() => {
    // TODO - test that -remove and -remove-active were added
    // assert.ok(this.$('.transition-group-element').hasClass('is-closed-remove'), '-remove is applied on clone');
    // assert.ok(this.$('.transition-group-element').hasClass('is-closed-remove-active'), '-remove-active is applied after `afterRender` and a browser repaint on clone');

    assert.notOk(this.$('.transition-group-element').hasClass('is-closed'), 'class was removed');
  });
});