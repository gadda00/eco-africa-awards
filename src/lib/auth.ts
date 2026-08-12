import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// Enforce secret in production runtime — fail fast rather than silently use a fallback.
// Note: we use a placeholder at build time so the build doesn't fail when operators
// haven't yet set the env var (Netlify will inject it at runtime).
const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE === "phase-production-server"
    ? null // Force runtime to require NEXTAUTH_SECRET
    : "dev-only-secret-do-not-use-in-production-please-set-NEXTAUTH_SECRET");

if (NEXTAUTH_SECRET === null) {
  throw new Error(
    "NEXTAUTH_SECRET environment variable is required in production. Set it to a 32+ character random string."
  );
}

const FALLBACK_SECRET = "dev-only-secret-do-not-use-in-production-please-set-NEXTAUTH_SECRET";

// Note: this must match the secret used in src/middleware.ts (getToken).
// Both fall back to FALLBACK_SECRET when NEXTAUTH_SECRET is unset (dev only).

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  secret: NEXTAUTH_SECRET ?? FALLBACK_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });
        if (!user || !user.isActive || !user.passwordHash) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;

        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      try {
        await db.auditLog.create({
          data: {
            userId: (user as any).id,
            action: "user.login",
            entity: "user",
            entityId: (user as any).id,
          },
        });
      } catch (e) {
        // Audit log failure should not block login
        console.warn("Audit log failed for user.login event:", e);
      }
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

// Type augmentation for next-auth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
    };
  }
  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
