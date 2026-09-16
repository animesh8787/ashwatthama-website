"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { EmberCanvas } from "@/components/ember-canvas";
import { Button } from "@/components/ui/button";
import { Download, Play } from "lucide-react";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // As the user scrolls the hero out of view, the content fades, lifts and
  // very slightly shrinks — with the orb moving a touch faster than the text
  // beneath it for a shallow parallax depth, rather than everything sliding
  // off screen as one flat block.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const ringsScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const ringsOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-4 md:px-16 pt-[100px] pb-[60px] md:pt-[120px] lg:pt-[140px] lg:pb-[80px] text-center overflow-hidden"
      aria-label="Hero"
    >
      <EmberCanvas />

      {/* Sacred geometry rings */}
      <motion.div
        style={{ scale: ringsScale, opacity: ringsOpacity }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] pointer-events-none w-[min(700px,90vw)] h-[min(700px,90vw)] lg:w-[min(920px,72vw)] lg:h-[min(920px,72vw)] rounded-full border border-ember/[0.06]"
        aria-hidden="true"
      >
        <div className="absolute inset-[40px] rounded-full border border-ember/[0.05]" />
        <div className="absolute inset-[100px] rounded-full border border-ember/[0.04]" />
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY, scale: contentScale }}
        className="relative z-[3] flex flex-col items-center max-w-[1000px] lg:max-w-[1160px] w-full"
      >
        {/* Orb */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ y: orbY }}
          className="relative w-[clamp(80px,14vw,120px)] h-[clamp(80px,14vw,120px)] rounded-full mb-7 md:mb-10 flex items-center justify-center animate-orb-pulse"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 38% 38%, rgba(243,168,97,0.5), rgba(224,114,58,0.3) 40%, rgba(140,60,20,0.15) 70%, transparent)",
              border: "1px solid rgba(224,114,58,0.35)",
            }}
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative w-[38%] h-[38%] text-ember-glow opacity-85"
          >
            <path d="M12 2c0 6-6 6-6 12a6 6 0 0 0 12 0c0-6-6-6-6-12z" />
            <path d="M12 2c0 4 3 5 3 9" />
          </svg>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2.5 mb-6 md:mb-8 border border-border-mid bg-surface/60 backdrop-blur-md rounded-full px-[18px] py-[7px] font-mono text-label-lg uppercase tracking-[0.3em] text-muted"
          role="status"
        >
          <span className="text-ember text-[8px]" aria-hidden="true">
            ◆
          </span>
          <span>Local-First AI Companion · Available Now</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-light leading-[0.88] tracking-[0.01em] text-bone whitespace-nowrap px-[0.04em]"
          style={{ fontSize: "clamp(3rem, 13vw, 10rem)" }}
          aria-label="Ashwatthama"
        >
          Ashwat<em className="italic text-ember-glow" style={{ textShadow: "0 0 30px rgba(243,168,97,0.4), 0 0 80px rgba(224,114,58,0.2)" }}>thama</em>
        </motion.h1>

        {/* Lede */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-display italic font-light mt-4 md:mt-6 text-bone-muted leading-[1.3] max-w-[40ch]"
          style={{ fontSize: "clamp(1.05rem, 2.4vw, 1.6rem)" }}
        >
          Not a chatbot. An AI that lives on your machine.
        </motion.p>

        {/* Myth line */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-3 font-mono uppercase tracking-[0.3em] text-ember opacity-80 leading-[1.8]"
          style={{ fontSize: "clamp(9px, 1.3vw, 10.5px)" }}
          aria-label="Named after the immortal warrior from the Mahabharata"
        >
          Named after the immortal warrior &nbsp;·&nbsp; Always present &nbsp;·&nbsp; Never sleeping
        </motion.p>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-4 md:mt-5 text-muted leading-[1.72] max-w-[54ch]"
          style={{ fontSize: "clamp(0.9rem, 1.5vw, 1rem)" }}
        >
          Ashwatthama thinks alongside you. It works, remembers, and assists —
          without a single byte leaving your computer. No subscriptions. No
          servers. No surveillance. Just intelligence, entirely yours.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-8 md:mt-12 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Link href="/download/">
            <Button variant="primary">
              <Download size={14} />
              Download for Windows
            </Button>
          </Link>
          <a href="#demo">
            <Button variant="secondary">
              <Play size={12} />
              Watch Demo
            </Button>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <div className="w-px h-11 bg-gradient-to-b from-ember to-transparent opacity-40" />
        <span className="font-mono text-micro uppercase tracking-[0.4em] text-muted-2">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
