"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

const pillars = [
  {
    num: "01",
    label: "Presence",
    head: (
      <>
        Ready before you <em className="accent">finish the thought.</em>
      </>
    ),
    sub: "Listening for your voice. No loading screens, no wake-up delays.",
  },
  {
    num: "02",
    label: "Intelligence",
    head: (
      <>
        It doesn&apos;t follow a script. It <em className="accent">thinks.</em>
      </>
    ),
    sub: "Genuine reasoning that understands context, and follows your mind rather than a script.",
  },
  {
    num: "03",
    label: "Memory",
    head: (
      <>
        It <em className="accent">remembers</em> you, permanently.
      </>
    ),
    sub: "Your work, your preferences and your past conversations build into a deep understanding over time.",
  },
  {
    num: "04",
    label: "Privacy",
    head: (
      <>
        Nothing ever <em className="accent">leaves.</em>
      </>
    ),
    sub: "Every computation happens on your hardware. Your data never touches a server. Not even once.",
  },
];

/**
 * The four principles, told one at a time. The section pins to the viewport
 * and the scroll position drives the story: each statement settles in, holds,
 * and gives way to the next, while concentric rings behind it fill in.
 */
export function PillarsSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".story-line");
      const rings = gsap.utils.toArray<HTMLElement>(".story-ring");
      const core = section.querySelector<HTMLElement>(".story-core");

      gsap.set(lines, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + window.innerHeight * 3.6,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const next = Math.min(pillars.length - 1, Math.floor(self.progress * pillars.length));
            setPhase((p) => (p === next ? p : next));
          },
        },
      });

      lines.forEach((line, i) => {
        tl.fromTo(
          line,
          { opacity: 0, y: 70, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" }
        );
        // each ring fills in as its statement arrives
        if (rings[i]) tl.to(rings[i], { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }, "<");
        if (i < lines.length - 1) {
          tl.to(line, { opacity: 0, y: -70, filter: "blur(10px)", duration: 1, ease: "power2.in" }, "+=0.9");
        }
      });
      if (core) tl.to(core, { scale: 1.6, opacity: 1, duration: lines.length * 2, ease: "none" }, 0);
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  // Reduced motion: the same four statements, stacked and always visible.
  if (reduced) {
    return (
      <section className="section" aria-labelledby="pillars-title">
        <div className="wrap">
          <h2 id="pillars-title" className="sr-only">
            Core principles
          </h2>
          <ol className="flex flex-col gap-20">
            {pillars.map((p) => (
              <li key={p.num} className="max-w-[26ch]">
                <div className="eyebrow mb-5">
                  {p.num} · {p.label}
                </div>
                <p className="h1">{p.head}</p>
                <p className="lede mt-6 max-w-[44ch]">{p.sub}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative z-10 grid h-dvh min-h-[560px] place-items-center overflow-hidden"
      aria-labelledby="pillars-title"
    >
      <h2 id="pillars-title" className="sr-only">
        Core principles
      </h2>

      {/* concentric rings and a warm core, filled in by scroll */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
        <div
          className="story-core absolute h-[44vmin] w-[44vmin] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(var(--ember-rgb), 0.28), rgba(var(--ember-rgb), 0.06) 55%, transparent 72%)",
          }}
        />
        {[28, 46, 66, 90].map((size, i) => (
          <div
            key={size}
            className="story-ring absolute rounded-full border border-ember/20 opacity-25"
            style={{ width: `${size}vmin`, height: `${size}vmin`, transform: `scale(${0.88 + i * 0.01})` }}
          />
        ))}
      </div>

      <div className="relative z-[2] h-[70vh] w-full max-w-[1100px] px-5 md:px-10">
        {pillars.map((p) => (
          <div
            key={p.num}
            className="story-line absolute inset-0 flex flex-col items-center justify-center px-5 text-center md:px-10"
          >
            <div className="eyebrow mb-6">
              {p.num} · {p.label}
            </div>
            <p
              className="font-display font-light text-bone"
              style={{
                fontSize: "clamp(2.2rem, 1rem + 5.4vw, 5.6rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.015em",
                textWrap: "balance",
              }}
            >
              {p.head}
            </p>
            <p className="lede mt-7 max-w-[44ch]">{p.sub}</p>
          </div>
        ))}
      </div>

      {/* position within the sequence */}
      <ol
        className="absolute bottom-10 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-3 font-mono text-micro text-muted"
        aria-hidden="true"
      >
        {pillars.map((p, i) => (
          <li key={p.num} className="flex items-center gap-3">
            <span className={`transition-colors duration-500 ${i === phase ? "text-ember" : ""}`}>{p.num}</span>
            {i < pillars.length - 1 && (
              <span
                className={`h-px w-8 transition-colors duration-500 ${i < phase ? "bg-ember" : "bg-border-mid"}`}
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
