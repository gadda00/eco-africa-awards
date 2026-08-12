"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare, Send, Loader2, CheckCircle2, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/section-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { siteConfig } from "@/lib/site-config";

export function ContactSection() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    subject: "",
    message: "",
    category: "general",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      toast.success("Message sent — we'll be in touch.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-gradient-to-b from-background via-card/30 to-background">
      <div className="absolute top-1/3 right-0 h-72 w-72 rounded-full bg-forest/8 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Get in Touch"
          title={
            <>
              Questions, partnerships,{" "}
              <span className="text-gradient-sunset">or a story to share?</span>
            </>
          }
          description="Reach the Eco Africa Awards team directly. We respond within two business days."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
          {/* Contact info */}
          <Reveal className="lg:col-span-2">
            <div className="space-y-4 h-full">
              <ContactCard
                icon={Mail}
                label="Email"
                value={siteConfig.email}
                href={`mailto:${siteConfig.email}`}
                sub="For nominations, partnerships, and general enquiries"
              />
              <ContactCard
                icon={Phone}
                label="Phone"
                value={siteConfig.phone}
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                sub="Mon–Fri, 09:00–17:00 EAT"
              />
              <ContactCard
                icon={MapPin}
                label="Location"
                value={siteConfig.location}
                sub="Ceremony: Kigali Convention Centre, Rwanda"
              />

              <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                  Follow the Awards
                </div>
                <div className="flex gap-2">
                  {[
                    { icon: Twitter, href: siteConfig.social.twitter, label: "Twitter / X" },
                    { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
                    { icon: Instagram, href: siteConfig.social.instagram, label: "Instagram" },
                    { icon: Youtube, href: siteConfig.social.youtube, label: "YouTube" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="h-10 w-10 rounded-lg border border-border/60 bg-background/60 grid place-items-center text-muted-foreground hover:text-forest hover:border-forest/40 transition-colors"
                    >
                      <s.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Contact form */}
          <Reveal delay={0.1} className="lg:col-span-3">
            {submitted ? (
              <div className="rounded-3xl border border-forest/40 bg-forest/10 p-8 lg:p-12 text-center h-full grid place-items-center">
                <div>
                  <div className="mx-auto h-16 w-16 rounded-full bg-forest/20 ring-2 ring-forest/40 grid place-items-center">
                    <CheckCircle2 className="h-8 w-8 text-forest" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-foreground">Message sent.</h3>
                  <p className="mt-2 text-muted-foreground">
                    Thank you for reaching out. We&apos;ll respond within two business days.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", organization: "", subject: "", message: "", category: "general" });
                    }}
                    variant="outline"
                    className="mt-5"
                  >
                    Send another
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <MessageSquare className="h-5 w-5 text-forest" />
                  <h3 className="font-display text-xl font-bold text-foreground">Send a message</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">
                        Your name <span className="text-destructive">*</span>
                      </Label>
                      <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name" />
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.org" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">
                        Organisation
                      </Label>
                      <Input value={form.organization} onChange={(e) => update("organization", e.target.value)} placeholder="Optional" />
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">
                        Topic
                      </Label>
                      <select
                        value={form.category}
                        onChange={(e) => update("category", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="general">General enquiry</option>
                        <option value="partnership">Partnership / Sponsorship</option>
                        <option value="press">Press / Media</option>
                        <option value="nominate-help">Nomination help</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">
                      Subject
                    </Label>
                    <Input value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Brief subject line" />
                  </div>

                  <div>
                    <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      rows={6}
                      placeholder="How can we help?"
                    />
                  </div>

                  <Button
                    onClick={submit}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-forest to-forest-light hover:from-forest hover:to-forest-light text-cream font-semibold"
                  >
                    {submitting ? (
                      <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />Sending…</>
                    ) : (
                      <><Send className="mr-1.5 h-4 w-4" />Send message</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon: Icon, label, value, sub, href }: { icon: any; label: string; value: string; sub?: string; href?: string }) {
  const Wrapper = href ? "a" : "div";
  return (
    <motion.div whileHover={{ y: -2 }}>
      <Wrapper
        {...(href ? { href } : {})}
        className="block rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5 hover:border-forest/40 transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-forest/20 to-gold/10 ring-1 ring-forest/30 grid place-items-center flex-shrink-0">
            <Icon className="h-5 w-5 text-forest" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
              {label}
            </div>
            <div className="mt-0.5 font-semibold text-foreground">{value}</div>
            {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
          </div>
        </div>
      </Wrapper>
    </motion.div>
  );
}
