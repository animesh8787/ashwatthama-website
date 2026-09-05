"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Download, Clock, Monitor, HardDrive, ArrowLeft, Diamond, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function DownloadPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user, isEmailVerified, resendVerification, refreshUser, logout } = useAuth();
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login/");
    }
  }, [loading, isAuthenticated, router]);

  const handleResend = async () => {
    await resendVerification();
    setResent(true);
    setTimeout(() => setResent(false), 30000);
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="font-mono text-muted text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Email not verified — show verification wall
  if (!isEmailVerified) {
    return (
      <>
        <Navbar />
        <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-[520px] w-full border border-border bg-obsidian-raised p-8 md:p-12 relative overflow-hidden text-center"
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
              style={{ background: "linear-gradient(to right, transparent, var(--ember), transparent)" }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(224,114,58,0.08) 0%, transparent 65%)" }}
            />
            <div className="relative z-[1] flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full border border-ember/30 flex items-center justify-center mb-6"
                style={{ background: "radial-gradient(circle at 38% 38%, rgba(243,168,97,0.3), rgba(224,114,58,0.2) 40%, transparent)" }}
              >
                <Mail size={24} className="text-ember-glow" />
              </div>
              <div className="section-eyebrow mb-2">Verify Your Email</div>
              <h1 className="font-display font-light text-bone text-2xl md:text-3xl mb-3">
                Check your inbox.
              </h1>
              <p className="text-muted text-sm max-w-[38ch] mb-2">
                A verification link was sent to
              </p>
              <p className="font-mono text-ember text-sm mb-6">{user?.email}</p>
              <p className="text-muted text-xs max-w-[38ch] mb-8">
                Click the link in that email, then refresh this page to access your download.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <Button variant="primary" onClick={refreshUser}>
                  <RefreshCw size={14} />
                  I&apos;ve verified — refresh
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleResend}
                  disabled={resent}
                  className={resent ? "opacity-50 cursor-not-allowed" : ""}
                >
                  {resent ? "Email sent — check your inbox" : "Resend verification email"}
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Sign out
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[600px] w-full border border-border bg-obsidian-raised p-8 md:p-12 relative overflow-hidden text-center"
        >
          <div
            className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
            style={{ background: "linear-gradient(to right, transparent, var(--ember), transparent)" }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(224,114,58,0.08) 0%, transparent 65%)" }}
          />

          <div className="relative z-[1] flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full border border-ember/30 flex items-center justify-center mb-6 animate-orb-pulse"
              style={{ background: "radial-gradient(circle at 38% 38%, rgba(243,168,97,0.3), rgba(224,114,58,0.2) 40%, transparent)" }}
            >
              <Download size={24} className="text-ember-glow" />
            </div>

            <div className="section-eyebrow mb-2">Secure Download</div>
            <h1 className="font-display font-light text-bone text-2xl md:text-3xl mb-3">
              Welcome, {user?.displayName || user?.email?.split("@")[0] || "warrior"}.
            </h1>
            <p className="text-muted text-sm max-w-[40ch] mb-8">
              Your account is verified. The installer will be available here on launch day.
            </p>

            <div className="w-full border border-dashed border-border-mid bg-obsidian/50 p-6 md:p-8 mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock size={18} className="text-ember" />
                <span className="font-mono text-label-lg uppercase tracking-[0.28em] text-ember">
                  Coming this August 2026
                </span>
              </div>
              <p className="text-muted text-sm mb-4">
                The Windows installer is currently in final preparation. You&apos;ll be the first to receive it.
              </p>
              <Button variant="primary" disabled className="opacity-50 cursor-not-allowed">
                <Download size={14} />
                Download Ashwatthama v1.0.0
              </Button>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border mb-6">
              <div className="bg-obsidian-raised p-4 text-center">
                <Monitor size={18} className="text-ember mx-auto mb-2 opacity-80" />
                <div className="font-mono text-micro uppercase tracking-[0.26em] text-muted">OS</div>
                <div className="font-display text-bone text-sm mt-1">Windows 10/11</div>
              </div>
              <div className="bg-obsidian-raised p-4 text-center">
                <HardDrive size={18} className="text-ember mx-auto mb-2 opacity-80" />
                <div className="font-mono text-micro uppercase tracking-[0.26em] text-muted">RAM</div>
                <div className="font-display text-bone text-sm mt-1">8 GB minimum</div>
              </div>
              <div className="bg-obsidian-raised p-4 text-center">
                <Diamond size={18} className="text-ember mx-auto mb-2 opacity-80" />
                <div className="font-mono text-micro uppercase tracking-[0.26em] text-muted">GPU</div>
                <div className="font-display text-bone text-sm mt-1">Recommended 4GB+</div>
              </div>
            </div>

            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={12} />
                Return to home
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
