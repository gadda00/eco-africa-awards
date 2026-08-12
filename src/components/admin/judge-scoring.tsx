"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type NominationForJudge = {
  id: string;
  referenceCode: string;
  categoryId: string;
  nomineeName: string;
  nomineeTitle: string | null;
  nomineeOrg: string | null;
  nomineeCountry: string;
  nomineeEmail: string | null;
  nomineeWebsite: string | null;
  summary: string;
  justification: string;
  impactMetrics: string | null;
  supportingLinks: string | null;
  status: string;
  createdAt: string;
  myExistingReview?: {
    id: string;
    scoreImpact: number;
    scoreInnovation: number;
    scoreScale: number;
    scoreSustainability: number;
    scoreLeadership: number;
    scoreEquity: number;
    totalScore: number;
    comments: string | null;
    recommendation: string | null;
    coiDeclared: boolean;
  } | null;
};

const CRITERIA = [
  { key: "scoreImpact", label: "Impact", weight: 25, description: "Measurable climate outcomes — ecological, social, economic." },
  { key: "scoreInnovation", label: "Innovation", weight: 18, description: "Originality of approach and problem framing." },
  { key: "scoreScale", label: "Scale & Replicability", weight: 17, description: "Reach today and potential to scale across contexts." },
  { key: "scoreSustainability", label: "Sustainability", weight: 15, description: "Durability beyond the intervention or grant cycle." },
  { key: "scoreLeadership", label: "Leadership", weight: 15, description: "Mentorship, pipeline-building, and influence beyond the work." },
  { key: "scoreEquity", label: "Equity & Inclusion", weight: 10, description: "Centre on women, youth, indigenous knowledge, frontline communities." },
] as const;

const RECOMMENDATIONS = ["SELECT", "SHORTLIST", "DECLINE"];

