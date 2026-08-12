import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/ai-assist — review a nomination draft
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      categoryName,
      categoryCriteria = [],
      nomineeName,
      nomineeCountry,
      nomineeOrg,
      summary,
      justification,
    } = body ?? {};

    if (!summary || !justification) {
      return NextResponse.json(
        { error: "Both summary and justification are required" },
        { status: 400 }
      );
    }

    // Build prompt for the LLM
    const criteriaList =
      categoryCriteria.length > 0
        ? categoryCriteria.map((c: string, i: number) => `${i + 1}. ${c}`).join("\n")
        : "(no specific criteria provided)";

    const systemPrompt = `You are a senior reviewer for the Eco Africa Awards, an annual African climate leadership awards programme. Your task is to provide structured, actionable feedback on a draft nomination.

Read the nomination carefully and return STRICT JSON (no markdown, no prose outside JSON) with these fields:
{
  "summary": "A one-sentence neutral summary of the nomination's strength (max 220 chars).",
  "strengths": ["3 specific strengths of the draft", "...", "..."],
  "improvements": ["3 specific, actionable improvements the nominator should make", "...", "..."],
  "criteriaAlignment": [
    {"criterion": "Impact", "score": <0-100 int>},
    {"criterion": "Innovation", "score": <0-100 int>},
    {"criterion": "Scale", "score": <0-100 int>},
    {"criterion": "Sustainability", "score": <0-100 int>},
    {"criterion": "Leadership", "score": <0-100 int>},
    {"criterion": "Equity", "score": <0-100 int>}
  ],
  "overallScore": <0-100 int>
}

Rules:
- Be specific, evidence-based, and respectful.
- If the draft is weak in a criterion, score below 50 and explain in improvements.
- Never invent facts about the nominee.
- Return ONLY the JSON object.`;

    const userPrompt = `Category: ${categoryName ?? "(unspecified)"}

Category criteria:
${criteriaList}

Nominee: ${nomineeName ?? "(unspecified)"}${nomineeOrg ? `\nOrganisation: ${nomineeOrg}` : ""}${nomineeCountry ? `\nCountry: ${nomineeCountry}` : ""}

Draft Summary (max 300 chars):
${summary}

Draft Justification:
${justification}`;

    let result: any = null;

    try {
      const ZAI = (await import("z-ai-web-dev-sdk")).default;
      const zai = await ZAI.create();
      const res = await zai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 900,
        response_format: { type: "json_object" },
      });

      const text = res.choices?.[0]?.message?.content ?? "";
      try {
        result = JSON.parse(text);
      } catch {
        // Fallback: extract JSON from text
        const match = text.match(/\{[\s\S]*\}/);
        if (match) result = JSON.parse(match[0]);
      }

      await db.aiUsageLog.create({
        data: { feature: "ai_assist", success: !!result, tokens: res.usage?.total_tokens ?? 0 },
      });
    } catch (e: any) {
      console.warn("AI assist fallback:", e?.message);
      await db.aiUsageLog.create({ data: { feature: "ai_assist", success: false, tokens: 0 } }).catch(() => {});
    }

    if (!result) {
      // Rule-based fallback (works without an API key)
      const wordCount = justification.trim().split(/\s+/).length;
      const hasMetrics = /\d/.test(justification);
      const strengths: string[] = [];
      const improvements: string[] = [];

      if (summary.length >= 60) strengths.push("Summary is concise and within the character limit.");
      if (wordCount >= 150) strengths.push("Justification has substantial length and detail.");
      if (hasMetrics) strengths.push("Includes quantitative metrics — strengthens the case.");

      if (wordCount < 150) improvements.push("Expand the justification with more specific examples and outcomes.");
      if (!hasMetrics) improvements.push("Add concrete numbers — people reached, hectares restored, tonnes avoided.");
      if (!/African|Africa|country|community|local/i.test(justification))
        improvements.push("Explicitly connect the work to its African context and beneficiaries.");
      improvements.push("Address how the work centres equity, youth, women, and indigenous knowledge.");

      const criteriaAlignment = [
        { criterion: "Impact", score: hasMetrics ? 65 : 45 },
        { criterion: "Innovation", score: 50 },
        { criterion: "Scale", score: 45 },
        { criterion: "Sustainability", score: 50 },
        { criterion: "Leadership", score: 50 },
        { criterion: "Equity", score: 45 },
      ];
      const overallScore = Math.round(
        criteriaAlignment.reduce((s, c) => s + c.score, 0) / criteriaAlignment.length
      );

      result = {
        summary:
          "Draft received. AI scoring service is offline — below is a rule-based review. Please try the AI assistant again later for deeper feedback.",
        strengths,
        improvements,
        criteriaAlignment,
        overallScore,
      };
    }

    // Normalise shape
    const normalised = {
      summary: String(result.summary ?? ""),
      strengths: Array.isArray(result.strengths) ? result.strengths.slice(0, 5) : [],
      improvements: Array.isArray(result.improvements) ? result.improvements.slice(0, 5) : [],
      criteriaAlignment: Array.isArray(result.criteriaAlignment)
        ? result.criteriaAlignment.map((c: any) => ({
            criterion: String(c.criterion ?? ""),
            score: Math.max(0, Math.min(100, parseInt(String(c.score ?? 0), 10) || 0)),
          }))
        : [],
      overallScore: Math.max(0, Math.min(100, parseInt(String(result.overallScore ?? 0), 10) || 0)),
    };

    return NextResponse.json(normalised);
  } catch (e: any) {
    console.error("AI assist error:", e);
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
