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
          "flex-1 min-w-0 border border-border-mid bg-obsidian/70 px-[18px] py-3.5 font-mono text-[16px] text-bone transition-all duration-200",
          "placeholder:text-muted-2 placeholder:tracking-[0.04em]",
          "focus:border-ember focus:shadow-[0_0_0_1px_var(--ember),0_0_20px_rgba(224,114,58,0.2)]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
