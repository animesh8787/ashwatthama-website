"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8765/api/v1";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the URL.");
      return;
    }

    fetch(`${API_BASE}/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.status === "success") {
          setStatus("success");
          setMessage("Your email has been verified. You can now access your downloads.");
        } else {
          setStatus("error");
          setMessage(data.error || data.detail || "Invalid or expired verification link.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Could not connect to the verification server. Please try again later.");
      });
  }, [token]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border border-border bg-obsidian-raised p-8 md:p-10 relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
        style={{
          background: "linear-gradient(to right, transparent, var(--ember), transparent)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(224,114,58,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-[1] flex flex-col items-center text-center">
        <Link
          href="/login/"
          className="inline-flex items-center gap-2 text-muted hover:text-ember transition-colors font-mono text-label uppercase tracking-[0.28em] mb-6 self-start"
        >
          <ArrowLeft size={12} />
          Back to sign in
        </Link>

        {status === "loading" && (
          <>
            <Loader2 size={40} className="text-ember animate-spin mb-4" />
            <div className="section-eyebrow mb-2">Verifying</div>
            <h1 className="font-display font-light text-bone text-2xl md:text-3xl mb-2">
              Confirming your email...
            </h1>
            <p className="text-muted text-sm">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle size={40} className="text-ember mb-4" />
            <div className="section-eyebrow mb-2">Verified</div>
            <h1 className="font-display font-light text-bone text-2xl md:text-3xl mb-2">
              Email confirmed.
            </h1>
            <p className="text-muted text-sm mb-6">{message}</p>
            <Link href="/download/">
              <Button variant="primary">
                Go to Downloads
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={40} className="text-signal-crit mb-4" />
            <div className="section-eyebrow mb-2 text-signal-crit">Failed</div>
            <h1 className="font-display font-light text-bone text-2xl md:text-3xl mb-2">
              Verification failed.
            </h1>
            <p className="text-muted text-sm mb-6">{message}</p>
            <Link href="/login/">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={12} />
                Return to sign in
              </Button>
            </Link>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
