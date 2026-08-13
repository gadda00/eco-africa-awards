/**
 * Zod schemas for all API inputs. Use these to validate every request body
 * on the server side, even if the client validates too.
 */
import { z } from "zod";

// ============================================================
// PUBLIC FORM SCHEMAS
// ============================================================

export const nominateSchema = z.object({
  categoryId: z.string().min(1).max(20),
  selfNomination: z.boolean().default(false),
  nomineeName: z.string().min(2).max(200),
  nomineeTitle: z.string().max(200).optional(),
  nomineeOrg: z.string().max(200).optional(),
  nomineeCountry: z.string().min(1).max(100),
  nomineeEmail: z.string().email().max(200).optional().or(z.literal("")),
  nomineePhone: z.string().max(50).optional(),
  nomineeWebsite: z.string().url().max(500).optional().or(z.literal("")),
  nomineeLinkedin: z.string().max(500).optional(),
  nominatorName: z.string().min(2).max(200),
  nominatorEmail: z.string().email().max(200),
  nominatorOrg: z.string().max(200).optional(),
  nominatorRel: z.string().max(200).optional(),
  summary: z.string().min(60).max(300),
  justification: z.string().min(200).max(20000),
  impactMetrics: z.string().max(5000).optional(),
  supportingLinks: z.string().max(5000).optional(),
  mediaUrl: z.string().url().max(500).optional().or(z.literal("")),
  confirmsConsent: z.boolean().refine((v) => v === true, "Required"),
  confirmsTruthful: z.boolean().refine((v) => v === true, "Required"),
  confirmsAfrican: z.boolean().refine((v) => v === true, "Required"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional(),
  organization: z.string().max(200).optional(),
  role: z.string().max(100).optional(),
  country: z.string().min(1).max(100),
  ticketType: z.enum(["GENERAL", "VIP", "PRESS", "SPEAKER", "STUDENT"]),
  dietary: z.string().max(200).optional(),
  accessibility: z.string().max(500).optional(),
  agreesTerms: z.boolean().refine((v) => v === true, "Required"),
  newsletter: z.boolean().default(true),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(200),
  subject: z.string().min(1).max(300),
  message: z.string().min(10).max(10000),
  organization: z.string().max(200).optional(),
  category: z.enum(["general", "partnership", "press", "nominate-help", "other"]).default("general"),
});

export const newsletterSchema = z.object({
  email: z.string().email().max(200),
  name: z.string().max(200).optional(),
});

// ============================================================
// AI ENDPOINT SCHEMAS
// ============================================================

export const aiAssistSchema = z.object({
  categoryName: z.string().max(200).optional(),
  categoryCriteria: z.array(z.string().max(500)).max(10).optional(),
  nomineeName: z.string().max(200).optional(),
  nomineeCountry: z.string().max(100).optional(),
  nomineeOrg: z.string().max(200).optional(),
  summary: z.string().min(10).max(500),
  justification: z.string().min(10).max(20000),
});

export const aiMatchSchema = z.object({
  description: z.string().min(20).max(5000),
});

// ============================================================
// ADMIN SCHEMAS
// ============================================================

export const nominationStatusSchema = z.object({
  action: z.literal("status"),
  status: z.enum([
    "SUBMITTED",
    "UNDER_REVIEW",
    "SHORTLISTED",
    "FINALIST",
    "WINNER",
    "NOT_SELECTED",
  ]),
  reason: z.string().max(1000).optional(),
});

export const nominationWinnerSchema = z.object({
  action: z.literal("winner"),
  winnerYear: z.number().int().min(2020).max(2100).optional(),
  winnerHighlight: z.string().max(500).optional(),
  winnerStory: z.string().max(20000).optional(),
  winnerPhotoUrl: z
    .string()
    .url()
    .refine((u) => u.startsWith("http://") || u.startsWith("https://"), {
      message: "Photo URL must use http or https protocol",
    })
    .optional()
    .or(z.literal("")),
  isPublic: z.boolean().optional(),
});

export const bulkNominationSchema = z.object({
  ids: z.array(z.string().min(1).max(50)).min(1).max(100),
  action: z.literal("setStatus"),
  status: z.enum([
    "SUBMITTED",
    "UNDER_REVIEW",
    "SHORTLISTED",
    "FINALIST",
    "WINNER",
    "NOT_SELECTED",
  ]),
});

export const registrationStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "CHECKED_IN", "CANCELLED"]),
});

export const messageStatusSchema = z.object({
  status: z.enum(["new", "read", "replied", "archived"]),
});

export const createJudgeSchema = z.object({
  email: z.string().email().max(200),
  name: z.string().min(2).max(200),
  title: z.string().max(200).optional(),
  organization: z.string().max(200).optional(),
  country: z.string().max(100).optional(),
  expertise: z.array(z.string().max(100)).max(12).optional(),
  password: z
    .string()
    .min(8)
    .max(200)
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  assignedCategories: z.array(z.string().max(20)).max(12).optional(),
});

export const updateJudgeSchema = z.object({
  isActive: z.boolean().optional(),
  name: z.string().min(2).max(200).optional(),
  title: z.string().max(200).optional(),
  organization: z.string().max(200).optional(),
  country: z.string().max(100).optional(),
  expertise: z.array(z.string().max(100)).max(12).optional(),
  assignedCategories: z.array(z.string().max(20)).max(12).optional(),
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase, hyphens only"),
  excerpt: z.string().min(1).max(500),
  body: z.string().min(1).max(50000),
  category: z.enum(["news", "update", "deadline", "ceremony"]).default("news"),
  isPublished: z.boolean().default(false),
  isPinned: z.boolean().default(false),
});

export const updateAnnouncementSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  excerpt: z.string().min(1).max(500).optional(),
  body: z.string().min(1).max(50000).optional(),
  category: z.enum(["news", "update", "deadline", "ceremony"]).optional(),
  isPublished: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
});

// ============================================================
// JUDGE SCHEMA
// ============================================================

export const judgeReviewSchema = z.object({
  scoreImpact: z.number().int().min(0).max(10),
  scoreInnovation: z.number().int().min(0).max(10),
  scoreScale: z.number().int().min(0).max(10),
  scoreSustainability: z.number().int().min(0).max(10),
  scoreLeadership: z.number().int().min(0).max(10),
  scoreEquity: z.number().int().min(0).max(10),
  comments: z.string().max(5000).optional(),
  recommendation: z.enum(["SELECT", "SHORTLIST", "DECLINE"]),
  coiDeclared: z.boolean().refine((v) => v === true, "COI declaration required"),
});

// ============================================================
// TYPES (inferred)
// ============================================================

export type NominateInput = z.infer<typeof nominateSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type CreateJudgeInput = z.infer<typeof createJudgeSchema>;
export type UpdateJudgeInput = z.infer<typeof updateJudgeSchema>;
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>;
export type JudgeReviewInput = z.infer<typeof judgeReviewSchema>;
