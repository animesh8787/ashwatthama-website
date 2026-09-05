"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function IntroSection() {
  const { ref: refLeft, isVisible: visibleLeft } = useScrollReveal<HTMLDivElement>();
  const { ref: refRight, isVisible: visibleRight } = useScrollReveal<HTMLDivElement>();

  return (
    <section
      className="relative z-10 max-w-[1280px] mx-auto mt-16 md:mt-24 px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center"
      aria-label="Product introduction"
    >
      <div
        ref={refLeft}
        className={`transition-all duration-700 ${
          visibleLeft ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="section-eyebrow">What it is</div>
        <h2 className="section-title">
          An AI that belongs
          <br />
          <em className="italic text-ember-glow">to you.</em>
        </h2>
        <p className="section-sub mb-6">
          Ashwatthama isn't a web app you log into. It's a desktop presence — an
          AI operating companion that integrates with your computer, speaks and
          listens in natural language, reads your screen, and learns from every
          interaction.
        </p>
        <p className="section-sub">
          You ask it to draft an email, and it does. You ask what's on your screen,
          and it describes it. You tell it something important, and it remembers —
          not until you close the tab, but permanently, privately, on your machine.
        </p>
      </div>

      <div
        ref={refRight}
        className={`border border-border bg-obsidian-raised p-6 md:p-10 relative overflow-hidden transition-all duration-700 delay-150 ${
          visibleRight ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(224,114,58,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="flex items-center gap-2 mb-5 pb-3.5 border-b border-border">
          <div className="w-2 h-2 rounded-full bg-ember opacity-60" />
          <div className="w-2 h-2 rounded-full bg-ember-glow opacity-45" />
          <div className="w-2 h-2 rounded-full bg-bone-muted opacity-20" />
          <span className="ml-1 font-mono text-label uppercase tracking-[0.28em] text-muted">
            ashwatthama · active
          </span>
        </div>

        <div className="font-mono leading-[1.6]" style={{ fontSize: "clamp(0.75rem, 1.3vw, 0.88rem)" }}>
          <div className="flex items-start gap-3 mb-3.5">
            <span className="text-ember flex-shrink-0">›</span>
            <span className="text-bone">What did I discuss last Tuesday about the project deadline?</span>
          </div>
          <div className="flex items-start gap-3 mb-3.5">
            <span className="text-ember-glow flex-shrink-0">◆</span>
            <span className="text-bone-muted">
              You noted the backend needed two more days and mentioned coordinating with the design team on Thursday. You also flagged the authentication flow as incomplete.
            </span>
          </div>
          <div className="flex items-start gap-3 mt-2 mb-3.5">
            <span className="text-ember flex-shrink-0">›</span>
            <span className="text-bone">What's on my screen right now?</span>
          </div>
          <div className="flex items-start gap-3 mb-3.5">
            <span className="text-ember-glow flex-shrink-0">◆</span>
            <span className="text-bone-muted">
              You have a code editor open with a Python file — looks like a route handler. There's also a browser tab showing pull requests.
            </span>
          </div>
          <div className="flex items-start gap-3 mt-2 mb-3.5">
            <span className="text-ember flex-shrink-0">›</span>
            <span className="text-bone">Set a reminder for 4pm to review that PR.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-ember-glow flex-shrink-0">◆</span>
            <span className="text-bone-muted">
              Done. I'll notify you at 4:00 PM.{" "}
              <span className="inline-block w-2 h-[1em] bg-ember opacity-70 animate-pulse-dot align-text-bottom" />
            </span>
          </div>
        </div>

        <div className="border-t border-border mt-5 pt-3.5 flex gap-5 flex-wrap">
          <span className="font-mono text-label uppercase tracking-[0.28em] text-muted">
            100% Local
          </span>
          <span className="font-mono text-label uppercase tracking-[0.28em] text-muted">
            Zero latency
          </span>
          <span className="font-mono text-label uppercase tracking-[0.28em] text-muted">
            Always private
          </span>
        </div>
      </div>
    </section>
  );
}
