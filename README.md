# Eco Africa Awards 🌍

> Celebrating climate leadership across Africa — an initiative of the Africa Climate Leadership Academy (ACLA).

The **Eco Africa Awards** are the continental stage for African climate leadership. This is the official awards platform — built with Next.js 16, Three.js, and AI throughout, featuring 12 award categories, a multi-step nomination flow with an AI assistant, a transparent 6-stage judging process, ceremony registration, and a Hall of Fame of past winners.

🌐 **Live domain:** [ecoafricaawards.com](https://ecoafricaawards.com)
🏫 **Parent organisation:** [acla.io](https://acla.io)

---

## ✨ Highlights

- **3D hero** — A rotating Earth with Africa highlighted, climate-action pulse points across the continent, orbiting satellites, and a starfield. Built with Three.js / React Three Fiber.
- **12 award categories** — From Climate Leader of the Year to Lifetime Achievement, each with detailed criteria, prize descriptions, and a 3D tilt-card UI.
- **5-step nomination flow** — Category → Nominee → Nominator → The Case → Review. Validates at every step, saves a reference code, and submits to the database.
- **AI Nomination Assistant** — Reviews draft nominations and returns strengths, improvements, and criteria-alignment scores. Powered by Z.ai.
- **AI Category Matchmaker** — Paste a description of a nominee and get ranked category matches with confidence scores.
- **AI eligibility screening** — Every submitted nomination is asynchronously reviewed by AI for completeness and category fit.
- **6-stage selection process** with weighted criteria (Impact, Innovation, Scale, Sustainability, Leadership, Equity).
- **32-judge continental panel** with bios and expertise.
- **Ceremony registration** with 4 ticket types (General, VIP, Student, Press).
- **Hall of Fame** of past winners across 4 editions.
- **FAQ** filterable by category (Nominations, Judging, Ceremony, General).
- **Contact form** with topic routing.
- **Dark, premium "eco-African" design system** — deep forest greens, sunset ambers, terracotta accents, Playfair Display headings.
- **Fully responsive** with mobile-first nav and sticky footer.

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript 5 |
| 3D Graphics | three.js + @react-three/fiber + @react-three/drei |
| Animations | Framer Motion |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Forms | React Hook Form + Zod |
| Database | Prisma ORM (SQLite dev / Postgres prod) |
| AI | z-ai-web-dev-sdk (Z.ai chat completions) |
| Icons | Lucide React |
| Fonts | Playfair Display + Geist Sans/Mono |
| Deployment | Netlify (Next.js runtime plugin) |

---

## 🚀 Local Development

```bash
# Install dependencies
bun install

# Set up the database (SQLite local file)
bun run db:push

# Start the dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🗄 Database

The Prisma schema (`prisma/schema.prisma`) defines six models:

- `Nomination` — all nomination submissions, including AI-generated eligibility summary.
- `Review` — individual judge scores per nomination.
- `Registration` — ceremony registrations.
- `ContactMessage` — contact form submissions.
- `NewsletterSubscriber` — newsletter signups.
- `AiUsageLog` — privacy-respecting audit log of AI feature usage (no PII).

### Local dev (SQLite)

The default `DATABASE_URL=file:/home/z/my-project/db/custom.db` works for local development.

### Production (recommended: Postgres)

For persistent production data on Netlify:

1. Provision a free Postgres database on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. In `prisma/schema.prisma`, change the provider:
   ```prisma
   datasource db {
     provider = "postgresql"  // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. In your Netlify site settings, set the environment variable:
   ```
   DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
   ```
4. Run `bun run db:push` locally (with the same `DATABASE_URL`) to create the tables, then deploy.

> The site will render and most static sections will work without a configured DB, but form submissions (nominate / register / contact) require a reachable `DATABASE_URL`.

---

## 🤖 AI Features & API Keys

The AI features use the `z-ai-web-dev-sdk`. The SDK is initialised automatically when an AI endpoint is hit.

If the AI service is unavailable (e.g. no API key configured), every endpoint **gracefully degrades** to a rule-based fallback so the site remains fully functional:

| Endpoint | Purpose | Fallback |
|---|---|---|
| `POST /api/ai-assist` | Review a draft nomination | Rule-based scoring on length, metrics, equity keywords |
| `POST /api/ai-match` | Match nominee description to categories | Keyword-based scoring across category keywords |
| Async post-nomination | Generate eligibility summary | Skipped silently |

---

## 📡 API Reference

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/nominate` | Submit a nomination (returns `referenceCode`) |
| `GET` | `/api/nominate?ref=EAA-XXXX` | Check a nomination's status |
| `POST` | `/api/register` | Register for the ceremony |
| `POST` | `/api/contact` | Send a contact message |
| `POST` | `/api/ai-assist` | Get AI feedback on a draft nomination |
| `POST` | `/api/ai-match` | Get AI-ranked category matches for a description |
| `GET` | `/api/categories` | List all award categories |
| `GET` | `/api/stats` | Live stats (nominations, registrations, countries) |

---

## 🌐 Deploying to Netlify

This repository is configured for one-click Netlify deployment via `netlify.toml`.

### Option A — Connect via GitHub (recommended)

1. Push this repo to GitHub (see [Deployment](#-deployment) below).
2. Log into [Netlify](https://app.netlify.com).
3. **Add new site → Import from GitHub** → select this repo.
4. Build settings are auto-detected from `netlify.toml`:
   - Build command: `bun run build:netlify`
   - Publish directory: `.next`
5. Set environment variables in **Site settings → Environment variables**:
   - `DATABASE_URL` — your Postgres connection string (recommended) or `file:/tmp/awards.db` for ephemeral demo
   - `NEXT_PUBLIC_SITE_URL` — `https://ecoafricaawards.com` (or your Netlify subdomain)
6. **Deploy site**. Netlify will install the Next.js runtime plugin automatically.

### Option B — Netlify CLI

```bash
npm i -g netlify-cli
netlify login
netlify init          # link this folder to a Netlify site
netlify deploy --build --prod
```

### Custom domain

In Netlify → **Domain settings → Add custom domain** → enter `ecoafricaawards.com`. Update your registrar's DNS to point to Netlify's nameservers (or add a CNAME record). Netlify auto-provisions HTTPS via Let's Encrypt.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                  # API routes (nominate, register, contact, ai-*)
│   ├── globals.css           # Eco-African design system
│   ├── layout.tsx            # Fonts + metadata
│   └── page.tsx              # Composes all sections
├── components/
│   ├── earth-canvas.tsx      # 3D Earth / Africa hero
│   ├── site-header.tsx
│   ├── site-footer.tsx
│   ├── section-primitives.tsx # Reveal, AnimatedCounter, SectionHeading
│   ├── sections/             # All page sections (hero, about, categories, …)
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── data.ts               # Award categories, winners, judges, timeline, FAQ
│   ├── db.ts                 # Prisma client
│   ├── site-config.ts        # Brand / ceremony / nomination metadata
│   └── utils.ts              # cn() helper
└── prisma/
    └── schema.prisma         # Database models
```

---

## 🏆 The 12 Award Categories

1. Climate Leader of the Year (Flagship)
2. Youth Climate Champion of the Year (Flagship)
3. Climate Innovation of the Year (Specialist)
4. Climate Finance Pioneer (Specialist)
5. Community Climate Resilience Award (Specialist)
6. Climate Policy & Governance Award (Specialist)
7. Women in Climate Leadership (Flagship)
8. Indigenous Knowledge & Climate Award (Specialist)
9. Climate Communication & Media Award (Specialist)
10. Biodiversity Conservation Award (Specialist)
11. Corporate Climate Stewardship (Emerging)
12. Lifetime Achievement in Climate Action (Lifetime)

---

## 📅 2026 Timeline

| Phase | Date |
|---|---|
| Nominations open | Jan 15, 2026 |
| Early-bird deadline | Apr 30, 2026 |
| Final deadline | Jun 30, 2026 |
| AI-assisted screening | Jul 1–31, 2026 |
| Judging & shortlist | Aug 1–10, 2026 |
| Winners announced | Aug 25, 2026 |
| Ceremony (Kigali) | Sep 14–17, 2026 |

---

## 🔒 Privacy & Code of Conduct

- Nominations are confidential and visible only to the nominee (with consent), nominator, judges, and a small secretariat.
- AI usage is logged without PII (only an email hash where relevant).
- All forms include explicit consent checkboxes.
- The ceremony is planned to be carbon-neutral, with verified offsets supporting African ecosystem restoration.

---

## 📝 License & Attribution

© Africa Climate Leadership Academy (ACLA). All rights reserved.

Built with care for the African continent. 🌍
