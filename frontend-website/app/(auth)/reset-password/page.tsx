"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthCard, FieldLabel, FormError } from "@/components/ui/auth-card";

function SuccessState({ message, linkLabel }: { message: string; linkLabel: string }) {
  return (
    <div className="flex flex-col items-start gap-5" role="status">
      <CheckCircle2 size={32} className="text-ember" strokeWidth={1.5} aria-hidden="true" />
      <p className="text-[1.0625rem] text-bone">{message}</p>
      <Button href="/login/" variant="secondary">
        {linkLabel}
      </Button>
    </div>
  );
}

function RequestResetForm() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setFormError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset your password."
      subtitle="Enter your email and we'll send you a link to reset it."
      back={{ href: "/login/", label: "Back to sign in" }}
    >
      {sent ? (
        <SuccessState message="Check your inbox for a password reset link." linkLabel="Return to sign in" />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {formError && <FormError>{formError}</FormError>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}

function PasswordInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          required
          autoComplete="new-password"
          placeholder="••••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-12"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-muted transition-colors hover:text-bone"
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

function ConfirmResetForm({ token }: { token: string }) {
  const { confirmResetPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await confirmResetPassword(token, password);
      setDone(true);
    } catch (err: any) {
      setFormError(
        err.message || "This reset link is invalid or has expired. Please request a new one."
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthCard title="Password updated.">
        <SuccessState message="Your password has been reset successfully." linkLabel="Continue to sign in" />
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Set a new password." subtitle="Choose a new password for your account.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <PasswordInput id="new-password" label="New password" value={password} onChange={setPassword} />
        <PasswordInput
          id="confirm-new-password"
          label="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        {formError && <FormError>{formError}</FormError>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Resetting…" : "Reset password"}
        </Button>
      </form>
      <p className="mt-8 text-center text-[0.9375rem] text-muted">
        <Link href="/login/" className="hover:text-bone">
          Back to sign in
        </Link>
      </p>
    </AuthCard>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  return token ? <ConfirmResetForm token={token} /> : <RequestResetForm />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
