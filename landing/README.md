# Recipe Pilot — landing page

A single-page marketing / download site for the app. Its only job: make a
stranger understand what Recipe Pilot does in about five seconds, and get the
APK onto their Android phone. It is **not** the app, and it touches nothing in
the Flutter project — it just lives in this repository as a self-contained Vite
app.

```bash
cd landing
npm install
npm run dev        # http://localhost:5173
npm run build      # → landing/dist  (static, deployable anywhere)
npm run preview    # serve the built output locally
```

Stack: **Vite + React + Tailwind CSS v4** (`@tailwindcss/vite` — no PostCSS
config, no `tailwind.config.js`; the design tokens live in `src/index.css`
under `@theme`, and the backdrop's illustration fills in a plain `:root` block
below it).

---

## What was built, and the choices behind it

| Decision | What it is | Why |
|---|---|---|
| Layout break | **Asymmetric hero** — 7 of 12 columns of type, 5 of angled phone. The mockups are rotated (3.5° / −7°) and pushed past the right gutter instead of flat and centred. | The brief's single biggest red flag was "centred hero + three icon cards". Nothing on this page is a centred hero, and no section is a row of identical cards. |
| Recurring edge | One **diagonal seam** motif, used on the entry to the "why offline" plane, the cream install band, and the final CTA. | Organic, kitchen-ish edge instead of three stacked rectangles — and it costs one `<div>` with a `clip-path`. |
| Type | **Fraunces** (display; a soft, high-contrast serif with real warmth at large optical sizes) + **Karla** (body; plain, humanist, very readable). Two fonts, no third. | Fraunces reads like a cookbook rather than a dev tool; Karla stays out of the way. No Inter, no system-ui-everywhere. |
| Palette | **Herb green leads**: the CTA fills with a deep leaf green `#3a7d2e`, and accents use the app's mint `#a8dc94`. **Ember** `#ea5a2b` (the app's CTA terracotta) is the rare warm accent. The dark surfaces are a **green** ramp — `#060f08 → #17301a`, hue 127–133° at 51–60% saturation, up from 31% — so the page is the scene's world rather than a dark page with green accents on it. Cream `#fdfaf3` for the one light band. | "Warm kitchen at night", lifted from the product instead of invented — and green is the app's own checkmark/progress colour, so the page leads with the product's *success* state rather than with a second warm hue. The ramp's luminance is unchanged level for level, so greening it cost nothing in contrast. No purple→blue gradient anywhere. |
| Copy budget | **One paragraph per feature, no screenshot captions, no restatement.** The offline section's two paragraphs became one; three feature captions were deleted; the install steps say one thing each. | The first draft explained itself twice and captioned every screenshot with what the row's own heading already said. Measured at 390px: **−22% visible text** and **−15% page height** (−1563px), with nothing removed that a reader needs. |
| Backdrop | The app's **own cartoon kitchen** — moon, hills, steaming pot, vegetable row — re-drawn as flat SVG (`src/components/CartoonScene.jsx`), over a two-stop sky gradient, with sparse kitchen doodles tiled onto the flat panels. | It is the motif the product already owns (`_CartoonKitchenPainter`), so the page and the app look like one thing instead of two. Flat fills, no blooms: a glow behind the content reads as neither a light nor an illustration. |
| Imagery | The **real screenshots** (in phone frames, angled, lifted off the sky by their bezel and shadow), plus one CSS re-creation of the confetti/finish moment. | No stock photos, no AI blobs. The finish moment is a particle rain, so it is labelled as a re-creation rather than faked with a still. |
| Motion | **One** React Bits component, used three times: the hero entrance and two scroll reveals. | One signature moment beats five competing effects. |

### Who leads, and where ember still lives

Green owns every structural surface: the download button, the hero's accent
word, all five section eyebrows, the feature-row kickers, chips, bullets, the
progress meter, `::selection` and the focus ring. `herb-600` (`#3a7d2e`) had to
be added, because the ramp stopped at mint — far too light to carry a white
label (1.9:1). The new step stays in the family (herb-400 is 103°, herb-500 is
116°, herb-600 is 111°), and white on it is 5.06:1.

Ember is deliberately **not** deleted. It survives in four "heat or mild
friction" slots, so the warmth still means something:

1. the pot's knob in the backdrop — the one place the scene is allowed a warm
   red;
2. the confetti in the finish-line band;
3. the *Cook along* row's `+1 min / +5 min / stopwatch` timer chips;
4. the install band's kicker and build-from-source link — the one warm-on-cream
   moment, in the section that is literally about the annoying part.

