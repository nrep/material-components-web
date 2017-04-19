/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';
import {createMockRaf} from '../helpers/raf';
import {supportsCssVariables} from '../../../packages/mdc-ripple/util';
import {MDCTab} from '../../../packages/mdc-tabs/tab';

function getFixture() {
  return bel`
    <div>
      <a class="mdc-tab mdc-tab--active" href="#one">Item One</a>
    </div>`;
}

function setupTest() {
  const fixture = getFixture();
  const root = fixture.querySelector('.mdc-tab');
  const component = new MDCTab(root);
  return {fixture, root, component};
}

suite('MDCTab');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCTab.attachTo(getFixture()) instanceof MDCTab);
});

if (supportsCssVariables(window)) {
  test('#destroy cleans up ripple on tab', () => {
    const raf = createMockRaf();
    const {root, component} = setupTest();

    raf.flush();

    component.destroy();
    raf.flush();

    assert.isFalse(root.classList.contains('mdc-ripple-upgraded'));
    raf.restore();
  });
}

test('#get computedWidth returns computed width', () => {
  const {component} = setupTest();

  assert.equal(component.computedWidth, 0);
});

test('#get computedLeft returns computed left offset', () => {
  const {component} = setupTest();

  assert.equal(component.computedLeft, 0);
});

test('#get/set isActive', () => {
  const {component} = setupTest();

  assert.isFalse(component.isActive);
  component.isActive = true;
  assert.isTrue(component.isActive);
});

test('#get/set preventDefaultOnClick', () => {
  const {component} = setupTest();

  assert.isFalse(component.preventDefaultOnClick);
  component.preventDefaultOnClick = true;
  assert.isTrue(component.preventDefaultOnClick);
});

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(root.classList.contains('foo'));
});

test('adapter#registerInteractionHandler adds an event listener to the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerInteractionHandler('click', handler);
  domEvents.emit(root, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterInteractionHandler removes an event listener from the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');
  root.addEventListener('click', handler);

  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('click', handler);
  domEvents.emit(root, 'click');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#getOffsetWidth returns the width of the tab', () => {
  const {component} = setupTest();

  assert.equal(component.getDefaultFoundation().adapter_.getOffsetWidth(), 0);
});

test('adapter#getOffsetLeft returns the distance that '+
  'the left edge of the tab is from the left edge of the frame', () => {
  const {component} = setupTest();

  assert.equal(component.getDefaultFoundation().adapter_.getOffsetLeft(), 0);
});

test('adapter#notifySelected emits MDCTab:selected', () => {
  const {component} = setupTest();

  const handler = td.func('acceptHandler');

  component.listen('MDCTab:selected', handler);
  component.getDefaultFoundation().adapter_.notifySelected();

  td.verify(handler(td.matchers.anything()));
});
