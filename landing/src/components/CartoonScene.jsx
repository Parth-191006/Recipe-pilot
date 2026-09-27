/**
 * The cartoon backdrop, re-drawn as flat SVG.
 *
 * The app paints this scene itself in `_CartoonKitchenPainter`
 * (lib/screens/home_screen.dart): a moon, two hills, a steaming pot and a row
 * of vegetables, built out of nothing but circles, capsules and arcs so it
 * stays crisp at any size and ships zero image assets. The landing page draws
 * the same scene for the same reasons — no image bytes, crisp at every width,
 * and editable in the diff — which also means the background is the app's own
 * motif rather than a look invented for the site.
 *
 * Two deliberate departures from the app:
 *
 *  • The hills are hue-shifted warmer. The app's hills sit at 133–138° and its
 *    night sky at 152° — a cooler, slightly teal green. Here they are 107–116°,
 *    the family the page's herb ramp already occupies (mint is 103°, herb-600 is
 *    111°), so the landscape reads as the same green the rest of the page leads
 *    with instead of introducing a second one.
 *  • Nothing is drawn as a soft glow. Every shape is a flat fill, because flat
 *    fills are what make a drawing read as a cartoon rather than as a light
 *    bloom — and the flat moon needed no halo to read as a light.
 *
 * Every piece is decorative and sits behind content: `aria-hidden`, and
 * `pointer-events-none` is left to the call site.
 */

// The app's vegetable shapes, kept as small helpers so the landscape below
// stays readable as a composition rather than as a wall of coordinates.

function Tomato({ x, y, r }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="var(--scene-tomato)" />
      <circle cx={-r * 0.28} cy={-r * 0.3} r={r * 0.26} fill="#fff" fillOpacity="0.45" />
      {/* Calyx: four leaves fanned over the shoulder, plus one at the top. */}
      {[-0.6, -0.2, 0.2, 0.6].map((a) => (
        <circle
          key={a}
          cx={Math.sin(a) * r * 0.92}
          cy={-Math.cos(a) * r * 0.92}
          r={r * 0.14}
          fill="var(--scene-leaf)"
        />
      ))}
      <circle cy={-r * 0.85} r={r * 0.16} fill="var(--scene-leaf)" />
    </g>
  );
}

function Broccoli({ x, y, r }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x={-r * 0.3}
        y={r * 0.4}
        width={r * 0.6}
        height={r * 0.9}
        rx={r * 0.2}
        fill="var(--scene-broccoli-light)"
      />
      {/* The floret is a cloud of four overlapping circles. */}
      <g fill="var(--scene-broccoli)">
        <circle cx={-r * 0.55} cy={-r * 0.15} r={r * 0.52} />
        <circle cx={r * 0.55} cy={-r * 0.15} r={r * 0.52} />
        <circle cy={-r * 0.55} r={r * 0.6} />
        <circle r={r * 0.55} />
      </g>
      <g fill="#66bb6a" fillOpacity="0.8">
        {[
          [-0.5, -0.5],
          [0.1, -0.8],
          [0.5, -0.3],
          [-0.1, -0.2],
        ].map(([dx, dy]) => (
          <circle key={`${dx}-${dy}`} cx={dx * r} cy={dy * r} r={r * 0.11} />
        ))}
      </g>
    </g>
  );
}

function Carrot({ x, y, r }) {
  return (
    // 0.5rad in the app — leaning into the scene.
    <g transform={`translate(${x} ${y}) rotate(28.6)`}>
      <path
        d={`M${-r * 0.3} ${-r * 0.4} Q0 ${-r * 0.62} ${r * 0.3} ${-r * 0.4} L0 ${r} Z`}
        fill="var(--scene-carrot)"
      />
      {[-0.1, 0.2, 0.5].map((f) => (
        <line
          key={f}
          x1={-r * 0.14}
          y1={r * f}
          x2={r * 0.14}
          y2={r * f}
          stroke="#fff"
          strokeOpacity="0.25"
          strokeWidth={r * 0.06}
        />
      ))}
      <g stroke="var(--scene-leaf)" strokeWidth={r * 0.14} strokeLinecap="round">
        {[-0.22, 0, 0.22].map((dx) => (
          <line key={dx} x1={dx * r * 0.6} y1={-r * 0.5} x2={dx * r * 1.6} y2={-r * 1.05} />
        ))}
      </g>
    </g>
  );
}

