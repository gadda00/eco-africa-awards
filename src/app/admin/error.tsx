"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="min-h-screen grid place-items-center bg-secondary/30 p-4">
      <div className="text-center max-w-md rounded-2xl border border-terracotta/30 bg-card p-8 shadow-warm-lg">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-terracotta/15 ring-1 ring-terracotta/30 mb-4">
          <AlertTriangle className="h-7 w-7 text-terracotta" />
        </div>
        <h1 className="font-display text-2xl font-bold text-forest mb-2">
          Admin panel error
        </h1>
        <p className="text-foreground/70 mb-2 text-sm">
          Something went wrong loading this page. Try again, or return to the dashboard.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-terracotta mb-4 font-mono bg-terracotta/10 p-2 rounded text-left">
            {error.message}
          </p>
        )}
        <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-forest hover:bg-forest-light text-cream font-semibold text-sm"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-forest/30 text-forest font-semibold text-sm hover:bg-white/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
