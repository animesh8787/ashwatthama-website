"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  MessageSquare,
  Monitor,
  Database,
  Command,
  FileText,
  Clock,
  Search,
  Code2,
  BookOpen,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Natural Conversation",
    desc: "Talk to it the way you think — incomplete sentences, context from earlier, mid-thought course corrections. It follows you, not a script.",
  },
  {
    icon: Monitor,
    title: "Sees Your Screen",
    desc: "Ask what's this error mean or summarize this page — it reads your screen visually and understands the context without you having to copy anything.",
  },
  {
    icon: Database,
    title: "Permanent Memory",
    desc: "Remembers names, preferences, past decisions, and ongoing projects. Ask what you discussed last Tuesday and get a real answer.",
  },
  {
    icon: Command,
    title: "Desktop Control",
    desc: "Control your system by voice — adjust volume, launch apps, manage brightness, switch windows. Your computer finally listens to you.",
  },
  {
    icon: FileText,
    title: "Document Intelligence",
    desc: "Show it a PDF, a receipt, a scanned letter — it reads the text, extracts the meaning, and answers questions about it instantly.",
  },
  {
    icon: Clock,
    title: "Reminders & Tasks",
    desc: "Remind me in 20 minutes to send that email. Natural language scheduling that actually fires at the right time — no app required.",
  },
  {
    icon: Search,
    title: "Research Assistant",
    desc: "Searches the web, synthesizes information, and gives you a spoken summary — so you can keep working instead of reading 10 tabs.",
  },
  {
    icon: Code2,
    title: "Coding Companion",
    desc: "Explain code, identify bugs, describe what functions do, navigate your project — by voice, entirely offline, understanding your codebase over time.",
  },
  {
    icon: BookOpen,
    title: "Private Journal",
    desc: "An encrypted personal diary, activated by voice. Your entries are searchable and never readable by anyone but you.",
  },
];

export function FeaturesSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="features"
      className="relative z-10 max-w-[1280px] mx-auto mt-16 md:mt-24 px-4 md:px-12"
      aria-labelledby="features-title"
    >
      <div
        className={`transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="section-eyebrow">Capabilities</div>
        <h2 id="features-title" className="section-title">
          What Ashwatthama
          <br />
          does for you.
        </h2>
        <p className="section-sub mb-10 md:mb-16">
          Everything you'd want from an AI, without any of the tradeoffs.
          Benefits, not technical specifications.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-mid border border-border">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 + i * 0.05 }}
            className="bg-obsidian-raised p-6 md:p-8 flex flex-col gap-0 transition-colors duration-200 hover:bg-[rgba(24,17,12,1)]"
          >
            <f.icon
              size={34}
              className="text-ember opacity-85 mb-4"
              strokeWidth={1.2}
            />
            <h3 className="font-display font-normal text-bone mb-2.5 leading-tight"
              style={{ fontSize: "clamp(1.1rem, 1.9vw, 1.35rem)" }}
            >
              {f.title}
            </h3>
            <p className="text-[0.88rem] leading-[1.7] text-muted flex-1">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
