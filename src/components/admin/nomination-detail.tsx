"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, Eye, EyeOff, Trophy, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/admin/status-badge";
import { cn } from "@/lib/utils";

type NominationDetail = {
  id: string;
  referenceCode: string;
  categoryId: string;
  nomineeName: string;
  nomineeTitle: string | null;
  nomineeOrg: string | null;
  nomineeCountry: string;
  nomineeEmail: string | null;
  nomineePhone: string | null;
  nomineeWebsite: string | null;
  nomineeLinkedin: string | null;
  selfNomination: boolean;
  nominatorName: string;
  nominatorEmail: string;
  nominatorOrg: string | null;
  nominatorRel: string | null;
  summary: string;
  justification: string;
  impactMetrics: string | null;
  supportingLinks: string | null;
  mediaUrl: string | null;
  confirmsConsent: boolean;
  confirmsTruthful: boolean;
  confirmsAfrican: boolean;
  status: string;
  statusReason: string | null;
  aiSummary: string | null;
  aiEligibility: string | null;
  totalScore: number | null;
  reviewsCount: number;
  winnerYear: number | null;
  winnerHighlight: string | null;
  winnerStory: string | null;
  winnerPhotoUrl: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  reviews: Array<{
    id: string;
    judgeId: string;
    judgeName: string;
    scoreImpact: number;
    scoreInnovation: number;
    scoreScale: number;
    scoreSustainability: number;
    scoreLeadership: number;
    scoreEquity: number;
    totalScore: number;
    comments: string | null;
    recommendation: string | null;
    createdAt: string;
  }>;
  statusChanges: Array<{
    id: string;
    fromStatus: string;
    toStatus: string;
    reason: string | null;
    createdAt: string;
    changedBy: { name: string | null; email: string } | null;
  }>;
};

const STATUSES = ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "FINALIST", "WINNER", "NOT_SELECTED"];

