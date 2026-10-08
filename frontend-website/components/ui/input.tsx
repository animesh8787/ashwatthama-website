"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          // 16px minimum keeps iOS from zooming the page on focus.
          "w-full min-w-0 rounded-xl border border-border-mid bg-obsidian/60 px-4 h-12 text-[16px] text-bone",
          "transition-[border-color,box-shadow] duration-200",
          "placeholder:text-muted-2",
          "hover:border-border-strong",
          "focus:border-ember focus:shadow-[0_0_0_3px_var(--ember-focus)]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
