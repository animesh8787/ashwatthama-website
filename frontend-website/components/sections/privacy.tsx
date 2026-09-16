"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useCountUp } from "@/hooks/use-count-up";
import { SectionHeader } from "@/components/ui/section-header";
import { Mic, Lock, WifiOff, Database } from "lucide-react";

const stats: { value: number | null; num: string; unit: string; label: string }[] = [
  { value: 0, num: "0", unit: "B", label: "Voice data transmitted to any server, ever" },
  { value: 100, num: "100", unit: "%", label: "AI inference runs on your hardware, locally" },
  { value: null, num: "AES", unit: "-128", label: "Encryption standard for all sensitive storage" },
  { value: null, num: "∞", unit: "", label: "Yours forever — no subscription, no expiry" },
];

function StatCard({
  stat,
  active,
  delay,
}: {
  stat: (typeof stats)[number];
  active: boolean;
  delay: number;
}) {
  const counted = useCountUp(stat.value ?? 0, active && stat.value !== null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={active ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="bg-obsidian-raised p-5 md:p-7"
    >
      <div
        className="font-display font-light text-bone leading-none mb-2 tabular-nums"
        style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)" }}
      >
        {stat.value !== null ? counted : stat.num}
        <em className="not-italic text-ember">{stat.unit}</em>
      </div>
      <div className="font-mono text-label uppercase tracking-[0.28em] text-muted leading-[1.6]">
        {stat.label}
      </div>
    </motion.div>
  );
}

const privacyItems = [
  {
    icon: Mic,
    title: "Voice stays on-device",
    desc: "Your microphone input is processed entirely within your computer. The audio never leaves your machine — not even for a millisecond.",
  },
  {
    icon: Lock,
    title: "Encrypted at rest",
    desc: "Diary entries and sensitive memory are encrypted using industry-standard algorithms. The master key lives in your OS credential vault — not in any file, not on any server.",
  },
  {
    icon: WifiOff,
    title: "No telemetry, ever",
    desc: "There are no analytics calls, no error reporting services, no background pings. Ashwatthama is silent on the network by design.",
  },
  {
    icon: Database,
    title: "Works fully offline",
    desc: "Voice, reasoning, memory, desktop control — all run offline. Internet is only used for features you explicitly ask for, like web search.",
  },
];

export function PrivacySection() {
  const { ref: refLeft, isVisible: visibleLeft } = useScrollReveal<HTMLDivElement>();
  const { ref: refRight, isVisible: visibleRight } = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="privacy"
      className="relative z-10 max-w-[1280px] mx-auto mt-16 md:mt-24 px-4 md:px-12"
      aria-labelledby="privacy-title"
    >
      <SectionHeader
        eyebrow="Privacy"
        titleId="privacy-title"
        title={
          <>
            Your machine.
            <br />
            Your data. Full stop.
          </>
        }
        subtitle="Privacy isn't a feature added on top. It's the architecture. The AI runs locally. The memory stores locally. The voice never leaves."
        className="mb-10 md:mb-16"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
        <div
          ref={refLeft}
          className={`border border-border transition-all duration-700 delay-75 ${
            visibleLeft ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {privacyItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={visibleLeft ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start gap-[18px] p-4 md:p-5 border-b border-border last:border-b-0 transition-colors duration-200 hover:bg-surface-hover"
            >
              <item.icon
                size={28}
                className="text-ember opacity-80 flex-shrink-0 mt-[2px]"
                strokeWidth={1.2}
              />
              <div>
                <div className="font-display font-normal text-bone mb-[5px] leading-tight"
                  style={{ fontSize: "clamp(1rem, 1.7vw, 1.2rem)" }}
                >
                  {item.title}
                </div>
                <p className="text-[0.85rem] leading-[1.65] text-muted">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div
          ref={refRight}
          className={`grid grid-cols-2 gap-px bg-border border border-border transition-all duration-700 delay-150 ${
            visibleRight ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} active={visibleRight} delay={0.15 + i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
