import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-secondary text-foreground/70",
  SUBMITTED: "bg-forest/10 text-forest ring-forest/30",
  UNDER_REVIEW: "bg-sky/15 text-sky ring-sky/30",
  SHORTLISTED: "bg-gold/15 text-gold ring-gold/40",
  FINALIST: "bg-terracotta/10 text-terracotta ring-terracotta/40",
  WINNER: "bg-gradient-to-r from-gold to-terracotta text-cream",
  NOT_SELECTED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-muted text-muted-foreground",
  CHECKED_IN: "bg-forest text-cream",
  CONFIRMED: "bg-forest/10 text-forest ring-forest/30",
  new: "bg-terracotta/10 text-terracotta ring-terracotta/40",
  read: "bg-forest/10 text-forest ring-forest/30",
  replied: "bg-gold/15 text-gold ring-gold/40",
  archived: "bg-muted text-muted-foreground",
};

const labels: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under review",
  SHORTLISTED: "Shortlisted",
  FINALIST: "Finalist",
  WINNER: "Winner",
  NOT_SELECTED: "Not selected",
  CANCELLED: "Cancelled",
  CHECKED_IN: "Checked in",
  CONFIRMED: "Confirmed",
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const style = statusStyles[status] ?? statusStyles.SUBMITTED;
  const label = labels[status] ?? status;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold ring-1",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
