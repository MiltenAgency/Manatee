import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { setupDOM } from './dom.js';

test('morphing FAQ preserves answers, restores focus, and cleans up across Strict Mode and reopening', async t => {
  const { root, window, media, onCleanup } = setupDOM(t);
  const previousAct = globalThis.IS_REACT_ACT_ENVIRONMENT;
  const previousGetStyle = globalThis.getComputedStyle;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  globalThis.getComputedStyle = window.getComputedStyle.bind(window);
  onCleanup(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousAct;
    globalThis.getComputedStyle = previousGetStyle;
  });
  window.HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
    this.querySelector('[autofocus]')?.focus();
  };
  window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
  // jsdom has no layout engine; transform geometry is checked separately below.
  window.DOMMatrixReadOnly = class { m41 = 0; m42 = 0; };
  const original = [...root.querySelectorAll('.faqs_list-item')].map(item => ({
    question: item.querySelector('.question-content').textContent.trim(),
    answer: item.querySelector('.text-size-regular').textContent.trim(),
  }));

  // Compile the client component using the Babel runtime already shipped with
  // Next. This exercises the real React and GSAP code without a test-only copy.
  const require = createRequire(import.meta.url);
  const { transformSync } = require('next/dist/compiled/babel/core');
  const { code } = transformSync(readFileSync(new URL('../app/morphing-faqs.js', import.meta.url), 'utf8'), {
    babelrc: false,
    configFile: false,
    presets: [[require('next/dist/compiled/babel/preset-react'), { runtime: 'automatic' }]],
  });
  const resolved = code.replace(/from ['"]([^'"]+)['"]/g, (_, specifier) => {
    const url = specifier.startsWith('.')
      ? new URL('../app/morphing-faqs-motion.js', import.meta.url).href
      : import.meta.resolve(specifier);
    return `from ${JSON.stringify(url)}`;
  });
  const { default: Mount } = await import(`data:text/javascript;base64,${Buffer.from(resolved).toString('base64')}`);
  const { createElement, StrictMode, act } = await import('react');
  const { createRoot } = await import('react-dom/client');
  const { gsap } = await import('gsap');
  const host = document.createElement('div');
  document.body.append(host);
  const reactRoot = createRoot(host);
  onCleanup(() => {
    act(() => reactRoot.unmount());
    gsap.ticker.sleep();
  });
  const finish = () => act(() => {
    gsap.globalTimeline.getChildren(false, false, true).forEach(timeline => timeline.progress(1));
  });

  await act(() => reactRoot.render(createElement(StrictMode, null, createElement(Mount))));
  const buttons = [...root.querySelectorAll('.morph-faq-row')];
  assert.equal(buttons.length, original.length);
  assert.equal(root.querySelectorAll('.morph-faq-layout').length, 1);
  const dialog = document.getElementById('morph-faq-dialog');
  assert.equal(dialog.hasAttribute('open'), false);

  for (const index of [0, 7, 2]) {
    media.matches = index === 7; // Exercise both full and reduced motion paths.
    document.body.style.overflow = 'auto';
    buttons[index].focus();
    await act(() => buttons[index].click());
    assert.equal(dialog.hasAttribute('open'), true);
    assert.equal(buttons[index].getAttribute('aria-expanded'), 'true');
    assert.equal(document.getElementById('morph-faq-title').textContent, original[index].question);
    assert.equal(document.getElementById('morph-faq-answer').textContent, original[index].answer);
    assert.equal(document.body.style.overflow, 'hidden');
    // First question closes during its opening animation; the others settle.
    if (index !== 0) await finish();
    await act(() => {
      if (index === 7) dialog.querySelector('.morph-backdrop').click();
      else dialog.dispatchEvent(new window.Event('cancel', { cancelable: true }));
    });
    await finish();
    assert.equal(dialog.hasAttribute('open'), false);
    assert.equal(document.body.style.overflow, 'auto');
    assert.equal(document.activeElement, buttons[index]);
    assert.equal(buttons[index].getAttribute('aria-expanded'), 'false');
  }

  await act(() => buttons[3].click());
  await act(() => reactRoot.render(null));
  assert.equal(document.body.style.overflow, 'auto');
  assert.equal(document.querySelector('dialog[open]'), null);
});

test('morph coordinates move and scale a panel into the measured thumbnail', async t => {
  const { window } = setupDOM(t);
  const { morphFrom, morphTo } = await import('../app/morphing-faqs-motion.js');
  const origin = { getBoundingClientRect: () => ({ left: 100, top: 220, width: 40, height: 48 }) };
  const element = document.createElement('div');
  document.body.append(element);
  element.getBoundingClientRect = () => ({ left: 300, top: 100, width: 320, height: 480 });
  Object.defineProperties(element, { offsetWidth: { value: 320 }, offsetHeight: { value: 480 } });
  const expected = { x: -200, y: 120, scaleX: 0.125, scaleY: 0.1, transformOrigin: 'top left' };
  assert.deepEqual(morphFrom(origin, element), expected);
  assert.deepEqual(morphTo(element, origin), expected);
  element.style.transform = 'matrix(0.5, 0, 0, 0.5, -100, 60)';
  window.DOMMatrixReadOnly = class { m41 = -100; m42 = 60; };
  element.getBoundingClientRect = () => ({ left: 200, top: 160, width: 160, height: 240 });
  assert.deepEqual(morphTo(element, origin), expected);
});
