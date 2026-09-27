/**
 * The app's mark: one minimalist leaf, drawn as vector paths so it stays crisp
 * at any size and adds no image bytes. Fill follows `currentColor`, so the
 * parent decides whether it is herb green or cream.
 */
export default function Mark({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M12 2.4c-3.7 4.5-5.7 8.2-5.7 11.7a5.7 5.7 0 0 0 11.4 0C17.7 10.6 15.7 6.9 12 2.4Z"
        fill="currentColor"
      />
      <path
        d="M12 7v12.6"
        stroke="rgba(10,15,13,0.55)"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}
