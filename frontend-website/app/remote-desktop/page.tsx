"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Monitor,
  Terminal,
  FolderOpen,
  Clipboard,
  Smartphone,
  Lock,
  ArrowLeft,
} from "lucide-react";

const capabilities = [
  {
    icon: Globe,
    title: "Web Dashboard Control",
    desc: "Open a browser on any device and see your desktop in real time. Move the mouse, click, type, and launch apps as if you were sitting right in front of it.",
  },
  {
    icon: Monitor,
    title: "Screen Viewing & Input",
    desc: "Live screen capture with low-latency streaming. Full mouse tracking, left/right/middle clicks, scrolling, and keyboard input — all routed securely to your desktop.",
  },
  {
    icon: Terminal,
    title: "Terminal Execution",
    desc: "Open a secure shell session directly from the dashboard. Run commands, manage processes, and inspect system output remotely with full audit logging.",
  },
  {
    icon: FolderOpen,
    title: "File Access & Management",
    desc: "Browse your entire file system, download documents, upload files, create folders, and move items — all through an intuitive file manager interface.",
  },
  {
    icon: Clipboard,
    title: "Clipboard Sync",
    desc: "Copy text on your phone and paste it on your desktop. Bi-directional clipboard sync keeps your workflow seamless across every screen you own.",
  },
  {
    icon: Smartphone,
    title: "Android Companion App",
    desc: "A dedicated mobile app for one-tap remote control. Optimized touch input, gesture shortcuts, and quick-action widgets for the most common commands.",
  },
];

export default function RemoteDesktopPage() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <main className="min-h-screen bg-obsidian text-bone">
      <section
        ref={ref}
        className="relative z-10 max-w-[1100px] mx-auto px-4 md:px-12 pt-16 md:pt-24 pb-20 md:pb-32"
      >
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted hover:text-ember transition-colors font-mono text-[9px] uppercase tracking-[0.28em]"
          >
            <ArrowLeft size={12} />
            Back to home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10 md:mb-14"
        >
          <div className="section-eyebrow">Remote Control</div>
          <h1 className="section-title">
            Your computer,
            <br />
            <em className="italic text-ember-glow">anywhere.</em>
          </h1>
          <p className="section-sub max-w-[60ch]">
            Once connected, your Ashwatthama desktop becomes reachable from any
            browser or a dedicated Android companion — giving you full control
            over your machine no matter where you are.
          </p>
        </motion.div>

        {/* Capabilities grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border-mid border border-border mb-10 md:mb-14">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
              className="bg-obsidian-raised p-6 md:p-8 flex flex-col gap-0 transition-colors duration-200 hover:bg-[rgba(24,17,12,1)]"
            >
              <cap.icon
                size={34}
                className="text-ember opacity-85 mb-4"
                strokeWidth={1.2}
              />
              <h3
                className="font-display font-normal text-bone mb-2.5 leading-tight"
                style={{ fontSize: "clamp(1.1rem, 1.9vw, 1.35rem)" }}
              >
                {cap.title}
              </h3>
              <p className="text-[0.88rem] leading-[1.7] text-muted flex-1">
                {cap.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Security note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border border-border bg-obsidian-raised p-5 md:p-6 mb-10 md:mb-14"
        >
          <div className="flex items-center gap-3">
            <Lock
              size={22}
              className="text-ember opacity-85"
              strokeWidth={1.2}
            />
          </div>
          <p className="text-sm text-muted leading-relaxed">
            <span className="text-bone font-medium">Built with care:</span>{" "}
            Remote access to your computer is powerful, so we&apos;re not
            shipping it until it&apos;s been thoroughly tested for security
            — that&apos;s why it&apos;s arriving in Version&nbsp;2, not day
            one.
          </p>
        </motion.div>

        {/* Coming in Version 2 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center border border-ember/30 bg-ember/5 p-8 md:p-10"
        >
          <div className="font-display font-semibold text-bone text-2xl md:text-3xl mb-3">
            Coming in Version 2
          </div>
          <p className="text-muted text-sm max-w-[48ch] mx-auto mb-6 leading-relaxed">
            Remote desktop and the Android companion app are scheduled for the
            Version 2 release. We&apos;re taking the time to get the security
            model right before opening your machine to the network.
          </p>
          <Link href="/">
            <Button variant="secondary" size="sm">
              <ArrowLeft size={14} className="mr-2" />
              Back to home
            </Button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
