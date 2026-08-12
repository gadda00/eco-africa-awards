"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  User,
  Users2,
  FileText,
  Trophy,
  Loader2,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { SectionHeading, Reveal } from "@/components/section-primitives";
import { awardCategories, africanCountries } from "@/lib/data";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 0, label: "Category", icon: Trophy },
  { id: 1, label: "Nominee", icon: User },
  { id: 2, label: "Nominator", icon: Users2 },
  { id: 3, label: "The Case", icon: FileText },
  { id: 4, label: "Review & Submit", icon: ShieldCheck },
];

const schema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  selfNomination: z.boolean().default(false),

  nomineeName: z.string().min(2, "Nominee name is required"),
  nomineeTitle: z.string().optional(),
  nomineeOrg: z.string().optional(),
  nomineeCountry: z.string().min(1, "Country is required"),
  nomineeEmail: z.string().email("Valid email required").optional().or(z.literal("")),
  nomineePhone: z.string().optional(),
  nomineeWebsite: z.string().url("Valid URL required").optional().or(z.literal("")),
  nomineeLinkedin: z.string().optional(),

  nominatorName: z.string().min(2, "Your name is required"),
  nominatorEmail: z.string().email("Valid email required"),
  nominatorOrg: z.string().optional(),
  nominatorRel: z.string().optional(),

  summary: z.string().min(60, "Summary must be at least 60 characters").max(300, "Max 300 characters"),
  justification: z.string().min(200, "Justification must be at least 200 characters"),
  impactMetrics: z.string().optional(),
  supportingLinks: z.string().optional(),
  mediaUrl: z.string().url("Valid URL required").optional().or(z.literal("")),

  confirmsConsent: z.boolean().refine((v) => v, "Nominee consent is required"),
  confirmsTruthful: z.boolean().refine((v) => v, "Truthful submission confirmation required"),
  confirmsAfrican: z.boolean().refine((v) => v, "African eligibility confirmation required"),
});

type NominationForm = z.infer<typeof schema>;

type AiFeedback = {
  loading: boolean;
  result: null | {
    strengths: string[];
    improvements: string[];
    criteriaAlignment: { criterion: string; score: number }[];
    overallScore: number;
    summary: string;
  };
  error: string | null;
};