export function NominationDetailClient({ nomination }: { nomination: NominationDetail }) {
  const router = useRouter();
  const [status, setStatus] = useState(nomination.status);
  const [reason, setReason] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  // Winner fields
  const [winnerYear, setWinnerYear] = useState(nomination.winnerYear ?? new Date().getFullYear());
  const [winnerHighlight, setWinnerHighlight] = useState(nomination.winnerHighlight ?? "");
  const [winnerStory, setWinnerStory] = useState(nomination.winnerStory ?? "");
  const [winnerPhotoUrl, setWinnerPhotoUrl] = useState(nomination.winnerPhotoUrl ?? "");
  const [isPublic, setIsPublic] = useState(nomination.isPublic);
  const [savingWinner, setSavingWinner] = useState(false);

  const saveStatus = async () => {
    if (status === nomination.status && !reason) return;
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/admin/nominations/${nomination.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", status, reason }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Status updated to ${status}`);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally {
      setSavingStatus(false);
    }
  };

  const saveWinner = async () => {
    setSavingWinner(true);
    try {
      const res = await fetch(`/api/admin/nominations/${nomination.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "winner",
          winnerYear,
          winnerHighlight,
          winnerStory,
          winnerPhotoUrl,
          isPublic,
        }),
      });
      if (!res.ok) throw new Error("Failed to save winner info");
      toast.success("Winner info saved");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally {
      setSavingWinner(false);
    }
  };

  const aiEligibility = nomination.aiEligibility
    ? JSON.parse(nomination.aiEligibility)
    : null;

  return (
    <div className="max-w-6xl">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link
          href="/admin/nominations"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-forest"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to nominations
        </Link>
      </div>

      {/* Header */}
      <div className="rounded-2xl border border-forest/15 bg-card p-6 mb-4 shadow-warm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={nomination.status} />
              <span className="text-xs text-muted-foreground font-mono">{nomination.referenceCode}</span>
            </div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-forest">{nomination.nomineeName}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {[nomination.nomineeTitle, nomination.nomineeOrg].filter(Boolean).join(" · ") || "—"} · {nomination.nomineeCountry}
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>Submitted: <span className="text-foreground tabular-nums">{new Date(nomination.createdAt).toLocaleString()}</span></div>
            <div>Updated: <span className="text-foreground tabular-nums">{new Date(nomination.updatedAt).toLocaleString()}</span></div>
            {nomination.totalScore !== null && (
              <div className="mt-2 text-lg font-bold text-forest tabular-nums">
                Score: {nomination.totalScore.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column: case */}
        <div className="lg:col-span-2 space-y-4">
          {/* Summary */}
          <Card title="Summary">
            <p className="text-foreground/85 leading-relaxed">{nomination.summary}</p>
          </Card>

          {/* Justification */}
          <Card title="Detailed justification">
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap">{nomination.justification}</p>
            </div>
          </Card>

          {/* Impact metrics */}
          {nomination.impactMetrics && (
            <Card title="Impact metrics">
              <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap">{nomination.impactMetrics}</p>
            </Card>
          )}

          {/* Supporting links */}
          {nomination.supportingLinks && (
            <Card title="Supporting links">
              <ul className="space-y-1">
                {nomination.supportingLinks.split("\n").filter(Boolean).map((url, i) => (
                  <li key={i}>
                    <a
                      href={url.trim()}
                      target="_blank"
                      rel="noreferrer"
                      className="text-forest hover:text-gold underline break-all"
                    >
                      {url.trim()}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* AI summary */}
          {nomination.aiSummary && (
            <Card title="AI eligibility summary" icon={Sparkles} accent="gold">
              <p className="text-foreground/85 leading-relaxed italic">"{nomination.aiSummary}"</p>
              {aiEligibility && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Category fit</div>
                    <div className="font-display text-xl font-bold text-forest tabular-nums">
                      {aiEligibility.category_fit ?? "—"}/100
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Completeness</div>
                    <div className="font-display text-xl font-bold text-forest tabular-nums">
                      {aiEligibility.completeness ?? "—"}/100
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Reviews */}
          <Card title={`Judge reviews (${nomination.reviews.length})`}>
            {nomination.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviews yet. Assign judges below.</p>
            ) : (
              <div className="space-y-3">
                {nomination.reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-border p-3 bg-secondary/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-foreground text-sm">{r.judgeName}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(r.createdAt).toLocaleDateString()}
                          {r.recommendation && ` · ${r.recommendation}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-xl font-bold text-forest tabular-nums">
                          {r.totalScore.toFixed(1)}
                        </div>
                        <div className="text-[10px] text-muted-foreground">/10</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                      {[
                        ["Imp", r.scoreImpact],
                        ["Inn", r.scoreInnovation],
                        ["Sc", r.scoreScale],
                        ["Sus", r.scoreSustainability],
                        ["Ldr", r.scoreLeadership],
                        ["Eq", r.scoreEquity],
                      ].map(([label, val]) => (
                        <div key={label as string} className="text-center">
                          <div className="text-[10px] text-muted-foreground">{label}</div>
                          <div className="font-semibold tabular-nums">{val}/10</div>
                        </div>
                      ))}
                    </div>
                    {r.comments && (
                      <p className="text-xs text-foreground/80 mt-2 italic">{r.comments}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Status history */}
          <Card title="Status history">
            <div className="space-y-2">
              {nomination.statusChanges.length === 0 ? (
                <p className="text-sm text-muted-foreground">No status changes recorded.</p>
              ) : (
                nomination.statusChanges
                  .slice()
                  .reverse()
                  .map((c) => (
                    <div key={c.id} className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={c.fromStatus} />
                        <span className="text-muted-foreground">→</span>
                        <StatusBadge status={c.toStatus} />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(c.createdAt).toLocaleString()}
                        {c.changedBy && ` · by ${c.changedBy.name ?? c.changedBy.email}`}
                      </div>
                      {c.reason && <div className="text-xs italic">"{c.reason}"</div>}
                    </div>
                  ))
              )}
            </div>
          </Card>
        </div>

        {/* Right column: actions */}
        <div className="space-y-4">
          {/* Status workflow */}
          <Card title="Status" icon={FileText}>
            <div className="space-y-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                ))}
              </select>
              <Input
                placeholder="Reason (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <Button
                onClick={saveStatus}
                disabled={savingStatus || (status === nomination.status && !reason)}
                className="w-full bg-forest hover:bg-forest-light text-cream"
              >
                {savingStatus ? (
                  <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />Saving…</>
                ) : (
                  <><Save className="mr-1.5 h-4 w-4" />Update status</>
                )}
              </Button>
            </div>
          </Card>

          {/* Nominee contact */}
          <Card title="Nominee details">
            <dl className="space-y-2 text-sm">
              <Detail label="Email" value={nomination.nomineeEmail} />
              <Detail label="Phone" value={nomination.nomineePhone} />
              <Detail label="Website" value={nomineeWebsiteLink(nomination.nomineeWebsite)} link={nomination.nomineeWebsite ?? undefined} />
              <Detail label="LinkedIn" value={nomination.nomineeLinkedin} />
              <Detail label="Self-nom" value={nomination.selfNomination ? "Yes" : "No"} />
            </dl>
          </Card>

          {/* Nominator */}
          <Card title="Nominator">
            <dl className="space-y-2 text-sm">
              <Detail label="Name" value={nomination.nominatorName} />
              <Detail label="Email" value={nomination.nominatorEmail} />
              <Detail label="Org" value={nomination.nominatorOrg} />
              <Detail label="Relationship" value={nomination.nominatorRel} />
            </dl>
          </Card>

          {/* Winner management */}
          <Card title="Winner profile" icon={Trophy} accent="gold">
            <div className="space-y-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1 block">
                  Winner year
                </label>
                <Input
                  type="number"
                  value={winnerYear}
                  onChange={(e) => setWinnerYear(parseInt(e.target.value || "0", 10))}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1 block">
                  Public highlight
                </label>
                <Textarea
                  rows={2}
                  value={winnerHighlight}
                  onChange={(e) => setWinnerHighlight(e.target.value)}
                  placeholder="One sentence for the Hall of Fame card"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1 block">
                  Public story
                </label>
                <Textarea
                  rows={5}
                  value={winnerStory}
                  onChange={(e) => setWinnerStory(e.target.value)}
                  placeholder="Longer public profile (markdown supported)"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1 block">
                  Photo URL
                </label>
                <Input
                  value={winnerPhotoUrl}
                  onChange={(e) => setWinnerPhotoUrl(e.target.value)}
                  placeholder="https://"
                />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-secondary/40">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4"
                />
                {isPublic ? <Eye className="h-4 w-4 text-forest" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                Show in public Hall of Fame
              </label>
              <Button
                onClick={saveWinner}
                disabled={savingWinner}
                className="w-full bg-gold hover:bg-gold-light text-cream"
              >
                {savingWinner ? (
                  <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />Saving…</>
                ) : (
                  <><Trophy className="mr-1.5 h-4 w-4" />Save winner profile</>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
  icon: Icon,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  icon?: any;
  accent?: "forest" | "gold";
}) {
  const accentBg = accent === "gold" ? "bg-gold/15 text-gold ring-gold/40" : "bg-forest/10 text-forest ring-forest/30";
  return (
    <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm">
      <h2 className="font-display text-lg font-bold text-forest mb-4 flex items-center gap-2">
        {Icon && (
          <div className={cn("h-7 w-7 rounded-lg grid place-items-center ring-1", accentBg)}>
            <Icon className="h-4 w-4" />
          </div>
        )}
        {title}
      </h2>
      {children}
    </div>
  );
}

function Detail({ label, value, link }: { label: string; value: string | null | undefined; link?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</dt>
      <dd className="text-foreground/85">
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className="text-forest hover:text-gold underline break-all">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function nomineeWebsiteLink(url: string | null) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname;
  } catch {
    return url;
  }
}
