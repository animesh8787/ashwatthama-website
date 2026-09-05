"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const commands = [
  {
    cmd: "What are my tasks for today?",
    res: "You have 3 things flagged from yesterday: review the auth PR, write the deployment guide, and follow up with the design team. Want me to set reminders for any of these?",
  },
  {
    cmd: "Read me the email on my screen.",
    res: "The email is from Priya at 2:14 PM. Subject: Re: Design review. She says Thursday works and asks if 3pm is okay. She also attached the revised wireframes.",
  },
  {
    cmd: "Remind me at 5pm to push my changes.",
    res: 'Done. Reminder set for 5:00 PM — "Push changes." Is there anything else you want added to that reminder?',
  },
  {
    cmd: "Set my volume to 40 percent.",
    res: "Volume set to 40%. Your previous level was 70% — I've saved that so you can restore it later if needed.",
  },
  {
    cmd: "What did I write in my diary last week?",
    res: 'You made two entries. On Monday you described feeling overwhelmed with the project scope. On Wednesday you wrote about a breakthrough with the memory system — you called it "finally clicking."',
  },
];

export function ExperienceSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [waveHeights] = useState(() =>
    [18, 30, 50, 40, 66, 44, 58, 34, 68, 46, 36, 62, 26, 50, 38, 64, 30, 46, 22, 42]
  );
  // Fixed (not Math.random()) so the animation timing is identical between
  // server-rendered HTML and the client's first render — random values here
  // previously caused a hydration mismatch on every load.
  const [waveDurations] = useState(() =>
    [1.1, 0.82, 1.42, 0.95, 1.28, 0.78, 1.55, 1.02, 0.88, 1.35, 1.08, 0.92, 1.48, 0.8, 1.2, 1.05, 1.38, 0.86, 1.15, 0.98]
  );

  const active = commands[activeIndex];

  return (
    <section
      ref={ref}
      className="relative z-10 max-w-[1280px] mx-auto mt-16 md:mt-24 px-4 md:px-12"
      aria-labelledby="experience-title"
    >
      <div
        className={`transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="section-eyebrow">In action</div>
        <h2 id="experience-title" className="section-title">
          Hear it think.
        </h2>
        <p className="section-sub mb-10 md:mb-16">
          Click any command to see how Ashwatthama responds. These are real
          interaction patterns.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="border border-border grid grid-cols-1 lg:grid-cols-2"
      >
        {/* Left — Voice Input */}
        <div className="p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-border">
          <div className="font-mono text-label uppercase tracking-[0.34em] text-muted mb-5">
            ◆ Voice Input
          </div>

          {/* Waveform */}
          <div className="flex items-center gap-[3px] h-11 mb-5">
            {waveHeights.map((h, i) => (
              <div
                key={i}
                className={`w-[3px] rounded-sm bg-ember flex-shrink-0 ${i % 3 === 0 ? "opacity-100" : "opacity-65"}`}
                style={{
                  height: h,
                  animationName: "wave",
                  animationDuration: `${waveDurations[i]}s`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${i * 0.055}s`,
                }}
              />
            ))}
          </div>

          <div className="font-mono text-bone border-l-2 border-ember pl-3.5 leading-[1.6] mb-2"
            style={{ fontSize: "clamp(0.78rem, 1.4vw, 0.9rem)" }}
          >
            "{active.cmd}"
          </div>
          <div className="font-mono text-label uppercase tracking-[0.24em] text-muted-2 mb-5">
            Click any command below to preview
          </div>

          <ul className="list-none flex flex-col gap-2">
            {commands.map((c, i) => (
              <li
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`font-mono cursor-default transition-all duration-200 py-2 px-3.5 border ${
                  i === activeIndex
                    ? "border-ember-border-strong text-bone bg-ember-dim"
                    : "border-border text-muted hover:border-ember-border-strong hover:text-bone hover:bg-ember-dim"
                }`}
                style={{ fontSize: "clamp(0.76rem, 1.2vw, 0.86rem)" }}
              >
                <span className="text-ember mr-1">›</span>
                {c.cmd}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Response */}
        <div className="p-6 md:p-10">
          <div className="font-mono text-label uppercase tracking-[0.34em] text-muted mb-5">
            ◆ Response
          </div>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-bone-muted leading-[1.75] mb-4 md:mb-5"
            style={{ fontSize: "clamp(0.85rem, 1.3vw, 0.94rem)" }}
          >
            {active.res}
          </motion.div>

          <div className="flex justify-between items-center border-t border-border pt-3.5">
            <div>
              <div className="font-display text-bone"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.45rem)" }}
              >
                &lt;300ms
              </div>
              <div className="font-mono text-micro uppercase tracking-[0.26em] text-muted mt-[3px]">
                Response time
              </div>
            </div>
            <div>
              <div className="font-display text-bone"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.45rem)" }}
              >
                100%
              </div>
              <div className="font-mono text-micro uppercase tracking-[0.26em] text-muted mt-[3px]">
                Offline
              </div>
            </div>
            <div>
              <div className="font-display text-bone"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.45rem)" }}
              >
                0
              </div>
              <div className="font-mono text-micro uppercase tracking-[0.26em] text-muted mt-[3px]">
                Data sent
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
