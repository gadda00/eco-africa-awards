"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Leaf,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "My Dashboard", href: "/judge", icon: LayoutDashboard },
  { label: "My Assignments", href: "/judge/nominations", icon: FileText },
];

export function JudgeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-forest" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen grid place-items-center bg-background p-6">
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl font-bold text-forest mb-3">Authentication required</h1>
          <p className="text-foreground/70 mb-6">Please sign in to access the judge portal.</p>
          <a
            href="/login?callbackUrl=/judge"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-cream font-semibold"
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  if (session.user.role !== "JUDGE" && session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen grid place-items-center bg-background p-6">
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl font-bold text-terracotta mb-3">Judge access required</h1>
          <p className="text-foreground/70 mb-6">
            Your account ({session.user.email}) is not registered as a judge.
          </p>
          <a
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-cream font-semibold mr-2"
          >
            Go to Admin
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-forest text-cream hidden lg:flex flex-col">
        <div className="p-5 border-b border-cream/15">
          <Link href="/judge" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-gold to-terracotta grid place-items-center">
              <Leaf className="h-5 w-5 text-cream" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-sm font-bold tracking-tight">Africa Climate</span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-gold-light font-semibold">
                Judge Portal
              </span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/judge" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active ? "bg-cream/10 text-cream" : "text-cream/70 hover:text-cream hover:bg-cream/5"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-cream/15 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-cream/70 hover:text-cream hover:bg-cream/5 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View public site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-cream/70 hover:text-terracotta hover:bg-terracotta/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          <div className="px-3 pt-2 text-[10px] text-cream/50">
            Signed in as<br />
            <span className="text-cream/80 truncate block max-w-[200px]">{session.user.email}</span>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-forest text-cream p-3 flex items-center justify-between">
        <Link href="/judge" className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-gold-light" />
          <span className="font-display text-sm font-bold">Judge Portal</span>
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-cream/70">
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile nav */}
      <div className="lg:hidden sticky top-12 z-20 bg-card border-b border-border overflow-x-auto scrollbar-warm">
        <div className="flex gap-1 px-2 py-1.5 min-w-max">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/judge" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                  active ? "bg-forest text-cream" : "text-foreground/70"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
