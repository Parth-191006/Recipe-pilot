/**
 * A phone mockup for real app screenshots.
 *
 * The screen takes the screenshot's natural aspect ratio: nothing is cropped,
 * nothing is letterboxed, and no ratio is hard-coded. (It was 720/1600 once,
 * but replacement screenshots re-encoded by WhatsApp arrived a few pixels
 * wider — 781–791 px — and a fixed ratio centre-cropped the back arrow and
 * corner icons off them.) Swapping in a replacement screenshot of roughly the
 * same shape needs no layout changes.
 *
 * `width` sizes the *device* — the figure is shrink-wrapped around it, so
 * nothing but that class decides how big a phone renders.
 *
 * `rotate` exists so the mockups are angled and offset rather than parked flat
 * and centred — the point of the layout is that it does not look like a
 * template. There is no caption prop either: the captions restated the row
 * headings they sat under, and every screenshot is described by its `alt`.
 *
 * There is no `glow` prop any more, and no halo behind the device: against the
 * flat cartoon backdrop a soft bloom was the one element that looked pasted on.
 * The bezel, the glass sheen and `shadow-lift` do the separating instead.
 */
export default function PhoneFrame({
  src,
  alt,
  rotate = 0,
  width = 'w-60',
  className = '',
}) {
  return (
    <figure className={`relative w-fit ${className}`}>
      <div
        className={`${width} relative rounded-[2.4rem] bg-gradient-to-b from-night-700 to-night-850 p-[3px] shadow-lift ring-1 ring-white/8`}
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <div className="relative overflow-hidden rounded-[2.15rem] bg-night-950">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="block w-full"
          />
          {/* Glass: a barely-there diagonal sheen so the bezel reads as glass. */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[2.15rem] bg-gradient-to-tr from-transparent via-white/3 to-white/8"
            aria-hidden="true"
          />
        </div>
      </div>

    </figure>
  );
}
