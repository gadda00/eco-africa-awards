"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Ticket, CheckCircle2, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/section-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { siteConfig } from "@/lib/site-config";
import { africanCountries } from "@/lib/data";
import { cn } from "@/lib/utils";

const ticketTypes = [
  {
    id: "GENERAL",
    name: "General Admission",
    price: "USD 145",
    early: "USD 95",
    description: "Full access to the ceremony and summit networking.",
    perks: ["Ceremony entry", "Welcome kit", "Tea & lunch", "Networking reception"],
  },
  {
    id: "VIP",
    name: "VIP Pass",
    price: "USD 495",
    early: "USD 395",
    description: "Priority seating, exclusive access, and a gala dinner seat.",
    perks: ["Front-row seating", "VIP gala dinner", "Backstage access", "Premium welcome kit", "Private reception"],
    popular: true,
  },
  {
    id: "STUDENT",
    name: "Student / Youth",
    price: "USD 35",
    early: "USD 25",
    description: "Subsidised pass for students and under-25 youth leaders.",
    perks: ["Ceremony entry", "Youth lounge", "Mentor matching", "Limited scholarships available"],
  },
  {
    id: "PRESS",
    name: "Press Pass",
    price: "Free",
    early: "—",
    description: "Accredited journalists covering the awards and summit.",
    perks: ["Press gallery", "Press room access", "Interview slots", "Media kit"],
  },
];

