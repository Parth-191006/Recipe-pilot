import { DOWNLOAD_LABEL, RELEASE_URL } from '../site.js';

/**
 * The page's one job, as a component. Links straight at
 * `releases/latest`, which always resolves to the newest APK, and says
 * "Android" out loud so nobody wonders whether it is their platform.
 *
 * Herb green fills it, not the app's terracotta: green leads this page. The
 * label flips to near-black on hover because the fill blooms to `herb-500`,
 * and white on that is only 1.9:1 — `night-950` on it is 8.59:1.
 */
export default function DownloadButton({
  size = 'lg',
  label = DOWNLOAD_LABEL,
  className = '',
}) {
  const sizing =
    size === 'sm'
      ? 'px-4 py-2 text-sm'
      : size === 'md'
        ? 'px-5 py-3 text-base'
        : 'px-6 py-4 text-base sm:px-7 sm:py-[1.15rem] sm:text-lg';

  return (
    <a
      href={RELEASE_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={`${label} — opens the latest GitHub release in a new tab`}
      className={`group inline-flex items-center justify-center gap-2.5 rounded-full bg-herb-600 font-semibold text-white shadow-herb ring-1 ring-herb-400/40 transition duration-200 hover:-translate-y-0.5 hover:bg-herb-500 hover:text-night-950 active:translate-y-0 ${sizing} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[1.15em] w-[1.15em] shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3.5v11" />
        <path d="m7.6 10.4 4.4 4.4 4.4-4.4" />
        <path d="M4.5 19.5h15" />
      </svg>
      {label}
    </a>
  );
}
