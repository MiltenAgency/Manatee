'use client';

import { useEffect, useId, useRef, useState } from 'react';

export function Dialog({ title, onClose, children }) {
  const ref = useRef(null);
  const titleId = useId();
  const [done, setDone] = useState(false);
  const [brief, setBrief] = useState('');

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
          <p>Your project brief is ready.</p>
          <p>Download a copy to keep your ideas together. Your details have not been sent.</p>
          <a className="primary" href={`data:text/plain;charset=utf-8,${encodeURIComponent(brief)}`} download="tidewell-project-brief.txt">Download your brief ↗</a>
        </div>
      ) : (
        <form onSubmit={event => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setBrief(`TIDEWELL HOME — PROJECT BRIEF\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\nYour ideas\n${data.get('message')}\n\nPrepared locally. This brief has not been sent.\n`);
          setDone(true);
        }}>
          <p className="dialog-intro">Tell us what you have in mind. Start by creating a brief you can download and keep.</p>
          <label>Your name<input name="name" required autoComplete="name" /></label>
          <label>Email address<input type="email" name="email" required autoComplete="email" /></label>
          <label>What would you love to change?<textarea name="message" rows="3" required /></label>
          <button type="submit" className="primary">Create my project brief ↗</button>
          <small>Your details stay in this browser until you choose to share your downloaded brief.</small>
        </form>
      ))}
    </dialog>
  );
}
