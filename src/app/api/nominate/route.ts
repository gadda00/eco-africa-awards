import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { awardCategories } from "@/lib/data";
import { nominateSchema } from "@/lib/validation";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

function generateReferenceCode(prefix: string): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `${prefix}-${ts}${rand}`;
}

// POST /api/nominate — submit a nomination
export async function POST(req: NextRequest) {
  // Rate limit: 10 submissions per minute per IP
  const limited = applyRateLimit(req, RATE_LIMITS.form, "nominate");
  if (limited) {
    return NextResponse.json(limited.body, { status: limited.status, headers: limited.headers });
  }

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Validate with Zod
    const parsed = nominateSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        {
          error: firstError?.message ?? "Validation failed",
          field: firstError?.path.join("."),
        },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const validCat = awardCategories.find((c) => c.id === data.categoryId);
    if (!validCat) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const referenceCode = generateReferenceCode("EAA");

    const nomination = await db.nomination.create({
      data: {
        referenceCode,
        categoryId: data.categoryId,
        nomineeName: data.nomineeName,
        nomineeTitle: data.nomineeTitle ?? null,
        nomineeOrg: data.nomineeOrg ?? null,
        nomineeCountry: data.nomineeCountry,
        nomineeEmail: data.nomineeEmail || null,
        nomineePhone: data.nomineePhone ?? null,
        nomineeWebsite: data.nomineeWebsite ?? null,
        nomineeLinkedin: data.nomineeLinkedin ?? null,
        selfNomination: data.selfNomination,
        nominatorName: data.nominatorName,
        nominatorEmail: data.nominatorEmail,
        nominatorOrg: data.nominatorOrg ?? null,
        nominatorRel: data.nominatorRel ?? null,
        summary: data.summary,
        justification: data.justification,
        impactMetrics: data.impactMetrics ?? null,
        supportingLinks: data.supportingLinks ?? null,
        mediaUrl: data.mediaUrl ?? null,
        confirmsConsent: data.confirmsConsent,
        confirmsTruthful: data.confirmsTruthful,
        confirmsAfrican: data.confirmsAfrican,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });

    // Fire-and-forget: AI eligibility summary (best-effort, non-blocking)
    void aiSummarizeNomination(nomination.id, {
      categoryName: validCat.name,
      nomineeName: data.nomineeName,
      nomineeOrg: data.nomineeOrg,
      summary: data.summary,
      justification: data.justification,
    }).catch((e) => console.warn("AI summarise failed (non-blocking):", e?.message));

    return NextResponse.json(
      {
        ok: true,
        referenceCode: nomination.referenceCode,
        nominationId: nomination.id,
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("Nominate error:", e);
    return NextResponse.json({ error: "Failed to submit nomination" }, { status: 500 });
  }
}

// GET /api/nominate?ref=EAA-XXXX — minimal status lookup
// Returns only the public-facing status, not the full record (privacy-first).
export async function GET(req: NextRequest) {
  // Rate limit: 60 reads per minute per IP
  const limited = applyRateLimit(req, RATE_LIMITS.read, "nominate-get");
  if (limited) {
    return NextResponse.json(limited.body, { status: limited.status, headers: limited.headers });
  }

  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");
    if (!ref) {
      return NextResponse.json({ error: "Missing ?ref= reference code" }, { status: 400 });
    }

    // Sanitize: ref codes are alphanumeric + hyphens, max 20 chars
    const sanitizedRef = ref.toUpperCase().trim().slice(0, 20);
    if (!/^[A-Z0-9-]+$/.test(sanitizedRef)) {
      return NextResponse.json({ error: "Invalid reference code format" }, { status: 400 });
    }

    const nomination = await db.nomination.findUnique({
      where: { referenceCode: sanitizedRef },
      select: {
        referenceCode: true,
        categoryId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!nomination) {
      return NextResponse.json({ error: "Nomination not found" }, { status: 404 });
    }

    // Return only the status (no nominee name, no nominator email)
    return NextResponse.json({
      ok: true,
      status: nomination.status,
      referenceCode: nomination.referenceCode,
      submittedAt: nomination.createdAt,
      lastUpdated: nomination.updatedAt,
    });
  } catch (e: any) {
    console.error("Nominate GET error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// Best-effort AI summarisation — never blocks the response
async function aiSummarizeNomination(
  nominationId: string,
  input: {
    categoryName: string;
    nomineeName: string;
    nomineeOrg?: string | null;
    summary: string;
    justification: string;
  }
) {
  try {
    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();
    const res = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a meticulous awards eligibility reviewer. Read the nomination and produce: (1) a one-sentence neutral summary of the nominee's case (max 220 chars); (2) a JSON object with two fields: 'category_fit' (0-100 integer) and 'completeness' (0-100 integer). Respond ONLY in this exact format:\nSUMMARY: <text>\nFIT: <int>\nCOMPLETENESS: <int>",
        },
        {
          role: "user",
          content: `Category: ${input.categoryName}\nNominee: ${input.nomineeName}\nOrg: ${input.nomineeOrg ?? "n/a"}\n\nSummary:\n${input.summary}\n\nJustification:\n${input.justification}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 350,
    });
    const text = res.choices?.[0]?.message?.content ?? "";
    const summary = (text.match(/SUMMARY:\s*(.+)/)?.[1] ?? "").trim();
    const fit = parseInt(text.match(/FIT:\s*(\d+)/)?.[1] ?? "0", 10);
    const completeness = parseInt(text.match(/COMPLETENESS:\s*(\d+)/)?.[1] ?? "0", 10);

    await db.nomination.update({
      where: { id: nominationId },
      data: {
        aiSummary: summary || null,
        aiEligibility: JSON.stringify({ category_fit: fit, completeness }),
      },
    });

    await db.aiUsageLog.create({
      data: {
        feature: "ai_eligibility",
        success: true,
        tokens: res.usage?.total_tokens ?? 0,
      },
    });
  } catch (e: any) {
    console.warn("AI summarise failed (non-blocking):", e?.message);
    try {
      await db.aiUsageLog.create({
        data: { feature: "ai_eligibility", success: false, tokens: 0 },
      });
    } catch {
      /* no-op */
    }
  }
}
