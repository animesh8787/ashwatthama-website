"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, Lock, Eye, EyeOff } from "lucide-react";

function Shell({ children }: { children: React.ReactNode }) {
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
      <div className="relative z-[1]">{children}</div>
    </motion.div>
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
    <Shell>
      <Link
        href="/login/"
        className="inline-flex items-center gap-2 text-muted hover:text-ember transition-colors font-mono text-label uppercase tracking-[0.28em] mb-6"
      >
        <ArrowLeft size={12} />
        Back to sign in
      </Link>

      <div className="section-eyebrow mb-2">Authentication</div>
      <h1 className="font-display font-light text-bone text-2xl md:text-3xl mb-2">
        Reset password.
      </h1>
      <p className="text-muted text-sm mb-8">
        Enter your email and we'll send you a link to reset your password.
      </p>

      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 text-center py-6"
        >
          <CheckCircle size={40} className="text-ember" />
          <p className="text-bone font-mono text-sm">
            Check your inbox for a password reset link.
          </p>
          <Link
            href="/login/"
            className="text-ember hover:text-ember-glow transition-colors font-mono text-label uppercase tracking-[0.22em] mt-2"
          >
            ← Return to sign in
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-mono text-label uppercase tracking-[0.28em] text-muted mb-2">
              Email
            </label>
            <Input
              type="email"
              required
              autoComplete="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {formError && (
            <p className="text-ember text-sm font-mono">{formError}</p>
          )}

          <Button type="submit" variant="primary" disabled={loading} className="mt-2">
            <Mail size={14} />
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      )}
    </Shell>
  );
}

function ConfirmResetForm({ token }: { token: string }) {
  const { confirmResetPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      <Shell>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 text-center py-6"
        >
          <CheckCircle size={40} className="text-ember" />
          <p className="text-bone font-mono text-sm">
            Your password has been reset successfully.
          </p>
          <Link
            href="/login/"
            className="text-ember hover:text-ember-glow transition-colors font-mono text-label uppercase tracking-[0.22em] mt-2"
          >
            ← Continue to sign in
          </Link>
        </motion.div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="section-eyebrow mb-2">Authentication</div>
      <h1 className="font-display font-light text-bone text-2xl md:text-3xl mb-2">
        Set a new password.
      </h1>
      <p className="text-muted text-sm mb-8">
        Choose a new password for your account.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block font-mono text-[9px] uppercase tracking-[0.28em] text-muted mb-2">
            New password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-muted hover:text-ember transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-mono text-[9px] uppercase tracking-[0.28em] text-muted mb-2">
            Confirm new password
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-muted hover:text-ember transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              aria-pressed={showConfirmPassword}
            >
              {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {formError && (
          <p className="text-ember text-sm font-mono">{formError}</p>
        )}

        <Button type="submit" variant="primary" disabled={loading} className="mt-2">
          <Lock size={14} />
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </Shell>
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
