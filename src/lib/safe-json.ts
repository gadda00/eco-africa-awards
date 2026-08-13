/**
 * Safe JSON parsing — returns fallback on malformed input instead of throwing.
 *
 * Use this EVERYWHERE you read JSON from a database string column or external
 * source. Never use raw `JSON.parse` on data that could be malformed.
 */
export function safeJsonParse<T>(input: string | null | undefined, fallback: T): T {
  if (!input) return fallback;
  try {
    return JSON.parse(input) as T;
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("safeJsonParse: malformed JSON, returning fallback:", (e as Error).message);
    }
    return fallback;
  }
}

/**
 * Safe JSON parse for arrays — returns [] on malformed input or non-array.
 */
export function safeJsonArray<T = string>(input: string | null | undefined, fallback: T[] = []): T[] {
  const parsed = safeJsonParse<T[] | null>(input, null);
  if (!Array.isArray(parsed)) return fallback;
  return parsed;
}

/**
 * Safe JSON parse for objects — returns {} on malformed input or non-object.
 */
export function safeJsonObject<T extends Record<string, unknown>>(
  input: string | null | undefined,
  fallback: T = {} as T
): T {
  const parsed = safeJsonParse<T | null>(input, null);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fallback;
  return parsed;
}
