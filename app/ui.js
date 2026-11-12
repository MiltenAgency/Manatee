'use client';

import { useEffect, useId, useRef, useState } from 'react';

export function Dialog({ title, onClose, children }) {
  const ref = useRef(null);
  const titleId = useId();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === ref.current) onClose(); }}
    >
      <button type="button" className="dialog-close" aria-label="Close dialog" onClick={onClose}>×</button>
      <h2 id={titleId}>{title}</h2>
      {children || (done ? (
        <div role="status">
          <p>Your request is ready.</p>
          <p>This is a local preview. No information was sent.</p>
          <button type="button" className="primary" onClick={onClose}>Back to the website ↗</button>
        </div>
      ) : (
        <form onSubmit={event => { event.preventDefault(); setDone(true); }}>
          <label>Your name<input name="name" required autoComplete="name" /></label>
          <label>Email address<input type="email" name="email" required autoComplete="email" /></label>
          <label>How can we help?<textarea name="message" rows="3" required /></label>
          <button type="submit" className="primary">Prepare request ↗</button>
          <small>Local preview. Your entries stay in this browser.</small>
        </form>
      ))}
    </dialog>
  );
}
