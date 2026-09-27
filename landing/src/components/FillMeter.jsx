import { useEffect, useRef, useState } from 'react';

/**
 * The progress meter from the app's list header, re-created in CSS.
 *
 * A plain CSS keyframe animation was the obvious way to do this, and it was
 * wrong: Chromium throttles animations on off-screen elements, so the meter sat
 * at its 4% start state and never filled. This version waits until the meter is
 * actually on screen (IntersectionObserver) and then runs an ordinary width
 * transition — deterministic everywhere, and it reads as "the list finished
 * while you were looking at it".
 *
 * Fallbacks are deliberate: no IntersectionObserver, or reduced motion, and the
 * meter simply renders full. The static state is the meaningful one.
 */
export default function FillMeter({ className = '' }) {
  const ref = useRef(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setLit(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLit(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`h-2 w-full overflow-hidden rounded-full bg-night-700 ${className}`}
    >
      <div
        className={`h-full rounded-full bg-herb-400 transition-[width] duration-[2200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          lit ? 'w-full' : 'w-[4%]'
        }`}
      />
    </div>
  );
}
