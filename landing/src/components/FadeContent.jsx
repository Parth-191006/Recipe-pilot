import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * FadeContent — from React Bits (https://www.reactbits.dev/animations/fade-content)
 * MIT licensed. Vendored so the page has no runtime dependency on the
 * component library, and so the two small additions below are explicit.
 *
 * What it does here: fades an element in (and lifts it a few pixels) the first
 * time it scrolls into view. It is the page's single signature motion — one
 * component, used at the hero and at the two moments that deserve a beat
 * (the "why offline matters" pull-quote and the closing call to action).
 *
 * Additions to the upstream source:
 *   1. `y` — upstream animates opacity + blur only; a gentle rise is what
 *      makes it read as "fade up" rather than "materialise". Defaults to 0 so
 *      passing nothing keeps upstream behaviour.
 *   2. `prefers-reduced-motion` — when the visitor asks for less motion, the
 *      element is shown immediately and no ScrollTrigger is created. Upstream
 *      has no such guard, which would leave motion-sensitive readers staring
 *      at invisible content.
 *   3. an in-view fast path — an element that is *already* on screen when it
 *      mounts (the hero, anything above the fold) plays immediately instead of
 *      waiting for a scroll that will never happen. Without this the hero sat
 *      at opacity 0 — caught by looking at the rendered page, not by the tests.
 *
 * Props (upstream): container, blur, duration, ease, delay, threshold,
 * initialOpacity, disappearAfter, disappearDuration, disappearEase,
 * onComplete, onDisappearanceComplete, className, style.
 */
const FadeContent = ({
  children,
  container,
  blur = false,
  duration = 1000,
  ease = 'power2.out',
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = 'power2.in',
  onComplete,
  onDisappearanceComplete,
  y = 0,
  className = '',
  style,
  ...props
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Addition 2: no motion for people who ask for none.
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(el, { autoAlpha: 1, y: 0, filter: 'blur(0px)' });
      return undefined;
    }

    let scrollerTarget =
      container || document.getElementById('snap-main-container') || null;
    if (typeof scrollerTarget === 'string') {
      scrollerTarget = document.querySelector(scrollerTarget);
    }

    const startPct = (1 - threshold) * 100;
    const getSeconds = (val) =>
      typeof val === 'number' && val > 10 ? val / 1000 : val;

    gsap.set(el, {
      autoAlpha: initialOpacity,
      y,
      filter: blur ? 'blur(10px)' : 'blur(0px)',
      willChange: 'opacity, filter, transform',
    });

    const tl = gsap.timeline({
      paused: true,
      delay: getSeconds(delay),
      onComplete: () => {
        if (onComplete) onComplete();
        if (disappearAfter > 0) {
          gsap.to(el, {
            autoAlpha: initialOpacity,
            filter: blur ? 'blur(10px)' : 'blur(0px)',
            delay: getSeconds(disappearAfter),
            duration: getSeconds(disappearDuration),
            ease: disappearEase,
            onComplete: () => onDisappearanceComplete?.(),
          });
        }
      },
    });

    tl.to(el, {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: getSeconds(duration),
      ease,
    });

    // Addition 3: nothing to scroll to. ScrollTrigger fires onEnter when an
    // element *scrolls into* the active range, so an element that is already
    // on screen when it mounts (the hero — and any element at the top of the
    // page) can sit at opacity 0 forever. Play it straight away instead.
    const rect = el.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < viewportHeight * (1 - threshold)) {
      tl.play();
      return () => {
        tl.kill();
        gsap.killTweensOf(el);
      };
    }

    const st = ScrollTrigger.create({
      trigger: el,
      scroller: scrollerTarget || window,
      start: `top ${startPct}%`,
      once: true,
      onEnter: () => tl.play(),
    });

    return () => {
      st.kill();
      tl.kill();
      gsap.killTweensOf(el);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={className} style={style} {...props}>
      {children}
    </div>
  );
};

export default FadeContent;
