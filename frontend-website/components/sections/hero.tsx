"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Download, Play } from "lucide-react";
import { EmberCanvas } from "@/components/ember-canvas";
import { Button } from "@/components/ui/button";

const ease = [0.22, 0.8, 0.2, 1] as const;

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease },
});

const facts = ["100% local", "No subscription", "Windows 10 and 11"];

// The opening sequence. Scroll starts here: the wordmark gives way to three
// statements while the scene behind pushes forward.
const sequence = [
  {
    head: (
      <>
        Not a <em className="accent">chatbot.</em>
      </>
    ),
    sub: "Ashwatthama is a desktop presence that thinks alongside you.",
  },
  {
    head: (
      <>
        No subscriptions. No servers. <em className="accent">No surveillance.</em>
      </>
    ),
    sub: "Every computation happens on your own hardware.",
  },
  {
    head: (
      <>
        Intelligence that is <em className="accent">entirely yours.</em>
      </>
    ),
    sub: "Download once. Own it forever.",
    cta: true,
  },
];

export function HeroSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const intro = section.querySelector<HTMLElement>(".hero-intro");
      const world = section.querySelector<HTMLElement>(".hero-world");
      const grid = section.querySelector<HTMLElement>(".hero-grid");
      const glow = section.querySelector<HTMLElement>(".hero-glow");
      const lines = gsap.utils.toArray<HTMLElement>(".hero-line");

      gsap.set(lines, { autoAlpha: 0 });

      const total = 1.6 + (lines.length - 1) * 2.1 + 1.6;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + window.innerHeight * 3.4,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // the scene pushes forward for the whole sequence
      if (world) tl.to(world, { scale: 2.8, ease: "none", duration: total }, 0);
      if (grid) tl.to(grid, { scale: 1.6, ease: "none", duration: total }, 0);
      if (glow) tl.to(glow, { opacity: 1, scale: 1.4, ease: "none", duration: total }, 0);

      // the wordmark and its call to action step aside
      if (intro) {
        tl.to(intro, { autoAlpha: 0, y: -60, filter: "blur(10px)", duration: 1, ease: "power2.in" }, 0.5);
      }

      lines.forEach((line, i) => {
        const at = 1.6 + i * 2.1;
        tl.fromTo(
          line,
          { autoAlpha: 0, y: 70, filter: "blur(10px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" },
          at
        );
        if (i < lines.length - 1) {
          tl.to(line, { autoAlpha: 0, y: -70, filter: "blur(10px)", duration: 1, ease: "power2.in" }, at + 1.5);
        }
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex h-dvh min-h-[640px] flex-col items-center justify-center overflow-hidden px-5 text-center md:px-10"
      aria-label="Introduction"
    >
      {/* the scene: hairline grid, a warm horizon and concentric rings */}
      <div className="hero-grid grid-lines absolute inset-0" aria-hidden="true" />
      <div
        className="hero-glow pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, rgba(var(--ember-rgb), 0.18), transparent 70%), radial-gradient(90% 60% at 50% 125%, rgba(var(--ember-rgb), 0.14), transparent)",
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
        <div className="hero-world absolute grid place-items-center">
          {[34, 56, 80].map((size) => (
            <div
              key={size}
              className="absolute rounded-full border border-ember/[0.12]"
              style={{ width: `${size}vmin`, height: `${size}vmin` }}
            />
          ))}
        </div>
      </div>
      <EmberCanvas />

      <div className="hero-intro relative z-[2] flex w-full max-w-[1100px] flex-col items-center pt-16">
        <motion.div {...fade(0.05)}>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-border-mid bg-obsidian/50 px-4 py-1.5 font-mono text-label uppercase text-muted backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ember" aria-hidden="true" />
            Available now for Windows
          </span>
        </motion.div>

        <motion.h1
          {...fade(0.15)}
          className="h1 mt-8"
          style={{ fontSize: "clamp(3rem, 1rem + 11.5vw, 9.5rem)", letterSpacing: "0.005em", lineHeight: 0.92 }}
        >
          Ashwat<span className="accent">thama</span>
        </motion.h1>

        <motion.p {...fade(0.3)} className="lede mt-6 max-w-[34ch] text-bone">
          Not a chatbot. An AI that lives on your machine.
        </motion.p>

        <motion.p {...fade(0.4)} className="body-text mt-4 max-w-[56ch]">
          Ashwatthama thinks alongside you. It works, remembers and assists, without a single byte
          leaving your computer. No subscriptions, no servers, no surveillance.
        </motion.p>

        <motion.div {...fade(0.5)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href="/download/" size="lg" magnetic>
            <Download size={17} />
            Download for Windows
          </Button>
          <Button href="#demo" variant="secondary" size="lg">
            <Play size={15} />
            Watch the demo
          </Button>
        </motion.div>

        <motion.ul
          {...fade(0.65)}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-label uppercase text-muted [@media(max-height:720px)]:hidden"
          aria-label="Highlights"
        >
          {facts.map((f) => (
            <li key={f} className="flex items-center gap-2.5">
              <span className="h-px w-4 bg-ember" aria-hidden="true" />
              {f}
            </li>
          ))}
        </motion.ul>
      </div>

      {/* the statements that take over as the sequence plays */}
      {!reduced &&
        sequence.map((s, i) => (
          <div
            key={i}
            className="hero-line absolute inset-0 z-[2] flex flex-col items-center justify-center px-5 text-center md:px-10"
          >
            <p
              className="max-w-[18ch] font-display font-light text-bone md:max-w-[22ch]"
              style={{
                fontSize: "clamp(2.2rem, 1rem + 5.4vw, 5.6rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.015em",
                textWrap: "balance",
              }}
            >
              {s.head}
            </p>
            <p className="lede mt-7 max-w-[44ch]">{s.sub}</p>
            {s.cta && (
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Button href="/download/" size="lg">
                  <Download size={17} />
                  Download for Windows
                </Button>
                <Button href="#demo" variant="secondary" size="lg">
                  <Play size={15} />
                  Watch the demo
                </Button>
              </div>
            )}
          </div>
        ))}
    </section>
  );
}
