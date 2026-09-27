import FillMeter from '../components/FillMeter.jsx';
import PhoneFrame from '../components/PhoneFrame.jsx';

const AISLES = [
  '🥬 Produce',
  '🧈 Dairy & Eggs',
  '🥩 Meat & Seafood',
  '🥫 Pantry',
  '🧂 Spices & Baking',
  '🛒 Other',
];

const ROWS = [
  {
    index: '01',
    kicker: 'The parser',
    title: 'The boring part, done before you notice it.',
    body: [
      'Type or paste an ingredient and a rule-based parser takes it apart: amount, unit, name, aisle. It knows that ½ is half, that "2-3 cloves" is a range and not a sum, that green onions are scallions, and that "1 (14 oz) can diced tomatoes" is one tin of tomatoes rather than a maths problem.',
      'Anything it genuinely cannot split safely — "2 cups flour and 1 cup sugar" — is flagged instead of guessed at, and one tap lets you rewrite the line, split it in two, or drop it.',
    ],
    src: './screenshots/grocery-list.jpg',
    alt: 'Grocery list screen: progress header reading 0 of 9 picked up, then Produce, Dairy & Eggs and Meat & Seafood sections with checkboxes and quantity pills.',
    rotate: -2.5,
    glow: 'herb',
    caption:
      'Real screenshot — one tap turns Classic Beef Tacos into counted, tickable aisles.',
    chips: AISLES,
  },
  {
    index: '02',
    kicker: 'Cook along',
    title: 'Timers that bend to the way the night is going.',
    body: [
      'One step at a time in text you can read from across the kitchen, with a countdown per step and a stopwatch for the steps that have no time at all. The screen stays awake while you cook.',
      'The sauce needs five more minutes? Tap +5. An untimed step suddenly matters? Give it a timer. Your adjustments belong to that step and that cook — the saved recipe is never rewritten behind your back.',
    ],
    src: './screenshots/recipe-detail.jpg',
    alt: 'Recipe screen for Classic Beef Tacos showing nine ingredients, tag pills for Quick & Easy, Dinner, High Protein and Mexican, the Ingredients list, Steps, and buttons for Cook along and Generate grocery list.',
    rotate: 2.5,
    glow: 'ember',
    caption: 'Real screenshot — steps carry their own timings; cook-along uses them.',
    chips: ['+1 min', '+5 min', '−1 min', 'stopwatch instead'],
  },
  {
    index: '03',
    kicker: 'Night kitchen',
    title: 'Hand-tuned for a dark kitchen at 9pm.',
    body: [
      'Warm charcoal instead of black, soft glows behind the icons, and a cartoon kitchen hero that switches to a night scene after dark. The glow is a setting, not a rule — switch it off if you would rather keep things flat.',
      'There is no white flash on launch, because there is no white anywhere.',
    ],
    src: './screenshots/home.jpg',
    alt: 'Home screen in dark mode: RECIPE PILOT hero card reading Plan it. Shop it. Cook it., library statistics, New recipe / Surprise me / My list actions and a Ready in 30 shelf.',
    rotate: -3,
    glow: 'cream',
    caption: 'Real screenshot — night scene, glowing tiles, and the stats at a glance.',
    chips: ['dark by default', 'glow toggle', '10 built-in recipes'],
  },
];

/**
 * Feature highlights as alternating rows with real screenshots in phone
 * frames — deliberately not three identical icon-headline-paragraph cards.
 * Each row leans the other way, the text column and frame widths differ, and
 * the fourth moment breaks the pattern entirely as a full-width band.
 */
