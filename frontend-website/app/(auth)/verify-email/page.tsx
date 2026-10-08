"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/ui/auth-card";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8765/api/v1";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email…");

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

  const title =
    status === "loading" ? "Confirming your email…" : status === "success" ? "Email confirmed." : "Verification failed.";
  const eyebrow = status === "loading" ? "Verifying" : status === "success" ? "Verified" : "Problem";

  return (
    <AuthCard
      eyebrow={eyebrow}
      title={title}
      subtitle={message}
      back={{ href: "/login/", label: "Back to sign in" }}
    >
      <div role="status" className="flex flex-col items-start gap-5">
        {status === "loading" && <Loader2 size={30} className="animate-spin text-ember" aria-hidden="true" />}
        {status === "success" && (
          <>
            <CheckCircle2 size={32} className="text-ember" strokeWidth={1.5} aria-hidden="true" />
            <Button href="/download/">Go to downloads</Button>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle size={32} className="text-crit" strokeWidth={1.5} aria-hidden="true" />
            <Button href="/login/" variant="secondary">
              Return to sign in
            </Button>
          </>
        )}
      </div>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
