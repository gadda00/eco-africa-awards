"use client";

import { SessionProvider } from "next-auth/react";
import { JudgeShell } from "@/components/admin/judge-shell";

export default function JudgeLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <JudgeShell>{children}</JudgeShell>
    </SessionProvider>
  );
}
