"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";

const pillars = [
  {
    num: "01",
    label: "Presence",
    title: "Always On",
    desc: "Listening for your voice. Ready before you finish the thought. No loading screens, no wake-up delays.",
  },
  {
    num: "02",
    label: "Intelligence",
    title: "Truly Thinks",
    desc: "Powered by genuine reasoning that understands context, not scripted responses. It follows your mind, not a script.",
  },
  {
    num: "03",
    label: "Memory",
    title: "Remembers You",
    desc: "Builds a deep understanding of your work, preferences, and past conversations over time. It knows you.",
  },
  {
    num: "04",
    label: "Privacy",
    title: "Zero Cloud",
    desc: "Every computation happens on your hardware. Your data never touches a server. Not even once.",
  },
];

const COUNT = pillars.length;

export function PillarsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const next = Math.min(COUNT - 1, Math.floor(v * COUNT));
      setActive((prev) => (prev === next ? prev : next));
    });
  }, [scrollYProgress]);

  // A slim glow that sweeps left-to-right across the pinned pane in step
  // with overall scroll progress, so the panel still feels alive even
  // between pillar transitions.
  const sweepX = useTransform(scrollYProgress, [0, 1], ["-10%", "110%"]);

  return (
    <section
      className="relative z-10 max-w-[1280px] mx-auto mt-16 md:mt-24 px-4 md:px-12"
      aria-label="Core capabilities"
    >
      <SectionHeader
        eyebrow="Core Capabilities"
        title="Four pillars, one presence."
        subtitle="Scroll through — each one stays on screen just long enough to land."
        className="mb-8 md:mb-10"
      />

      {/* Tall scroll track: its height (not the pinned pane's) is what turns
          continued scrolling into "time" the pinned pane can spend on each
          pillar, the same mechanism behind Apple's product deep-dive
          sections. */}
      <div ref={trackRef} className="relative h-[320vh] md:h-[380vh]">
        <div className="sticky top-0 h-dvh flex items-center overflow-hidden">
          <div className="relative w-full border border-border bg-obsidian-raised overflow-hidden">
            {/* Ambient sweep */}
            <motion.div
              aria-hidden="true"
              style={{ left: sweepX }}
              className="absolute top-0 bottom-0 w-[40%] pointer-events-none"
            >
              <div
                className="w-full h-full"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(var(--ember-rgb),0.08), transparent 70%)",
                }}
              />
            </motion.div>

            <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 p-8 sm:p-12 md:p-16 lg:p-20">
              <div className="min-h-[280px] sm:min-h-[240px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -28 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="font-mono text-label-lg uppercase tracking-[0.34em] text-ember mb-4 md:mb-6">
                      {pillars[active].num} · {pillars[active].label}
                    </div>
                    <div
                      className="font-display font-light text-bone leading-[1.02]"
                      style={{ fontSize: "clamp(2.4rem, 7vw, 5.2rem)" }}
                    >
                      {pillars[active].title}
                    </div>
                    <p className="mt-4 md:mt-6 text-muted leading-[1.7] max-w-[46ch]" style={{ fontSize: "clamp(0.92rem, 1.6vw, 1.05rem)" }}>
                      {pillars[active].desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress rail */}
              <div className="flex lg:flex-col items-center lg:justify-center gap-3 lg:gap-5">
                {pillars.map((p, i) => (
                  <div key={p.num} className="flex lg:flex-col items-center gap-2">
                    <span
                      className={`h-px lg:h-8 w-8 lg:w-px transition-colors duration-500 ${
                        i <= active ? "bg-ember" : "bg-border-mid"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`font-mono text-micro tabular-nums transition-colors duration-500 ${
                        i === active ? "text-ember" : "text-muted-2"
                      }`}
                    >
                      {p.num}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
