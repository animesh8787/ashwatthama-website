"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UserPlus, ArrowLeft, Eye, EyeOff } from "lucide-react";

const passwordRules = [
  { test: (p: string) => p.length >= 8, label: "At least 8 characters" },
  { test: (p: string) => /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p: string) => /[a-z]/.test(p), label: "One lowercase letter" },
  { test: (p: string) => /[0-9]/.test(p), label: "One number" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: "One special character" },
];

function validatePassword(password: string): string | null {
  if (!passwordRules[0].test(password)) return "Password must be at least 8 characters.";
  if (!passwordRules[1].test(password)) return "Password must include an uppercase letter.";
  if (!passwordRules[2].test(password)) return "Password must include a lowercase letter.";
  if (!passwordRules[3].test(password)) return "Password must include a number.";
  if (!passwordRules[4].test(password)) return "Password must include a special character.";
  return null;
}

const REDIRECT_MAP: Record<string, string> = {
  download: "/download/",
};

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, loading: authLoading, error: authError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const redirectToken = searchParams.get("redirect");
  const redirectUrl = REDIRECT_MAP[redirectToken || ""] || "/download/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setFormError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, name);
      if (redirectUrl.startsWith("http")) {
        window.location.href = redirectUrl;
      } else {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      setFormError(
        err.code === "auth/email-already-in-use"
          ? "An account with this email already exists."
          : err.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border border-border bg-obsidian-raised p-8 md:p-10 relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
        style={{ background: "linear-gradient(to right, transparent, var(--ember), transparent)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(224,114,58,0.06) 0%, transparent 65%)" }}
      />

      <div className="relative z-[1]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted hover:text-ember transition-colors font-mono text-label uppercase tracking-[0.28em] mb-6"
        >
          <ArrowLeft size={12} />
          Back to home
        </Link>

        <div className="section-eyebrow mb-2">Authentication</div>
        <h1 className="font-display font-light text-bone text-2xl md:text-3xl mb-2">
          Join the awakening.
        </h1>
        <p className="text-muted text-sm mb-8">
          Create an account to secure your download and early access.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-mono text-label uppercase tracking-[0.28em] text-muted mb-2">
              Display Name
            </label>
            <Input
              type="text"
              autoComplete="name"
              placeholder="Animesh"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div>
            <label className="block font-mono text-label uppercase tracking-[0.28em] text-muted mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
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
            {(passwordFocused || password.length > 0) && (
              <div className="mt-2 grid grid-cols-2 gap-1">
                {passwordRules.map((rule) => (
                  <div
                    key={rule.label}
                    className={`flex items-center gap-1.5 font-mono text-micro transition-colors ${
                      rule.test(password) ? "text-ember" : "text-muted"
                    }`}
                  >
                    <span>{rule.test(password) ? "✓" : "○"}</span>
                    {rule.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block font-mono text-label uppercase tracking-[0.28em] text-muted mb-2">
              Confirm Password
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

          {(formError || authError) && (
            <p className="text-ember text-sm font-mono">{formError || authError}</p>
          )}

          <Button type="submit" variant="primary" disabled={loading || authLoading} className="mt-2">
            <UserPlus size={14} />
            {loading || authLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login/"
            className="text-muted hover:text-ember transition-colors font-mono text-label uppercase tracking-[0.22em]"
          >
            Already have an account? Sign in →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
