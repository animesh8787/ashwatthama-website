"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useActiveSection } from "@/hooks/use-active-section";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { FlameMark } from "@/components/ui/flame-mark";

const navLinks = [
  { id: "features", label: "Capabilities" },
  { id: "privacy", label: "Privacy" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

const ids = navLinks.map((l) => l.id);

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useActiveSection(ids);

  const hrefFor = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll and allow Escape while the mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const name = user?.displayName || user?.email;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] h-16 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled
            ? "border-border bg-obsidian/80 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <nav
          className="wrap flex h-full items-center justify-between gap-6"
          aria-label="Main navigation"
        >
          <Link href="/" className="flex items-center gap-2.5" aria-label="Ashwatthama home">
            <FlameMark className="h-[22px] w-[22px] text-ember" />
            <span className="font-display text-[1.1875rem] font-light leading-none tracking-[0.01em] text-bone">
              Ashwat<em className="italic text-ember-glow">thama</em>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = onHome && activeId === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={hrefFor(link.id)}
                    aria-current={active ? "true" : undefined}
                    className={`rounded-full px-3.5 py-2 font-mono text-label uppercase transition-colors duration-200 ${
                      active ? "text-bone" : "text-muted hover:text-bone"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="hidden items-center gap-1 md:flex">
                <span className="max-w-[140px] truncate px-2 text-[0.875rem] text-muted">{name}</span>
                <Button href="/download/" size="sm">
                  Download
                </Button>
                <button
                  onClick={() => logout()}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-bone/[0.06] hover:text-bone"
                  aria-label="Sign out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-1 md:flex">
                <Button href="/login/" variant="ghost" size="sm">
                  Sign in
                </Button>
                <Button href="/signup/" size="sm">
                  Get started
                </Button>
              </div>
            )}

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-bone-muted transition-colors hover:bg-bone/[0.06] md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Rendered as a sibling of <header> so its fixed positioning is relative to the viewport. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-obsidian/95 pt-16 backdrop-blur-xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="wrap flex h-full flex-col pb-8 pt-6">
              <ul className="flex flex-col">
                {navLinks.map((link) => (
                  <li key={link.id} className="border-b border-border">
                    <a
                      href={hrefFor(link.id)}
                      onClick={() => setMobileOpen(false)}
                      className="flex min-h-14 items-center font-display text-[1.9rem] font-light tracking-[-0.01em] text-bone"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <p className="truncate text-[0.9375rem] text-muted">{name}</p>
                    <Button href="/download/" onClick={() => setMobileOpen(false)}>
                      Download
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button href="/signup/" onClick={() => setMobileOpen(false)}>
                      Get started
                    </Button>
                    <Button href="/login/" variant="secondary" onClick={() => setMobileOpen(false)}>
                      Sign in
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