export function JudgeScoringClient({ nomination }: { nomination: NominationForJudge }) {
  const router = useRouter();
  const existing = nomination.myExistingReview;

  const [scores, setScores] = useState<Record<string, number>>({
    scoreImpact: existing?.scoreImpact ?? 5,
    scoreInnovation: existing?.scoreInnovation ?? 5,
    scoreScale: existing?.scoreScale ?? 5,
    scoreSustainability: existing?.scoreSustainability ?? 5,
    scoreLeadership: existing?.scoreLeadership ?? 5,
    scoreEquity: existing?.scoreEquity ?? 5,
  });
  const [comments, setComments] = useState(existing?.comments ?? "");
  const [recommendation, setRecommendation] = useState(existing?.recommendation ?? "");
  const [coiDeclared, setCoiDeclared] = useState(existing?.coiDeclared ?? false);
  const [saving, setSaving] = useState(false);

  // Weighted total score (0-10)
  // Each criterion scored 0-10, weighted (weights sum to 1), result on 0-10 scale.
  const totalScore = CRITERIA.reduce((sum, c) => {
    return sum + scores[c.key] * (c.weight / 100);
  }, 0);

  const updateScore = (key: string, value: number) => {
    setScores((s) => ({ ...s, [key]: Math.max(0, Math.min(10, value)) }));
  };

  const submit = async () => {
    if (!recommendation) {
      toast.error("Please choose a recommendation (Select / Shortlist / Decline).");
      return;
    }
    if (!coiDeclared) {
      toast.error("Please confirm the conflict-of-interest declaration.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/judge/nominations/${nomination.id}`, {
        method: existing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...scores,
          comments,
          recommendation,
          coiDeclared,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Submission failed");
      }
      toast.success(existing ? "Review updated" : "Review submitted");
      router.push("/judge/nominations");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-4">
        <Link
          href="/judge/nominations"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-forest"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to assignments
        </Link>
      </div>

      {/* Header */}
      <div className="rounded-2xl border border-forest/15 bg-card p-6 mb-4 shadow-warm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs text-muted-foreground font-mono mb-1">{nomination.referenceCode}</div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-forest">{nomination.nomineeName}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {[nomination.nomineeTitle, nomination.nomineeOrg].filter(Boolean).join(" · ") || "—"} · {nomination.nomineeCountry}
            </p>
          </div>
          {existing && (
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Your current score</div>
              <div className="font-display text-3xl font-bold text-forest tabular-nums">
                {existing.totalScore.toFixed(1)}
              </div>
              <div className="text-[10px] text-muted-foreground">/ 10.0</div>
            </div>
          )}
        </div>
      </div>

      {/* Case */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Summary">
            <p className="text-foreground/85 leading-relaxed">{nomination.summary}</p>
          </Card>
          <Card title="Detailed justification">
            <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap">{nomination.justification}</p>
          </Card>
          {nomination.impactMetrics && (
            <Card title="Impact metrics">
              <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap">{nomination.impactMetrics}</p>
            </Card>
          )}
          {nomination.supportingLinks && (
            <Card title="Supporting links">
              <ul className="space-y-1">
                {nomination.supportingLinks.split("\n").filter(Boolean).map((url, i) => (
                  <li key={i}>
                    <a href={url.trim()} target="_blank" rel="noreferrer" className="text-forest hover:text-gold underline break-all">
                      {url.trim()}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Right: scoring */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm sticky top-4">
            <h2 className="font-display text-lg font-bold text-forest mb-3">Your score</h2>
            <div className="text-center mb-4 p-4 rounded-xl bg-gradient-to-br from-forest/10 to-gold/10">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Weighted total</div>
              <div className="font-display text-5xl font-bold text-gradient-sunset tabular-nums">
                {totalScore.toFixed(2)}
              </div>
              <div className="text-[10px] text-muted-foreground">/ 10.0</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">
                  Recommendation
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {RECOMMENDATIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRecommendation(r)}
                      className={cn(
                        "px-2 py-2 rounded-lg text-xs font-semibold border transition-all",
                        recommendation === r
                          ? r === "SELECT"
                            ? "bg-forest text-cream border-forest"
                            : r === "SHORTLIST"
                            ? "bg-gold text-cream border-gold"
                            : "bg-terracotta text-cream border-terracotta"
                          : "border-border text-foreground/70 hover:border-forest/30"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">
                  Comments (private to panel)
                </label>
                <Textarea
                  rows={4}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Optional: explain your scoring, surface concerns, or note standout strengths."
                />
              </div>

              <label className="flex items-start gap-2 p-3 rounded-lg border border-border bg-secondary/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={coiDeclared}
                  onChange={(e) => setCoiDeclared(e.target.checked)}
                  className="h-4 w-4 mt-0.5"
                />
                <span className="text-xs text-foreground/85 leading-snug">
                  I confirm I have <strong>no conflict of interest</strong> with this nominee or organisation,
                  and my scoring is independent and evidence-based.
                </span>
              </label>

              <Button
                onClick={submit}
                disabled={saving}
                className="w-full bg-forest hover:bg-forest-light text-cream"
              >
                {saving ? (
                  <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />Saving…</>
                ) : existing ? (
                  <><Save className="mr-1.5 h-4 w-4" />Update review</>
                ) : (
                  <><CheckCircle2 className="mr-1.5 h-4 w-4" />Submit review</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scoring criteria (full width) */}
      <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm">
        <h2 className="font-display text-lg font-bold text-forest mb-1">Scoring criteria</h2>
        <p className="text-xs text-muted-foreground mb-5">
          Score each criterion 0–10. The weighted total updates in real time.
        </p>
        <div className="space-y-5">
          {CRITERIA.map((c) => (
            <div key={c.key}>
              <div className="flex items-baseline justify-between mb-1.5">
                <div>
                  <span className="font-semibold text-foreground">{c.label}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{c.description}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-muted-foreground">{c.weight}% weight</span>
                  <span className="font-display text-2xl font-bold text-forest tabular-nums w-12 text-right">
                    {scores[c.key]}
                  </span>
                  <span className="text-xs text-muted-foreground">/10</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={scores[c.key]}
                onChange={(e) => updateScore(c.key, parseInt(e.target.value, 10))}
                className="w-full h-2 rounded-full bg-secondary accent-forest"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                {[0, 2, 4, 6, 8, 10].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl border border-gold/30 bg-gold/5 flex items-start gap-3">
          <Shield className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
          <div className="text-xs text-foreground/80 leading-relaxed">
            <strong className="text-forest">Scoring guidance:</strong> 0–3 = does not meet criterion,
            4–6 = meets criterion with reservations, 7–8 = strong evidence, 9–10 = exceptional,
            continent-leading. Be rigorous — equity is a stand-alone criterion, never a tiebreaker.
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm">
      <h3 className="font-display text-base font-bold text-forest mb-3">{title}</h3>
      {children}
    </div>
  );
}
