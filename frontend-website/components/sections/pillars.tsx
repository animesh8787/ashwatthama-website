"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

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

export function PillarsSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`relative z-10 max-w-[1280px] mx-auto mt-16 md:mt-24 border-t border-b border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      aria-label="Core capabilities"
    >
      {pillars.map((p, i) => (
        <motion.div
          key={p.num}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className="bg-obsidian-raised p-6 md:p-9 transition-colors duration-200 hover:bg-[rgba(24,17,12,1)]"
        >
          <div className="font-mono text-label uppercase tracking-[0.34em] text-ember mb-3">
            {p.num} · {p.label}
          </div>
          <div className="font-display font-normal text-bone leading-[1.1]"
            style={{ fontSize: "clamp(1.35rem, 2.2vw, 1.85rem)" }}
          >
            {p.title}
          </div>
          <p className="mt-2.5 text-[0.88rem] leading-[1.65] text-muted">
            {p.desc}
          </p>
        </motion.div>
      ))}
    </section>
  );
}
