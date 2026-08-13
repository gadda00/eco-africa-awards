"use client";

import Link from "next/link";
import { Leaf, ArrowLeft, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen grid place-items-center bg-savanna-gradient p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-forest to-forest-light shadow-forest mb-6">
          <Leaf className="h-8 w-8 text-gold-light" />
        </div>
        <h1 className="font-display text-4xl font-bold text-forest mb-3">
          Something went wrong
        </h1>
        <p className="text-foreground/70 mb-2">
          An unexpected error occurred while loading this page.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-terracotta/80 mb-6 font-mono bg-terracotta/10 p-2 rounded">
            {error.message}
          </p>
        )}
        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-cream font-semibold"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-forest/30 text-forest font-semibold hover:bg-white/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
