"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in px. Kept small: it should read as a settle, not a slide. */
  y?: number;
  as?: "div" | "section" | "li" | "p" | "header";
}

/** Fade-and-settle on first view. Renders statically for reduced-motion users. */
export function Reveal({ children, className, delay = 0, y = 16, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  if (reduce) return <Tag className={cn(className)}>{children}</Tag>;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.8, 0.2, 1] }}
    >
      {children}
    </Tag>
  );
}