Anything that wants a warm hue outside those four slots is wrong; add a green
step instead. Both light-band ember values were darkened for contrast
(`ember-600` `#c9451c → #b4401a`, 4.18:1 → 4.93:1 on cream, with `ember-700`
`#8f2f0e` for the hover, which darkens rather than lightens).

### The backdrop: the app's own cartoon kitchen

The page sits in the scene the app already paints on its home screen.
`_CartoonKitchenPainter` in `lib/screens/home_screen.dart` draws a moon, two
hills, a steaming pot and a row of vegetables from nothing but circles,
capsules and arcs, in a dusk palette, with zero image assets.
`src/components/CartoonScene.jsx` re-draws that scene as flat SVG for the same
reasons: crisp at any width, no image bytes, and every shape readable in the
diff.

It replaced the radial-gradient "glow" blobs the page used to be lit by. A
bloom behind the content read as neither a light nor an illustration, and flat
fills are what make a drawing read as a cartoon — so there are deliberately no
glow utilities left in `index.css`.

Three things keep it behaving like a backdrop instead of like artwork:

- **It paints no sky of its own.** The page supplies that (`sky-night`, a
  two-stop gradient from `#1a2818` to the page black), so the band has no
  visible top edge and the moon simply sits in the page's sky.
- **The section padding is built around it.** The hero and the closing CTA each
  carry one band at their bottom, with enough bottom padding to clear it. That
  is checked as a real rectangle intersection, not by eye: at 390/768/1280
  nothing carrying text or a screenshot overlaps a hill.
- **The composition is crop-safe.** The band is 1600×360 and the call site
  crops it with `preserveAspectRatio="slice"`, so the pot, all four vegetables
  and the moon all sit away from the extremes and survive the narrower view.

One deliberate departure from the app: the sky and hills are hue-shifted
warmer. The app's are 133–152° — a cooler, nearly teal green — against a page
ramp that runs 95–116°. They are 107–115° here, so the landscape is the same
green the page leads with rather than a second one arriving from behind the
content. The moon is likewise softened from the app's near-white `#f5f5f5` to
`#e9eef0`, because a backdrop moon should not out-shout what is in front of
it.

The page keeps exactly one texture and one full-screen overlay: a `starfield` of
sparse sparkles, tiled, drawn in white so it reads on the green planes and all
but vanishes over the cream band. The photographic paper grain that used to sit
over everything is gone — a cartoon mark belongs on a flat cartoon surface,
where noise does not — and `doodle-night` / `doodle-cream` replaced it. Those
tile a sparkle, a leaf, a streamer and two dots onto the flat panels, and are
applied only to *bounded* surfaces (a card, or a panel with an edge), so a
tile's phase never has to line up with a neighbouring surface and nothing needs
a fixed full-screen layer.

### The copy cut

The page opened far denser than what it actually has to say. Three things went,
and none of them were facts:

- **The second paragraph of every feature.** Each row had two, and the second
  restated the first at greater length. One paragraph per row now.
- **Every screenshot caption.** They described the screenshot that the row's own
  heading had already described. The `alt` text still describes all of them for
  screen readers, which is what the caption was never doing.
- **The offline section's second paragraph**, except its last sentence — the one
  that actually added something (*nothing is uploaded, because there is no
  server to upload it to*), which is now the end of the first.

Then a mobile pass: every section's padding came down a step at the small
breakpoint, the hero's headline and grid gaps tightened, and the install steps
lost their extra spacing. Measured at 390px with every image loaded, before and
after: page height 10320px → 8757px, visible text 5307 → 4132 characters.

### The React Bits component: `FadeContent`

Source: <https://www.reactbits.dev/animations/fade-content> (MIT), vendored into
`src/components/FadeContent.jsx` so the page has no runtime dependency on the
component library and every change is visible in the diff.

**Why this one, over the alternatives:**

- **It is the least "techy" thing in the catalogue.** The page needed something
  warm and organic; text-scrambles, glitch effects, `SplitText`, `Beams` and
  `Particles` all read as dev-tool demo reel rather than kitchen.
- **It is used well, not decoratively.** The hero arrives with it, and then it
  fires twice more on scroll (the "why offline" pull-quote and the closing call
  to action). Same easing everywhere, so the page feels of a piece.
- **It is cheap.** No WebGL, no canvas, no 3D library: GSAP tweens opacity,
  blur and a few pixels of `y`. ~28 KB gzipped of GSAP including ScrollTrigger —
  worth noting, because it is the single largest thing in the bundle.

**Three documented additions to the upstream source** (all commented in the
file):

