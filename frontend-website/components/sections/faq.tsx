"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SectionHeader } from "@/components/ui/section-header";

const faqs = [
  {
    q: "What hardware do I need?",
    a: "Windows 10 or 11 (64-bit), 8GB RAM minimum, any modern CPU. Recommended: 16GB RAM and a dedicated GPU with 4GB+ VRAM for the fastest experience. Core voice and AI features run on CPU-only if you have no dedicated GPU.",
  },
  {
    q: "Does it really work completely offline?",
    a: "Yes. Voice recognition, wake word detection, text-to-speech, reasoning, memory, and desktop controls all run locally with zero internet. The only features that require connectivity are web search and messaging apps — because those services themselves require the internet. The AI core is always 100% offline.",
  },
  {
    q: "Is my voice data stored or sent anywhere?",
    a: "Never. Audio is processed entirely in memory, locally. Transcripts are stored in a local database on your machine that never leaves. Diary entries are encrypted at rest. The encryption key lives in your OS credential vault, not in any file.",
  },
  {
    q: "How is this different from Alexa or Siri?",
    a: "Mainstream assistants are cloud-first: your voice is sent to corporate servers for processing. Ashwatthama inverts that model — every computation happens on your hardware. Additionally, Ashwatthama integrates deeply with your OS, has persistent memory that grows over time, reads your screen, understands documents, and runs entirely free — features no mainstream assistant offers.",
  },
  {
    q: "Is it free? Will there be a subscription?",
    a: "The desktop application will be free to download and use forever. No subscription, no usage limits. Future optional cloud-sync features may be paid add-ons, but the core — voice, AI, memory, desktop control — will always be free and fully offline.",
  },
  {
    q: "When is it available to download?",
    a: "Now. Create an account and download the Windows installer right away. macOS and Linux are on the future roadmap.",
  },
];

export function FAQSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section
      ref={ref}
      id="faq"
      className="relative z-10 max-w-[820px] mx-auto mt-16 md:mt-24 px-4 md:px-12"
      aria-labelledby="faq-title"
    >
      <SectionHeader
        eyebrow="Questions"
        titleId="faq-title"
        title="Common transmissions."
        className="mb-10 md:mb-14"
      />

      <div>
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.04 * i }}
            className={`border-b border-border ${i === 0 ? "border-t" : ""}`}
          >
            <button
              onClick={() => toggle(i)}
              aria-expanded={openIndex === i}
              className="w-full flex justify-between items-center py-4 md:py-5 cursor-pointer font-display font-normal text-bone text-left transition-colors duration-200 hover:text-ember-glow gap-4"
              style={{ fontSize: "clamp(0.98rem, 1.7vw, 1.15rem)" }}
            >
              <span>{faq.q}</span>
              <span
                className="font-mono text-lg text-ember flex-shrink-0 transition-transform duration-300 leading-none"
                style={{
                  transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                }}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-[0.9rem] leading-[1.75] text-muted pb-4 md:pb-5">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
