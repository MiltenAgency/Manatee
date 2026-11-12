import test from 'node:test';
import assert from 'node:assert/strict';
import { setupDOM } from './dom.js';
import { setupSiteControls } from '../app/site-controls.js';

test('quote and newsletter handling stays scoped and never captures a dialog form', t => {
  const { window, root, onCleanup } = setupDOM(t);
  const opened = [];
  const cleanup = setupSiteControls(root, title => opened.push(title));
  onCleanup(cleanup);
  root.querySelector('.nav_button').click();
  assert.deepEqual(opened, ['Get a quote']);
  const form = root.querySelector('.form-footer');
  form.querySelector('[type=email]').value = 'not-an-email';
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  assert.equal(opened.length, 1);
  form.querySelector('[type=email]').value = 'hello@example.com';
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  assert.equal(opened.at(-1), 'Newsletter preview');
  const dialogForm = document.createElement('form');
  document.body.append(dialogForm);
  assert.equal(dialogForm.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })), true);
  assert.equal(opened.length, 2);
});

test('FAQ keyboard-ready buttons toggle a single panel and listeners clean up', t => {
  const { root } = setupDOM(t);
  const cleanup = setupSiteControls(root, () => {});
  const buttons = [...root.querySelectorAll('.dropdown_faqs-toggle')];
  buttons[1].click();
  assert.equal(buttons[0].getAttribute('aria-expanded'), 'false');
  assert.equal(document.getElementById(buttons[0].getAttribute('aria-controls')).hidden, true);
  assert.equal(buttons[1].getAttribute('aria-expanded'), 'true');
  buttons[1].click();
  assert.equal(buttons[1].getAttribute('aria-expanded'), 'false');
  cleanup();
  buttons[1].click();
  assert.equal(buttons[1].getAttribute('aria-expanded'), 'false');
});

test('mobile menu supports escape, focus wrapping, resize, and scroll restoration', t => {
  const { window, root, media } = setupDOM(t);
  media.matches = true;
  document.body.style.overflow = 'auto';
  const cleanup = setupSiteControls(root, () => {});
  const toggle = root.querySelector('.nav_hamburger');
  toggle.click();
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(document.body.style.overflow, 'hidden');
  toggle.focus();
  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true }));
  assert.equal(document.activeElement, [...root.querySelectorAll('.nav_menu a')].at(-1));
  toggle.focus();
  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Tab', cancelable: true }));
  assert.equal(document.activeElement, root.querySelector('.nav_menu a'));
  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
  assert.equal(document.activeElement, toggle);
  assert.equal(document.body.style.overflow, 'auto');
  toggle.click();
  media.matches = false;
  media.dispatchEvent(new window.Event('change'));
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  cleanup();
  assert.equal(document.body.style.overflow, 'auto');
});

test('page has unique IDs, labeled controls, and resolved internal links', t => {
  const { root } = setupDOM(t);
  const ids = [...root.querySelectorAll('[id]')].map(node => node.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const link of root.querySelectorAll('a[href^="#"]')) assert.ok(root.querySelector(link.getAttribute('href')));
  for (const input of root.querySelectorAll('input')) assert.ok(input.getAttribute('aria-label'));
  for (const button of root.querySelectorAll('button')) assert.equal(button.type, 'button');
});
