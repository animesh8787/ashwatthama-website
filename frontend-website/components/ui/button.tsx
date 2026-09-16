"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
  > {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
  /** Set false to opt a button out of the cursor-pull hover effect (e.g. when it sits inside a dense list where the pull feels noisy). */
  magnetic?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "default",
  children,
  magnetic = true,
  onMouseMove,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  const baseStyles =
    "inline-flex items-center justify-center gap-2.5 font-mono uppercase tracking-[0.28em] cursor-pointer transition-all duration-200 whitespace-nowrap select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-[3px] disabled:cursor-not-allowed disabled:pointer-events-none";

  const variants = {
    primary:
      "border border-ember bg-ember text-obsidian hover:bg-ember-glow hover:shadow-ember active:translate-y-px",
    secondary:
      "border border-border-mid bg-transparent text-bone-muted hover:border-ember-border-strong hover:text-bone hover:bg-ember-dim",
    ghost:
      "border border-transparent bg-transparent text-muted hover:text-bone hover:bg-surface/60",
  };

  const sizes = {
    sm: "px-4 py-2 text-[9px]",
    default: "px-7 py-3.5 text-[10.5px]",
    lg: "px-9 py-4 text-[11px]",
  };

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (magnetic && !reduced && ref.current && window.matchMedia("(pointer: fine)").matches) {
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
    }
    onMouseMove?.(e);
  }

  function handleMouseLeave(e: React.MouseEvent<HTMLButtonElement>) {
    x.set(0);
    y.set(0);
    onMouseLeave?.(e);
  }

  return (
    <motion.button
      ref={ref}
      style={magnetic ? { x: springX, y: springY } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
