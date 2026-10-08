"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthCard, FieldLabel, FormError } from "@/components/ui/auth-card";

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

function PasswordField({
  id,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  autoComplete = "new-password",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoComplete?: string;
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
          autoComplete={autoComplete}
          placeholder="••••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
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
    <AuthCard
      title="Create your account."
      subtitle="Free forever. An account secures your download."
      back={{ href: "/", label: "Back to home" }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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

        <div>
          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          {(passwordFocused || password.length > 0) && (
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5" aria-label="Password requirements">
              {passwordRules.map((rule) => {
                const ok = rule.test(password);
                return (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-1.5 text-[0.8125rem] transition-colors ${
                      ok ? "text-ember" : "text-muted"
                    }`}
                  >
                    <Check size={13} className={ok ? "opacity-100" : "opacity-30"} aria-hidden="true" />
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <PasswordField
          id="confirm-password"
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        {(formError || authError) && <FormError>{formError || authError}</FormError>}

        <Button type="submit" disabled={loading || authLoading} className="mt-1 w-full">
          {loading || authLoading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-8 text-center text-[0.9375rem] text-muted">
        Already have an account?{" "}
        <Link href="/login/" className="font-medium text-bone underline-offset-4 hover:text-ember hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
