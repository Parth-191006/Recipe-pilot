import Mark from './Mark.jsx';
import { ALL_RELEASES_URL, LICENSE_URL, REPO_URL } from '../site.js';

export default function Footer() {
  return (
    <footer className="border-t border-white/6 bg-night-900/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-10">
        <div className="flex items-center gap-3">
          <Mark className="h-7 w-7 text-herb-400" />
          <div>
            <p className="display text-base font-semibold text-cream-100">
              Recipe Pilot
            </p>
            <p className="text-sm text-cream-400">
              Plan it. Shop it. Cook it. — offline-first, Android.
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream-400">
          <a
            className="transition hover:text-herb-300"
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="transition hover:text-herb-300"
            href={ALL_RELEASES_URL}
            target="_blank"
            rel="noreferrer"
          >
            Releases
          </a>
          <a
            className="transition hover:text-herb-300"
            href={LICENSE_URL}
            target="_blank"
            rel="noreferrer"
          >
            MIT licensed
          </a>
        </nav>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pb-8 sm:px-8 sm:pb-10">
        <p className="text-xs leading-relaxed text-cream-400">
          Built by Parth — free, open source, no ads. This page sets no cookies,
          runs no analytics, and makes no third-party requests: the two fonts
          are served from here.
        </p>
      </div>
    </footer>
  );
}
