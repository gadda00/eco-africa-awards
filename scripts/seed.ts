/**
 * Seed script: creates default admin user, sample judges, and key settings.
 * Usage: bun run seed
 *
 * Default admin credentials:
 *   Email:    admin@ecoawardsafrica.com
 *   Password: ACLA-Admin-2026!
 *
 * Override via env vars: SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@ecoawardsafrica.com").toLowerCase().trim();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ACLA-Admin-2026!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // Admin user
  const admin = await db.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", isActive: true, passwordHash },
    create: {
      email: adminEmail,
      name: "Platform Admin",
      title: "Awards Secretariat",
      organization: "Africa Climate Leadership Academy",
      country: "Kenya",
      role: "ADMIN",
      isActive: true,
      passwordHash,
    },
  });
  console.log(`✓ Admin user: ${admin.email} (id: ${admin.id})`);

  // Default site settings
  const settings = [
    { key: "nominationsOpen", value: "true" },
    { key: "nominationsDeadline", value: "2026-06-30" },
    { key: "ceremonyDate", value: "2026-09-14" },
    { key: "ceremonyVenue", value: "Kigali Convention Centre, Rwanda" },
    { key: "ceremonyTheme", value: "African Solutions for a Just Transition" },
    { key: "maxNominationsPerNominator", value: "5" },
    { key: "maxCategoriesPerNominee", value: "2" },
  ];
  for (const s of settings) {
    await db.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log(`✓ ${settings.length} site settings seeded`);

  // Sample judges (3 demo judges with simple passwords)
  const judges = [
    {
      email: "judge.kwame@example.org",
      name: "Dr. Kwame Mensah",
      title: "Climate Policy Lead",
      organization: "Lukenya University",
      country: "Kenya",
      expertise: ["Policy", "Adaptation", "Indigenous Knowledge"],
      assignedCategories: ["cat-01", "cat-06", "cat-08"],
    },
    {
      email: "judge.amina@example.org",
      name: "Dr. Amina Diallo",
      title: "Senior Researcher",
      organization: "University of Ghana",
      country: "Ghana",
      expertise: ["Climate Science", "Water Systems", "Resilience"],
      assignedCategories: ["cat-03", "cat-05", "cat-10"],
    },
    {
      email: "judge.thabo@example.org",
      name: "Thabo Nkosi",
      title: "Director",
      organization: "Green Belt Movement",
      country: "South Africa",
      expertise: ["Conservation", "Community", "Movement-building"],
      assignedCategories: ["cat-02", "cat-07", "cat-09"],
    },
  ];
  const judgePassword = "Judge-2026!";
  const judgeHash = await bcrypt.hash(judgePassword, 12);

  for (const j of judges) {
    await db.user.upsert({
      where: { email: j.email },
      update: {},
      create: {
        email: j.email,
        name: j.name,
        title: j.title,
        organization: j.organization,
        country: j.country,
        expertise: JSON.stringify(j.expertise),
        assignedCategories: JSON.stringify(j.assignedCategories),
        role: "JUDGE",
        isActive: true,
        passwordHash: judgeHash,
      },
    });
  }
  console.log(`✓ ${judges.length} demo judges seeded (password: ${judgePassword})`);

  // Sample announcement
  const existingAnn = await db.announcement.findFirst({ where: { slug: "nominations-open-2026" } });
  if (!existingAnn) {
    await db.announcement.create({
      data: {
        title: "Nominations for the 2026 Africa Climate Leadership Awards are now open",
        slug: "nominations-open-2026",
        excerpt:
          "The continental call for nominations begins. Submit a leader, innovator, or community that has reshaped Africa's climate trajectory by 30 June 2026.",
        body: `## The 2026 cycle begins

We are honoured to open nominations for the **fourth edition** of the Africa Climate Leadership Awards — the continental celebration of the leaders, innovators, and communities shaping Africa's response to the climate crisis.

This year, we are recognising outstanding contributions across **12 award categories**, including the flagship Climate Leader of the Year, Youth Climate Champion, Women in Climate Leadership, and Lifetime Achievement awards.

### Key dates

- **Nominations open:** January 15, 2026
- **Early-bird deadline:** April 30, 2026
- **Final deadline:** June 30, 2026
- **Shortlist announced:** August 10, 2026
- **Winners announced:** August 25, 2026
- **Ceremony:** September 14–17, 2026 — Kigali Convention Centre, Rwanda

### How to nominate

Anyone can nominate — yourself or a third party — and nominations are free. Use our **AI Nomination Assistant** to strengthen your case before submitting, and the **AI Category Matchmaker** if you're unsure which category best fits your nominee.

### Get involved

Beyond nominating, you can attend the ceremony, volunteer with the secretariat, or apply to join the 2026 judging panel. Reach out to awards@acla.io.`,
        category: "deadline",
        isPublished: true,
        isPinned: true,
        publishedAt: new Date(),
      },
    });
    console.log("✓ Sample announcement seeded");
  }

  console.log("\n=== SEED COMPLETE ===");
  console.log("Admin user created: admin@ecoawardsafrica.com");
  console.log("3 demo judges created.");
  console.log("7 site settings seeded.");
  console.log("1 sample announcement seeded.");
  console.log("\n⚠ Passwords were read from env vars or generated with strong defaults.");
  console.log("⚠ For production, set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD env vars before seeding.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
