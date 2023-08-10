import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  rerender,
  find,
  waitFor,
  waitUntil,
} from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import { spy } from 'sinon';
import MyComponent from 'test-app/components/my-component';
import GlimmerComponent from 'test-app/components/glimmer-component';
import { cssTransition } from 'ember-css-transitions';

module('Integration | Component | transition group', function (hooks) {
  setupRenderingTest(hooks);

  class State {
    @tracked show = false;
    @tracked showSibling = false;
    didTransitionIn;
    didTransitionOut;
  }

  /** @type {State} */
  let state;

  hooks.beforeEach(function () {
    state = new State();
  });

  module('Enter and leave via name', function () {
    let testCases = [
      {
        name: 'element',
        template: <template>
          {{#if state.show}}
            <div id="my-element" {{cssTransition "example" didTransitionIn=state.didTransitionIn didTransitionOut=state.didTransitionOut}}>
              <p class="content">Çup?</p>
            </div>
          {{/if}}
        </template>,
      },
      {
        name: 'classic component',
        template: <template>
          {{#if state.show}}
            <MyComponent id="my-element" {{cssTransition "example" didTransitionIn=state.didTransitionIn didTransitionOut=state.didTransitionOut}}>
              <p class="content">Çup?</p>
            </MyComponent>
          {{/if}}
        </template>,
      },
      {
        name: 'glimmer component',
        template: <template>
          {{#if state.show}}
            <GlimmerComponent id="my-element" {{cssTransition "example" didTransitionIn=state.didTransitionIn didTransitionOut=state.didTransitionOut}}>
              <p class="content">Çup?</p>
            </GlimmerComponent>
          {{/if}}
        </template>,
      },
    ];

    testCases.forEach((i) => {
      test(`enter and leave transitions work (${i.name})`, async function (assert) {
        state.didTransitionIn = spy();
        state.didTransitionOut = spy();

        state.show = false;

        await render(i.template);

        assert.dom('#my-element').doesNotExist('no element at first');
        assert.ok(
          state.didTransitionIn.notCalled,
          'didTransitionIn was not called'
        );
        assert.ok(
          state.didTransitionOut.notCalled,
          'didTransitionOut was not called'
        );

        state.show = true;
        await rerender();

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
          state.didTransitionIn.calledOnce,
          'didTransitionIn was called once'
        );
        assert.ok(
          state.didTransitionOut.notCalled,
          'didTransitionOut was not called'
        );

        state.show = false;

        // waitFor may run too late and cause false-negative test failure.
        await new Promise((resolve) =>
          window.requestAnimationFrame(() => resolve())
        );
        if (!find('#my-element_clone.example-leave')) {
          await waitFor('#my-element_clone.example-leave');
        }

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
          state.didTransitionIn.calledOnce,
          'didTransitionIn was called once total'
        );
        assert.ok(
          state.didTransitionOut.calledOnce,
          'didTransitionOut was called once total'
        );
      });

      test(`teardown after -enter-active is applied does not throw errors (${i.name})`, async function (assert) {
        state.didTransitionIn = spy();
        state.didTransitionOut = spy();

        state.show = false;

        await render(i.template);

        state.show = true;
        await rerender();

        assert.dom('#my-element').exists({ count: 1 }, 'element is rendered');
        assert
          .dom('#my-element')
          .hasClass('example-enter', '-enter is immediately applied');

        await waitFor('#my-element.example-enter-active');

        state.show = false;
        await rerender();

        assert.dom('#my-element').doesNotExist('element is removed');
        assert.ok(
          state.didTransitionIn.notCalled,
          'didTransitionIn was not called'
        );
        assert.ok(
          state.didTransitionOut.notCalled,
          'didTransitionOut was not called'
        );
        assert.dom('#my-element_clone').doesNotExist('clone was not created');
      });

      test(`teardown after -enter is applied does not throw errors (${i.name})`, async function (assert) {
        state.didTransitionIn = spy();
        state.didTransitionOut = spy();

        state.show = false;

        await render(i.template);

        state.show = true;
        await rerender();

        assert.dom('#my-element').exists({ count: 1 }, 'element is rendered');
        assert
          .dom('#my-element')
          .hasClass('example-enter', '-enter is immediately applied');

        state.show = false;
        await rerender();

        assert.dom('#my-element').doesNotExist('element is removed');
        assert.ok(
          state.didTransitionIn.notCalled,
          'didTransitionIn was not called'
        );
        assert.ok(
          state.didTransitionOut.notCalled,
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
        template: <template>
          {{#if state.show}}
            <div id="my-element" {{cssTransition enterClass="opacity-0" enterActiveClass="duration-500" enterToClass="opacity-100" leaveClass="opacity-100" leaveActiveClass="duration-500" leaveToClass="opacity-0" didTransitionIn=state.didTransitionIn didTransitionOut=state.didTransitionOut}}>
              <p class="content">Çup?</p>
            </div>
          {{/if}}
        </template>,
      },
      {
        name: 'classic component',
        template: <template>
          {{#if state.show}}
            <MyComponent id="my-element" {{cssTransition enterClass="opacity-0" enterActiveClass="duration-500" enterToClass="opacity-100" leaveClass="opacity-100" leaveActiveClass="duration-500" leaveToClass="opacity-0" didTransitionIn=state.didTransitionIn didTransitionOut=state.didTransitionOut}}>
              <p class="content">Çup?</p>
            </MyComponent>
          {{/if}}
        </template>,
      },
      {
        name: 'glimmer component',
        template: <template>
          {{#if state.show}}
            <GlimmerComponent id="my-element" {{cssTransition enterClass="opacity-0" enterActiveClass="duration-500" enterToClass="opacity-100" leaveClass="opacity-100" leaveActiveClass="duration-500" leaveToClass="opacity-0" didTransitionIn=state.didTransitionIn didTransitionOut=state.didTransitionOut}}>
              <p class="content">Çup?</p>
            </GlimmerComponent>
          {{/if}}
        </template>,
      },
    ];

    testCases.forEach((i) => {
      test(`enter and leave transitions work (${i.name})`, async function (assert) {
        state.didTransitionIn = spy();
        state.didTransitionOut = spy();

        state.show = false;

        await render(i.template);

        assert.dom('#my-element').doesNotExist('no element at first');
        assert.ok(
          state.didTransitionIn.notCalled,
          'didTransitionIn was not called'
        );
        assert.ok(
          state.didTransitionOut.notCalled,
          'didTransitionOut was not called'
        );

        state.show = true;
        await rerender();

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
          state.didTransitionIn.calledOnce,
          'didTransitionIn was called once'
        );
        assert.ok(
          state.didTransitionOut.notCalled,
          'didTransitionOut was not called'
        );

        state.show = false;

        // waitFor may run too late and cause false-negative test failure.
        await new Promise((resolve) =>
          window.requestAnimationFrame(() => resolve())
        );
        if (!find('#my-element_clone.opacity-100')) {
          await waitFor('#my-element_clone.opacity-100');
        }

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
          state.didTransitionIn.calledOnce,
          'didTransitionIn was called once total'
        );
        assert.ok(
          state.didTransitionOut.calledOnce,
          'didTransitionOut was called once total'
        );
      });
    });
  });

  test('can disable the modifier by using isEnabled=false', async function (assert) {
    state.show = false;

    await render(
      <template>
        {{#if state.show}}
          <div id="my-element" class="some test classes" {{cssTransition name="example" isEnabled=false}}>
            <p class="content">Çup?</p>
          </div>
        {{/if}}
      </template>
    );

    assert.dom('#my-element').doesNotExist('no element at first');

    state.show = true;
    await rerender();

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

    state.show = false;
    await rerender();

    assert.dom('#my-element').doesNotExist('original element is not present');
    assert.dom('#my-element_clone').doesNotExist('clone was not added');
  });

  test('teardown by removal of the parent element', async function (assert) {
    state.show = true;

    render(
      <template>
        {{#if state.show}}
          <div>
            <div id="my-element" {{cssTransition name="example" didTransitionIn=state.didTransitionIn didTransitionOut=state.didTransitionOut}}>
              <p class="content">Çup?</p>
            </div>
          </div>
        {{/if}}
      </template>
    );

    await waitFor('#my-element.example-enter-active');
    await waitFor('#my-element:not(.example-enter)');

    state.show = false;
    await rerender();

    assert.dom('#my-element').doesNotExist();
  });

  test('teardown after removal of sibling element', async function (assert) {
    state.show = true;
    state.showSibling = true;

    render(
      <template>
        {{#if state.show}}
          <div>
            <div id="my-element" {{cssTransition name="example" didTransitionIn=state.didTransitionIn didTransitionOut=state.didTransitionOut}}>
              <p class="content">Çup?</p>
            </div>
            {{#if state.showSibling}}
              <div data-test-sibling>Sibling element</div>
            {{/if}}
          </div>
        {{/if}}
      </template>
    );

    await waitFor('#my-element.example-enter-active');
    await waitFor('#my-element:not(.example-enter)');

    state.showSibling = false;
    await rerender();

    assert.dom('[data-test-sibling]').doesNotExist();

    state.show = false;
    await rerender();

    assert.dom('#my-element').doesNotExist();
  });

  test('leave transitions via classes', async function (assert) {
    state.show = true;

    await render(
      <template>
        {{#if state.show}}
          <div id="real-parent" class="random-class">
            <div
              id="my-element"
              {{cssTransition
                leaveClass="opacity-100"
                leaveActiveClass="duration-1000"
                leaveToClass="opacity-0"
                parentSelector=".random-class"
              }}
            >
              <p class="content">Çup?</p>
            </div>
          </div>
        {{/if}}
      </template>
    );

    assert.dom('#my-element').exists({ count: 1 }, 'element is rendered');

    state.show = false;

    await waitFor('#real-parent_clone');

    assert.dom('#my-element_clone').doesNotExist('normal clone does not exist');

    assert
      .dom('#real-parent_clone')
      .exists({ count: 1 }, 'element clone is still rendered');

    assert
      .dom('#my-element')
      .exists({ count: 1 }, 'child element is still rendered');
  });
});
