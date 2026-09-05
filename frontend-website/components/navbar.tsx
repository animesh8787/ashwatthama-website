"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useActiveSection } from "@/hooks/use-active-section";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, UserPlus, LogOut, Menu, X } from "lucide-react";

const navLinks = [
  { href: "#features", id: "features", label: "Capabilities" },
  { href: "#privacy", id: "privacy", label: "Privacy" },
  { href: "#faq", id: "faq", label: "Questions" },
  { href: "#contact", id: "contact", label: "Contact" },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useActiveSection(navLinks.map((l) => l.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll while the mobile overlay is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between h-[60px] px-4 md:px-12 lg:px-16 transition-all duration-300 border-b ${
          scrolled
            ? "bg-obsidian/95 backdrop-blur-xl border-border"
            : "bg-obsidian/80 backdrop-blur-md border-transparent"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-ember text-[10px] lg:text-[11px]" aria-hidden="true">▲</span>
          <span className="font-display font-light text-[17px] lg:text-[19px] tracking-[0.01em] leading-none text-bone">
            Ashwat<em className="italic text-ember-glow">thama</em>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-10 list-none">
          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative font-mono text-label lg:text-label-lg uppercase tracking-[0.28em] lg:tracking-[0.3em] transition-colors duration-200 pb-1 ${
                    isActive ? "text-ember" : "text-muted hover:text-ember"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-0.5 h-px bg-ember transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                    aria-hidden="true"
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3 lg:gap-4">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="font-mono text-label text-muted truncate max-w-[120px]">
                {user?.displayName || user?.email}
              </span>
              <button
                onClick={() => logout()}
                className="flex items-center justify-center w-11 h-11 -mr-2.5 text-muted hover:text-ember transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2.5">
              <Link href="/login/">
                <Button
                  variant="secondary"
                  size="sm"
                  className="backdrop-blur-md bg-surface/50"
                >
                  <User size={12} />
                  Sign In
                </Button>
              </Link>
              <Link href="/signup/">
                <Button variant="primary" size="sm">
                  <UserPlus size={12} />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 -mr-2.5 text-bone-muted"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu — full-screen dark/blurred overlay with a glass panel nested inside.
          Rendered as a sibling of <motion.nav>, not a child — motion.nav animates a
          `y` transform, which would otherwise become the containing block for this
          fixed/inset-0 overlay and clip it to the navbar's own height. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[150] bg-obsidian/85 backdrop-blur-xl md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            {/* Glass menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-[76px] left-4 right-4 z-[200] border border-border-mid bg-surface/90 backdrop-blur-2xl rounded-2xl shadow-card p-6 flex flex-col gap-1 max-h-[calc(100dvh-92px)] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={activeId === link.id ? "true" : undefined}
                  className={`font-mono text-label-lg uppercase tracking-[0.28em] transition-colors min-h-11 flex items-center ${
                    activeId === link.id ? "text-ember" : "text-muted hover:text-ember"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-border my-3" />
              {isAuthenticated ? (
                <div className="flex flex-col gap-3 pb-1">
                  <span className="font-mono text-label text-muted truncate">
                    {user?.displayName || user?.email}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="inline-flex items-center gap-2 min-h-11 text-muted hover:text-ember font-mono text-label uppercase tracking-[0.28em]"
                  >
                    <LogOut size={12} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-1">
                  <Link href="/login/" onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="secondary"
                      className="w-full backdrop-blur-md bg-surface/50"
                    >
                      <User size={12} />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup/" onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" className="w-full">
                      <UserPlus size={12} />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
