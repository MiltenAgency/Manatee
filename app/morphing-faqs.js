'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { morphFrom, morphTo } from './morphing-faqs-motion';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP);

// Enhance the repository's static FAQ in place. Its original questions and
// answers remain server rendered and readable before the client is ready.
export default function MorphingFaqsMount() {
  const [mount, setMount] = useState(null);
  useEffect(() => {
    const target = document.querySelector('#site-shell .faqs-content');
    if (!target) return;
    const items = [...target.querySelectorAll('.faqs_list-item')].map(item => ({
      question: item.querySelector('.question-content').textContent.trim(),
      answer: item.querySelector('.text-size-regular').textContent.trim(),
      topic: item.dataset.topic,
      image: item.dataset.image,
      fit: 'cover',
    }));
    if (!items.length) return;
    target.replaceChildren();
    target.classList.add('has-morphing-faqs');
    setMount({ target, items });
  }, []);
  return mount ? createPortal(<MorphingFaqs items={mount.items} />, mount.target) : null;
}

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function MorphingFaqs({ items }) {
  const scope = useRef(null);
  const dialog = useRef(null);
  const surface = useRef(null);
  const image = useRef(null);
  const title = useRef(null);
  const meta = useRef(null);
  const detail = useRef(null);
  const closeButton = useRef(null);
  const backdrop = useRef(null);
  const rows = useRef([]);
  const thumbnails = useRef([]);
  const titles = useRef([]);
  const metadata = useRef([]);
  const animation = useRef(null);
  const closing = useRef(false);
  const [active, setActive] = useState(null);
  const current = items[active ?? 0];

  const { contextSafe } = useGSAP(() => {
    if (active === null) return;
    const modal = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    closing.current = false;
    modal.showModal();
    document.body.style.overflow = 'hidden';

    const pairs = [
      [surface.current, rows.current[active]],
      [image.current, thumbnails.current[active]],
      [title.current, titles.current[active]],
      [meta.current, metadata.current[active]],
    ];
    const timeline = gsap.timeline({ defaults: { duration: 0.7, ease: 'power3.inOut' } });
    animation.current = timeline;
    timeline.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);
    if (!reduced.matches) {
      pairs.forEach(([element, origin]) => timeline.fromTo(element, morphFrom(origin, element), {
        x: 0, y: 0, scaleX: 1, scaleY: 1,
      }, 0));
    } else {
      timeline.fromTo([surface.current, image.current, title.current, meta.current],
        { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0);
    }
    timeline.fromTo([detail.current, closeButton.current], { opacity: 0 }, {
      opacity: 1, duration: 0.3,
    }, reduced.matches ? 0 : 0.35);

    // If the preference changes while animating, immediately settle the panel.
    const settle = () => {
      if (!reduced.matches) return;
      animation.current?.progress(1);
    };
    reduced.addEventListener('change', settle);
    return () => {
      reduced.removeEventListener('change', settle);
      animation.current?.kill();
      modal.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, { scope, dependencies: [active], revertOnUpdate: true });

  const close = contextSafe(() => {
    if (active === null || closing.current) return;
    closing.current = true;
    animation.current?.kill();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeline = gsap.timeline({
      defaults: { duration: reduced ? 0.2 : 0.6, ease: 'power3.inOut' },
      onComplete: () => setActive(null),
    });
    animation.current = timeline;
    timeline.to([detail.current, closeButton.current], { opacity: 0, duration: 0.15 }, 0);
    timeline.to(backdrop.current, { opacity: 0 }, 0);
    if (reduced) {
      timeline.to([surface.current, image.current, title.current, meta.current], { opacity: 0 }, 0);
    } else {
      [
        [surface.current, rows.current[active]],
        [image.current, thumbnails.current[active]],
        [title.current, titles.current[active]],
        [meta.current, metadata.current[active]],
      ].forEach(([element, destination]) => timeline.to(element, morphTo(element, destination), 0));
    }
  });

  return (
    <div className="morph-faq-layout" ref={scope}>
      <div className="morph-faq-heading">
        <p className="morph-caption">A little clarity</p>
        <h2 className="morph-heading" id="faq-heading">Before<br />we begin.</h2>
        <p className="morph-body">Your questions, thoughtfully answered.<br />A little clarity for the road ahead.</p>
      </div>
      <div className="morph-faq-list" role="list" aria-label="Frequently asked questions">
        {items.map((item, index) => (
          <div role="listitem" key={item.question}>
            <button
              type="button"
              className="morph-faq-row"
              ref={node => { rows.current[index] = node; }}
              onClick={() => setActive(index)}
              aria-haspopup="dialog"
              aria-expanded={active === index}
              aria-controls="morph-faq-dialog"
            >
              <span className={`morph-faq-thumbnail is-${item.fit}`} ref={node => { thumbnails.current[index] = node; }}>
                <img src={item.image} alt="" loading="lazy" />
              </span>
              <span className="morph-row-title" ref={node => { titles.current[index] = node; }}>{item.question}</span>
              <span className="morph-row-meta morph-caption" ref={node => { metadata.current[index] = node; }}>{item.topic}</span>
              <span className="morph-row-arrow"><Arrow /></span>
            </button>
          </div>
        ))}
        <p className="morph-list-hint morph-caption">A few things worth knowing. Select a question to explore.</p>
      </div>
      <dialog
        id="morph-faq-dialog"
        className="morph-dialog"
        ref={dialog}
        aria-labelledby="morph-faq-title"
        aria-describedby="morph-faq-answer"
        onCancel={event => { event.preventDefault(); close(); }}
        onClick={event => { if (event.target === dialog.current || event.target === backdrop.current) close(); }}
      >
        <div className="morph-backdrop" ref={backdrop} aria-hidden="true" />
        <article className="morph-panel">
          <div className="morph-panel-surface" ref={surface} />
          <div className={`morph-panel-image is-${current.fit}`} ref={image}>
            <img src={current.image} alt="" />
          </div>
          <div className="morph-panel-content">
            <h2 id="morph-faq-title" className="morph-panel-title" ref={title}>{current.question}</h2>
            <p className="morph-panel-meta morph-caption" ref={meta}>{current.topic}</p>
            <div className="morph-panel-detail" ref={detail}>
              <p id="morph-faq-answer" className="morph-body">{current.answer}</p>
              <button type="button" className="morph-panel-link" onClick={close}>Back to questions <span><Arrow /></span></button>
            </div>
          </div>
          <button type="button" className="morph-panel-close" ref={closeButton} aria-label="Close answer" autoFocus onClick={close}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 7 10 10M7 17 17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </article>
      </dialog>
    </div>
  );
}
