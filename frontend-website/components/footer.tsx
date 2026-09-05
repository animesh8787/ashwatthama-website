"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 md:mt-32 border-t border-border">
      <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-8 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left font-mono text-label uppercase tracking-[0.3em] text-muted">
        <div>
          <span className="text-ember mr-1">▲</span>ashwatthama.dev
        </div>
        <div className="font-display italic text-[0.88rem] normal-case tracking-[0.02em] leading-relaxed md:text-center">
          "Named after the immortal warrior cursed to roam forever, always present, never sleeping."
        </div>
        <div className="md:text-right">
          © 2026 · Animesh Dhiman
        </div>
      </div>
    </footer>
  );
}
