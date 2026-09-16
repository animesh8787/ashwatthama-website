"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { TiltCard } from "@/components/ui/tilt-card";
import { Eye, Shield, Brain, Lock } from "lucide-react";

const reasons = [
  {
    icon: Eye,
    title: "Cloud AI watches you.",
    desc: "Every conversation you have with a cloud assistant is recorded, analyzed, and stored on someone else's servers. Your thoughts become a product.",
  },
  {
    icon: Shield,
    title: "Ashwatthama protects you.",
    desc: "Your voice never leaves your machine. Your memories stay in your home. Your data is yours alone — encrypted, local, and invisible to the world.",
  },
  {
    icon: Brain,
    title: "Intelligence without compromise.",
    desc: "You shouldn't have to choose between powerful AI and privacy. Ashwatthama proves you can have both — a genuine reasoning companion that lives entirely on your hardware.",
  },
  {
    icon: Lock,
    title: "Forever yours.",
    desc: "No subscriptions. No usage limits. No vendor lock-in. Download once, own forever. The ancient warrior's promise: always present, never demanding tribute.",
  },
];

export function WhyAshwatthamaSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative z-10 max-w-[1280px] mx-auto mt-16 md:mt-24 px-4 md:px-12"
      aria-labelledby="why-title"
    >
      <SectionHeader
        eyebrow="Philosophy"
        titleId="why-title"
        title={
          <>
            Why Ashwatthama
            <br />
            <em className="italic text-ember-glow">exists.</em>
          </>
        }
        subtitle="The world has accepted that AI must live in the cloud. We reject that premise. Intelligence should serve the individual, not the corporation."
        className="mb-12 md:mb-16"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
        {reasons.map((reason, i) => (
          <TiltCard key={reason.title} maxTilt={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className="h-full bg-obsidian-raised p-6 md:p-10 transition-colors duration-200 hover:bg-surface-hover"
            >
              <reason.icon
                size={34}
                className="text-ember opacity-85 mb-5"
                strokeWidth={1.2}
              />
              <h3 className="font-display font-normal text-bone text-xl md:text-2xl leading-tight mb-3">
                {reason.title}
              </h3>
              <p className="text-[0.88rem] leading-[1.7] text-muted">
                {reason.desc}
              </p>
            </motion.div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
