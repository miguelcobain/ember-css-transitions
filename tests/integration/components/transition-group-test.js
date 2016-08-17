import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';
const { run } = Ember;

moduleForComponent('transition-group', 'Integration | Component | transition group', {
  integration: true
});

test('enter and leave transitions work', function(assert) {
  assert.expect(10);

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
    assert.ok(this.$('.transition-group-element').hasClass('example-enter-active'), '-enter-active is applied after `afterRender` and a browser repaint');

    // transition should be happening now
    this.set('show', false);

    assert.ok(this.$('.transition-group-element').hasClass('example-leave'), '-leave is immediately applied');

    return wait();
  }).then(() => {
    assert.ok(this.$('.transition-group-element').hasClass('example-leave-active'), '-leave-active is applied after `afterRender` and a browser repaint');
    assert.equal(this.$(`#${originalId}`).length, 0, 'original element is not present');
    assert.equal(this.$(`#${originalId}_clone`).length, 1, 'clone is present');

    return wait();
  }).then(() => {
    assert.equal(this.$(`#${originalId}_clone`).length, 0);
  });
});
