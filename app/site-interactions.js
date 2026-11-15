'use client';

import { useCallback, useEffect, useState } from 'react';
import { Dialog } from './ui';
import { useReferenceMotion } from './motion';
import { setupSiteControls } from './site-controls';
import MorphingFaqsMount from './morphing-faqs';

export default function SiteInteractions() {
  const [modal, setModal] = useState(null);
  const closeDialog = useCallback(() => setModal(null), []);
  useReferenceMotion();

  useEffect(() => setupSiteControls(document.getElementById('site-shell'), setModal), []);

  return (
    <>
      <MorphingFaqsMount />
      {modal && <Dialog key={modal} title={modal} onClose={closeDialog}>
        {modal === 'The Tidewell notebook' && (
          <div role="status">
            <p>A place for materials, spaces, and ideas worth keeping.</p>
            <p>The notebook is still taking shape. Your address has not been saved or added to a mailing list.</p>
            <button type="button" className="primary" onClick={closeDialog}>Back to Tidewell ↗</button>
          </div>
        )}
        {modal === 'Privacy' && <div className="legal-copy">
          <p>Tidewell Home is a studio concept. Enquiry details are used in your browser to prepare a downloadable project brief. They are not sent to a studio or saved on a server by this site.</p>
          <p>The newsletter form does not currently create a subscription. No advertising or analytics scripts are included in the site.</p>
          <p>If you download a brief, you control the resulting file and who you share it with.</p>
        </div>}
        {modal === 'Terms' && <div className="legal-copy">
          <p>Tidewell Home is a fictional renovation studio presented as an independent design concept. The site does not accept bookings, payments, or binding service commitments.</p>
          <p>The interior imagery was created with AI for this concept. The rooms are not completed client commissions. Project timelines and costs would need to be agreed separately for an actual renovation.</p>
          <p>Creating a project brief does not send an enquiry or establish a client relationship.</p>
        </div>}
        {modal === 'Cookies' && <div className="legal-copy">
          <p>This studio concept does not include advertising or analytics cookies.</p>
          <p>Your project brief is prepared in your browser. The newsletter form does not currently save your address or create a subscription.</p>
          <p>You can review the privacy information for more details about the forms on this site.</p>
        </div>}
      </Dialog>}
    </>
  );
}
