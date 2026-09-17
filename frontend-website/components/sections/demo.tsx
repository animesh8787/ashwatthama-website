"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { Play } from "lucide-react";

// Drop the video file at public/videos/demo.mp4 (see public/videos/README.md
// for format/size guidance) — nothing else needs to change here.
const VIDEO_SRC = "/videos/demo.mp4";
const POSTER_SRC = "/videos/demo-poster.jpg"; // optional; safe to leave missing

export function DemoSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [videoMissing, setVideoMissing] = useState(false);

  function handlePlay() {
    setPlaying(true);
    // play() is async and rejects if the browser blocks autoplay-with-sound;
    // this is a direct user click, so it's allowed, but we still guard it.
    videoRef.current?.play().catch(() => {});
  }

  return (
    <section
      ref={ref}
      id="demo"
      className="relative z-10 max-w-[1280px] mx-auto mt-16 md:mt-24 px-4 md:px-12"
      aria-labelledby="demo-title"
    >
      <SectionHeader
        eyebrow="Preview"
        titleId="demo-title"
        title={
          <>
            See it <em className="italic text-ember-glow">think.</em>
          </>
        }
        subtitle="A full walkthrough of Ashwatthama running locally — voice, memory, and desktop control in action."
        className="mb-8 md:mb-12"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative w-full aspect-video border border-border-mid bg-surface/60 backdrop-blur-xl overflow-hidden group"
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          controls={playing}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setVideoMissing(true)}
          onEnded={() => setPlaying(false)}
        />

        {/* Top glow line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-60 z-[1] pointer-events-none"
          style={{
            background: "linear-gradient(to right, transparent, var(--ember), transparent)",
          }}
        />

        <AnimatePresence>
          {!playing && (
            <motion.button
              type="button"
              onClick={handlePlay}
              disabled={videoMissing}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              aria-label="Play demo video"
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center disabled:cursor-not-allowed"
            >
              {/* Ambient orange glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(224,114,58,0.14) 0%, transparent 65%)",
                }}
                aria-hidden="true"
              />

              <div
                className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border border-ember/40 flex items-center justify-center animate-orb-pulse transition-transform duration-300 group-hover:scale-105"
                style={{
                  background:
                    "radial-gradient(circle at 38% 38%, rgba(243,168,97,0.35), rgba(224,114,58,0.22) 40%, transparent)",
                }}
              >
                <Play
                  size={22}
                  className="text-ember-glow ml-1"
                  fill="currentColor"
                  aria-hidden="true"
                />
              </div>
              <div>
                <div className="font-mono text-label-lg uppercase tracking-[0.32em] text-ember mb-1.5">
                  {videoMissing ? "Demo Coming Soon" : "Watch Demo"}
                </div>
                <p className="font-mono text-label uppercase tracking-[0.24em] text-muted">
                  {videoMissing
                    ? "The full walkthrough is in production"
                    : "Full walkthrough — voice, memory, desktop control"}
                </p>
              </div>

              {/* Corner frame accents for a "media player" feel */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-ember/25 pointer-events-none" aria-hidden="true" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-ember/25 pointer-events-none" aria-hidden="true" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-ember/25 pointer-events-none" aria-hidden="true" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-ember/25 pointer-events-none" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
