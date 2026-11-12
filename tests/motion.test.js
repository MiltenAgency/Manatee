import test from 'node:test';
import assert from 'node:assert/strict';
import { setupReferenceMotion } from '../app/motion.js';
import { setupDOM } from './dom.js';

const settle = () => new Promise(resolve => setImmediate(resolve));

test('selectors share a five-second animation clock and survive cleanup/reinitialization', async t => {
  const { window, root, media, observers, onCleanup } = setupDOM(t);
  const animations = new Set();
  window.Element.prototype.animate = function (frames, options) {
    const animation = {
      target: this, options, frames, currentTime: 0, playState: 'running',
      pause() { this.playState = 'paused'; },
      play() { this.playState = 'running'; },
      cancel() { this.playState = 'idle'; this.reject(new Error('cancelled')); animations.delete(this); },
    };
    animation.finished = new Promise((resolve, reject) => { animation.resolve = resolve; animation.reject = reject; });
    animations.add(animation);
    return animation;
  };
  window.Element.prototype.getAnimations = function () {
    return [...animations].filter(animation => animation.target === this);
  };
  const advance = async milliseconds => {
    for (const animation of [...animations]) {
      if (animation.playState !== 'running') continue;
      animation.currentTime += milliseconds;
      if (animation.currentTime >= animation.options.duration) {
        animation.playState = 'finished'; animations.delete(animation); animation.resolve();
      }
    }
    await settle();
  };
  const cleanup = setupReferenceMotion();
  onCleanup(cleanup);
  for (const kind of ['unit', 'process']) {
    const tabs = [...root.querySelectorAll(`[data-${kind}-tab]`)];
    const images = root.querySelector(`[data-${kind}-image]`).parentElement;
    const observer = observers.find(observer => observer.targets.includes(images));
    observer.callback([{ isIntersecting: true }]);
    const active = () => tabs.findIndex(tab => tab.getAttribute('aria-expanded') === 'true');
    const cycle = () => [...animations].find(animation => animation.target === tabs[active()].querySelector('.pin-progress'));
    assert.equal(cycle().options.easing, 'cubic-bezier(0,0,1,1)');
    await advance(4999); assert.equal(active(), 0);
    await advance(1); assert.equal(active(), 1);
    const progress = cycle();
    const elapsed = progress.currentTime;
    observer.callback([{ isIntersecting: false }]);
    await advance(10000); assert.equal(progress.currentTime, elapsed);
    observer.callback([{ isIntersecting: true }]); assert.equal(cycle(), progress);
    tabs.at(-1).click(); await advance(5000); assert.equal(active(), 0);
    media.matches = true; media.dispatchEvent(new window.Event('change'));
    assert.equal(cycle(), undefined);
    media.matches = false; media.dispatchEvent(new window.Event('change'));
  }
  cleanup(); await settle();
  assert.equal(animations.size, 0);
  assert.equal(root.querySelectorAll('.pin-progress').length, 0);
  const cleanupAgain = setupReferenceMotion();
  assert.equal(root.querySelectorAll('.pin-progress').length, 7);
  cleanupAgain(); await settle();
});
