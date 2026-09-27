import DownloadButton from '../components/DownloadButton.jsx';
import { DOWNLOAD_SIZE, REPO_URL } from '../site.js';

const STEPS = [
  {
    n: '1',
    title: 'Download it on the phone you want it on',
    body: `Tap the button; the file lands in your Downloads folder. About ${DOWNLOAD_SIZE}, because each download carries only the engine its own CPU needs.`,
  },
  {
    n: '2',
    title: 'Open it, and let Android trust this one source',
    body: 'Android cannot verify it — that is what it says about anything not from the Play Store. Allow installs from this browser, then tap Install.',
  },
  {
    n: '3',
    title: 'If Play Protect offers to scan it, tap "Install anyway"',
    body: 'More details → Install anyway. There is nothing for a scan to find: no ads, no tracking, no network calls, and the whole build runs in public on GitHub Actions.',
  },
];

/**
 * The install walkthrough.
 *
 * This is deliberately a warm, light band rather than another dark panel:
 * it is the page's one "and here is the slightly annoying bit" moment, and it
 * should read as help, not as a security warning. The tone is set by the
 * heading and by keeping every step in the visitor's own voice.
 *
 * It is also ember's fourth and last accent appearance: the terracotta kicker
 * and the build-from-source link are the page's one warm-on-cream moment, which
 * is exactly the "slightly annoying bit" this section is about. Everything else
 * here — the numbered discs, the tick, the button — leads green.
 */
export default function Install() {
  return (
    <section
      id="install"
      className="doodle-cream relative mt-14 bg-cream-100 pt-14 pb-20 text-night-900 sm:mt-24 sm:pt-24 sm:pb-24"
    >
      <div
        aria-hidden="true"
        className="absolute -top-9 left-0 h-10 w-full bg-cream-100 [clip-path:polygon(0_100%,100%_0,100%_100%)] sm:-top-12 sm:h-14"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-[0.68rem] font-bold tracking-[0.18em] text-ember-600 uppercase">
              Installing it
            </p>
            <h2 className="mt-5 text-[2.05rem] leading-[1.08] font-semibold text-night-950 sm:text-[2.6rem]">
              One minute, and Android grumbles exactly once.
            </h2>
            <p className="mt-4 leading-relaxed text-night-800/80 sm:mt-5">
              Not on the Play Store: a free, open-source APK you install yourself.
              The phone will double-check once before it lets you in.
            </p>

            <div className="mt-6 sm:mt-8">
              <DownloadButton />
            </div>

            <p className="mt-4 text-sm text-night-800/70 sm:mt-5">
              Build it yourself?{' '}
              <a
                className="font-semibold text-ember-600 underline decoration-ember-600/40 underline-offset-4 transition hover:text-ember-700"
                href={`${REPO_URL}#-build-from-source`}
                target="_blank"
                rel="noreferrer"
              >
                The README has the commands
              </a>
              .
            </p>
          </div>

          <ol className="space-y-6 sm:space-y-8 lg:col-span-6 lg:col-start-7 lg:pt-2">
            {STEPS.map((step) => (
              <li key={step.n} className="flex gap-5">
                <span className="display mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-herb-600 text-lg font-semibold text-cream-50">
                  {step.n}
                </span>
                <div className="border-b border-night-900/12 pb-7">
                  <h3 className="text-[1.1rem] leading-snug font-semibold text-night-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-night-800/80">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
            <li className="flex gap-5">
              <span className="display mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-herb-400 text-lg font-semibold text-night-950">
                ✓
              </span>
              <div>
                <h3 className="text-[1.1rem] leading-snug font-semibold text-night-950">
                  Updates install straight over the top
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-night-800/80">
                  New versions replace the old app in place — recipes and lists
                  survive, with no second copy left on the home screen.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
