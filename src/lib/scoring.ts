/**
 * Shared scoring criteria for the Africa Climate Leadership Awards.
 *
 * Used by:
 * - Server: /api/judge/nominations/[id]/route.ts (computeTotal)
 * - Client: /components/admin/judge-scoring.tsx (live preview)
 *
 * KEEP IN SYNC — both must produce identical weighted totals.
 */

export const CRITERIA_WEIGHTS = {
  scoreImpact: 0.25,
  scoreInnovation: 0.18,
  scoreScale: 0.17,
  scoreSustainability: 0.15,
  scoreLeadership: 0.15,
  scoreEquity: 0.10,
} as const;

export type CriterionKey = keyof typeof CRITERIA_WEIGHTS;

export const CRITERIA = [
  {
    key: "scoreImpact" as const,
    label: "Impact",
    weight: 25,
    description: "Measurable climate outcomes — ecological, social, economic.",
    guidance: "0–3 = no measurable outcomes; 4–6 = some outcomes; 7–8 = strong evidence; 9–10 = continent-leading.",
  },
  {
    key: "scoreInnovation" as const,
    label: "Innovation",
    weight: 18,
    description: "Originality of approach and problem framing.",
    guidance: "0–3 = derivative; 4–6 = novel elements; 7–8 = distinctly original; 9–10 = paradigm-shifting.",
  },
  {
    key: "scoreScale" as const,
    label: "Scale & Replicability",
    weight: 17,
    description: "Reach today and potential to scale across contexts.",
    guidance: "0–3 = single-community; 4–6 = regional; 7–8 = national/multi-country; 9–10 = pan-African potential.",
  },
  {
    key: "scoreSustainability" as const,
    label: "Sustainability",
    weight: 15,
    description: "Durability beyond the intervention or grant cycle.",
    guidance: "0–3 = grant-dependent; 4–6 = some sustainable revenue; 7–8 = financially durable; 9–10 = self-perpetuating.",
  },
  {
    key: "scoreLeadership" as const,
    label: "Leadership",
    weight: 15,
    description: "Mentorship, pipeline-building, and influence beyond the work itself.",
    guidance: "0–3 = isolated; 4–6 = some mentorship; 7–8 = visible pipeline; 9–10 = continental leadership.",
  },
  {
    key: "scoreEquity" as const,
    label: "Equity & Inclusion",
    weight: 10,
    description: "Centre on women, youth, indigenous knowledge, frontline communities.",
    guidance: "0–3 = no equity lens; 4–6 = some inclusion; 7–8 = explicit equity practice; 9–10 = equity-centred.",
  },
] as const;

/**
 * Compute the weighted total score for a set of 6 criteria scores (each 0–10).
 * Returns a value on the 0–10 scale, rounded to 1 decimal place.
 */
export function computeTotal(scores: Record<CriterionKey, number>): number {
  const total = CRITERIA.reduce((sum, c) => {
    return sum + (scores[c.key] ?? 0) * CRITERIA_WEIGHTS[c.key];
  }, 0);
  return Math.round(total * 10) / 10;
}