function Eggplant({ x, y, r }) {
  return (
    // -0.35rad in the app.
    <g transform={`translate(${x} ${y}) rotate(-20)`}>
      <ellipse cy={r * 0.25} rx={r * 0.475} ry={r * 0.85} fill="var(--scene-eggplant)" />
      <ellipse
        cx={-r * 0.16}
        cy={r * 0.05}
        rx={r * 0.11}
        ry={r * 0.425}
        fill="var(--scene-eggplant-shade)"
        fillOpacity="0.55"
      />
      <g fill="var(--scene-leaf)">
        <circle cy={-r * 0.62} r={r * 0.26} />
        {[-0.5, 0, 0.5].map((dx) => (
          <circle key={dx} cx={dx * r * 0.5} cy={-r * 0.52} r={r * 0.16} />
        ))}
      </g>
    </g>
  );
}

/**
 * The landscape: two mounds behind a field, a steaming pot on the left and the
 * vegetable row on the right, with the moon in the sky above.
 *
 * The sky is deliberately *not* painted — the page's own night gradient shows
 * through, so the scene has no hard top edge anywhere and can be dropped at the
 * bottom of any dark section. The three green layers are positioned so the
 * field spans the full width (a very wide circle, so it reads flat), which
 * means no gap can open up under the mounds at any band height.
 *
 * The viewBox is 1600×360 and the call site crops it with `slice`, so the
 * composition is kept away from the extreme left and right: on a phone the
 * sides are trimmed and the pot, veg and moon all survive.
 */
export function KitchenLandscape({ className = '' }) {
  return (
    <svg
      viewBox="0 0 1600 360"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Mounds, then the field over their feet. */}
      <circle cx="520" cy="620" r="430" fill="var(--scene-hill-back)" />
      <circle cx="1180" cy="600" r="400" fill="var(--scene-hill-back)" />
      <circle cx="800" cy="3660" r="3400" fill="var(--scene-hill-front)" />

      {/* Moon — flat, craters only, no halo. */}
      <circle cx="1150" cy="95" r="31" fill="var(--scene-moon)" />
      <circle cx="1143" cy="88" r="5.5" fill="var(--scene-moon-crater)" fillOpacity="0.5" />
      <circle cx="1160" cy="104" r="3.5" fill="var(--scene-moon-crater)" fillOpacity="0.5" />

      {/* The pot: a capsule body, a domed lid and a terracotta knob, with two
          short curls of steam. */}
      <g>
        <rect x="278" y="258" width="104" height="42" rx="10" fill="var(--scene-pot)" />
        <path d="M278 258 A51 51 0 0 1 382 258 Z" fill="var(--scene-pot-lid)" />
        <circle cx="330" cy="201" r="8" fill="var(--scene-terracotta)" />
        <rect x="265" y="271" width="14" height="7" rx="3.5" fill="var(--scene-pot)" />
        <rect x="381" y="271" width="14" height="7" rx="3.5" fill="var(--scene-pot)" />
        <g fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="8" strokeLinecap="round">
          <path d="M304 196 q18 -20 -6 -40" />
          <path d="M356 196 q-18 -20 6 -40" />
        </g>
      </g>

      {/* Each vegetable is seated on the field's own surface at its own x. */}
      <Tomato x={660} y={236} r={27} />
      <Broccoli x={840} y={220} r={31} />
      <Carrot x={1020} y={234} r={32} />
      <Eggplant x={1200} y={240} r={36} />
    </svg>
  );
}

/**
 * The finish line, in the same flat vocabulary as the landscape: the app's
 * confetti is a particle rain, and a cartoon still of it is a handful of
 * triangles, dots and streamers. Sparser than it sounds — the band it sits in
 * already has a card and an animation in it.
 */
export function Confetti({ className = '' }) {
  return (
    <svg
      viewBox="0 0 240 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g opacity="0.55">
        <g fill="var(--color-ember-300)">
          <path d="M40 26 l7 12 -14 0 z" transform="rotate(-18 40 32)" />
          <circle cx="132" cy="66" r="4" />
          <path d="M186 106 q12 -12 24 -4" fill="none" stroke="var(--color-ember-300)" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g fill="var(--color-herb-400)">
          <circle cx="66" cy="74" r="5" />
          <path d="M160 34 l7 12 -14 0 z" transform="rotate(-32 160 40)" />
          <path d="M28 108 q10 -14 22 -8" fill="none" stroke="var(--color-herb-400)" strokeWidth="4" strokeLinecap="round" />
        </g>
        <circle cx="96" cy="20" r="4.5" fill="var(--color-herb-300)" />
        <circle cx="204" cy="52" r="5.5" fill="var(--color-herb-300)" />
      </g>
    </svg>
  );
}
