'use client';

import { useCallback, useEffect, useState } from 'react';
import { Dialog } from './ui';
import { useReferenceMotion } from './motion';
import { setupSiteControls } from './site-controls';

export default function SiteInteractions() {
  const [modal, setModal] = useState(null);
  const closeDialog = useCallback(() => setModal(null), []);
  useReferenceMotion();

  useEffect(() => setupSiteControls(document.getElementById('site-shell'), setModal), []);

  if (!modal) return null;
  return (
    <Dialog key={modal} title={modal} onClose={closeDialog}>
      {modal === 'Newsletter preview' && (
        <div role="status">
          <p>Your newsletter signup is ready.</p>
          <p>This is a local preview. No email was sent.</p>
          <button type="button" className="primary" onClick={closeDialog}>Back to Manatee ↗</button>
        </div>
      )}
    </Dialog>
  );
}
