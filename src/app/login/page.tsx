"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Leaf, Loader2, Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    if (res?.url) {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm-lg space-y-4"
    >
      <div>
        <label htmlFor="login-email" className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.org"
            className="pl-9"
            autoComplete="email"
            required
            aria-required="true"
          />
        </div>
      </div>

      <div>
        <label htmlFor="login-password" className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-9 pr-10"
            autoComplete="current-password"
            required
            aria-required="true"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-forest"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 p-3 rounded-lg border border-terracotta/30 bg-terracotta/10 text-sm text-terracotta"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-forest hover:bg-forest-light text-cream font-semibold h-11"
      >
        {loading ? (
          <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" />Signing in…</>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-savanna-gradient p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-forest to-forest-light shadow-forest mb-4">
            <Leaf className="h-7 w-7 text-gold-light" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-bold text-forest">Africa Climate Leadership Awards</h1>
          <p className="text-sm text-foreground/70 mt-1">Sign in to your account</p>
        </div>

        <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading…</div>}>
          <LoginForm />
        </Suspense>

        <div className="text-center mt-6">
          <a href="/" className="text-xs text-muted-foreground hover:text-forest">
            ← Back to public site
          </a>
        </div>
      </div>
    </div>
  );
}
