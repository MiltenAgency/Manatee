/** Bind only the static site. Dialog forms live outside this root. */
export function setupSiteControls(root, openDialog) {
  if (!root) return () => {};
  const cleanups = [];
  const listen = (node, event, handler) => {
    node.addEventListener(event, handler);
    cleanups.push(() => node.removeEventListener(event, handler));
  };
  const menu = root.querySelector('.nav_menu');
  const toggle = root.querySelector('.nav_hamburger');
  const mobile = window.matchMedia('(max-width: 991px)');
  let menuOpen = false;
  let previousOverflow;

  function setMenu(open, restoreFocus = false) {
    menuOpen = open && mobile.matches;
    toggle?.setAttribute('aria-expanded', String(menuOpen));
    toggle?.setAttribute('aria-label', menuOpen ? 'Close menu' : 'Open menu');
    menu?.classList.toggle('is-open', menuOpen);
    if (menuOpen && previousOverflow === undefined) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else if (!menuOpen && previousOverflow !== undefined) {
      document.body.style.overflow = previousOverflow;
      previousOverflow = undefined;
    }
    if (restoreFocus) toggle?.focus();
  }
  if (toggle && menu) {
    listen(toggle, 'click', () => setMenu(!menuOpen));
    listen(mobile, 'change', () => setMenu(false));
    listen(document, 'keydown', event => {
      if (!menuOpen) return;
      if (event.key === 'Escape') { event.preventDefault(); setMenu(false, true); }
      if (event.key === 'Tab') {
        const links = [...menu.querySelectorAll('a[href]')];
        const first = links[0];
        const last = links.at(-1);
        if (event.shiftKey && document.activeElement === toggle) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === toggle) {
          event.preventDefault(); first?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); toggle.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); toggle.focus();
        }
      }
    });
    cleanups.push(() => setMenu(false));
  }

  const faqs = [...root.querySelectorAll('.dropdown_faqs-toggle')];
  function setQuestion(button, expanded) {
    button.setAttribute('aria-expanded', String(expanded));
    const content = root.querySelector(`#${button.getAttribute('aria-controls')}`);
    if (content) content.hidden = !expanded;
  }
  listen(root, 'click', event => {
    if (!(event.target instanceof Element)) return;
    const question = event.target.closest('.dropdown_faqs-toggle');
    if (question) {
      const expand = question.getAttribute('aria-expanded') !== 'true';
      faqs.forEach(button => setQuestion(button, button === question && expand));
      return;
    }
    const anchor = event.target.closest('a[href]');
    if (!anchor) return;
    if (menuOpen) setMenu(false, true);
    const url = new URL(anchor.href, window.location.href);
    if (url.hostname === 'app.manatee.energy') {
      event.preventDefault();
      openDialog(url.pathname.includes('sign-in') ? 'Manatee account preview' : 'Get a quote');
    }
  });
  listen(root, 'submit', event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.matches('.form-footer')) return;
    event.preventDefault();
    if (form.reportValidity()) openDialog('Newsletter preview');
  });
  return () => cleanups.reverse().forEach(cleanup => cleanup());
}
