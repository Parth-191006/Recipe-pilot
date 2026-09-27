import DownloadButton from '../components/DownloadButton.jsx';
import FadeContent from '../components/FadeContent.jsx';
import { KitchenLandscape } from '../components/CartoonScene.jsx';
import PhoneFrame from '../components/PhoneFrame.jsx';
import { DOWNLOAD_SIZE, LICENSE_URL } from '../site.js';

/**
 * Asymmetric hero: seven of twelve columns of type, five of phone — and the
 * mockups are angled and pushed off the right edge rather than parked dead
 * centre. This is the deliberate break from the centred-hero template.
 *
 * The two phones are the real app screenshots inside real frames; the front
 * one carries the page's soft float (the app floats its own hero card, so the
 * page echoes it).
 */
export default function Hero() {
  return (
    <section className="relative pt-12 pb-44 sm:pt-16 sm:pb-56 lg:pt-20 lg:pb-64">
      {/* The backdrop, anchored to the bottom of the section — and the bottom
          padding above is sized to clear it, so no type or phone ever lands on
          the hills. The scene paints no sky of its own, so the band's top edge
          is invisible and the moon simply sits in the page's sky. */}
      <KitchenLandscape className="pointer-events-none absolute bottom-0 left-0 block h-32 w-full sm:h-44 lg:h-52" />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-6">
          <FadeContent
            className="lg:col-span-7 lg:pr-4"
            duration={950}
            y={20}
            threshold={0.01}
          >
            <p className="inline-flex items-center gap-2.5 rounded-full border border-herb-400/25 bg-herb-400/10 px-3.5 py-1.5 text-[0.68rem] font-bold tracking-[0.18em] text-herb-300 uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-herb-400" />
              </span>
              100% offline · no account, ever
            </p>

            <h1 className="mt-7 text-[2.55rem] leading-[1.04] font-semibold text-cream-50 sm:text-[3.4rem] lg:text-[4.1rem]">
              Paste a recipe.
              <br />
              Get the{' '}
              <span className="text-herb-300 italic underline decoration-herb-400/70 decoration-[3px] underline-offset-[10px]">
                shopping list
              </span>
              .
            </h1>

            <p className="mt-7 max-w-xl text-[1.06rem] leading-relaxed text-cream-300 sm:text-lg">
              Recipe Pilot reads ingredients the messy way recipes are actually
              written —{' '}
              <span className="rounded bg-night-800 px-1.5 py-0.5 font-medium text-cream-100">
                1 (14 oz) can diced tomatoes
              </span>
              ,{' '}
              <span className="rounded bg-night-800 px-1.5 py-0.5 font-medium text-cream-100">
                2–3 cloves garlic
              </span>{' '}
              — sorts every line into the right aisle, and keeps the whole thing
              on your phone. Offline, private, done before the kettle boils.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <DownloadButton />
              <a
                href="#screens"
                className="inline-flex items-center gap-2 rounded-full border border-cream-300/25 px-5 py-3 text-base font-semibold text-cream-200 transition hover:border-herb-400/50 hover:text-herb-200 sm:px-6 sm:py-[1.1rem]"
              >
                See it in action
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14" />
                  <path d="m6.5 13.5 5.5 5.5 5.5-5.5" />
                </svg>
              </a>
            </div>

            {/* cream-400, not cream-500: this line sits on the sky, which is
                lighter than the dark planes, and cream-500 lands at 3.7:1
                there. cream-400 is 5.8:1. */}
            <p className="mt-6 text-sm text-cream-400">
              Latest release · {DOWNLOAD_SIZE} · Free &amp;{' '}
              <a
                className="text-cream-400 underline decoration-cream-500/50 underline-offset-4 transition hover:text-cream-200"
                href={LICENSE_URL}
                target="_blank"
                rel="noreferrer"
              >
                MIT licensed
              </a>{' '}
              · Android
            </p>
          </FadeContent>

          {/* Offset cluster: angled, overlapping, bleeding past the gutter. */}
          <FadeContent
            className="relative lg:col-span-5 lg:translate-x-10"
            duration={1150}
            delay={140}
            y={28}
            threshold={0.01}
          >
            <div className="relative mx-auto w-fit">
              <div className="absolute bottom-2 -left-14 hidden sm:block lg:-left-20">
                <PhoneFrame
                  src="./screenshots/recipe-detail.jpg"
                  alt="Recipe Pilot recipe screen: Classic Beef Tacos with its ingredient list, steps and a Cook along button."
                  rotate={-7}
                  width="w-36 sm:w-40"
                />
              </div>

              <div className="animate-float">
                <PhoneFrame
                  src="./screenshots/home.jpg"
                  alt="Recipe Pilot home screen in night-kitchen dark mode: greeting, library stats, quick actions and the Ready in 30 shelf."
                  rotate={3.5}
                  width="w-[15.5rem] sm:w-[17rem]"
                  className="relative"
                />
              </div>

              <div className="absolute -top-3 -left-4 rotate-[-4deg] rounded-full border border-white/10 bg-night-800/90 px-3 py-1.5 text-[0.7rem] font-semibold tracking-wide text-herb-300 shadow-lift backdrop-blur sm:-left-8">
                night-kitchen dark mode
              </div>
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  );
}
