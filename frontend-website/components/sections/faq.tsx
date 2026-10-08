"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const faqs = [
  {
    q: "What hardware do I need?",
    a: "Windows 10 or 11 (64-bit), 8GB RAM minimum, any modern CPU. Recommended: 16GB RAM and a dedicated GPU with 4GB+ VRAM for the fastest experience. Core voice and AI features run on CPU-only if you have no dedicated GPU.",
  },
  {
    q: "Does it really work completely offline?",
    a: "Yes. Voice recognition, wake word detection, text-to-speech, reasoning, memory and desktop controls all run locally with zero internet. The only features that require connectivity are web search and messaging apps, because those services themselves require the internet. The AI core is always 100% offline.",
  },
  {
    q: "Is my voice data stored or sent anywhere?",
    a: "Never. Audio is processed entirely in memory, locally. Transcripts are stored in a local database on your machine that never leaves. Diary entries are encrypted at rest. The encryption key lives in your OS credential vault, not in any file.",
  },
  {
    q: "How is this different from Alexa or Siri?",
    a: "Mainstream assistants are cloud-first: your voice is sent to corporate servers for processing. Ashwatthama inverts that model, so every computation happens on your hardware. It also integrates deeply with your OS, has persistent memory that grows over time, reads your screen, understands documents and runs entirely free: features no mainstream assistant offers.",
  },
  {
    q: "Is it free? Will there be a subscription?",
    a: "The desktop application will be free to download and use forever. No subscription, no usage limits. Future optional cloud-sync features may be paid add-ons, but the core (voice, AI, memory, desktop control) will always be free and fully offline.",
  },
  {
    q: "When is it available to download?",
    a: "Now. Create an account and download the Windows installer right away. macOS and Linux are on the future roadmap.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <SectionHeader
          eyebrow="FAQ"
          titleId="faq-title"
          title={
            <>
              Frequently asked <span className="accent">questions.</span>
            </>
          }
          subtitle="Straight answers about hardware, privacy and pricing."
          className="mb-0 lg:sticky lg:top-28 lg:self-start"
        />

        <Reveal>
          <div className="border-t border-border">
            {faqs.map((faq, i) => {
              const open = openIndex === i;
              return (
                <div key={faq.q} className="border-b border-border">
                  <h3>
                    <button
                      onClick={() => setOpenIndex(open ? null : i)}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-button-${i}`}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-[1.1875rem] font-normal text-bone transition-colors duration-200 hover:text-ember-glow md:py-6"
                    >
                      <span>{faq.q}</span>
                      <Plus
                        size={20}
                        className={`shrink-0 text-ember transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-button-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 0.8, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="body-text max-w-[62ch] pb-6">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
