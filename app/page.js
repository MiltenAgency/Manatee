import source from '../source/site.json';
import SiteInteractions from './site-interactions';

export default function Page() {
  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      {/* This trusted, repository-owned snapshot is never populated by user input. */}
      <style dangerouslySetInnerHTML={{ __html: source.styles }} />
      <div id="site-shell" dangerouslySetInnerHTML={{ __html: source.body }} />
      <SiteInteractions />
    </>
  );
}
