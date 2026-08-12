import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { awardCategories } from "@/lib/data";

function generateReferenceCode(prefix: string): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `${prefix}-${ts}${rand}`;
}

// POST /api/nominate
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Minimal server-side validation
    if (!body?.categoryId || !body?.nomineeName || !body?.nomineeCountry) {
      return NextResponse.json({ error: "Missing required nominee fields" }, { status: 400 });
    }
    if (!body?.nominatorName || !body?.nominatorEmail) {
      return NextResponse.json({ error: "Missing required nominator fields" }, { status: 400 });
    }
    if (!body?.summary || body.summary.length < 60) {
      return NextResponse.json({ error: "Summary must be at least 60 characters" }, { status: 400 });
    }
    if (!body?.justification || body.justification.length < 200) {
      return NextResponse.json({ error: "Justification must be at least 200 characters" }, { status: 400 });
    }
    if (!body?.confirmsConsent || !body?.confirmsTruthful || !body?.confirmsAfrican) {
      return NextResponse.json({ error: "All confirmations are required" }, { status: 400 });
    }
    const validCat = awardCategories.find((c) => c.id === body.categoryId);
    if (!validCat) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const referenceCode = generateReferenceCode("EAA");

    const nomination = await db.nomination.create({
      data: {
        referenceCode,
        categoryId: body.categoryId,
        nomineeName: body.nomineeName,
        nomineeTitle: body.nomineeTitle ?? null,
        nomineeOrg: body.nomineeOrg ?? null,
        nomineeCountry: body.nomineeCountry,
        nomineeEmail: body.nomineeEmail ?? null,
        nomineePhone: body.nomineePhone ?? null,
        nomineeWebsite: body.nomineeWebsite ?? null,
        nomineeLinkedin: body.nomineeLinkedin ?? null,
        selfNomination: !!body.selfNomination,
        nominatorName: body.nominatorName,
        nominatorEmail: body.nominatorEmail,
        nominatorOrg: body.nominatorOrg ?? null,
        nominatorRel: body.nominatorRel ?? null,
        summary: body.summary,
        justification: body.justification,
        impactMetrics: body.impactMetrics ?? null,
        supportingLinks: body.supportingLinks ?? null,
        mediaUrl: body.mediaUrl ?? null,
        confirmsConsent: !!body.confirmsConsent,
        confirmsTruthful: !!body.confirmsTruthful,
        confirmsAfrican: !!body.confirmsAfrican,
        status: "SUBMITTED",
      },
    });

    // Fire-and-forget: AI eligibility summary (best-effort, non-blocking)
    void aiSummarizeNomination(nomination.id, {
      categoryName: validCat.name,
      nomineeName: body.nomineeName,
      nomineeOrg: body.nomineeOrg,
      summary: body.summary,
      justification: body.justification,
    }).catch(() => {});

    return NextResponse.json({
      ok: true,
      referenceCode: nomination.referenceCode,
      nominationId: nomination.id,
    });
  } catch (e: any) {
    console.error("Nominate error:", e);
    return NextResponse.json({ error: e?.message ?? "Failed to submit" }, { status: 500 });
  }
}

// GET /api/nominate — fetch a nomination by reference code (status check)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");
    if (!ref) {
      return NextResponse.json({ error: "Missing ?ref= reference code" }, { status: 400 });
    }
    const nomination = await db.nomination.findUnique({
      where: { referenceCode: ref.toUpperCase() },
      select: {
        referenceCode: true,
        categoryId: true,
        nomineeName: true,
        nomineeCountry: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!nomination) {
      return NextResponse.json({ error: "Nomination not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, nomination });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
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
          content:
            `Category: ${input.categoryName}\nNominee: ${input.nomineeName}\nOrg: ${input.nomineeOrg ?? "n/a"}\n\nSummary:\n${input.summary}\n\nJustification:\n${input.justification}`,
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
    } catch {}
  }
}
