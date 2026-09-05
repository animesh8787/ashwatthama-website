"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Play } from "lucide-react";

export function DemoSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="demo"
      className="relative z-10 max-w-[1280px] mx-auto mt-16 md:mt-24 px-4 md:px-12"
      aria-labelledby="demo-title"
    >
      <div
        className={`transition-all duration-700 mb-8 md:mb-12 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="section-eyebrow">Preview</div>
        <h2 id="demo-title" className="section-title">
          See it <em className="italic text-ember-glow">think.</em>
        </h2>
        <p className="section-sub">
          A full walkthrough of Ashwatthama running locally — voice, memory, and
          desktop control in action.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative w-full aspect-video border border-border-mid bg-surface/60 backdrop-blur-xl overflow-hidden group"
      >
        {/* Top glow line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-60 z-[1]"
          style={{
            background: "linear-gradient(to right, transparent, var(--ember), transparent)",
          }}
        />
        {/* Ambient orange glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(224,114,58,0.14) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
          <div
            className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border border-ember/40 flex items-center justify-center animate-orb-pulse transition-transform duration-300 group-hover:scale-105"
            style={{
              background:
                "radial-gradient(circle at 38% 38%, rgba(243,168,97,0.35), rgba(224,114,58,0.22) 40%, transparent)",
            }}
          >
            <Play
              size={22}
              className="text-ember-glow ml-1"
              fill="currentColor"
              aria-hidden="true"
            />
          </div>
          <div>
            <div className="font-mono text-label-lg uppercase tracking-[0.32em] text-ember mb-1.5">
              Demo Coming Soon
            </div>
            <p className="font-mono text-label uppercase tracking-[0.24em] text-muted">
              The full walkthrough is in production
            </p>
          </div>
        </div>

        {/* Corner frame accents for a "media player" feel */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-ember/25 pointer-events-none" aria-hidden="true" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-ember/25 pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-ember/25 pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-ember/25 pointer-events-none" aria-hidden="true" />
      </motion.div>
    </section>
  );
}