1. `y` — upstream fades + un-blurs only. A small rise is what makes it read as
   "fade up". Defaults to `0`, so passing nothing keeps upstream behaviour.
2. `prefers-reduced-motion` — upstream has no guard, which would leave
   motion-sensitive visitors looking at invisible content. With it, the content
   is simply shown.
3. **In-view fast path** — this one was a real bug, and it is worth reading:
   upstream waits for `ScrollTrigger.onEnter`, which fires when an element
   *scrolls into* view. The hero never scrolls into view; it is already there on
   load, so it sat at `opacity: 0` forever and the entire hero — headline, CTA,
   everything — was invisible. Caught by opening the rendered page rather than
   by any test. Elements already on screen now play immediately.

---

## Screenshot placeholders

I used the three real screenshots you sent rather than grey boxes — they are
already in `landing/public/screenshots/`. Phone frames render each image at
its **natural aspect ratio** (no fixed ratio in the markup), so a replacement
screenshot fits without cropping even if its exact pixel width differs a
little.

| File | Shown in | Content |
|---|---|---|
| `home.jpg` | Hero (front phone) + feature 03 | Home / night-kitchen dark mode |
| `recipe-detail.jpg` | Hero (back phone) + feature 02 | Classic Beef Tacos: ingredients, steps, Cook along |
| `grocery-list.jpg` | Feature 01 | Grocery list: aisle sections, quantity pills, checkboxes |

To swap one, drop a replacement with **the same filename and roughly the same
shape** (portrait, ~1:2.2) — nothing else needs changing.

Two things worth re-shooting when convenient:

- These shots still read **"1 cups" / "0.5 cups"** in the quantity pills
  (taken on a device running the previous build); the latest build formats
  them "1 cup" / "0.5 cup".
- The **finish/confetti moment is re-created in CSS** (`FillMeter` + the
  ticked-off rows in feature 04), because it is an animation. A short screen
  recording, or an animated GIF/WebP, would let that block show the real thing.

## Editing copy

- Links, download URL and the size claim: `src/site.js` (one file, nothing
  hard-coded in the markup).
- Section copy: `src/sections/*.jsx` — `Hero`, `Offline`, `Features`,
  `Install`, `Closing`. Each is a small component with the text at the top.
- Colour, type and motion tokens: `src/index.css` under `@theme`. The
  backdrop's illustration palette sits in a plain `:root` block just below it,
  kept out of `@theme` on purpose so those fills are always emitted rather than
  tree-shaken when no utility happens to use them.
- Backdrop shapes: `src/components/CartoonScene.jsx` (one component per piece).

The download button points at
`https://github.com/Parth-191006/Recipe-pilot/releases/latest`, so it always
resolves to the newest APK with zero maintenance. (The repository was renamed
from `Pantry-pilot`; the old URL redirects, but the canonical one is used so
nothing depends on a redirect.)

## Notes and caveats

- **The page is dark-only**, and says so to the browser (`color-scheme: dark` +
  `theme-color`, which follows the sky's top colour). That matches the app's
  signature night-kitchen look.
- **`cream-500` is decoration only — never text.** It used to set the quietest
  labels (the stat captions, the row indices, the struck-through list items) at
  11–14px, where it measured 3.4–4.6:1 against the surfaces it sat on, under AA.
  Those are `cream-400` now (6.2–7.3:1 on the same surfaces) and the contrast
  audit comes back with zero failures across the whole page. `cream-500`
  survives only as underline colours, and the rule is written next to the token
  in `index.css`.
- **No analytics, no cookies.** The only third-party request is the two Google
  Fonts files, which the footer says out loud. If you would rather have zero
  third-party requests, self-host the two fonts in `public/fonts/` and swap the
  `<link>` in `index.html` for `@font-face` rules.
- **This sub-project is invisible to the app's CI.** `flutter test` only looks
  at `test/`, and the workflow only builds the Dart project, so nothing here can
  break the APK build. `landing/.gitignore` keeps `node_modules/` and `dist/` out
  of git.
- **Deploying it:** `npm run build` produces a fully static `landing/dist/`.
  `vite.config.js` sets `base: './'`, so it also works from a subdirectory —
  GitHub Pages project sites (`username.github.io/Recipe-pilot/`) included.
- **Bundle size:** ~7.8 KB gzipped CSS and ~122 KB gzipped JS, of which roughly a
  quarter is GSAP. If you ever want it leaner, replacing `FadeContent` with a
  small IntersectionObserver + CSS transition drops GSAP entirely and cuts most
  of that JS — at the cost of the one React Bits component the brief asked for.
