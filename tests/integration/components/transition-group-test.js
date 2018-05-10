import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | transition group', function(hooks) {
  setupRenderingTest(hooks);

  test('enter and leave transitions work', async function(assert) {
    assert.expect(7);

    this.set('show', false);

    await render(hbs`
      {{#if show}}
        {{#transition-group transitionName="example" class="transition-group-element"}}
          <p class="transition-group-content">Çup?</p>
        {{/transition-group}}
      {{/if}}
    `);

    assert.dom('.transition-group-element').doesNotExist('no element at first');

    this.set('show', true);

    assert.dom('.transition-group-element').exists({ count: 1 }, 'element is rendered');
    assert.dom('.transition-group-content').exists({ count: 1 }, 'its contents as well');

    let originalId = find('.transition-group-element').id;

    assert.dom('.transition-group-element').hasClass('example-enter', '-enter is immediately applied');

    await settled();

    // transition should be happening now
    // TODO - test that -enter-active was added
    // assert.ok(this.$('.transition-group-element').hasClass('example-enter-active'), '-enter-active is applied after `afterRender` and a browser repaint');
    assert.dom('.transition-group-element').doesNotHaveClass('example-enter', '-enter was removed');

    this.set('show', false);

    await settled();

    // TODO - test that -leave and -leave-active were added
    // assert.ok(this.$(`#${originalId}_clone`).hasClass('example-leave'), '-leave is applied on clone');
    // assert.ok(this.$(`#${originalId}_clone`).hasClass('example-leave-active'), '-leave-active is applied after `afterRender` and a browser repaint on clone');

    assert.dom(`#${originalId}`).doesNotExist('original element is not present');
    assert.dom(`#${originalId}_clone`).doesNotExist('clone was removed');
  });

  test('add and remove transitions work', async function(assert) {
    assert.expect(5);

    this.set('closed', false);

    await render(hbs`
      {{test-class-component closed=closed class="transition-group-element"}}
    `);

    assert.dom('.transition-group-element').doesNotHaveClass('is-closed', 'element doesn\'t have class');

    this.set('closed', true);

    assert.dom('.transition-group-element').hasClass('is-closed-add', '-add is immediately applied');

    await settled();

    // transition should be happening now
    // TODO - test that -add-active was added
    // assert.ok(this.$('.transition-group-element').hasClass('is-closed-add-active'), '-add-active is applied after `afterRender` and a browser repaint');
    assert.dom('.transition-group-element').doesNotHaveClass('is-closed-add', '-add was removed');
    assert.dom('.transition-group-element').hasClass('is-closed', 'class was added');

    this.set('closed', false);

    await settled();
    // TODO - test that -remove and -remove-active were added
    // assert.ok(this.$('.transition-group-element').hasClass('is-closed-remove'), '-remove is applied on clone');
    // assert.ok(this.$('.transition-group-element').hasClass('is-closed-remove-active'), '-remove-active is applied after `afterRender` and a browser repaint on clone');

    assert.dom('.transition-group-element').doesNotHaveClass('is-closed', 'class was removed');
  });
});
