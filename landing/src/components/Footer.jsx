import Mark from './Mark.jsx';
import { ALL_RELEASES_URL, LICENSE_URL, REPO_URL } from '../site.js';

export default function Footer() {
  return (
    <footer className="border-t border-white/6 bg-night-900/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <Mark className="h-7 w-7 text-herb-400" />
          <div>
            <p className="display text-base font-semibold text-cream-100">
              Recipe Pilot
            </p>
            <p className="text-sm text-cream-500">
              Plan it. Shop it. Cook it. — offline-first, Android.
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream-400">
          <a
            className="transition hover:text-cream-100"
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="transition hover:text-cream-100"
            href={ALL_RELEASES_URL}
            target="_blank"
            rel="noreferrer"
          >
            Releases
          </a>
          <a
            className="transition hover:text-cream-100"
            href={LICENSE_URL}
            target="_blank"
            rel="noreferrer"
          >
            MIT licensed
          </a>
        </nav>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pb-10 sm:px-8">
        <p className="text-xs leading-relaxed text-cream-500">
          Built and maintained by Parth — a free, open-source project with no
          ads and nothing to sell. No cookies and no analytics on this page
          either: it loads two fonts from Google Fonts and nothing else.
        </p>
      </div>
    </footer>
  );
}
