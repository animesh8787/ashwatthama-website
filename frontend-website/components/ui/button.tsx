"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
  > {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2.5 font-mono uppercase tracking-[0.28em] cursor-pointer transition-all duration-200 whitespace-nowrap select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-[3px] disabled:cursor-not-allowed disabled:pointer-events-none";

  const variants = {
    primary:
      "border border-ember bg-ember text-obsidian hover:bg-ember-glow hover:shadow-ember active:translate-y-px",
    secondary:
      "border border-border-mid bg-transparent text-bone-muted hover:border-ember-border-strong hover:text-bone hover:bg-ember-dim",
    ghost:
      "border border-transparent bg-transparent text-muted hover:text-bone hover:bg-surface",
  };

  const sizes = {
    sm: "px-4 py-2 text-[9px]",
    default: "px-7 py-3.5 text-[10.5px]",
    lg: "px-9 py-4 text-[11px]",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
