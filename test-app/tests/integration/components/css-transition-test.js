import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, waitFor, waitUntil } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { spy } from 'sinon';

module('Integration | Component | transition group', function (hooks) {
  setupRenderingTest(hooks);

  module('Enter and leave via name', function () {
    let testCases = [
      {
        name: 'element',
        template: hbs`
        {{#if this.show}}
          <div id="my-element" {{css-transition "example" didTransitionIn=this.didTransitionIn didTransitionOut=this.didTransitionOut}}>
            <p class="content">Çup?</p>
          </div>
        {{/if}}
      `,
      },
      {
        name: 'classic component',
        template: hbs`
        {{#if this.show}}
          <MyComponent id="my-element" {{css-transition "example" didTransitionIn=this.didTransitionIn didTransitionOut=this.didTransitionOut}}>
            <p class="content">Çup?</p>
          </MyComponent>
        {{/if}}
      `,
      },
      {
        name: 'glimmer component',
        template: hbs`
        {{#if this.show}}
          <GlimmerComponent id="my-element" {{css-transition "example" didTransitionIn=this.didTransitionIn didTransitionOut=this.didTransitionOut}}>
            <p class="content">Çup?</p>
          </GlimmerComponent>
        {{/if}}
      `,
      },
    ];

    testCases.forEach((i) => {
      test(`enter and leave transitions work (${i.name})`, async function (assert) {
        assert.expect(23);

        this.didTransitionIn = spy();
        this.didTransitionOut = spy();

        this.set('show', false);

        await render(i.template);

        assert.dom('#my-element').doesNotExist('no element at first');
        assert.ok(
          this.didTransitionIn.notCalled,
          'didTransitionIn was not called'
        );
        assert.ok(
          this.didTransitionOut.notCalled,
          'didTransitionOut was not called'
        );

        this.set('show', true);

        assert.dom('#my-element').exists({ count: 1 }, 'element is rendered');
        assert.dom('.content').exists({ count: 1 }, 'its contents as well');

        assert
          .dom('#my-element')
          .hasClass('example-enter', '-enter is immediately applied');
        assert
          .dom('#my-element')
          .hasClass(
            'example-enter-active',
            '-enter-active is immediately applied'
          );
        assert
          .dom('#my-element')
          .doesNotHaveClass(
            'example-enter-to',
            '-enter-to is not immediately applied'
          );

        await waitFor('#my-element.example-enter-to');

        assert
          .dom('#my-element')
          .doesNotHaveClass('example-enter', '-enter was removed');
        assert
          .dom('#my-element')
          .hasClass('example-enter-active', '-enter-active is still applied');
        assert
          .dom('#my-element')
          .hasClass('example-enter-to', '-enter-to is applied');

        await waitFor('#my-element:not(.example-enter-active)');

        assert.ok(
          this.didTransitionIn.calledOnce,
          'didTransitionIn was called once'
        );
        assert.ok(
          this.didTransitionOut.notCalled,
          'didTransitionOut was not called'
        );

        this.set('show', false);

        await waitFor('#my-element_clone.example-leave');

        assert
          .dom('#my-element_clone')
          .hasClass('example-leave', '-leave is applied on clone');
        assert
          .dom('#my-element_clone')
          .hasClass(
            'example-leave-active',
            '-leave-active is applied on clone'
          );
        assert
          .dom('#my-element_clone')
          .doesNotHaveClass(
            'example-leave-to',
            '-leave-to is not yet applied on clone'
          );

        await waitFor('#my-element_clone.example-leave-to');

        assert
          .dom('#my-element_clone')
          .doesNotHaveClass(
            'example-leave',
            '-leave was removed from the clone'
          );
        assert
          .dom('#my-element_clone')
          .hasClass(
            'example-leave-active',
            '-leave-active is applied after `afterRender` and a browser repaint on clone'
          );
        assert
          .dom('#my-element_clone')
          .hasClass(
            'example-leave-to',
            '-leave-to is applied after `afterRender` and a browser repaint on clone'
          );

        assert
          .dom('#my-element')
          .doesNotExist('original element is not present');

        await waitUntil(() => {
          return find('#my-element_clone') === null;
        });

        assert.dom('#my-element_clone').doesNotExist('clone was removed');

        assert.ok(
          this.didTransitionIn.calledOnce,
          'didTransitionIn was called once total'
        );
        assert.ok(
          this.didTransitionOut.calledOnce,
          'didTransitionOut was called once total'
        );
      });

      test(`teardown after -enter-active is applied does not throw errors (${i.name})`, async function (assert) {
        assert.expect(6);

        this.didTransitionIn = spy();
        this.didTransitionOut = spy();

        this.set('show', false);

        await render(i.template);

        this.set('show', true);

        assert.dom('#my-element').exists({ count: 1 }, 'element is rendered');
        assert
          .dom('#my-element')
          .hasClass('example-enter', '-enter is immediately applied');

        await waitFor('#my-element.example-enter-active');

        this.set('show', false);

        assert.dom('#my-element').doesNotExist('element is removed');
        assert.ok(
          this.didTransitionIn.notCalled,
          'didTransitionIn was not called'
        );
        assert.ok(
          this.didTransitionOut.notCalled,
          'didTransitionOut was not called'
        );
        assert.dom('#my-element_clone').doesNotExist('clone was not created');
      });

      test(`teardown after -enter is applied does not throw errors (${i.name})`, async function (assert) {
        assert.expect(6);

        this.didTransitionIn = spy();
        this.didTransitionOut = spy();

        this.set('show', false);

        await render(i.template);

        this.set('show', true);

        assert.dom('#my-element').exists({ count: 1 }, 'element is rendered');
        assert
          .dom('#my-element')
          .hasClass('example-enter', '-enter is immediately applied');

        this.set('show', false);

        assert.dom('#my-element').doesNotExist('element is removed');
        assert.ok(
          this.didTransitionIn.notCalled,
          'didTransitionIn was not called'
        );
        assert.ok(
          this.didTransitionOut.notCalled,
          'didTransitionOut was not called'
        );
        assert.dom('#my-element_clone').doesNotExist('clone was not created');
      });
    });
  });

  module('Enter and leave via transition classes', function () {
    let testCases = [
      {
        name: 'element',
        template: hbs`
        {{#if this.show}}
          <div id="my-element" {{css-transition enterClass="opacity-0" enterActiveClass="duration-500" enterToClass="opacity-100" leaveClass="opacity-100" leaveActiveClass="duration-500" leaveToClass="opacity-0" didTransitionIn=this.didTransitionIn didTransitionOut=this.didTransitionOut}}>
            <p class="content">Çup?</p>
          </div>
        {{/if}}
      `,
      },
      {
        name: 'classic component',
        template: hbs`
        {{#if this.show}}
          <MyComponent id="my-element" {{css-transition enterClass="opacity-0" enterActiveClass="duration-500" enterToClass="opacity-100" leaveClass="opacity-100" leaveActiveClass="duration-500" leaveToClass="opacity-0" didTransitionIn=this.didTransitionIn didTransitionOut=this.didTransitionOut}}>
            <p class="content">Çup?</p>
          </MyComponent>
        {{/if}}
      `,
      },
      {
        name: 'glimmer component',
        template: hbs`
        {{#if this.show}}
          <GlimmerComponent id="my-element" {{css-transition enterClass="opacity-0" enterActiveClass="duration-500" enterToClass="opacity-100" leaveClass="opacity-100" leaveActiveClass="duration-500" leaveToClass="opacity-0" didTransitionIn=this.didTransitionIn didTransitionOut=this.didTransitionOut}}>
            <p class="content">Çup?</p>
          </GlimmerComponent>
        {{/if}}
      `,
      },
    ];

    testCases.forEach((i) => {
      test(`enter and leave transitions work (${i.name})`, async function (assert) {
        assert.expect(23);

        this.didTransitionIn = spy();
        this.didTransitionOut = spy();

        this.set('show', false);

        await render(i.template);

        assert.dom('#my-element').doesNotExist('no element at first');
        assert.ok(
          this.didTransitionIn.notCalled,
          'didTransitionIn was not called'
        );
        assert.ok(
          this.didTransitionOut.notCalled,
          'didTransitionOut was not called'
        );

        this.set('show', true);

        assert.dom('#my-element').exists({ count: 1 }, 'element is rendered');
        assert.dom('.content').exists({ count: 1 }, 'its contents as well');

        assert
          .dom('#my-element')
          .hasClass('opacity-0', '-enter is immediately applied');
        assert
          .dom('#my-element')
          .hasClass('duration-500', '-enter-active is immediately applied');
        assert
          .dom('#my-element')
          .doesNotHaveClass(
            'opacity-100',
            '-enter-to is not immediately applied'
          );

        await waitFor('#my-element.opacity-100');

        assert
          .dom('#my-element')
          .doesNotHaveClass('opacity-0', '-enter was removed');
        assert
          .dom('#my-element')
          .hasClass('duration-500', '-enter-active is still applied');
        assert
          .dom('#my-element')
          .hasClass('opacity-100', '-enter-to is applied');

        await waitFor('#my-element:not(.opacity-100)');

        assert.ok(
          this.didTransitionIn.calledOnce,
          'didTransitionIn was called once'
        );
        assert.ok(
          this.didTransitionOut.notCalled,
          'didTransitionOut was not called'
        );

        this.set('show', false);

        await waitFor('#my-element_clone.opacity-100');

        assert
          .dom('#my-element_clone')
          .hasClass('opacity-100', '-leave is applied on clone');
        assert
          .dom('#my-element_clone')
          .hasClass('duration-500', '-leave-active is applied on clone');
        assert
          .dom('#my-element_clone')
          .doesNotHaveClass(
            'opacity-0',
            '-leave-to is not yet applied on clone'
          );

        await waitFor('#my-element_clone.opacity-0');

        assert
          .dom('#my-element_clone')
          .doesNotHaveClass('opacity-100', '-leave was removed from the clone');
        assert
          .dom('#my-element_clone')
          .hasClass(
            'duration-500',
            '-leave-active is applied after `afterRender` and a browser repaint on clone'
          );
        assert
          .dom('#my-element_clone')
          .hasClass(
            'opacity-0',
            '-leave-to is applied after `afterRender` and a browser repaint on clone'
          );

        assert
          .dom('#my-element')
          .doesNotExist('original element is not present');

        await waitUntil(() => {
          return find('#my-element_clone') === null;
        });

        assert.dom('#my-element_clone').doesNotExist('clone was removed');

        assert.ok(
          this.didTransitionIn.calledOnce,
          'didTransitionIn was called once total'
        );
        assert.ok(
          this.didTransitionOut.calledOnce,
          'didTransitionOut was called once total'
        );
      });
    });
  });

  test('can disable the modifier by using isEnabled=false', async function (assert) {
    assert.expect(8);

    this.set('show', false);

    await render(hbs`
      {{#if this.show}}
        <div id="my-element" class="some test classes" {{css-transition name="example" isEnabled=false}}>
          <p class="content">Çup?</p>
        </div>
      {{/if}}
    `);

    assert.dom('#my-element').doesNotExist('no element at first');

    this.set('show', true);

    assert.dom('#my-element').exists({ count: 1 }, 'element is rendered');
    assert.dom('.content').exists({ count: 1 }, 'its contents as well');

    assert
      .dom('#my-element')
      .doesNotHaveClass('example-enter', '-enter is not applied');
    assert
      .dom('#my-element')
      .doesNotHaveClass('example-enter-active', '-enter-active is not applied');
    assert
      .dom('#my-element')
      .doesNotHaveClass('example-enter-to', '-enter-to is not applied');

    this.set('show', false);

    assert.dom('#my-element').doesNotExist('original element is not present');
    assert.dom('#my-element_clone').doesNotExist('clone was not added');
  });

  test('teardown by removal of the parent element', async function (assert) {
    this.set('show', true);
    render(hbs`
      {{#if this.show}}
        <div>
          <div id="my-element" {{css-transition name="example" didTransitionIn=this.didTransitionIn didTransitionOut=this.didTransitionOut}}>
            <p class="content">Çup?</p>
          </div>
        </div>
      {{/if}}
    `);
    await waitFor('#my-element.example-enter-active');
    await waitFor('#my-element:not(.example-enter)');
    this.set('show', false);
    assert.dom('#my-element').doesNotExist();
  });

  test('teardown after removal of sibling element', async function (assert) {
    this.set('show', true);
    this.set('showSibling', true);
    render(hbs`
      {{#if this.show}}
        <div>
          <div id="my-element" {{css-transition name="example" didTransitionIn=this.didTransitionIn didTransitionOut=this.didTransitionOut}}>
            <p class="content">Çup?</p>
          </div>
          {{#if this.showSibling}}
            <div data-test-sibling>Sibling element</div>
          {{/if}}
        </div>
      {{/if}}
    `);
    await waitFor('#my-element.example-enter-active');
    await waitFor('#my-element:not(.example-enter)');
    this.set('showSibling', false);
    assert.dom('[data-test-sibling]').doesNotExist();
    this.set('show', false);
    assert.dom('#my-element').doesNotExist();
  });
});
