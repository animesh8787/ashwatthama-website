"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthCard, FieldLabel, FormError } from "@/components/ui/auth-card";

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
    <AuthCard
      title="Welcome back."
      subtitle="Sign in to access your download."
      back={{ href: "/", label: "Back to home" }}
    >
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
            onChange={(e) => {
              setEmail(e.target.value);
              setFormError("");
            }}
          />
        </div>
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label htmlFor="password" className="text-[0.875rem] font-medium text-bone-muted">
              Password
            </label>
            <Link
              href="/reset-password/"
              className="text-[0.8125rem] text-muted transition-colors hover:text-bone"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormError("");
              }}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-muted transition-colors hover:text-bone"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {formError && <FormError>{formError}</FormError>}

        <Button type="submit" disabled={loading || authLoading} className="mt-1 w-full">
          {loading || authLoading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-8 text-center text-[0.9375rem] text-muted">
        New to Ashwatthama?{" "}
        <Link href="/signup/" className="font-medium text-bone underline-offset-4 hover:text-ember hover:underline">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
