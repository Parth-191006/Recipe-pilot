import { KitchenLandscape } from '../components/CartoonScene.jsx';
import DownloadButton from '../components/DownloadButton.jsx';
import FadeContent from '../components/FadeContent.jsx';
import { ALL_RELEASES_URL } from '../site.js';

const LATEST_BUILD = [
  'One APK per CPU type — ~17 MB, not a 49 MB universal download.',
  'Flagged lines are fixable in place: rewrite, split or drop them.',
  'Quantities in different units add up — 200 g + 1 kg becomes 1.2 kg.',
  'Cook-along timers you can nudge +1/+5 minutes mid-simmer.',
  'Recipes you write yourself get their own shelf, newest first.',
];

/**
 * What changed lately (proof the project is alive, in the visitor's terms
 * rather than a changelog), then the final call to action — the same promise
 * as the hero, made once more at the moment someone has read everything.
 */
export default function Closing() {
  return (
    <>
      <section className="relative mt-14 bg-night-950 pt-14 sm:mt-24 sm:pt-20">
        <div
          aria-hidden="true"
          className="absolute -top-9 left-0 h-10 w-full bg-night-950 [clip-path:polygon(0_100%,100%_0,100%_100%)] sm:-top-12 sm:h-14"
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="doodle-night rounded-[2rem] border border-white/6 bg-night-850 p-6 sm:p-10">
            <p className="display text-sm font-semibold tracking-[0.14em] text-herb-300 uppercase">
              In the latest build
            </p>
            <ul className="mt-6 grid gap-3.5 text-[0.95rem] leading-relaxed text-cream-300 sm:grid-cols-2 sm:gap-x-10">
              {LATEST_BUILD.map((line) => (
                <li key={line} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-herb-400"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="download" className="relative pt-16 pb-36 sm:pt-28 sm:pb-52">
        {/* The same backdrop the page opened on, so it closes on the same
            horizon. The band's bottom edge is flush with the footer, which
            reads as the hills running behind it rather than as a crop. */}
        <KitchenLandscape className="pointer-events-none absolute bottom-0 left-0 block h-28 w-full sm:h-44" />
        <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
          <FadeContent
            duration={950}
            y={20}
            className="flex flex-col items-start gap-8 border-t border-white/6 pt-14 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-xl">
              <h2 className="text-[2.05rem] leading-[1.06] font-semibold text-cream-50 sm:text-[2.8rem]">
                Your next recipe is already sorted.
              </h2>
              <p className="mt-4 leading-relaxed text-cream-300 sm:mt-5">
                Download the APK, paste in tonight's dinner, and carry the list
                around the shop. No account, no sign-up, no signal.
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-4">
              <DownloadButton />
              <a
                className="text-sm text-cream-400 underline decoration-cream-500/40 underline-offset-4 transition hover:text-cream-100"
                href={ALL_RELEASES_URL}
                target="_blank"
                rel="noreferrer"
              >
                All releases on GitHub
              </a>
            </div>
          </FadeContent>
        </div>
      </section>
    </>
  );
}