export default function Features() {
  return (
    <section id="screens" className="relative pt-24 sm:pt-32">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* Deliberately *not* wrapped in FadeContent: the brief asked for the
            hero entrance plus one or two scroll reveals, and those two beats
            are the offline section and the closing CTA. A third would make the
            motion ordinary. */}
        <div className="max-w-2xl">
          <p className="text-[0.68rem] font-bold tracking-[0.18em] text-herb-300 uppercase">
            What it does
          </p>
          <h2 className="mt-5 text-[2.05rem] leading-[1.08] font-semibold text-cream-50 sm:text-[2.8rem]">
            Four things, done properly.
          </h2>
          <p className="mt-5 text-[1.04rem] leading-relaxed text-cream-300 sm:text-lg">
            Everything below is in the app today. The screenshots are from a real
            phone, not a mockup deck.
          </p>
        </div>

        <div className="mt-6 sm:mt-10">
          {ROWS.map((row, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={row.index}
                className="grid items-center gap-12 border-t border-white/6 py-14 sm:py-16 md:grid-cols-12 md:gap-14"
              >
                <div
                  className={`md:col-span-5 ${flip ? 'md:order-2 md:col-start-8' : ''}`}
                >
                  <PhoneFrame
                    src={row.src}
                    alt={row.alt}
                    rotate={row.rotate}
                    glow={row.glow}
                    width={i === 1 ? 'w-[14.5rem] sm:w-[15.5rem]' : 'w-[15.5rem] sm:w-[16.5rem]'}
                    className="mx-auto md:mx-0"
                    caption={row.caption}
                  />
                </div>

                <div
                  className={`md:col-span-6 ${flip ? 'md:order-1 md:col-start-1' : 'md:col-start-7'}`}
                >
                  <p className="display flex items-baseline gap-3 text-sm font-semibold tracking-[0.14em] text-ember-300 uppercase">
                    <span className="text-cream-500">{row.index}</span>
                    {row.kicker}
                  </p>
                  <h3 className="mt-4 text-[1.6rem] leading-[1.15] font-semibold text-cream-50 sm:text-[2rem]">
                    {row.title}
                  </h3>
                  {row.body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 24)}
                      className="mt-4 leading-relaxed text-cream-300"
                    >
                      {paragraph}
                    </p>
                  ))}
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {row.chips.map((chip) => (
                      <li
                        key={chip}
                        className="rounded-full border border-white/8 bg-night-800/70 px-3 py-1.5 text-[0.78rem] font-medium text-cream-300"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* 04 — the finish line. The celebration is a particle rain, so it is
            re-created here in CSS and labelled as such rather than faked with a
            still image. */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/6 bg-night-850 px-6 py-12 sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="glow-herb pointer-events-none absolute -top-24 -right-16 h-80 w-80 opacity-70"
          />
          <div className="relative grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="display flex items-baseline gap-3 text-sm font-semibold tracking-[0.14em] text-herb-300 uppercase">
                <span className="text-cream-500">04</span>
                The finish line
              </p>
              <h3 className="mt-4 text-[1.6rem] leading-[1.15] font-semibold text-cream-50 sm:text-[2rem]">
                The last box gets ticked and the confetti falls.
              </h3>
              <p className="mt-4 leading-relaxed text-cream-300">
                Every checkbox pops with its own little burst, checked rows dim and
                strike through, and the meter climbs with you. Clear the list and
                the whole screen celebrates — a small thing that makes the walk
                from the last aisle to the till feel finished.
              </p>
            </div>

            <div className="rounded-2xl border border-white/6 bg-night-800 p-5 shadow-lift">
              <div className="flex items-baseline justify-between">
                <span className="display text-2xl font-semibold text-cream-50">
                  9 of 9
                </span>
                <span className="text-[0.72rem] font-semibold tracking-[0.16em] text-cream-500 uppercase">
                  picked up
                </span>
              </div>
              <FillMeter className="mt-4" />
              <ul className="mt-5 space-y-3 text-[0.9rem]">
                {[
                  ['🥬', '1 cup Lettuce'],
                  ['🥩', '1 lb Beef'],
                  ['🥫', '1 packet Taco seasoning'],
                ].map(([emoji, label]) => (
                  <li key={label} className="flex items-center gap-3">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-herb-400 text-[0.6rem] text-night-950">
                      ✓
                    </span>
                    <span className="text-cream-500 line-through">
                      {emoji} {label}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-cream-500">
                Re-created in CSS, not a screenshot: the real thing is a burst of
                falling particles, which a still frame cannot show.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
