/**
 * Shared StatTile component used by admin dashboard, judge dashboard, and public pages.
 */
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export type AccentColor = "forest" | "gold" | "terracotta" | "savanna";

const accentStyles: Record<AccentColor, { bg: string; text: string; ring: string }> = {
  forest: { bg: "bg-forest/10", text: "text-forest", ring: "ring-forest/30" },
  gold: { bg: "bg-gold/15", text: "text-gold", ring: "ring-gold/40" },
  terracotta: { bg: "bg-terracotta/10", text: "text-terracotta", ring: "ring-terracotta/40" },
  savanna: { bg: "bg-savanna/25", text: "text-terracotta", ring: "ring-savanna/50" },
};

export function StatTile({
  label,
  value,
  icon: Icon,
  accent = "forest",
  trend,
  link,
  className,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: AccentColor;
  trend?: string;
  link?: string;
  className?: string;
}) {
  const styles = accentStyles[accent];
  const Wrapper = link ? "a" : "div";

  return (
    <Wrapper
      {...(link ? { href: link } : {})}
      className={cn(
        "block rounded-2xl border border-forest/15 bg-card p-5 shadow-warm",
        link && "hover:shadow-warm-lg hover:-translate-y-0.5 transition-all",
        className
      )}
    >
      <div className={cn("h-10 w-10 rounded-xl grid place-items-center mb-3 ring-1", styles.bg, styles.ring)}>
        <Icon className={cn("h-5 w-5", styles.text)} />
      </div>
      <div className="font-display text-3xl font-bold text-foreground tabular-nums">{value}</div>
      <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
      {trend && <div className="text-[10px] text-muted-foreground mt-1">{trend}</div>}
    </Wrapper>
  );
}
