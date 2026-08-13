/**
 * Shared helper for parsing Next.js 16 searchParams in admin pages.
 * searchParams is a Promise in Next 16 — this awaits and stringifies it.
 */
export async function parseSearchParams(
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>
): Promise<Record<string, string>> {
  const resolved = await searchParams;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(resolved)) {
    if (Array.isArray(v)) out[k] = v[0] || "";
    else if (typeof v === "string") out[k] = v;
    else out[k] = "";
  }
  return out;
}

/**
 * Convert a filters object to URL search params for router.push.
 */
export function filtersToSearchParams(
  filters: Record<string, string>,
  extra: Record<string, string> = {}
): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v) params.set(k, v);
    else params.delete(k);
  }
  for (const [k, v] of Object.entries(extra)) {
    if (v) params.set(k, v);
    else params.delete(k);
  }
  return params.toString();
}
