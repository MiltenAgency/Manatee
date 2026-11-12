import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const source = JSON.parse(readFileSync(new URL('../source/site.json', import.meta.url)));

export function setupDOM(t) {
  const dom = new JSDOM(`<div id="site-shell">${source.body}</div>`, {
    url: 'http://localhost:3000', pretendToBeVisual: true,
  });
  const { window } = dom;
  const media = new window.EventTarget();
  media.matches = false;
  window.matchMedia = () => media;
  const observers = [];
  class Observer {
    constructor(callback) { this.callback = callback; this.targets = []; observers.push(this); }
    observe(target) { this.targets.push(target); }
    unobserve() {}
    disconnect() { this.disconnected = true; }
  }
  const replacements = {
    window, document: window.document, Element: window.Element,
    HTMLElement: window.HTMLElement, HTMLFormElement: window.HTMLFormElement,
    innerHeight: 759, IntersectionObserver: Observer, ResizeObserver: Observer,
    requestAnimationFrame: window.requestAnimationFrame.bind(window),
    cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
  };
  const cleanups = [];
  const previous = new Map();
  for (const [key, value] of Object.entries(replacements)) {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  t.after(() => {
    cleanups.reverse().forEach(cleanup => cleanup());
    dom.window.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  return { onCleanup: cleanup => cleanups.push(cleanup), window, root: window.document.getElementById('site-shell'), media, observers, source };
}
