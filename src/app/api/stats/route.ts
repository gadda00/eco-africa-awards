import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";

// GET /api/stats — public live stats for the awards
export async function GET() {
  let nominations = 0;
  let registrations = 0;
  let countriesThisCycle = 0;

  try {
    nominations = await db.nomination.count();
    registrations = await db.registration.count();
    const countryRows = await db.nomination.findMany({
      where: {},
      select: { nomineeCountry: true },
      distinct: ["nomineeCountry"],
    });
    countriesThisCycle = countryRows.length;
  } catch {
    // fall back to config defaults if DB unreachable
  }

  return NextResponse.json({
    ok: true,
    stats: {
      ...siteConfig.stats,
      liveNominations: nominations,
      liveRegistrations: registrations,
      liveCountries: countriesThisCycle || siteConfig.stats.countriesCovered,
    },
  });
}
