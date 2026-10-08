"use client";

import { useEffect, useState } from "react";

export const INTRO_DONE_EVENT = "ashwatthama:intro-done";

type IntroWindow = Window & { __introDone?: boolean };

// Window state resets on every full page load, so the opening screen replays
// on reload but not when navigating back to the home page client-side.
export function markIntroDone() {
  (window as IntroWindow).__introDone = true;
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

// True once the opening screen is gone (or never needed). Lets the hero hold
// its entrance animation until the curtain lifts.
export function useIntroDone() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if ((window as IntroWindow).__introDone) {
      setDone(true);
      return;
    }
    const onDone = () => setDone(true);
    window.addEventListener(INTRO_DONE_EVENT, onDone);
    return () => window.removeEventListener(INTRO_DONE_EVENT, onDone);
  }, []);

  return done;
}
