"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

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
    res: 'Done. Reminder set for 5:00 PM: "Push changes." Is there anything else you want added to that reminder?',
  },
  {
    cmd: "Set my volume to 40 percent.",
    res: "Volume set to 40%. Your previous level was 70%, and I've saved that so you can restore it later if needed.",
  },
  {
    cmd: "What did I write in my diary last week?",
    res: 'You made two entries. On Monday you described feeling overwhelmed with the project scope. On Wednesday you wrote about a breakthrough with the memory system, which you called "finally clicking."',
  },
];

// Fixed values (not Math.random()) so server-rendered HTML and the client's
// first render match exactly; random values here caused a hydration mismatch.
const waveHeights = [18, 30, 50, 40, 66, 44, 58, 34, 68, 46, 36, 62, 26, 50, 38, 64, 30, 46, 22, 42];
const waveDurations = [1.1, 0.82, 1.42, 0.95, 1.28, 0.78, 1.55, 1.02, 0.88, 1.35, 1.08, 0.92, 1.48, 0.8, 1.2, 1.05, 1.38, 0.86, 1.15, 0.98];

const metrics = [
  { value: "<300ms", label: "Response time" },
  { value: "100%", label: "Offline" },
  { value: "0", label: "Data sent" },
];

export function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = commands[activeIndex];

  return (
    <section className="section" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHeader
          eyebrow="In action"
          titleId="experience-title"
          title={
            <>
              Hear it <span className="accent">think.</span>
            </>
          }
          subtitle="Real interaction patterns. Select a command to see how Ashwatthama responds."
        />

        <Reveal>
          <div className="grid overflow-hidden rounded-2xl border border-border-mid bg-obsidian-raised shadow-card lg:grid-cols-2">
            <div className="border-b border-border p-6 md:p-10 lg:border-b-0 lg:border-r">
              <div className="eyebrow mb-6">Voice input</div>

              <div className="mb-6 flex h-[68px] items-center gap-[3px]" aria-hidden="true">
                {waveHeights.map((h, i) => (
                  <span
                    key={i}
                    className={`w-[3px] shrink-0 rounded-sm bg-ember ${i % 3 === 0 ? "opacity-100" : "opacity-60"}`}
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

              <ul className="flex flex-col gap-2" role="listbox" aria-label="Example commands">
                {commands.map((c, i) => {
                  const on = i === activeIndex;
                  return (
                    <li key={c.cmd} role="presentation">
                      <button
                        role="option"
                        aria-selected={on}
                        onClick={() => setActiveIndex(i)}
                        className={`w-full rounded-xl border px-4 py-3 text-left text-[0.9375rem] transition-[border-color,background-color,color] duration-200 ${
                          on
                            ? "border-ember-border-strong bg-ember-dim text-bone"
                            : "border-border text-muted hover:border-border-strong hover:text-bone"
                        }`}
                      >
                        <span className="mr-2 font-mono text-ember" aria-hidden="true">
                          ›
                        </span>
                        {c.cmd}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col p-6 md:p-10">
              <div className="eyebrow mb-6">Response</div>
              <motion.p
                key={activeIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="lede flex-1 text-bone"
                aria-live="polite"
              >
                {active.res}
              </motion.p>

              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
                {metrics.map((m) => (
                  <div key={m.label}>
                    <dd
                      className="font-display font-light text-bone"
                      style={{ fontSize: "clamp(1.4rem, 1rem + 1.2vw, 2rem)" }}
                    >
                      {m.value}
                    </dd>
                    <dt className="mt-1 font-mono text-micro uppercase text-muted">{m.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
