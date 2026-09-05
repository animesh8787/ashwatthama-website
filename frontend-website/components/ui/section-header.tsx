"use client";

import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  delay?: number;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
  align = "left",
  delay = 0,
}: SectionHeaderProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "mb-10 md:mb-16 transition-all duration-700",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4",
        align === "center" && "text-center flex flex-col items-center",
        className
      )}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="section-eyebrow">{eyebrow}</div>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </div>
  );
}
