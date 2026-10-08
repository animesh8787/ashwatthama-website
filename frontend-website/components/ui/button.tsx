"use client";

import Link from "next/link";
import { forwardRef, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "default" | "lg";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  /** Subtle pull toward the cursor on fine pointers. Off by default for dense UI. */
  magnetic?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-full font-mono uppercase whitespace-nowrap select-none " +
  "transition-[background-color,color,border-color,transform,box-shadow] duration-200 ease-out " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-bone text-obsidian hover:bg-ember hover:text-obsidian",
  secondary:
    "border border-border-mid text-bone hover:border-bone hover:bg-bone/[0.04]",
  ghost: "text-bone-muted hover:text-bone hover:bg-bone/[0.06]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[10px] tracking-[0.2em]",
  default: "h-12 px-7 text-[11px] tracking-[0.22em]",
  lg: "h-14 px-9 text-[11.5px] tracking-[0.24em]",
};

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { variant = "primary", size = "default", magnetic = false, className, children, ...rest },
  forwardedRef
) {
  const innerRef = useRef<HTMLElement | null>(null);
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef]
  );

  const classes = cn(base, variants[variant], sizes[size], className);

  const onMove = (e: React.PointerEvent) => {
    const el = innerRef.current;
    if (!magnetic || !el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.28;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    if (innerRef.current) innerRef.current.style.transform = "";
  };

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorProps } = rest as Omit<ButtonAsLink, keyof CommonProps>;
    const external = /^(https?:|mailto:)/.test(href);
    if (external) {
      return (
        <a
          ref={setRef}
          href={href}
          className={classes}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          {...anchorProps}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        ref={setRef as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        {...anchorProps}
      >
        {children}
      </Link>
    );
  }

  const buttonProps = rest as Omit<ButtonAsButton, keyof CommonProps>;
  return (
    <button
      ref={setRef as React.Ref<HTMLButtonElement>}
      type={buttonProps.type ?? "button"}
      className={classes}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...buttonProps}
    >
      {children}
    </button>
  );
});
