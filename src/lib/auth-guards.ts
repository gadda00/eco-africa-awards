/**
 * Server-side role checks for protected routes & API endpoints.
 */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  role: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user as SessionUser;
}

export async function requireAdmin() {
  const u = await getSessionUser();
  if (!u || u.role !== "ADMIN") {
    return { ok: false as const, status: 403, message: "Admin access required" };
  }
  return { ok: true as const, user: u };
}

export async function requireJudgeOrAdmin() {
  const u = await getSessionUser();
  if (!u || (u.role !== "ADMIN" && u.role !== "JUDGE")) {
    return { ok: false as const, status: 403, message: "Judge or admin access required" };
  }
  return { ok: true as const, user: u };
}

/**
 * Log an audit action. Always succeeds (best-effort).
 */
export async function audit(
  userId: string | undefined | null,
  action: string,
  entity?: string,
  entityId?: string,
  metadata?: Record<string, any>
) {
  try {
    await db.auditLog.create({
      data: {
        userId: userId ?? null,
        action,
        entity,
        entityId,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (e) {
    console.warn("audit log failed:", e);
  }
}
