"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface AuthCardProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  back?: { href: string; label: string };
  children: React.ReactNode;
}

/** The shared frame for sign in, sign up, reset and verify pages. */
export function AuthCard({ eyebrow = "Account", title, subtitle, back, children }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 0.8, 0.2, 1] }}
      className="rounded-3xl border border-border-mid bg-obsidian-raised/90 p-7 shadow-card backdrop-blur-xl md:p-10"
    >
      {back && (
        <Link
          href={back.href}
          className="mb-8 flex w-fit items-center gap-2 text-[0.875rem] text-muted transition-colors hover:text-bone"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {back.label}
        </Link>
      )}
      <div className="eyebrow mb-4 flex">{eyebrow}</div>
      <h1
        className="font-display font-light text-bone"
        style={{ fontSize: "clamp(1.9rem, 1.4rem + 1.6vw, 2.5rem)", letterSpacing: "-0.01em", lineHeight: 1.08 }}
      >
        {title}
      </h1>
      {subtitle && <p className="body-text mt-3 text-[0.9688rem]">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </motion.div>
  );
}

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[0.875rem] font-medium text-bone-muted">
      {children}
    </label>
  );
}

export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="rounded-xl border border-crit/30 bg-crit/10 px-4 py-3 text-[0.9063rem] text-crit">
      {children}
    </p>
  );
}
