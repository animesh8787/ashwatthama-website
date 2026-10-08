"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently crossing the reading line (a band
 * near the top of the viewport), or null when none of them is. Tracking the
 * full set of intersecting sections, rather than only the latest event, means
 * the highlight clears when you leave the tracked sections instead of sticking.
 */
export function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0 || !("IntersectionObserver" in window)) return;

    const inside = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inside.add(entry.target.id);
          else inside.delete(entry.target.id);
        }
        // If two sections overlap the band, prefer the later one in the page.
        const current = [...ids].reverse().find((id) => inside.has(id)) ?? null;
        setActiveId(current);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
