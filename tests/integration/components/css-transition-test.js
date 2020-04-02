import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, waitFor, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { spy } from 'sinon';

module('Integration | Component | transition group', function(hooks) {
  setupRenderingTest(hooks);

  test('enter and leave transitions work', async function(assert) {
    assert.expect(16);

    this.didTransitionIn = spy();
    this.didTransitionOut = spy();

    this.set('show', false);

    await render(hbs`
      {{#if this.show}}
        <div id="my-element" {{css-transition "example" didTransitionIn=this.didTransitionIn didTransitionOut=this.didTransitionOut}}>
          <p class="content">Çup?</p>
        </div>
      {{/if}}
    `);

    assert.dom('#my-element').doesNotExist('no element at first');
    assert.ok(this.didTransitionIn.notCalled, 'didTransitionIn was not called');
    assert.ok(this.didTransitionOut.notCalled, 'didTransitionOut was not called');

    this.set('show', true);

    assert.dom('#my-element').exists({ count: 1 }, 'element is rendered');
    assert.dom('.content').exists({ count: 1 }, 'its contents as well');

    assert.dom('#my-element').hasClass('example-enter', '-enter is immediately applied');

    await waitFor('#my-element.example-enter-active');

    assert.dom('#my-element').hasClass('example-enter-active', '-enter-active is applied');

    await waitFor('#my-element:not(.example-enter)');

    assert.dom('#my-element').doesNotHaveClass('example-enter', '-enter was removed');

    assert.ok(this.didTransitionIn.calledOnce, 'didTransitionIn was called once');
    assert.ok(this.didTransitionOut.notCalled, 'didTransitionOut was not called');

    this.set('show', false);

    await waitFor('#my-element_clone.example-leave');

    assert.dom('#my-element_clone').hasClass('example-leave', '-leave is applied on clone');

    await waitFor('#my-element_clone.example-leave-active');

    assert.dom('#my-element_clone').hasClass('example-leave-active', '-leave-active is applied after `afterRender` and a browser repaint on clone');

    assert.dom('#my-element').doesNotExist('original element is not present');

    await waitUntil(() => {
      return find('#my-element_clone') === null;
    });

    assert.dom('#my-element_clone').doesNotExist('clone was removed');

    assert.ok(this.didTransitionIn.calledOnce, 'didTransitionIn was called once');
    assert.ok(this.didTransitionOut.calledOnce, 'didTransitionOut was called once');
  });

  test('add and remove transitions work', async function(assert) {
    assert.expect(16);

    this.didTransitionIn = spy();
    this.didTransitionOut = spy();

    this.set('isImportant', false);

    await render(hbs`
      <div id="my-element" {{css-transition isImportant=this.isImportant didTransitionIn=this.didTransitionIn didTransitionOut=this.didTransitionOut}}>
        <p class="content">Çup?</p>
      </div>
    `);

    assert.dom('#my-element').doesNotHaveClass('is-important', 'element doesn\'t have class');

    assert.ok(this.didTransitionIn.notCalled, 'didTransitionIn was not called');
    assert.ok(this.didTransitionOut.notCalled, 'didTransitionOut was not called');

    this.set('isImportant', true);

    await waitFor('#my-element.is-important-add');

    assert.dom('#my-element').hasClass('is-important-add', '-add is immediately applied');

    await waitFor('#my-element.is-important-add-active');

    // transition should be happening now
    assert.dom('#my-element').hasClass('is-important-add-active', '-add-active is applied after `afterRender` and a browser repaint');

    await waitFor('#my-element:not(.is-important-add)');

    assert.dom('#my-element').doesNotHaveClass('is-important-add', '-add was removed');
    assert.dom('#my-element').hasClass('is-important', 'class was added');

    assert.ok(this.didTransitionIn.calledOnceWith('is-important'), 'didTransitionIn was called once with is-important');
    assert.ok(this.didTransitionOut.notCalled, 'didTransitionOut was not called');

    this.set('isImportant', false);

    assert.dom('#my-element').hasClass('is-important-remove', '-remove is applied');

    await waitFor('#my-element.is-important-remove-active');

    assert.dom('#my-element').hasClass('is-important-remove-active', '-remove-active is applied after `afterRender` and a browser repaint on clone');

    assert.dom('#my-element').doesNotHaveClass('is-important', 'class was removed');

    await waitFor('#my-element:not(.is-important-remove)');

    assert.dom('#my-element').doesNotHaveClass('is-important-remove', '-remove was removed');
    assert.dom('#my-element').doesNotHaveClass('is-important-remove-active', '-remove-active was removed');

    assert.ok(this.didTransitionIn.calledOnceWith('is-important'), 'didTransitionIn was called once with is-important');
    assert.ok(this.didTransitionOut.calledOnceWith('is-important'), 'didTransitionOut was called once with is-important');
  });

  test('element should have class applied when provided value is true to start with', async function(assert) {
    assert.expect(3);

    this.didTransitionIn = spy();
    this.didTransitionOut = spy();

    this.set('isImportant', true);

    await render(hbs`
      <div id="my-element" {{css-transition isImportant=this.isImportant didTransitionIn=this.didTransitionIn didTransitionOut=this.didTransitionOut}}>
        <p class="content">Çup?</p>
      </div>
    `);

    assert.dom('#my-element').hasClass('is-important', 'element starts with class applied');

    assert.ok(this.didTransitionIn.notCalled, 'didTransitionIn was not called');
    assert.ok(this.didTransitionOut.notCalled, 'didTransitionOut was not called');
  });

  test('can customize class while using the modifier', async function(assert) {
    assert.expect(12);

    this.set('isImportant', false);

    await render(hbs`
      <div id="my-element" class="some test classes" {{css-transition isImportant=this.isImportant}}>
        <p class="content">Çup?</p>
      </div>
    `);

    assert.dom('#my-element').hasClass('some', 'element has provided classes');
    assert.dom('#my-element').hasClass('test', 'element has provided classes');
    assert.dom('#my-element').hasClass('classes', 'element has provided classes');
    assert.dom('#my-element').doesNotHaveClass('is-important', 'still does not have transition class');

    this.set('isImportant', true);

    await waitFor('#my-element.is-important');

    assert.dom('#my-element').hasClass('some', 'element still has provided classes');
    assert.dom('#my-element').hasClass('test', 'element still has provided classes');
    assert.dom('#my-element').hasClass('classes', 'element still has provided classes');
    assert.dom('#my-element').hasClass('is-important', 'element has transitioned class');


    this.set('isImportant', false);

    await waitFor('#my-element:not(.is-important)');

    assert.dom('#my-element').hasClass('some', 'element has provided classes');
    assert.dom('#my-element').hasClass('test', 'element has provided classes');
    assert.dom('#my-element').hasClass('classes', 'element has provided classes');
    assert.dom('#my-element').doesNotHaveClass('is-important', 'does not have transition class');
  });
});
