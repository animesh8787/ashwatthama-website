"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const features = [
  {
    icon: MessageSquare,
    title: "Natural conversation",
    desc: "Talk to it the way you think: incomplete sentences, context from earlier, mid-thought course corrections. It follows you, not a script.",
  },
  {
    icon: Monitor,
    title: "Sees your screen",
    desc: "Ask what an error means or to summarize a page. It reads your screen visually and understands the context without you copying anything.",
  },
  {
    icon: Database,
    title: "Permanent memory",
    desc: "Remembers names, preferences, past decisions and ongoing projects. Ask what you discussed last Tuesday and get a real answer.",
  },
  {
    icon: Command,
    title: "Desktop control",
    desc: "Control your system by voice: adjust volume, launch apps, manage brightness, switch windows. Your computer finally listens to you.",
  },
  {
    icon: FileText,
    title: "Document intelligence",
    desc: "Show it a PDF, a receipt or a scanned letter. It reads the text, extracts the meaning and answers questions about it instantly.",
  },
  {
    icon: Clock,
    title: "Reminders and tasks",
    desc: "“Remind me in 20 minutes to send that email.” Natural-language scheduling that fires at the right time, with no extra app.",
  },
  {
    icon: Search,
    title: "Research assistant",
    desc: "Searches the web, synthesizes information and gives you a spoken summary, so you can keep working instead of reading ten tabs.",
  },
  {
    icon: Code2,
    title: "Coding companion",
    desc: "Explain code, identify bugs, describe what functions do and navigate your project by voice, entirely offline, learning your codebase over time.",
  },
  {
    icon: BookOpen,
    title: "Private journal",
    desc: "An encrypted personal diary, activated by voice. Your entries are searchable and never readable by anyone but you.",
  },
];

/**
 * On large screens the section pins and the nine capabilities travel past on
 * a horizontal track, driven by scroll. Below that width the same cards simply
 * wrap into a grid; the animation is only attached via matchMedia.
 */
export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative z-10 py-24 lg:flex lg:min-h-dvh lg:flex-col lg:justify-center lg:py-0"
      aria-labelledby="features-title"
    >
      <div className="wrap lg:mb-12">
        <SectionHeader
          eyebrow="Capabilities"
          titleId="features-title"
          title={
            <>
              What Ashwatthama <span className="accent">does for you.</span>
            </>
          }
          subtitle="Everything you'd want from an AI, without any of the tradeoffs."
          className="mb-12 lg:mb-0"
        />
      </div>

      <Reveal className="wrap lg:max-w-none lg:px-0">
        <div className="lg:overflow-hidden lg:border-y lg:border-border">
          <div
            ref={trackRef}
            className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:flex lg:w-max lg:gap-0 lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:pl-10 xl:pl-[max(2.5rem,calc((100vw-1180px)/2+2.5rem))]"
          >
            {features.map((f, i) => (
              <article
                key={f.title}
                className="spot flex flex-col bg-obsidian-raised p-7 md:p-8 lg:w-[380px] lg:shrink-0 lg:border-r lg:border-border lg:p-10 lg:first:border-l"
              >
                <span
                  className="mb-8 hidden font-display text-[5rem] font-light leading-none text-transparent lg:block"
                  style={{ WebkitTextStroke: "1px var(--border-strong)" }}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <f.icon size={24} className="mb-6 text-ember lg:mb-5" strokeWidth={1.4} aria-hidden="true" />
                <h3 className="h3 mb-3">{f.title}</h3>
                <p className="body-text flex-1 text-[0.9375rem]">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
