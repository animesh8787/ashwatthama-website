"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Clock, Monitor, HardDrive, Cpu, Mail, RefreshCw, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const requirements = [
  { icon: Monitor, label: "OS", value: "Windows 10 / 11" },
  { icon: HardDrive, label: "Memory", value: "8 GB minimum" },
  { icon: Cpu, label: "GPU", value: "4 GB+ recommended" },
];

function Card({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 0.8, 0.2, 1] }}
      className={`relative w-full overflow-hidden rounded-3xl border border-border-mid bg-obsidian-raised p-7 shadow-card md:p-12 ${
        wide ? "max-w-[620px]" : "max-w-[520px]"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(70% 50% at 50% 0%, rgba(var(--ember-rgb), 0.12), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

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
      <div className="flex min-h-dvh items-center justify-center" role="status">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Email not verified: show the verification wall.
  if (!isEmailVerified) {
    return (
      <>
        <Navbar />
        <main id="main" className="relative flex min-h-dvh items-center justify-center px-5 pb-20 pt-28">
          <div className="grid-lines absolute inset-0" aria-hidden="true" />
          <Card>
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-ember-border bg-ember-dim text-ember">
              <Mail size={22} aria-hidden="true" />
            </div>
            <div className="eyebrow mb-4">Verify your email</div>
            <h1 className="h2" style={{ fontSize: "clamp(1.9rem, 1.4rem + 1.6vw, 2.5rem)" }}>
              Check your inbox.
            </h1>
            <p className="body-text mt-3">A verification link was sent to</p>
            <p className="mt-1 break-all font-mono text-[0.9375rem] text-ember">{user?.email}</p>
            <p className="body-text mt-4 text-[0.9375rem]">
              Click the link in that email, then refresh this page to access your download.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Button onClick={refreshUser}>
                <RefreshCw size={15} />
                I&apos;ve verified, refresh
              </Button>
              <Button variant="secondary" onClick={handleResend} disabled={resent}>
                {resent ? "Email sent. Check your inbox" : "Resend verification email"}
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sign out
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  const firstName = user?.displayName || user?.email?.split("@")[0] || "there";

  return (
    <>
      <Navbar />
      <main id="main" className="relative flex min-h-dvh items-center justify-center px-5 pb-20 pt-28">
        <div className="grid-lines absolute inset-0" aria-hidden="true" />
        <Card wide>
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-ember-border bg-ember-dim text-ember">
            <Download size={22} aria-hidden="true" />
          </div>
          <div className="eyebrow mb-4">Download</div>
          <h1 className="h2" style={{ fontSize: "clamp(1.9rem, 1.4rem + 1.6vw, 2.5rem)" }}>
            Welcome, {firstName}.
          </h1>
          <p className="body-text mt-3 max-w-[44ch]">
            Your account is verified. The installer will be available here on launch day.
          </p>

          <div className="mt-8 rounded-2xl border border-dashed border-border-strong p-6">
            <div className="mb-3 flex items-center gap-2.5 font-mono text-label uppercase text-ember">
              <Clock size={16} aria-hidden="true" />
              Coming August 2026
            </div>
            <p className="body-text mb-5 text-[0.9375rem]">
              The Windows installer is in final preparation. You&apos;ll be the first to receive it.
            </p>
            <Button disabled className="w-full sm:w-auto">
              <Download size={16} />
              Download Ashwatthama v1.0.0
            </Button>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {requirements.map((r) => (
              <div key={r.label} className="bg-obsidian-raised p-4">
                <r.icon size={18} className="mb-3 text-ember" strokeWidth={1.5} aria-hidden="true" />
                <dt className="font-mono text-micro uppercase text-muted">{r.label}</dt>
                <dd className="mt-1 text-[0.9375rem] font-medium text-bone">{r.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <Button href="/" variant="ghost" size="sm">
              <ArrowLeft size={14} />
              Back to home
            </Button>
          </div>
        </Card>
      </main>
      <Footer />
    </>
  );
}
