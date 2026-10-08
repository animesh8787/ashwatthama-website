"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { Mic, Lock, WifiOff, Database } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const stats: { value: number | null; num: string; unit: string; label: string }[] = [
  { value: 0, num: "0", unit: "B", label: "Voice data transmitted to any server, ever" },
  { value: 100, num: "100", unit: "%", label: "AI inference runs on your hardware, locally" },
  { value: null, num: "AES", unit: "-128", label: "Encryption standard for all sensitive storage" },
  { value: null, num: "∞", unit: "", label: "Yours forever: no subscription, no expiry" },
];

const privacyItems = [
  {
    icon: Mic,
    title: "Voice stays on-device",
    desc: "Your microphone input is processed entirely within your computer. The audio never leaves your machine, not even for a millisecond.",
  },
  {
    icon: Lock,
    title: "Encrypted at rest",
    desc: "Diary entries and sensitive memory are encrypted using industry-standard algorithms. The master key lives in your OS credential vault, not in any file and not on any server.",
  },
  {
    icon: WifiOff,
    title: "No telemetry, ever",
    desc: "There are no analytics calls, no error reporting services and no background pings. Ashwatthama is silent on the network by design.",
  },
  {
    icon: Database,
    title: "Works fully offline",
    desc: "Voice, reasoning, memory and desktop control all run offline. The internet is only used for features you explicitly ask for, like web search.",
  },
];

function Stat({ stat, active }: { stat: (typeof stats)[number]; active: boolean }) {
  const counted = useCountUp(stat.value ?? 0, active && stat.value !== null);
  return (
    <div className="bg-obsidian-raised p-6 md:p-8">
      <div
        className="mb-3 font-display font-light leading-none text-bone tabular-nums"
        style={{ fontSize: "clamp(2.2rem, 1.2rem + 3.4vw, 3.8rem)" }}
      >
        {stat.value !== null ? counted : stat.num}
        <span className="accent">{stat.unit}</span>
      </div>
      <p className="text-[0.875rem] leading-snug text-muted">{stat.label}</p>
    </div>
  );
}

export function PrivacySection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <section id="privacy" className="section" aria-labelledby="privacy-title">
      <div className="wrap">
        <SectionHeader
          eyebrow="Privacy"
          titleId="privacy-title"
          title={
            <>
              Your machine. <span className="accent">Your data.</span>
            </>
          }
          subtitle="Privacy isn't a feature added on top. It's the architecture. The AI runs locally, the memory is stored locally and the voice never leaves."
        />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal>
            <ul className="overflow-hidden rounded-2xl border border-border">
              {privacyItems.map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-5 border-b border-border bg-obsidian-raised p-6 transition-colors duration-200 last:border-b-0 hover:bg-surface-hover md:p-7"
                >
                  <item.icon size={22} className="mt-0.5 shrink-0 text-ember" strokeWidth={1.4} aria-hidden="true" />
                  <div>
                    <h3 className="h3 mb-1.5" style={{ fontSize: "1.125rem" }}>
                      {item.title}
                    </h3>
                    <p className="body-text text-[0.9375rem]">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              ref={statsRef}
              className="grid h-full grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border"
            >
              {stats.map((s) => (
                <Stat key={s.label} stat={s} active={statsInView} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
