"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Mail, Lock } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";

export function ContactSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="contact"
      className="relative z-10 max-w-[1280px] mx-auto mt-16 md:mt-24 px-4 md:px-12"
      aria-labelledby="contact-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8"
      >
        <div className="section-eyebrow mb-0" id="contact-title">
          Connect
        </div>
        <p className="text-muted text-sm max-w-sm sm:text-right leading-relaxed">
          Questions, feedback, bugs, or partnership ideas please reach out any time.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="relative border border-border bg-obsidian-raised/80 backdrop-blur-xl overflow-hidden"
      >
        {/* Top glow line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-60 z-[1]"
          style={{
            background: "linear-gradient(to right, transparent, var(--ember), transparent)",
          }}
        />
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(224,114,58,0.1) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        <div className="relative grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <a
            href="mailto:workreachoutanimesh@gmail.com"
            className="group p-6 md:p-8 transition-colors duration-300 hover:bg-ember-dim active:bg-ember-dim"
          >
            <p className="font-mono text-label uppercase tracking-[0.32em] text-ember mb-3">
              Email
            </p>
            <div className="flex items-center gap-2.5 text-base sm:text-lg min-w-0">
              <Mail size={16} className="text-ember-glow shrink-0" aria-hidden="true" />
              <span className="font-display text-bone truncate group-hover:text-ember-glow transition-colors duration-300">
                MAIL
              </span>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/animesh-dhiman-658250311/"
            target="_blank"
            rel="noreferrer"
            className="group p-6 md:p-8 transition-colors duration-300 hover:bg-ember-dim active:bg-ember-dim"
          >
            <p className="font-mono text-label uppercase tracking-[0.32em] text-ember mb-3">
              LINKEDIN
            </p>
            <div className="flex items-center gap-2.5 text-base sm:text-lg min-w-0">
              <LinkedinIcon className="w-4 h-4 text-ember-glow shrink-0" />
              <span className="font-display text-bone truncate group-hover:text-ember-glow transition-colors duration-300">
                Animesh Dhiman
              </span>
            </div>
            <span className="sr-only"> (opens in new tab)</span>
          </a>

          <a
            href="https://github.com/animesh8787"
            target="_blank"
            rel="noreferrer"
            className="group p-6 md:p-8 transition-colors duration-300 hover:bg-ember-dim active:bg-ember-dim"
          >
            <p className="font-mono text-label uppercase tracking-[0.32em] text-ember mb-3">
              GitHub
            </p>
            <div className="flex items-center gap-2.5 text-base sm:text-lg min-w-0">
              <GithubIcon className="w-4 h-4 text-ember-glow shrink-0" />
              <span className="font-display text-bone truncate group-hover:text-ember-glow transition-colors duration-300">
                animesh8787
              </span>
            </div>
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