export function CeremonySection() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    country: "",
    ticketType: "GENERAL",
    dietary: "",
    accessibility: "",
    agreesTerms: false,
    newsletter: true,
  });

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    if (!form.fullName || !form.email || !form.country || !form.agreesTerms) {
      toast.error("Please fill all required fields and accept the terms.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Registration failed");
      const data = await res.json();
      setSubmitted(data.referenceCode);
      toast.success("Registration confirmed!");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="ceremony" className="relative py-24 lg:py-32 bg-background">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute top-1/4 right-0 h-72 w-72 rounded-full bg-gold/8 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Ceremony"
          title={
            <>
              Four days. One continental stage.{" "}
              <span className="text-gradient-sunset">850 climate leaders.</span>
            </>
          }
          description="Join the 2026 Eco Africa Awards Ceremony at the Kigali Convention Centre — held in partnership with the Africa Climate Leadership Summit. The night the continent celebrates its own."
        />

        {/* Ceremony meta */}
        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetaCard icon={Calendar} label="Dates" value={siteConfig.ceremony.date} sub="Ceremony night: Sep 16" />
            <MetaCard icon={MapPin} label="Venue" value="Kigali Convention Centre" sub="Rwanda · East Africa" />
            <MetaCard icon={Users} label="Capacity" value="850 attendees" sub="54 countries represented" />
          </div>
        </Reveal>

        {submitted ? (
          <Reveal>
            <div className="mt-12 relative overflow-hidden rounded-3xl border border-forest/40 bg-gradient-to-br from-forest/12 via-card/60 to-gold/10 p-8 lg:p-12 text-center">
              <div className="absolute inset-0 bg-dots opacity-30" />
              <div className="relative">
                <div className="mx-auto h-20 w-20 rounded-full bg-forest/20 ring-2 ring-forest/40 grid place-items-center">
                  <CheckCircle2 className="h-10 w-10 text-forest" />
                </div>
                <h3 className="mt-6 font-display text-3xl font-bold text-foreground">
                  You&apos;re registered.
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Your reference code is below — save it for your records. We&apos;ll be in touch with venue details as the ceremony approaches.
                </p>
                <div className="mt-5 inline-flex flex-col items-center gap-1 px-6 py-3 rounded-xl border border-forest/30 bg-forest/10">
                  <span className="text-xs uppercase tracking-[0.22em] text-forest-light font-semibold">
                    Reference Code
                  </span>
                  <span className="font-mono text-2xl font-bold text-forest-light tracking-wider">
                    {submitted}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {/* Ticket options */}
            <Reveal>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-forest font-semibold mb-3">
                  Ticket Options
                </div>
                <div className="space-y-3">
                  {ticketTypes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => update("ticketType", t.id)}
                      className={cn(
                        "w-full text-left rounded-2xl border p-4 transition-all relative overflow-hidden",
                        form.ticketType === t.id
                          ? "border-forest/60 bg-forest/10 ring-2 ring-forest/40"
                          : "border-border/60 bg-card/50 hover:border-border"
                      )}
                    >
                      {t.popular && (
                        <span className="absolute top-0 right-0 px-2 py-0.5 text-[10px] font-bold uppercase bg-gold/30 text-gold-light rounded-bl-lg">
                          Most Popular
                        </span>
                      )}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0",
                            form.ticketType === t.id ? "border-forest bg-forest" : "border-border"
                          )} />
                          <div>
                            <div className="font-semibold text-foreground">{t.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {t.perks.map((p) => (
                                <span key={p} className="px-1.5 py-0.5 rounded text-[10px] bg-muted/60 text-muted-foreground">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-display text-lg font-bold text-foreground">{t.price}</div>
                          {t.early !== "—" && (
                            <div className="text-[10px] text-gold-light">Early: {t.early}</div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-xl border border-gold/30 bg-gold/5 text-xs text-gold-light">
                  Early-bird pricing ends {siteConfig.ceremony.earlyBirdDeadline}. Scholarship seats available for African youth and community leaders — indicate in the form below.
                </div>
              </div>
            </Reveal>

            {/* Registration form */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Ticket className="h-5 w-5 text-forest" />
                  <h3 className="font-display text-xl font-bold text-foreground">Register to attend</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Full name" required>
                      <Input
                        value={form.fullName}
                        onChange={(e) => update("fullName", e.target.value)}
                        placeholder="Your name"
                      />
                    </FormField>
                    <FormField label="Email" required>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@example.org"
                      />
                    </FormField>
                    <FormField label="Phone">
                      <Input
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+254 711 000 000"
                      />
                    </FormField>
                    <FormField label="Organisation">
                      <Input
                        value={form.organization}
                        onChange={(e) => update("organization", e.target.value)}
                        placeholder="Optional"
                      />
                    </FormField>
                    <FormField label="Country" required>
                      <select
                        value={form.country}
                        onChange={(e) => update("country", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select…</option>
                        {africanCountries.concat(["Other (international)"]).map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Role / Interest">
                      <select
                        value={form.role}
                        onChange={(e) => update("role", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select…</option>
                        <option value="Attendee">Attendee</option>
                        <option value="Nominator">Nominator / Nominee</option>
                        <option value="Partner">Partner / Sponsor</option>
                        <option value="Speaker">Speaker</option>
                        <option value="Press">Press</option>
                        <option value="Volunteer">Volunteer</option>
                      </select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Dietary needs">
                      <Input
                        value={form.dietary}
                        onChange={(e) => update("dietary", e.target.value)}
                        placeholder="Optional"
                      />
                    </FormField>
                    <FormField label="Accessibility needs">
                      <Input
                        value={form.accessibility}
                        onChange={(e) => update("accessibility", e.target.value)}
                        placeholder="Optional"
                      />
                    </FormField>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/30">
                      <Checkbox
                        checked={form.agreesTerms}
                        onCheckedChange={(v) => update("agreesTerms", v === true)}
                      />
                      <Label className="text-xs text-foreground leading-snug cursor-pointer flex-1">
                        I agree to the code of conduct, photo release, and cancellation policy. I understand registration is confirmed on payment (where applicable).
                      </Label>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/30">
                      <Checkbox
                        checked={form.newsletter}
                        onCheckedChange={(v) => update("newsletter", v === true)}
                      />
                      <Label className="text-xs text-foreground leading-snug cursor-pointer flex-1">
                        Send me updates on the awards, future ceremonies, and ACLA programmes.
                      </Label>
                    </div>
                  </div>

                  <Button
                    onClick={submit}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-forest to-forest-light hover:from-forest hover:to-forest-light text-cream font-semibold"
                  >
                    {submitting ? (
                      <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />Registering…</>
                    ) : (
                      <><Ticket className="mr-1.5 h-4 w-4" />Confirm registration</>
                    )}
                  </Button>

                  <p className="text-[10px] text-center text-muted-foreground">
                    Your data is encrypted and never shared with third parties. See our privacy notice.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

function MetaCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5 flex items-start gap-4"
    >
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-forest/20 to-gold/10 ring-1 ring-forest/30 grid place-items-center flex-shrink-0">
        <Icon className="h-5 w-5 text-forest" strokeWidth={1.75} />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
          {label}
        </div>
        <div className="mt-1 font-semibold text-foreground">{value}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
    </motion.div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
