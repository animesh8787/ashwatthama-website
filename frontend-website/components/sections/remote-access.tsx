"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Terminal,
  FolderOpen,
  Clipboard,
  ArrowRight,
  Shield,
  Lock,
} from "lucide-react";

const capabilities = [
  {
    icon: Globe,
    title: "Remote Desktop Streaming",
    desc: "See and control your paired computer from anywhere. Real-time screen capture with low-latency WebRTC streaming — your desktop, in your pocket.",
  },
  {
    icon: Terminal,
    title: "Terminal Execution",
    desc: "Run commands on your remote machine through a secure shell. Every command is authenticated, audited, and sandboxed to your trusted devices only.",
  },
  {
    icon: FolderOpen,
    title: "File Operations",
    desc: "Browse, download, upload, move, and delete files on your remote system. Browse directory trees, preview files, and transfer securely over your authenticated session.",
  },
  {
    icon: Clipboard,
    title: "Clipboard Sync",
    desc: "Copy on your phone, paste on your desktop. Bi-directional clipboard sync keeps your workflow seamless across every screen you own.",
  },
];

export function RemoteAccessSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const router = useRouter();

  const handleCTA = () => {
    // Remote desktop is locked for Version 1. Link to informational page.
    router.push("/remote-desktop");
  };

  return (
    <section
      ref={ref}
      id="remote-access"
      className="relative z-10 max-w-[1280px] mx-auto mt-16 md:mt-24 px-4 md:px-12"
      aria-labelledby="remote-access-title"
    >
      <div
        className={`transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="section-eyebrow">Remote Control</div>
        <h2 id="remote-access-title" className="section-title">
          Your computer,
          <br />
          <em className="italic text-ember-glow">anywhere.</em>
        </h2>
        <p className="section-sub mb-10 md:mb-16 max-w-[60ch]">
          Pair your desktop once, then control it from any browser or Android device.
          Two-layer authentication means your machine is never exposed to the world — only to you.
        </p>
      </div>

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
            <h3 className="font-display font-normal text-bone mb-2.5 leading-tight"
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

      {/* Security callout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border border-border bg-obsidian-raised p-5 md:p-6 mb-10 md:mb-14"
      >
        <div className="flex items-center gap-3">
          <Shield size={22} className="text-ember opacity-85" strokeWidth={1.2} />
          <Lock size={22} className="text-ember opacity-85" strokeWidth={1.2} />
        </div>
        <p className="text-sm text-muted leading-relaxed">
          <span className="text-bone font-medium">Two-layer security:</span>{" "}
          Layer 1 authenticates your identity. Layer 2 verifies your device with a unique access key.
          Both must pass before any remote command is executed. Every action is audited.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center"
      >
        <Button
          variant="primary"
          onClick={handleCTA}
          className="px-8 py-6 text-base"
        >
          Learn More
          <ArrowRight size={16} className="ml-2" />
        </Button>
        <p className="text-muted text-xs mt-4 font-mono">
          Remote desktop is coming in Version 2.
        </p>
      </motion.div>
    </section>
  );
}
