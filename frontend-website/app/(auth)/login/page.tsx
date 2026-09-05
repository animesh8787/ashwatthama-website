"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogIn, ArrowLeft, Eye, EyeOff } from "lucide-react";

const REDIRECT_MAP: Record<string, string> = {
  download: "/download/",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Resolve redirect token from query param (never raw URLs)
  const redirectToken = searchParams.get("redirect");
  const redirectUrl = REDIRECT_MAP[redirectToken || ""] || "/download/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    try {
      await login(email, password);
      if (redirectUrl.startsWith("http")) {
        window.location.href = redirectUrl;
      } else {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      setFormError(
        err.code === "auth/invalid-credential"
          ? "Invalid email or password."
          : err.message || "Login failed. Please try again."
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
          Welcome back.
        </h1>
        <p className="text-muted text-sm mb-8">
          Sign in to access your download and early access status.
        </p>

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
              onChange={(e) => {
                setEmail(e.target.value);
                setFormError("");
              }}
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
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFormError("");
                }}
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

          {formError && (
            <p className="text-ember text-sm font-mono">{formError}</p>
          )}

          <Button type="submit" variant="primary" disabled={loading || authLoading} className="mt-2">
            <LogIn size={14} />
            {loading || authLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <Link
            href="/reset-password/"
            className="text-muted hover:text-ember transition-colors font-mono text-label uppercase tracking-[0.22em]"
          >
            Forgot password?
          </Link>
          <Link
            href="/signup/"
            className="text-ember hover:text-ember-glow transition-colors font-mono text-label uppercase tracking-[0.22em]"
          >
            Create account →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
