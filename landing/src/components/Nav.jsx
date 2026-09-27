import DownloadButton from './DownloadButton.jsx';
import Mark from './Mark.jsx';
import { REPO_URL } from '../site.js';

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-herb-400/12 bg-night-950/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-3 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <Mark className="h-6 w-6 text-herb-400" />
          <span className="display text-lg font-semibold text-cream-50">
            Recipe Pilot
          </span>
        </a>

        <nav className="ml-auto hidden items-center gap-7 text-sm text-cream-300 sm:flex">
          <a className="transition hover:text-herb-300" href="#offline">
            Why offline
          </a>
          <a className="transition hover:text-herb-300" href="#screens">
            Screens
          </a>
          <a className="transition hover:text-herb-300" href="#install">
            How to install
          </a>
          <a
            className="transition hover:text-herb-300"
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>

        <DownloadButton size="sm" label="Get the APK" className="ml-auto sm:ml-0" />
      </div>
    </header>
  );
}
