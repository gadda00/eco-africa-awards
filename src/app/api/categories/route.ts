import { NextResponse } from "next/server";
import { awardCategories } from "@/lib/data";

// GET /api/categories — public list of award categories
export async function GET() {
  return NextResponse.json({
    ok: true,
    count: awardCategories.length,
    categories: awardCategories,
  });
}
