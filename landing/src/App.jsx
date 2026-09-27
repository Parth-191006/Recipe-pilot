import Footer from './components/Footer.jsx';
import Nav from './components/Nav.jsx';
import Closing from './sections/Closing.jsx';
import Features from './sections/Features.jsx';
import Hero from './sections/Hero.jsx';
import Install from './sections/Install.jsx';
import Offline from './sections/Offline.jsx';

/**
 * The whole page, in one reading order:
 *
 *   Hero          — what it is, one download button, real screenshots
 *   Offline       — the actual differentiator, given real room
 *   Features      — four things, alternating rows, real screenshots
 *   Install       — the friendly "Android will grumble once" walkthrough
 *   Closing       — what changed in the latest build + the final CTA
 *   Footer        — GitHub, licence, and the honest small print
 *
 * No routing, no state, no data fetching: it is a single static page whose only
 * job is to explain the app and hand over the APK.
 */
export default function App() {
  return (
    // overflow-clip (not overflow-hidden): the backdrop scene spans the full
    // viewport and the angled hero phones deliberately hang past the right
    // gutter, and clipping here kills the sideways scroll without creating a
    // scroll container — so the sticky nav keeps sticking. Verified: 0px of
    // horizontal overflow at 390, 768 and 1280 wide.
    <div id="top" className="sky-night relative min-h-screen overflow-clip">
      <Nav />
      <main>
        <Hero />
        <Offline />
        <Features />
        <Install />
        <Closing />
      </main>
      <Footer />
      {/* Two fixed, whole-page textures: cartoon starlight beneath the grain.
          Neither intercepts a pointer, and neither is a section background, so
          they read straight through the dark planes and vanish over the cream
          band. */}
      <div className="starfield" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
