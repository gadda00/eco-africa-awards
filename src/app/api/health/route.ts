import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  let dbStatus: "up" | "down" = "down";
  try {
    await db.$queryRaw`SELECT 1`;
    dbStatus = "up";
  } catch {
    dbStatus = "down";
  }

  return NextResponse.json(
    {
      ok: dbStatus === "up",
      status: dbStatus,
      service: "africa-climate-leadership-awards",
      version: "1.0",
      timestamp: new Date().toISOString(),
    },
    {
      status: dbStatus === "up" ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
