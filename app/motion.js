'use client';
import {useEffect} from 'react';

// All animation controllers return cleanup for React Strict Mode and navigation.
export function useReferenceMotion() {
  useEffect(setupReferenceMotion, []);
}

export function setupReferenceMotion() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cleanups = [];
  const animations = new Set();
  const listen = (node, event, fn) => {
    node.addEventListener(event, fn);
    cleanups.push(() => node.removeEventListener(event, fn));
  };
  const animate = (node, frames, options) => {
    if (reduced.matches || !node?.animate) return;
    const animation = node.animate(frames, options);
    animations.add(animation);
    animation.finished.catch(() => {}).finally(() => animations.delete(animation));
    return animation;
  };
  const curve = 'cubic-bezier(.22,1,.36,1)';

  function selector(kind) {
    const tabs = [...document.querySelectorAll(`[data-${kind}-tab]`)];
    const images = [...document.querySelectorAll(`[data-${kind}-image]`)];
    if (!tabs.length || images.length !== tabs.length) return;
    let active = 0;
    let imageAnimation;
    const select = (index, motion = true) => {
      const previous = active;
      images.forEach(image => image.getAnimations?.().forEach(animation => animation.cancel()));
      active = index;
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-expanded', String(i === index));
        const text = tab.querySelector('span');
        if (text) text.hidden = i !== index;
        if (text && i === index && motion) {
          animate(text, [{opacity: 0, transform:'translateY(8px)'}, {opacity:1, transform:'translateY(0)'}], {duration:500, easing:curve});
        }
      });
      imageAnimation?.cancel();
      images.forEach((image, i) => {
        image.hidden = i !== index && i !== previous;
        image.style.zIndex = i === index ? '2' : '1';
        image.setAttribute('aria-hidden', String(i !== index));
      });
      if (motion && index !== previous) {
        const frames = [{transform:'translateY(100%)', opacity:kind === 'unit' ? 0 : 1}, {transform:'translateY(0)', opacity:1}];
        imageAnimation = animate(images[index], frames, {duration:900, easing:curve});
        if (kind === 'unit') animate(images[previous], [{transform:'translateY(0)', opacity:1}, {transform:'translateY(-100%)', opacity:0}], {duration:900, easing:curve});
        if (imageAnimation) imageAnimation.finished.then(() => {
          images.forEach((image, i) => { image.hidden = i !== active; });
        }).catch(() => {});
        else images.forEach((image, i) => { image.hidden = i !== index; });
      } else images.forEach((image, i) => { image.hidden = i !== index; });
    };
    select(0, false);
    tabs.forEach((tab, i) => {
      listen(tab, 'click', () => { focused = false; select(i); restart(); });
      listen(tab, 'keydown', event => {
        let next;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (active + 1) % tabs.length;
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (active + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); tabs[next].focus(); select(next); restart(); }
      });
    });
    let progress;
    let visible = false;
    let paused = false;
    let focused = false;
    const canPlay = () => visible && !paused && !focused && !document.hidden && !reduced.matches;
    function restart() {
      progress?.cancel();
      progress = undefined;
      if (reduced.matches) return;
      const bar = tabs[active].querySelector('.pin-progress');
      // One animation is the clock for both the line and tab selection.
      // Constant speed makes its visible fill proportional to elapsed time.
      const cycle = animate(bar, [{transform:'scaleX(0)'}, {transform:'scaleX(1)'}], {duration:5000, easing:'cubic-bezier(0,0,1,1)', fill:'forwards'});
      progress = cycle;
      if (!cycle) return;
      if (!canPlay()) cycle.pause();
      cycle.finished.then(() => {
        if (progress !== cycle) return;
        select((active + 1) % tabs.length);
        restart();
      }).catch(() => {});
    }
    function syncPlayback() {
      if (reduced.matches) {
        progress?.cancel();
        progress = undefined;
      } else if (!progress) {
        if (canPlay()) restart();
      } else if (canPlay()) {
        if (progress.playState === 'paused') progress.play();
      } else {
        progress.pause();
      }
    }
    {
      tabs.forEach(tab => {
        const bar = document.createElement('i');
        bar.className = 'pin-progress';
        bar.setAttribute('aria-hidden', 'true');
        tab.appendChild(bar);
        cleanups.push(() => bar.remove());
      });
      const section = document.querySelector(kind === 'unit' ? '.pin-units' : '.pin-process');
      const observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        syncPlayback();
      }, {threshold:.3});
      observer.observe(images[0].parentElement);
      const toggle = section.querySelector('.pin-autoplay');
      listen(toggle, 'click', () => {
        paused = !paused;
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.textContent = paused ? 'Play slideshow' : 'Pause slideshow';
        syncPlayback();
      });
      listen(section, 'focusin', event => {focused = event.target.matches(':focus-visible'); syncPlayback();});
      listen(section, 'focusout', event => {
        if (!section.contains(event.relatedTarget)) {focused = false; syncPlayback();}
      });
      listen(document, 'visibilitychange', syncPlayback);
      listen(reduced, 'change', () => {
        if (reduced.matches) select(active, false);
        syncPlayback();
      });
      cleanups.push(() => {progress?.cancel(); progress = undefined; observer.disconnect();});
    }
  }
  selector('unit');
  selector('process');

  const units = document.querySelector('.pin-installation-stack .pin-units');
  if (units) {
    const measure = () => units.style.setProperty('--units-pin-top', `${Math.min(80, innerHeight - units.offsetHeight - 24)}px`);
    const resize = new ResizeObserver(measure);
    resize.observe(units);
    listen(window, 'resize', measure);
    measure();
    cleanups.push(() => {resize.disconnect(); units.style.removeProperty('--units-pin-top');});
  }

  // Sticky positioning supplies the overlap; only the hero artwork/content
  // transforms while the lifestyle panel moves over it in normal flow.
  const hero = document.querySelector('.pin-hero-stack .section_home-header');
  const benefits = document.querySelector('.section_home-benefits');
  if (hero && benefits) {
    let frame = 0;
    let inView = true;
    const measure = () => {
      hero.style.setProperty('--hero-pin-top', `${Math.min(0, innerHeight - hero.offsetHeight)}px`);
    };
    const paint = () => {
      frame = 0;
      if (!inView) return;
      const progress = reduced.matches ? 0 : Math.min(1, Math.max(0, 1 - benefits.getBoundingClientRect().top / innerHeight));
      hero.style.setProperty('--hero-cover', progress.toFixed(4));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const visibility = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      schedule();
    });
    visibility.observe(hero.parentElement);
    const resize = new ResizeObserver(() => {measure(); schedule();});
    resize.observe(hero);
    listen(window, 'scroll', schedule);
    listen(window, 'resize', () => {measure(); schedule();});
    listen(reduced, 'change', schedule);
    measure(); paint();
    cleanups.push(() => {
      cancelAnimationFrame(frame);
      visibility.disconnect(); resize.disconnect();
      hero.style.removeProperty('--hero-cover');
      hero.style.removeProperty('--hero-pin-top');
    });
  }

  const marquee = document.querySelector('.pin-logo-marquee');
  const logoToggle = document.querySelector('.pin-logo-pause');
  if (marquee && logoToggle) {
    listen(logoToggle, 'click', () => {
      const paused = logoToggle.getAttribute('aria-pressed') !== 'true';
      logoToggle.setAttribute('aria-pressed', String(paused));
      logoToggle.textContent = paused ? 'Play logos' : 'Pause logos';
      marquee.classList.toggle('is-paused', paused);
    });
  }

  const track = document.querySelector('.pin-story-track');
  if (track) {
    const buttons = [...document.querySelectorAll('[data-story-direction]')];
    const update = () => {
      buttons[0].disabled = track.scrollLeft < 4;
      buttons[1].disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    };
    buttons.forEach(button => listen(button, 'click', () => {
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      const step = track.children[0].getBoundingClientRect().width + gap;
      track.scrollBy({left:Number(button.dataset.storyDirection) * step, behavior:reduced.matches ? 'instant' : 'smooth'});
    }));
    listen(track, 'scroll', update);
    const resize = new ResizeObserver(update);
    resize.observe(track);
    cleanups.push(() => resize.disconnect());
    update();
  }

  const revealTargets = document.querySelectorAll('.benefits_card, .pin-stories-heading, .pin-partners, .pin-process > h2, .pin-process > p');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('pin-visible');
    observer.unobserve(entry.target);
  }), {threshold:.12});
  revealTargets.forEach((node, i) => {
    node.classList.add('pin-enter');
    node.style.setProperty('--reveal-delay', `${node.classList.contains('benefits_card') ? i % 3 * 90 : 0}ms`);
    observer.observe(node);
  });
  cleanups.push(() => {observer.disconnect(); revealTargets.forEach(node => node.classList.remove('pin-enter', 'pin-visible'));});

  // Activate the community benefit word by word as it reaches the viewport.
  const heading = document.querySelector('.pin-word-reveal');
  if (heading) {
    const original = heading.innerHTML;
    const fragment = document.createDocumentFragment();
    [...heading.childNodes].forEach(node => {
      if (node.nodeType !== 3) { fragment.append(node.cloneNode(true)); return; }
      node.textContent.split(/(\s+)/).filter(Boolean).forEach(word => {
        if (/^\s+$/.test(word)) { fragment.append(document.createTextNode(word)); return; }
        const span = document.createElement('span');
        span.textContent = word;
        fragment.append(span);
      });
    });
    heading.replaceChildren(fragment);
    const words = [...heading.querySelectorAll('span')];
    let frame = 0;
    const paint = () => {
      frame = 0;
      const rect = heading.getBoundingClientRect();
      const fraction = Math.min(1, Math.max(0, (innerHeight * .85 - rect.top) / (innerHeight * .3)));
      words.forEach((word, i) => word.classList.toggle('is-lit', reduced.matches || fraction > i / words.length));
    };
    const schedule = () => {if (!frame) frame = requestAnimationFrame(paint);};
    listen(window, 'scroll', schedule);
    listen(window, 'resize', schedule);
    listen(reduced, 'change', schedule);
    paint();
    cleanups.push(() => {cancelAnimationFrame(frame); heading.innerHTML = original;});
  }
  return () => {cleanups.forEach(cleanup => cleanup()); animations.forEach(animation => animation.cancel());};
}
