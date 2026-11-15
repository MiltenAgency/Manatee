import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { setupDOM } from './dom.js';

test('studio identity uses local replacement assets and no former business links', t => {
  const { root, source } = setupDOM(t);
  const visibleText = root.textContent;
  assert.match(visibleText, /Tidewell/);
  assert.doesNotMatch(visibleText, /Manatee|Mass Save|Laminar|heat pump|National Grid|Eversource/i);
  assert.doesNotMatch(source.body, /\/assets\/|manatee\.energy|webflow|pinterest/i);
  for (const node of root.querySelectorAll('img[src]')) {
    assert.ok(node.getAttribute('alt'), 'Every content photograph has an accessible description');
    const path = node.getAttribute('src');
    assert.ok(path.startsWith('/images/tidewell-'));
    assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), `${path} exists`);
  }
  assert.match(visibleText, /AI generated design concepts/);
  assert.equal(root.querySelectorAll('blockquote').length, 0);
  assert.equal(root.querySelectorAll('[data-unit-tab]').length, root.querySelectorAll('[data-unit-image]').length);
  assert.equal(root.querySelectorAll('[data-process-tab]').length, root.querySelectorAll('[data-process-image]').length);
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
  assert.doesNotMatch(css, /\/assets\/|Figtree|Kalam|Inter[;,]/);
  assert.ok(existsSync(new URL('../public/fonts/OFL-Manrope.txt', import.meta.url)));
});
