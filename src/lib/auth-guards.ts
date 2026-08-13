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

/**
 * Verify the session user is still active and is an admin.
 * Re-fetches the user from DB on every call (cheap indexed lookup) so that
 * deactivated admins immediately lose access even with a valid JWT.
 */
export async function requireAdmin() {
  const u = await getSessionUser();
  if (!u) {
    return { ok: false as const, status: 401, message: "Authentication required" };
  }
  // Re-check DB — a user may have been deactivated or had their role changed
  // since the JWT was issued.
  const fresh = await db.user.findUnique({
    where: { id: u.id },
    select: { isActive: true, role: true },
  });
  if (!fresh || !fresh.isActive || fresh.role !== "ADMIN") {
    return { ok: false as const, status: 403, message: "Admin access required" };
  }
  return { ok: true as const, user: u };
}

/**
 * Verify the session user is still active and is a judge or admin.
 * Re-fetches the user from DB on every call.
 */
export async function requireJudgeOrAdmin() {
  const u = await getSessionUser();
  if (!u) {
    return { ok: false as const, status: 401, message: "Authentication required" };
  }
  const fresh = await db.user.findUnique({
    where: { id: u.id },
    select: { isActive: true, role: true },
  });
  if (!fresh || !fresh.isActive) {
    return { ok: false as const, status: 403, message: "Account is not active" };
  }
  if (fresh.role !== "ADMIN" && fresh.role !== "JUDGE") {
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
  metadata?: Record<string, unknown>
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
