import { ReactNode } from "react";
import Link from "next/link";
import { FlameMark } from "@/components/ui/flame-mark";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata = {
  title: "Account — Ashwatthama",
  robots: "noindex",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="grid-lines absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 0%, rgba(var(--ember-rgb), 0.16), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <header className="relative z-10 flex h-16 items-center justify-between px-5 md:px-10">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Ashwatthama home">
          <FlameMark className="h-[22px] w-[22px] text-ember" />
          <span className="font-display text-[1.1875rem] font-light tracking-[0.01em] text-bone">
            Ashwat<em className="italic text-ember-glow">thama</em>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      <main
        id="main"
        className="relative z-10 flex min-h-[calc(100dvh-4rem)] items-center justify-center px-5 pb-16 pt-6"
      >
        <div className="w-full max-w-[26rem]">{children}</div>
      </main>
    </div>
  );
}
