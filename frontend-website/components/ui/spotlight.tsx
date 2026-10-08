"use client";

import { cn } from "@/lib/utils";

/**
 * A grid of cards separated by hairlines, where each `.spot` child glows
 * softly under the cursor. Position is written to CSS variables on the card
 * under the pointer, so there is no React state and no re-render per move.
 */
export function SpotlightGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const card = (e.target as HTMLElement).closest<HTMLElement>(".spot");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      onPointerMove={onMove}
      className={cn("grid gap-px overflow-hidden rounded-2xl border border-border bg-border", className)}
    >
      {children}
    </div>
  );
}
