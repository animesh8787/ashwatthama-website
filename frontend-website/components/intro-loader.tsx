"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { markIntroDone } from "@/hooks/use-intro";

// The opening screen: a terminal types the name, a counter runs to 100, then
// the curtain lifts onto the hero. Plays on every full page load (reloads
// included) but not on client-side navigation back to the home page, can be
// skipped, and is bypassed entirely under prefers-reduced-motion.
//
// It is rendered into the server HTML so it covers the very first paint.

const WORD = "animesh/ashwatthama";
const TYPE_START = 450; // ms before the first character
const TYPE_STEP = 80; // ms per character
const COUNT_START = 250;
const COUNT_MS = 3000;
const HOLD_MS = 450; // pause on 100% before the curtain lifts
const EXIT_MS = 950;

const STATUS: [number, string][] = [
  [0, "waking the companion"],
  [28, "loading memory"],
  [56, "binding to this machine"],
  [82, "nothing leaves your computer"],
  [100, "ready"],
];

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function statusFor(pct: number) {
  let line = STATUS[0][1];
  for (const [at, text] of STATUS) if (pct >= at) line = text;
  return line;
}

// Module state survives client-side navigation but resets on a full reload.
let introPlayed = false;

export function IntroLoader() {
  const [phase, setPhase] = useState<"run" | "exit" | "gone">(() => (introPlayed ? "gone" : "run"));
  const [chars, setChars] = useState(0);
  const [pct, setPct] = useState(0);
  const [clock, setClock] = useState("");
  const exitRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = document.documentElement;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || introPlayed) {
      introPlayed = true;
      markIntroDone();
      setPhase("gone");
      return;
    }

    root.classList.add("intro-lock");
    lenis?.stop();

    const now = new Date();
    setClock(
      `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    );

    let timer = 0;
    let exitTimer = 0;
    let doneTimer = 0;
    let exiting = false;
    const t0 = performance.now();

    const finish = () => {
      root.classList.remove("intro-lock");
      lenis?.start();
      setPhase("gone");
      ScrollTrigger.refresh();
    };

    const exit = () => {
      if (exiting) return;
      exiting = true;
      introPlayed = true;
      window.clearInterval(timer);
      window.clearTimeout(exitTimer);
      setChars(WORD.length);
      setPct(100);
      setPhase("exit");
      markIntroDone(); // hero starts its entrance as the curtain lifts
      doneTimer = window.setTimeout(finish, EXIT_MS);
    };

    exitRef.current = exit;

    // A timer rather than requestAnimationFrame: frames pause in a background
    // tab, which would leave the screen frozen at 000%.
    const tick = () => {
      const t = performance.now() - t0;
      setChars(Math.max(0, Math.min(WORD.length, Math.floor((t - TYPE_START) / TYPE_STEP) + 1)));
      const p = Math.min(1, Math.max(0, (t - COUNT_START) / COUNT_MS));
      setPct(Math.round(easeInOut(p) * 100));
      if (p >= 1) {
        window.clearInterval(timer);
        exitTimer = window.setTimeout(exit, HOLD_MS);
      }
    };
    timer = window.setInterval(tick, 33);
    tick();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        exit();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("keydown", onKey);
      root.classList.remove("intro-lock");
      lenis?.start();
    };
  }, []);

  if (phase === "gone") return null;

  const exiting = phase === "exit";
  const typed = WORD.slice(0, chars);
  const slash = typed.indexOf("/");
  const left = slash === -1 ? typed : typed.slice(0, slash);
  const right = slash === -1 ? "" : typed.slice(slash + 1);
  const typingDone = chars >= WORD.length;

  return (
    <div
      className="intro-loader fixed inset-0 z-[200] overflow-hidden bg-[#0e0b08] font-mono text-[#f0e7d6]"
      style={{
        transform: exiting ? "translateY(-100%)" : "translateY(0)",
        transition: exiting ? `transform ${EXIT_MS}ms cubic-bezier(0.76, 0, 0.24, 1)` : "none",
      }}
      role="status"
      aria-label="Loading Ashwatthama"
    >
      <noscript>
        <style>{".intro-loader{display:none!important}"}</style>
      </noscript>

      {/* warm glow that swells with the count */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(45% 40% at 50% 50%, rgba(232,121,61,0.16), transparent 70%)",
          opacity: 0.25 + pct / 140,
          transform: `scale(${0.8 + pct / 160})`,
        }}
      />
      {/* faint scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center"
        style={{
          opacity: exiting ? 0 : 1,
          filter: exiting ? "blur(8px)" : "none",
          transition: exiting ? "opacity 380ms ease-out, filter 380ms ease-out" : "none",
        }}
        aria-hidden="true"
      >
        <p
          className="whitespace-nowrap font-light"
          style={{ fontSize: "clamp(1.5rem, 0.5rem + 5.4vw, 4.2rem)", letterSpacing: "0.04em" }}
        >
          {left}
          {slash !== -1 && <span className="text-[#e8793d]">/</span>}
          {right}
          <span
            className={`ml-[0.12em] inline-block h-[1em] w-[2px] translate-y-[0.14em] bg-[#f0e7d6] ${
              typingDone ? "animate-blink" : ""
            }`}
          />
        </p>
        <p
          className="mt-7 text-[11px] uppercase text-[#f0e7d6]/45 transition-opacity duration-700"
          style={{ letterSpacing: "0.32em", opacity: chars > 3 ? 1 : 0 }}
        >
          The immortal AI companion{clock && ` · ${clock}`}
        </p>
      </div>

      {/* status line, bottom left */}
      <p
        className="absolute bottom-7 left-6 text-[11px] uppercase text-[#f0e7d6]/40 md:left-10"
        style={{ letterSpacing: "0.22em", opacity: exiting ? 0 : 1, transition: "opacity 300ms" }}
        aria-hidden="true"
      >
        <span className="mr-2 text-[#e8793d]">&gt;</span>
        {statusFor(pct)}
      </p>

      {/* counter, bottom right */}
      <p
        className="absolute bottom-7 right-6 text-[13px] tabular-nums text-[#f0e7d6]/80 md:right-10"
        style={{ letterSpacing: "0.18em", opacity: exiting ? 0 : 1, transition: "opacity 300ms" }}
        aria-hidden="true"
      >
        {String(pct).padStart(3, "0")}%
      </p>

      {/* skip */}
      <button
        type="button"
        onClick={() => exitRef.current()}
        className="absolute left-1/2 top-7 -translate-x-1/2 text-[10px] uppercase text-[#f0e7d6]/35 transition-colors hover:text-[#f0e7d6]/80 focus-visible:text-[#f0e7d6]"
        style={{ letterSpacing: "0.28em", opacity: exiting ? 0 : 1 }}
      >
        Skip
      </button>

      {/* progress hairline */}
      <div
        className="absolute bottom-0 left-0 h-px bg-[#e8793d]"
        style={{ width: `${pct}%` }}
        aria-hidden="true"
      />
    </div>
  );
}
