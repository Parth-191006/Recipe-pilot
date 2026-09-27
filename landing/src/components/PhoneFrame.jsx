/**
 * A phone mockup for real app screenshots.
 *
 * The screenshots are 720×1600, so the screen uses that exact aspect ratio:
 * nothing is cropped, nothing is letterboxed, and swapping in a replacement
 * screenshot of the same size needs no layout changes.
 *
 * `width` sizes the *device* — the figure is shrink-wrapped around it, and the
 * glow is an oversized overlay relative to that, so a glow can never influence
 * how big the phone renders. (It did, once: the width class sat on the glow
 * div, so the screen sized itself to the screenshot's intrinsic 720px and the
 * mockups rendered at ~650px instead of ~260px.)
 *
 * `rotate` and `glow` exist so the mockups are angled and offset rather than
 * parked flat and centred — the point of the layout is that it does not look
 * like a template.
 */
export default function PhoneFrame({
  src,
  alt,
  rotate = 0,
  width = 'w-60',
  glow = 'ember',
  className = '',
  caption,
}) {
  const glowClass =
    glow === 'herb'
      ? 'glow-herb'
      : glow === 'cream'
        ? 'glow-cream'
        : 'glow-ember';

  return (
    <figure className={`relative w-fit ${className}`}>
      <div
        className={`${glowClass} pointer-events-none absolute -inset-x-12 -inset-y-16 -z-10 rounded-full`}
        aria-hidden="true"
      />

      <div
        className={`${width} relative rounded-[2.4rem] bg-gradient-to-b from-night-700 to-night-850 p-[3px] shadow-lift ring-1 ring-white/8`}
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <div className="relative overflow-hidden rounded-[2.15rem] bg-night-950">
          <img
            src={src}
            alt={alt}
            width="720"
            height="1600"
            loading="lazy"
            decoding="async"
            className="block aspect-[720/1600] w-full object-cover object-top"
          />
          {/* Glass: a barely-there diagonal sheen so the bezel reads as glass. */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[2.15rem] bg-gradient-to-tr from-transparent via-white/3 to-white/8"
            aria-hidden="true"
          />
        </div>
      </div>

      {caption ? (
        <figcaption className="mt-4 max-w-[16rem] text-sm leading-snug text-cream-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
