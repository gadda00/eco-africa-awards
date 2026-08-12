import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { awardCategories } from "@/lib/data";

// POST /api/ai-match — match a nominee description to top categories
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const description: string = String(body?.description ?? "").trim();

    if (description.length < 20) {
      return NextResponse.json(
        { error: "Please provide a description of at least 20 characters" },
        { status: 400 }
      );
    }

    // Build the prompt
    const categoriesList = awardCategories
      .map((c) => `- ${c.id}: ${c.name} — ${c.tagline}`)
      .join("\n");

    const systemPrompt = `You are the Eco Africa Awards AI Category Matchmaker. Given a plain-English description of a nominee's climate work, rank the most suitable award categories.

Available categories:
${categoriesList}

Return STRICT JSON (no markdown, no prose) in this exact shape:
{
  "matches": [
    { "categoryId": "<cat-id from list above>", "score": <0-100 int>, "rationale": "<one-sentence reason, max 180 chars>" }
  ]
}

Rules:
- Return exactly 4 matches, sorted by score (highest first).
- Scores should reflect genuine fit; do not give everyone 90+.
- The rationale must be specific to the nominee description and that category's focus.
- Only return category IDs from the list above.`;

    const userPrompt = `Nominee description:\n${description}`;

    let matches: { categoryId: string; score: number; rationale: string }[] = [];

    try {
      const ZAI = (await import("z-ai-web-dev-sdk")).default;
      const zai = await ZAI.create();
      const res = await zai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 700,
        response_format: { type: "json_object" },
      });

      const text = res.choices?.[0]?.message?.content ?? "";
      let parsed: any = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }

      if (parsed && Array.isArray(parsed.matches)) {
        const validIds = new Set(awardCategories.map((c) => c.id));
        matches = parsed.matches
          .filter((m: any) => validIds.has(String(m.categoryId)))
          .map((m: any) => ({
            categoryId: String(m.categoryId),
            score: Math.max(0, Math.min(100, parseInt(String(m.score ?? 0), 10) || 0)),
            rationale: String(m.rationale ?? "").slice(0, 220),
          }))
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, 4);
      }

      await db.aiUsageLog.create({
        data: { feature: "ai_match", success: matches.length > 0, tokens: res.usage?.total_tokens ?? 0 },
      });
    } catch (e: any) {
      console.warn("AI match fallback:", e?.message);
      await db.aiUsageLog.create({ data: { feature: "ai_match", success: false, tokens: 0 } }).catch(() => {});
    }

    // Fallback: keyword-based scoring
    if (matches.length === 0) {
      matches = keywordMatch(description);
    }

    return NextResponse.json({ matches });
  } catch (e: any) {
    console.error("AI match error:", e);
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}

function keywordMatch(description: string): { categoryId: string; score: number; rationale: string }[] {
  const text = description.toLowerCase();
  const scored = awardCategories.map((cat) => {
    let score = 30; // base
    const keywords: Record<string, string[]> = {
      "cat-01": ["leader", "leadership", "vision", "career", "policy", "movement", "director", "founder"],
      "cat-02": ["youth", "young", "under 35", "student", "activist", "movement", "mobilise"],
      "cat-03": ["innovation", "technology", "platform", "app", "patent", "research", "prototype", "startup"],
      "cat-04": ["finance", "fund", "investment", "capital", "bond", "carbon market", "blended"],
      "cat-05": ["community", "grassroots", "cooperative", "village", "local", "indigenous"],
      "cat-06": ["policy", "law", "regulation", "government", "minister", "ndc", "negotiator", "treaty"],
      "cat-07": ["woman", "women", "girl", "female", "gender"],
      "cat-08": ["indigenous", "traditional", "elder", "knowledge", "ancestral", "maasai", "san"],
      "cat-09": ["media", "journalist", "film", "podcast", "story", "article", "documentary", "photo"],
      "cat-10": ["biodiversity", "conservation", "wildlife", "ranger", "park", "reserve", "species", "habitat"],
      "cat-11": ["corporate", "company", "business", "industry", "supply chain", "esg", "net zero"],
      "cat-12": ["lifetime", "decades", "elder", "legacy", "career spanning"],
    };
    const kws = keywords[cat.id] ?? [];
    let hits = 0;
    kws.forEach((k) => {
      if (text.includes(k)) {
        hits += 1;
        score += 18;
      }
    });
    if (hits === 0) score = Math.max(20, score - 10);
    score = Math.min(95, score);
    return {
      categoryId: cat.id,
      score,
      rationale: `Matched on ${hits} keyword(s) related to ${cat.name.toLowerCase()}.`,
    };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, 4);
}
