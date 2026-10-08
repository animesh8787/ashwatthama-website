"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

// Drop the video file at public/videos/demo.mp4 (see public/videos/README.md
// for format/size guidance); nothing else needs to change here.
const VIDEO_SRC = "/videos/demo.mp4";
const POSTER_SRC = "/videos/demo-poster.jpg"; // optional; safe to leave missing

export function DemoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [videoMissing, setVideoMissing] = useState(false);

  function handlePlay() {
    setPlaying(true);
    // play() rejects if the browser blocks it; this is a direct user click,
    // so it is normally allowed, but the promise is guarded regardless.
    videoRef.current?.play().catch(() => {});
  }

  return (
    <section id="demo" className="section pt-8 md:pt-12" aria-labelledby="demo-title">
      <div className="wrap">
        <SectionHeader
          eyebrow="Demo"
          titleId="demo-title"
          title={
            <>
              Watch it <span className="accent">work.</span>
            </>
          }
          subtitle="A full walkthrough of Ashwatthama running locally: voice, memory and desktop control."
        />

        <Reveal>
          <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-border-mid bg-obsidian-raised shadow-card">
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              poster={POSTER_SRC}
              controls={playing}
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setVideoMissing(true)}
              onEnded={() => setPlaying(false)}
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
                  className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-t from-obsidian/70 via-obsidian/20 to-transparent px-6 text-center disabled:cursor-not-allowed"
                >
                  <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-bone text-obsidian shadow-ember transition-transform duration-300 group-hover:scale-105 md:h-20 md:w-20">
                    <Play size={24} fill="currentColor" className="ml-1" aria-hidden="true" />
                  </span>
                  <span className="rounded-2xl bg-obsidian/75 px-5 py-3 backdrop-blur-md">
                    <span className="block text-[1.0625rem] font-medium text-bone">
                      {videoMissing ? "Demo coming soon" : "Watch the demo"}
                    </span>
                    <span className="mt-1 block text-[0.9375rem] text-bone-muted">
                      {videoMissing
                        ? "The full walkthrough is in production."
                        : "Voice, memory and desktop control"}
                    </span>
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
