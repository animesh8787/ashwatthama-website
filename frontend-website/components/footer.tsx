import Link from "next/link";
import { FlameMark } from "@/components/ui/flame-mark";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Capabilities" },
      { href: "/#privacy", label: "Privacy" },
      { href: "/remote-desktop/", label: "Remote access" },
      { href: "/download/", label: "Download" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login/", label: "Sign in" },
      { href: "/signup/", label: "Create account" },
      { href: "/reset-password/", label: "Reset password" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "mailto:workreachoutanimesh@gmail.com", label: "Email" },
      { href: "https://www.linkedin.com/in/animesh-dhiman-658250311/", label: "LinkedIn" },
      { href: "https://github.com/animesh8787", label: "GitHub" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border">
      <div className="wrap grid gap-12 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)] md:py-16">
        <div className="max-w-[28ch]">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Ashwatthama home">
            <FlameMark className="h-5 w-5 text-ember" />
            <span className="font-display text-[1.125rem] font-light tracking-[0.01em] text-bone">
              Ashwat<em className="italic text-ember-glow">thama</em>
            </span>
          </Link>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
            A private AI companion that lives on your computer.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="eyebrow mb-4">{col.title}</h2>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((l) => {
                const external = /^(https?:|mailto:)/.test(l.href);
                return (
                  <li key={l.href}>
                    {external ? (
                      <a
                        href={l.href}
                        {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                        className="text-[0.9375rem] text-bone-muted transition-colors hover:text-bone"
                      >
                        {l.label}
                        {l.href.startsWith("http") && <span className="sr-only"> (opens in new tab)</span>}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-[0.9375rem] text-bone-muted transition-colors hover:text-bone"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="wrap flex flex-col gap-2 py-6 text-[0.8125rem] text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 Animesh Dhiman. All rights reserved.</p>
          <p className="font-display text-[0.95rem] font-light italic text-bone-muted">
            Named after the immortal warrior of the Mahabharata.
          </p>
        </div>
      </div>
    </footer>
  );
}