export function NominateSection() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ referenceCode: string } | null>(null);
  const [aiFeedback, setAiFeedback] = useState<AiFeedback>({
    loading: false,
    result: null,
    error: null,
  });

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<NominationForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      selfNomination: false,
      confirmsConsent: false,
      confirmsTruthful: false,
      confirmsAfrican: false,
    },
    mode: "onBlur",
  });

  const selectedCategory = watch("categoryId");
  const selfNom = watch("selfNomination");
  const summaryValue = watch("summary") || "";
  const justificationValue = watch("justification") || "";

  const progress = ((step + 1) / STEPS.length) * 100;

  const nextStep = async () => {
    const fieldsToValidate: (keyof NominationForm)[] =
      step === 0
        ? ["categoryId"]
        : step === 1
        ? ["nomineeName", "nomineeCountry"]
        : step === 2
        ? ["nominatorName", "nominatorEmail"]
        : step === 3
        ? ["summary", "justification"]
        : [];

    if (fieldsToValidate.length > 0) {
      const valid = await trigger(fieldsToValidate as any);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    if (typeof window !== "undefined") {
      document.getElementById("nominate")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const runAiAssist = async () => {
    setAiFeedback({ loading: true, result: null, error: null });
    try {
      const cat = awardCategories.find((c) => c.id === selectedCategory);
      const res = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryName: cat?.name ?? "",
          categoryCriteria: cat?.criteria ?? [],
          nomineeName: getValues("nomineeName"),
          nomineeCountry: getValues("nomineeCountry"),
          nomineeOrg: getValues("nomineeOrg"),
          summary: getValues("summary"),
          justification: getValues("justification"),
        }),
      });
      if (!res.ok) throw new Error("AI assist failed");
      const data = await res.json();
      setAiFeedback({ loading: false, result: data, error: null });
      toast.success("AI review complete — see feedback below");
    } catch (e: any) {
      setAiFeedback({ loading: false, result: null, error: e.message ?? "AI assist unavailable" });
      toast.error("AI assistant temporarily unavailable. You can still submit.");
    }
  };

  const onSubmit = async (values: NominationForm) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/nominate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Submission failed");
      }
      const data = await res.json();
      setSubmitted({ referenceCode: data.referenceCode });
      toast.success("Nomination submitted!");
    } catch (e: any) {
      toast.error(e.message ?? "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="nominate" className="relative py-24 lg:py-32 bg-background">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-forest/40 bg-gradient-to-br from-forest/12 via-card/60 to-gold/10 p-8 lg:p-12 text-center">
              <div className="absolute inset-0 bg-dots opacity-30" />
              <div className="relative">
                <div className="mx-auto h-20 w-20 rounded-full bg-forest/15 ring-2 ring-forest/40 grid place-items-center">
                  <CheckCircle2 className="h-10 w-10 text-forest" />
                </div>
                <h3 className="mt-6 font-display text-3xl lg:text-4xl font-bold text-foreground">
                  Nomination Received
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Thank you for honouring African climate leadership. Your nomination has been
                  securely submitted and is now entering our multi-stage review process.
                </p>
                <div className="mt-6 inline-flex flex-col items-center gap-1 px-6 py-3 rounded-xl border border-forest/30 bg-forest/10">
                  <span className="text-xs uppercase tracking-[0.22em] text-forest font-semibold">
                    Your Reference Code
                  </span>
                  <span className="font-mono text-2xl font-bold text-forest tracking-wider">
                    {submitted.referenceCode}
                  </span>
                </div>
                <p className="mt-5 text-xs text-muted-foreground">
                  Save this code — you&apos;ll need it to follow your nomination&apos;s status.
                  We&apos;ve also sent a confirmation email.
                </p>
                <Button
                  asChild
                  className="mt-7 bg-forest hover:bg-forest-light text-cream font-semibold"
                >
                  <a href="#top">Back to top</a>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section
      id="nominate"
      className="relative py-24 lg:py-32 bg-gradient-to-b from-background via-secondary/40 to-background"
    >
      <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-forest/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Submit a Nomination"
          title={
            <>
              Five steps to honour a{" "}
              <span className="text-gradient-sunset">climate leader.</span>
            </>
          }
          description="Nominations are free, confidential, and open to anyone. Use our AI Nomination Assistant at any time to strengthen your case before submitting."
        />

        <Reveal delay={0.1}>
          <div className="mt-12 relative overflow-hidden rounded-3xl border border-border/60 bg-card/50 backdrop-blur-xl">
            <div className="absolute inset-0 bg-grid opacity-[0.05]" />

            {/* Stepper */}
            <div className="relative px-6 lg:px-10 pt-7 pb-2 border-b border-border/60">
              <div className="flex items-center justify-between gap-1">
                {STEPS.map((s, i) => (
                  <div key={s.id} className="flex-1 flex items-center gap-2 min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          "h-9 w-9 lg:h-10 lg:w-10 rounded-xl grid place-items-center transition-all flex-shrink-0",
                          i < step && "bg-forest/15 text-forest ring-1 ring-forest/30",
                          i === step && "bg-gradient-to-br from-forest to-forest-light text-cream shadow-forest",
                          i > step && "bg-muted/60 text-muted-foreground"
                        )}
                      >
                        {i < step ? (
                          <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5" />
                        ) : (
                          <s.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                        )}
                      </div>
                      <div className="hidden sm:block min-w-0">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          Step {i + 1}
                        </div>
                        <div
                          className={cn(
                            "text-sm font-semibold truncate",
                            i === step ? "text-forest" : "text-muted-foreground"
                          )}
                        >
                          {s.label}
                        </div>
                      </div>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-px bg-border/60 mx-2 hidden sm:block">
                        <div
                          className="h-full bg-gradient-to-r from-forest to-gold transition-all duration-500"
                          style={{ width: i < step ? "100%" : "0%" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <Progress value={progress} className="h-1.5 bg-muted/60 [&>div]:bg-gradient-to-r [&>div]:from-forest [&>div]:to-gold" />
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="relative p-6 lg:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Step 0: Category */}
                  {step === 0 && (
                    <div>
                      <h3 className="font-display text-2xl font-bold text-foreground">
                        Which category are you nominating for?
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Choose the category that best fits your nominee&apos;s contribution.
                        You can change this later if needed.
                      </p>
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto scrollbar-thin pr-1">
                        {awardCategories.map((cat) => {
                          const selected = selectedCategory === cat.id;
                          return (
                            <button
                              type="button"
                              key={cat.id}
                              onClick={() => setValue("categoryId", cat.id, { shouldValidate: true })}
                              className={cn(
                                "text-left p-4 rounded-xl border transition-all relative overflow-hidden",
                                selected
                                  ? "border-forest/60 bg-forest/10 ring-2 ring-forest/30"
                                  : "border-border/60 bg-card/40 hover:border-border hover:bg-card/70"
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="text-[10px] uppercase tracking-wider text-forest font-semibold">
                                    {cat.level}
                                  </div>
                                  <div className="mt-1 font-semibold text-sm text-foreground leading-tight">
                                    {cat.name}
                                  </div>
                                </div>
                                {selected && (
                                  <CheckCircle2 className="h-5 w-5 text-forest flex-shrink-0" />
                                )}
                              </div>
                              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                                {cat.tagline}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                      {errors.categoryId && (
                        <p className="mt-3 text-xs text-destructive">{errors.categoryId.message}</p>
                      )}
                    </div>
                  )}

                  {/* Step 1: Nominee */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          Tell us about the nominee
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          The person or organisation being nominated for this award.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-muted/30">
                        <Checkbox
                          id="selfNom"
                          checked={selfNom}
                          onCheckedChange={(v) => setValue("selfNomination", v === true, { shouldValidate: true })}
                        />
                        <Label htmlFor="selfNom" className="text-sm text-foreground cursor-pointer flex-1">
                          I am nominating myself
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            Self-nominations are welcome and treated identically to third-party nominations.
                          </span>
                        </Label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Nominee name" required error={errors.nomineeName?.message}>
                          <Input {...register("nomineeName")} placeholder="e.g., Dr. Amina Mohammed" />
                        </Field>
                        <Field label="Title / Role" error={errors.nomineeTitle?.message}>
                          <Input {...register("nomineeTitle")} placeholder="e.g., Director, Founder" />
                        </Field>
                        <Field label="Organisation">
                          <Input {...register("nomineeOrg")} placeholder="e.g., Green Belt Movement" />
                        </Field>
                        <Field label="Country" required error={errors.nomineeCountry?.message}>
                          <select
                            {...register("nomineeCountry")}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="">Select country…</option>
                            {africanCountries.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Email" error={errors.nomineeEmail?.message}>
                          <Input type="email" {...register("nomineeEmail")} placeholder="nominee@example.org" />
                        </Field>
                        <Field label="Phone">
                          <Input {...register("nomineePhone")} placeholder="+254 711 000 000" />
                        </Field>
                        <Field label="Website" error={errors.nomineeWebsite?.message}>
                          <Input {...register("nomineeWebsite")} placeholder="https://" />
                        </Field>
                        <Field label="LinkedIn / Social">
                          <Input {...register("nomineeLinkedin")} placeholder="linkedin.com/in/…" />
                        </Field>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Nominator */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          {selfNom ? "Your contact details" : "Your details as nominator"}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {selfNom
                            ? "We need a way to reach you about your nomination."
                            : "So we can verify the nomination and contact you about the review."}
                        </p>
                      </div>

                      {selfNom && (
                        <div className="rounded-xl border border-forest/30 bg-forest/8 p-3 text-xs text-forest">
                          We&apos;ll pre-fill your nominator details from the nominee step.
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Your name" required error={errors.nominatorName?.message}>
                          <Input
                            {...register("nominatorName")}
                            placeholder={selfNom ? (watch("nomineeName") || "Your name") : "Your full name"}
                          />
                        </Field>
                        <Field label="Your email" required error={errors.nominatorEmail?.message}>
                          <Input type="email" {...register("nominatorEmail")} placeholder="you@example.org" />
                        </Field>
                        <Field label="Your organisation">
                          <Input {...register("nominatorOrg")} placeholder="Optional" />
                        </Field>
                        <Field label="Relationship to nominee">
                          <Input
                            {...register("nominatorRel")}
                            placeholder={selfNom ? "Self-nomination" : "e.g., Colleague, Mentee, Partner"}
                          />
                        </Field>
                      </div>
                    </div>
                  )}

                  {/* Step 3: The Case */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          Make the case for this nomination
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Be specific, be evidence-based, and be honest. Use our AI assistant to
                          strengthen your case before submitting.
                        </p>
                      </div>

                      <Field
                        label="Short summary"
                        hint={`${summaryValue.length}/300 characters`}
                        required
                        error={errors.summary?.message}
                      >
                        <Textarea
                          {...register("summary")}
                          rows={3}
                          maxLength={300}
                          placeholder="In 300 characters or fewer, who is this nominee and what have they achieved?"
                        />
                      </Field>

                      <Field
                        label="Detailed justification"
                        hint={`${justificationValue.length} characters (min 200)`}
                        required
                        error={errors.justification?.message}
                      >
                        <Textarea
                          {...register("justification")}
                          rows={8}
                          placeholder="Lay out the strongest case for this nominee. Cover: (1) the climate challenge addressed; (2) the specific actions taken; (3) the measurable impact achieved; (4) why this approach is innovative or replicable; (5) how it centres equity and African leadership. Use data and specific examples wherever possible."
                        />
                      </Field>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field
                          label="Impact metrics"
                          hint="Optional — hectares restored, tonnes CO2e avoided, people reached, etc."
                        >
                          <Textarea
                            {...register("impactMetrics")}
                            rows={3}
                            placeholder="e.g., 12,400 trees planted; 3,200 households solar-powered; 47 policies informed"
                          />
                        </Field>
                        <Field
                          label="Supporting links"
                          hint="Optional — one URL per line"
                        >
                          <Textarea
                            {...register("supportingLinks")}
                            rows={3}
                            placeholder={"https://example.org/impact-report\nhttps://example.org/press"}
                          />
                        </Field>
                      </div>

                      <Field label="Media / portfolio URL" hint="Optional — video, deck, or portfolio" error={errors.mediaUrl?.message}>
                        <Input {...register("mediaUrl")} placeholder="https://" />
                      </Field>

                      {/* AI Assistant */}
                      <div className="mt-6 rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/12 via-card/40 to-forest/8 p-5">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-lg bg-gold/20 ring-1 ring-gold/40 grid place-items-center">
                              <Sparkles className="h-4 w-4 text-gold" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-foreground">
                                AI Nomination Assistant
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Get specific feedback on your draft before submitting.
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            onClick={runAiAssist}
                            disabled={aiFeedback.loading || !selectedCategory}
                            className="bg-gradient-to-r from-gold to-terracotta hover:from-gold-light hover:to-terracotta text-cream font-semibold"
                          >
                            {aiFeedback.loading ? (
                              <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Reviewing…</>
                            ) : (
                              <><Sparkles className="mr-1.5 h-3.5 w-3.5" />Review my draft</>
                            )}
                          </Button>
                        </div>

                        {aiFeedback.result && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 space-y-4 overflow-hidden"
                          >
                            <div className="text-xs text-terracotta italic leading-relaxed">
                              &ldquo;{aiFeedback.result.summary}&rdquo;
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <div className="text-[10px] uppercase tracking-wider font-semibold text-forest mb-1.5">
                                  Strengths
                                </div>
                                <ul className="space-y-1 text-xs text-foreground/85">
                                  {aiFeedback.result.strengths.map((s, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <CheckCircle2 className="h-3 w-3 text-forest mt-0.5 flex-shrink-0" />
                                      <span>{s}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <div className="text-[10px] uppercase tracking-wider font-semibold text-gold mb-1.5">
                                  Improvements
                                </div>
                                <ul className="space-y-1 text-xs text-foreground/85">
                                  {aiFeedback.result.improvements.map((s, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <Lightbulb className="h-3 w-3 text-gold mt-0.5 flex-shrink-0" />
                                      <span>{s}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                                Estimated Criteria Alignment
                              </div>
                              <div className="space-y-1.5">
                                {aiFeedback.result.criteriaAlignment.map((c, i) => (
                                  <div key={i} className="flex items-center gap-2 text-xs">
                                    <span className="w-28 text-foreground/70 flex-shrink-0">{c.criterion}</span>
                                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-forest to-gold"
                                        style={{ width: `${c.score}%` }}
                                      />
                                    </div>
                                    <span className="w-8 text-right text-foreground/80 tabular-nums">{c.score}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gold">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>AI feedback is advisory only — your nomination will still be reviewed by human judges.</span>
                            </div>
                          </motion.div>
                        )}

                        {aiFeedback.error && (
                          <div className="mt-3 text-xs text-muted-foreground">
                            AI assistant unavailable right now — you can still submit your nomination.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {step === 4 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          Review &amp; confirm
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Please confirm your nomination is accurate and the nominee has consented.
                        </p>
                      </div>

                      <ReviewBlock title="Category">
                        {awardCategories.find((c) => c.id === selectedCategory)?.name ?? "—"}
                      </ReviewBlock>

                      <ReviewBlock title="Nominee">
                        <div className="space-y-0.5">
                          <div>{watch("nomineeName")}</div>
                          <div className="text-muted-foreground">
                            {[watch("nomineeTitle"), watch("nomineeOrg")].filter(Boolean).join(" · ") || "—"}
                          </div>
                          <div className="text-muted-foreground">{watch("nomineeCountry")}</div>
                        </div>
                      </ReviewBlock>

                      <ReviewBlock title="Summary">
                        <p className="text-sm italic">{watch("summary")}</p>
                      </ReviewBlock>

                      <ReviewBlock title="Justification (excerpt)">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {watch("justification")}
                        </p>
                      </ReviewBlock>

                      <div className="space-y-3 pt-2">
                        <ConfirmRow
                          checked={watch("confirmsConsent")}
                          onCheck={(v) => setValue("confirmsConsent", v, { shouldValidate: true })}
                          error={errors.confirmsConsent?.message}
                          text={selfNom
                            ? "I confirm that I am the person named above and that the information provided is mine."
                            : "I confirm that the nominee has consented to this nomination, or that this is a publicly eligible nomination."}
                        />
                        <ConfirmRow
                          checked={watch("confirmsTruthful")}
                          onCheck={(v) => setValue("confirmsTruthful", v, { shouldValidate: true })}
                          error={errors.confirmsTruthful?.message}
                          text="I confirm that all information provided is truthful and accurate to the best of my knowledge."
                        />
                        <ConfirmRow
                          checked={watch("confirmsAfrican")}
                          onCheck={(v) => setValue("confirmsAfrican", v, { shouldValidate: true })}
                          error={errors.confirmsAfrican?.message}
                          text="I confirm that the nominee is African or based on the African continent and meets the category's eligibility criteria."
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={step === 0 || submitting}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Back
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-forest hover:bg-forest-light text-cream font-semibold"
                  >
                    Continue
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-forest hover:bg-forest-light text-cream font-semibold min-w-44"
                  >
                    {submitting ? (
                      <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />Submitting…</>
                    ) : (
                      <><ShieldCheck className="mr-1.5 h-4 w-4" />Submit nomination</>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
      <div className="text-[10px] uppercase tracking-wider text-forest font-semibold mb-1.5">
        {title}
      </div>
      {children}
    </div>
  );
}

function ConfirmRow({
  checked,
  onCheck,
  text,
  error,
}: {
  checked: boolean;
  onCheck: (v: boolean) => void;
  text: string;
  error?: string;
}) {
  return (
    <div>
      <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/30">
        <Checkbox checked={checked} onCheckedChange={(v) => onCheck(v === true)} />
        <Label className="text-sm text-foreground leading-snug cursor-pointer flex-1">
          {text}
        </Label>
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
