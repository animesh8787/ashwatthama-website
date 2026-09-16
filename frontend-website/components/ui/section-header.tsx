"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  delay?: number;
  /** Applied to the <h2> so sections can wire aria-labelledby to it. */
  titleId?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
  align = "left",
  delay = 0,
  titleId,
}: SectionHeaderProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "mb-10 md:mb-16",
        align === "center" && "text-center flex flex-col items-center",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        className="section-eyebrow"
      >
        {eyebrow}
      </motion.div>

      {/* Headline is revealed through an expanding clip-path with a soft
          blur-to-sharp focus pull — a subtler, more premium alternative to a
          plain fade-up for the most prominent text on the page. */}
      <motion.h2
        initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)", filter: "blur(6px)" }}
        animate={
          isVisible
            ? { opacity: 1, clipPath: "inset(0 0 0% 0)", filter: "blur(0px)" }
            : {}
        }
        transition={{ duration: 0.85, delay: delay + 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="section-title"
        id={titleId}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: delay + 0.22, ease: "easeOut" }}
          className="section-sub"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
