import FadeContent from '../components/FadeContent.jsx';

const PROOF = [
  ['0', 'accounts to create'],
  ['0', 'network calls, ever'],
  ['0', 'permissions asked for'],
];

/**
 * The differentiator gets a real section instead of a tooltip-length bullet.
 *
 * Layout: a 7/5 split with the numbers in a hairline-separated stack, and the
 * section enters on a diagonal seam so the page has one recurring organic
 * edge rather than three stacked rectangles.
 */
export default function Offline() {
  return (
    <section
      id="offline"
      className="relative mt-20 bg-night-900 pt-20 pb-28 sm:mt-28 sm:pt-28 sm:pb-36"
    >
      <div
        aria-hidden="true"
        className="absolute -top-9 left-0 h-10 w-full bg-night-900 [clip-path:polygon(0_100%,100%_0,100%_100%)] sm:-top-12 sm:h-14"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="text-[0.68rem] font-bold tracking-[0.18em] text-herb-300 uppercase">
              The part that actually matters
            </p>

            <FadeContent duration={900} y={18}>
              <h2 className="mt-5 text-[2.05rem] leading-[1.08] font-semibold text-cream-50 sm:text-[2.8rem]">
                A recipe app has no business asking you to sign in.
              </h2>

              <div className="mt-7 space-y-5 text-[1.04rem] leading-relaxed text-cream-300 sm:text-lg">
                <p>
                  There is no login, no cloud sync, no analytics and no ads.
                  Every recipe you type is written to a small database inside the
                  app, on the device in your hand — so the list keeps working on a
                  plane, in the basement of a supermarket with no signal, or on
                  the last 3% of battery.
                </p>
                <p>
                  Nothing gets uploaded, because there is no server to upload it
                  to. That is the entire design, and it is why the app is small,
                  instant, and genuinely nobody else's business.
                </p>
              </div>
            </FadeContent>
          </div>

          <div className="lg:col-span-5 lg:pt-3">
            <dl className="grid gap-8 border-t border-herb-400/20 pt-9 sm:grid-cols-3 lg:grid-cols-1">
              {PROOF.map(([value, label]) => (
                // flex-col-reverse: the number reads first on screen while the
                // markup keeps the correct <dt> then <dd> order.
                <div key={label} className="flex flex-col-reverse gap-1.5">
                  <dt className="text-[0.7rem] font-semibold tracking-[0.16em] text-cream-500 uppercase">
                    {label}
                  </dt>
                  <dd className="display text-5xl leading-none font-semibold text-herb-300">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
