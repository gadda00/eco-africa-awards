"use client";

import { useEffect, useState } from "react";

/**
 * Debounce any value — useful for search inputs that trigger server-side fetches.
 *
 * Usage:
 *   const [q, setQ] = useState("");
 *   const debouncedQ = useDebouncedValue(q, 300);
 *   useEffect(() => { if (debouncedQ !== filters.q) updateFilter("q", debouncedQ); }, [debouncedQ]);
 */
export function useDebouncedValue<T>(value: T, delayMs: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}
