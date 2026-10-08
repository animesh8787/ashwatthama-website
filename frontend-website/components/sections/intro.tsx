import { Reveal } from "@/components/ui/reveal";

const exchange = [
  { who: "you", text: "What did I discuss last Tuesday about the project deadline?" },
  {
    who: "ashwatthama",
    text: "You noted the backend needed two more days and mentioned coordinating with the design team on Thursday. You also flagged the authentication flow as incomplete.",
  },
  { who: "you", text: "What's on my screen right now?" },
  {
    who: "ashwatthama",
    text: "You have a code editor open with a Python file, which looks like a route handler. There's also a browser tab showing pull requests.",
  },
  { who: "you", text: "Set a reminder for 4pm to review that PR." },
  { who: "ashwatthama", text: "Done. I'll notify you at 4:00 PM.", cursor: true },
];

export function IntroSection() {
  return (
    <section className="section" aria-labelledby="intro-title">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="eyebrow mb-5">What it is</div>
          <h2 className="h2" id="intro-title">
            An AI that belongs <span className="accent">to you.</span>
          </h2>
          <p className="lede mt-6 max-w-[48ch]">
            Ashwatthama isn&apos;t a web app you log into. It&apos;s a desktop presence: an AI
            operating companion that integrates with your computer, speaks and listens in natural
            language, reads your screen and learns from every interaction.
          </p>
          <p className="body-text mt-5 max-w-[52ch]">
            You ask it to draft an email, and it does. You ask what&apos;s on your screen, and it
            describes it. You tell it something important, and it remembers, permanently, privately,
            on your machine.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <figure
            className="overflow-hidden rounded-2xl border border-border-mid bg-obsidian-raised shadow-card"
            aria-label="Example conversation with Ashwatthama"
          >
            <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-bone/20" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-bone/20" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-bone/20" aria-hidden="true" />
              <span className="ml-2 font-mono text-label text-muted">ashwatthama · running locally</span>
            </div>

            <ol className="flex flex-col gap-4 p-5 md:p-7">
              {exchange.map((m, i) => (
                <li key={i} className="flex gap-3.5">
                  <span
                    className={`mt-0.5 w-[5.5rem] shrink-0 font-mono text-label uppercase ${
                      m.who === "you" ? "text-muted" : "text-ember"
                    }`}
                  >
                    {m.who === "you" ? "You" : "Ashwatthama"}
                  </span>
                  <p
                    className={`text-[0.9375rem] leading-relaxed ${
                      m.who === "you" ? "text-bone" : "text-bone-muted"
                    }`}
                  >
                    {m.text}
                    {m.cursor && (
                      <span
                        className="ml-1 inline-block h-[1em] w-[2px] translate-y-[2px] animate-blink bg-ember align-baseline"
                        aria-hidden="true"
                      />
                    )}
                  </p>
                </li>
              ))}
            </ol>

            <figcaption className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border px-5 py-3.5 font-mono text-label uppercase text-muted md:px-7">
              <span>100% local</span>
              <span>Zero latency</span>
              <span>Always private</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
