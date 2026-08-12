"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Leaf, Loader2, Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm-lg space-y-4"
    >
      <div>
        <label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.org"
            className="pl-9"
            autoComplete="email"
            autoFocus
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-9"
            autoComplete="current-password"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-terracotta/30 bg-terracotta/10 text-sm text-terracotta">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-forest hover:bg-forest-light text-cream font-semibold h-11"
      >
        {loading ? (
          <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />Signing in…</>
        ) : (
          "Sign in"
        )}
      </Button>

      <div className="pt-3 border-t border-border/60 text-xs text-muted-foreground space-y-1.5">
        <p className="font-semibold text-foreground/80">Demo credentials:</p>
        <p><span className="font-medium text-forest">Admin:</span> admin@ecoawardsafrica.com / ACLA-Admin-2026!</p>
        <p><span className="font-medium text-forest">Judge:</span> judge.kwame@example.org / Judge-2026!</p>
        <p className="text-[10px] text-muted-foreground/70 mt-2">
          Change these passwords in production via the admin panel.
        </p>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-savanna-gradient p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-forest to-forest-light shadow-forest mb-4">
            <Leaf className="h-7 w-7 text-gold-light" />
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
