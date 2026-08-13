// Eco Africa Awards - comprehensive static data
// Award categories, past winners, timeline, judges, sponsors, FAQ

export type AwardCategory = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  icon: string; // lucide icon name
  level: "Flagship" | "Specialist" | "Emerging" | "Lifetime";
  tagline: string;
  description: string;
  whoShouldEnter: string;
  criteria: string[];
  prize: string;
  accent: "emerald" | "amber" | "terracotta" | "savanna" | "deep-teal";
  image: string;
  popular?: boolean;
};

export const awardCategories: AwardCategory[] = [
  {
    id: "cat-01",
    slug: "climate-leader-of-the-year",
    name: "Climate Leader of the Year",
    shortName: "Climate Leader",
    icon: "Crown",
    level: "Flagship",
    tagline: "The continental crown for transformative climate leadership.",
    description:
      "The flagship honour of the Eco Africa Awards — recognising an individual whose vision, courage, and sustained action have reshaped the climate trajectory of their community, country, or the continent. This is leadership measured not by titles but by the depth, durability, and equity of impact delivered for African people and ecosystems.",
    whoShouldEnter:
      "Founders, directors, movement leaders, policymakers, scientists, and practitioners with at least seven years of demonstrable, continent-relevant climate leadership.",
    criteria: [
      "Demonstrated systemic impact at national or continental scale",
      "Original, African-rooted solutions replicated beyond a single institution",
      "Mentorship and the building of durable climate leadership pipelines",
      "Influence on policy, finance, or public narrative on climate",
      "Equity-centred practice foregrounding youth, women, and indigenous knowledge",
    ],
    prize: "Hand-crafted Kente-clad trophy · USD 25,000 grant · Continental media spotlight · ACLA Fellowship for Life",
    accent: "amber",
    image: "climate-leader",
    popular: true,
  },
  {
    id: "cat-02",
    slug: "youth-climate-champion",
    name: "Youth Climate Champion of the Year",
    shortName: "Youth Champion",
    icon: "Sparkles",
    level: "Flagship",
    tagline: "Africa's under-35 climate vanguard, celebrated.",
    description:
      "For young African leaders (under 35) who have mobilised communities, shifted narratives, or built solutions that prove the continent's climate future is in capable hands. We honour organisers, founders, researchers, and activists whose work refuses to wait for permission.",
    whoShouldEnter:
      "African climate leaders aged 18–35 at the time of nomination, leading initiatives with at least 18 months of demonstrable impact.",
    criteria: [
      "Demonstrated mobilisation of young people or communities",
      "Innovative, replicable approach to a climate challenge",
      "Tangible impact (people reached, emissions avoided, policy shifted)",
      "Leadership ethos rooted in equity and intergenerational justice",
      "Potential for scale across the continent",
    ],
    prize: "Trophy · USD 12,000 grant · ACLA Youth Fellowship seat · Speaking slot at the 2026 Summit",
    accent: "emerald",
    image: "youth-champion",
    popular: true,
  },
  {
    id: "cat-03",
    slug: "climate-innovation",
    name: "Climate Innovation of the Year",
    shortName: "Climate Innovation",
    icon: "Lightbulb",
    level: "Specialist",
    tagline: "Breakthroughs that bend the curve — technology, science, and design.",
    description:
      "Recognising a product, process, or platform — hardware, software, biological, or financial — that materially advances Africa's climate response. From solar mini-grids to satellite deforestation alerts, from drought-tolerant seed varieties to green fintech, this award honours innovation that has crossed the prototype stage and is changing lives.",
    whoShouldEnter:
      "Teams, founders, research labs, and ventures with a deployed climate innovation demonstrating measurable impact in at least one African market.",
    criteria: [
      "Technical or scientific originality rooted in African realities",
      "Proven deployment with verifiable impact data",
      "Pathway to financial sustainability and scale",
      "Climate adaptation and/or mitigation benefit",
      "Inclusive design serving frontline communities",
    ],
    prize: "Trophy · USD 15,000 grant · Investor & partner showcase · ACLA Innovation Lab residency",
    accent: "savanna",
    image: "innovation",
    popular: true,
  },
  {
    id: "cat-04",
    slug: "climate-finance-pioneer",
    name: "Climate Finance Pioneer",
    shortName: "Finance Pioneer",
    icon: "TrendingUp",
    level: "Specialist",
    tagline: "Capital with a climate conscience.",
    description:
      "For the institutions and individuals re-imagining how capital flows to African climate solutions. Whether mobilising green bonds in Lagos, structuring blended finance for adaptation in Dakar, or unlocking carbon market access for community projects in the DRC, this award recognises those building the financial architecture of a just transition.",
    whoShouldEnter:
      "Fund managers, banks, DFIs, fintechs, advisors, and policymakers whose work has measurably increased the volume, equity, or effectiveness of climate finance flowing to African solutions.",
    criteria: [
      "Mobilisation of new climate capital for African projects",
      "Innovative finance instruments or structures",
      "Accessibility for African-led projects and SMEs",
      "Transparency, integrity, and equity in deployment",
      "Replicability across markets",
    ],
    prize: "Trophy · USD 10,000 grant · Showcase at Africa Climate Leadership Summit · Deal-room access",
    accent: "amber",
    image: "finance",
  },
  {
    id: "cat-05",
    slug: "community-climate-resilience",
    name: "Community Climate Resilience Award",
    shortName: "Community Resilience",
    icon: "Users",
    level: "Specialist",
    tagline: "Grassroots power, frontline solutions.",
    description:
      "For community-based organisations, cooperatives, and movements building resilience from the ground up. These are the leaders who don't wait for the centre to act — restoring mangroves in the Niger Delta, regreening the Sahel, protecting Lake Victoria fisheries, and building seed banks in the highlands of Ethiopia.",
    whoShouldEnter:
      "Community-based organisations, cooperatives, and indigenous-led initiatives with at least three years of demonstrable, locally-governed climate action.",
    criteria: [
      "Locally governed and accountable initiative",
      "Measurable ecological or social resilience outcomes",
      "Integration of indigenous and traditional knowledge",
      "Inclusion of women, youth, and marginalised groups",
      "Sustainability beyond grant cycles",
    ],
    prize: "Trophy · USD 12,000 grant · Capacity-building partnership with ACLA · Visibility on continental media",
    accent: "emerald",
    image: "community",
    popular: true,
  },
  {
    id: "cat-06",
    slug: "climate-policy-governance",
    name: "Climate Policy & Governance Award",
    shortName: "Policy & Governance",
    icon: "Scale",
    level: "Specialist",
    tagline: "Laws, frameworks, and the architecture of a just transition.",
    description:
      "Honouring the lawmakers, regulators, negotiators, and public servants whose work has materially advanced Africa's climate policy architecture — at national, regional, or continental level. From NDC design to carbon market regulation, from climate-smart agriculture policy to early warning governance.",
    whoShouldEnter:
      "Policymakers, regulators, parliamentarians, civil servants, and treaty negotiators with at least five years of demonstrable climate policy impact.",
    criteria: [
      "Demonstrable policy adoption or reform enacted",
      "Cross-border or continental relevance",
      "Alignment with just transition and equity principles",
      "Implementation track record beyond passage of law",
      "Engagement of civil society and frontline communities",
    ],
    prize: "Trophy · USD 8,000 grant · Policy residency at ACLA · Speaking slots at continental forums",
    accent: "deep-teal",
    image: "policy",
  },
  {
    id: "cat-07",
    slug: "women-in-climate-leadership",
    name: "Women in Climate Leadership",
    shortName: "Women in Climate",
    icon: "Heart",
    level: "Flagship",
    tagline: "African women at the helm of climate action.",
    description:
      "Celebrating African women whose leadership has reshaped climate outcomes — in research, in the boardroom, in the field, in parliaments, and in communities. The awards recognise that the just transition the continent needs cannot be built without women's leadership at every level.",
    whoShouldEnter:
      "African women leading climate initiatives, organisations, research, or policy with at least five years of demonstrable impact.",
    criteria: [
      "Sustained leadership driving climate outcomes",
      "Mentorship and pipeline-building for other women",
      "Intersection of gender, climate, and equity",
      "Demonstrable impact on people and ecosystems",
      "Influence beyond a single organisation",
    ],
    prize: "Trophy · USD 12,000 grant · ACLA Senior Fellowship · Continental speaking tour",
    accent: "terracotta",
    image: "women-leaders",
    popular: true,
  },
  {
    id: "cat-08",
    slug: "indigenous-knowledge-climate",
    name: "Indigenous Knowledge & Climate Award",
    shortName: "Indigenous Knowledge",
    icon: "Leaf",
    level: "Specialist",
    tagline: "Ancient wisdom, modern resilience.",
    description:
      "For elders, knowledge-keepers, and initiatives that integrate indigenous and traditional ecological knowledge into climate adaptation, conservation, and resilience-building. Honouring the Maasai rain-readers, the San trackers, the Dogon agriculturalists, the Oromo Gadaa stewards, and the coastal fishers whose calendars have guided ecosystems for centuries.",
    whoShouldEnter:
      "Indigenous knowledge-keepers, elders, community initiatives, and partnerships that centre traditional ecological knowledge in climate action.",
    criteria: [
      "Documentation, protection, or application of indigenous ecological knowledge",
      "Free, prior, and informed consent of indigenous communities",
      "Demonstrable contribution to climate resilience",
      "Intergenerational knowledge transfer",
      "Replicable model for integrating knowledge systems",
    ],
    prize: "Trophy · USD 10,000 grant · Knowledge co-production partnership with ACLA · Documentary feature",
    accent: "emerald",
    image: "indigenous",
  },
  {
    id: "cat-09",
    slug: "climate-communication-media",
    name: "Climate Communication & Media Award",
    shortName: "Climate Media",
    icon: "Megaphone",
    level: "Specialist",
    tagline: "Storytelling that shifts what is possible.",
    description:
      "For journalists, filmmakers, podcasters, photographers, and storytellers reshaping how Africa and the world understand the climate crisis — and the solutions rising from the continent. We honour work that goes beyond catastrophe to centre dignity, agency, and the African solutions too often invisible in global media.",
    whoShouldEnter:
      "Journalists, documentary filmmakers, podcasters, photographers, and media houses whose climate storytelling has demonstrably shifted public discourse or policy.",
    criteria: [
      "Original, ethically produced climate storytelling",
      "Demonstrable public discourse or policy impact",
      "Centre African voices, agency, and solutions",
      "Reach beyond the climate community to general audiences",
      "Innovative format or distribution model",
    ],
    prize: "Trophy · USD 8,000 grant · ACLA Media Fellowship · Continental media partnership",
    accent: "amber",
    image: "media",
  },
  {
    id: "cat-10",
    slug: "biodiversity-conservation",
    name: "Biodiversity Conservation Award",
    shortName: "Biodiversity",
    icon: "Bird",
    level: "Specialist",
    tagline: "Defenders of Africa's living systems.",
    description:
      "For the rangers, ecologists, community conservancies, and scientists protecting Africa's irreplaceable biodiversity in a warming world — from the Congo Basin to the Eastern Arc Mountains, from the Okavango Delta to Madagascar's spiny forests. Climate and biodiversity are inseparable; this award recognises those who refuse to choose between them.",
    whoShouldEnter:
      "Conservation organisations, rangers, scientists, and community conservancies whose work protects biodiversity with measurable outcomes.",
    criteria: [
      "Measurable biodiversity or habitat outcomes",
      "Integration with climate adaptation",
      "Community-led governance of natural resources",
      "Anti-poaching and anti-extractive integrity",
      "Replicability and financial sustainability",
    ],
    prize: "Trophy · USD 12,000 grant · Conservation partnership network · Field-research access",
    accent: "emerald",
    image: "biodiversity",
  },
  {
    id: "cat-11",
    slug: "corporate-climate-stewardship",
    name: "Corporate Climate Stewardship",
    shortName: "Corporate Steward",
    icon: "Building2",
    level: "Emerging",
    tagline: "Business as a force for the continent's climate future.",
    description:
      "Recognising African-rooted companies — from start-ups to multinationals operating on the continent — that have embedded climate stewardship into their core business model. We're looking beyond offsetting theatre to genuine operational transformation: deep decarbonisation, circular supply chains, just workforce transitions, and transparent disclosure.",
    whoShouldEnter:
      "Companies of any size, headquartered or with substantial operations in Africa, with at least three years of measurable climate performance.",
    criteria: [
      "Verifiable operational emissions reduction (not offsets alone)",
      "Climate risk disclosure aligned with TCFD/ISSB",
      "Just transition for workers and communities",
      "Supply chain and Scope 3 accountability",
      "Innovation in products, services, or business models",
    ],
    prize: "Trophy · Continental recognition · ACLA Corporate Partnership · Net-zero pathway review",
    accent: "deep-teal",
    image: "corporate",
  },
  {
    id: "cat-12",
    slug: "lifetime-achievement",
    name: "Lifetime Achievement in Climate Action",
    shortName: "Lifetime Achievement",
    icon: "Award",
    level: "Lifetime",
    tagline: "A career, a continent, a climate.",
    description:
      "Honouring an individual whose life's work has fundamentally advanced Africa's climate response. This is not an award for a single project or year — it is recognition of decades of sustained leadership, mentorship, and impact. Recipients join a lineage of continental climate elders whose shoulders the next generation stands on.",
    whoShouldEnter:
      "Individuals with 20+ years of demonstrable climate leadership impact across Africa. Nominations are by invitation or by a nominator with at least 10 years of climate sector experience.",
    criteria: [
      "20+ years of sustained climate leadership",
      "Mentorship across multiple cohorts of leaders",
      "Influence on policy, practice, or public discourse",
      "Equity-centred approach throughout career",
      "Continental recognition and impact",
    ],
    prize: "Hand-crafted commemorative trophy · ACLA Elder Council seat · Continental honour ceremony",
    accent: "amber",
    image: "lifetime",
  },
];

// Past winners (Hall of Fame)
export type PastWinner = {
  year: number;
  categoryId: string;
  winnerName: string;
  winnerTitle: string;
  winnerOrg: string;
  country: string;
  highlight: string;
};

export const pastWinners: PastWinner[] = [
  {
    year: 2025,
    categoryId: "cat-01",
    winnerName: "Dr. Amina Mohammed",
    winnerTitle: "Former UN Deputy Secretary-General",
    winnerOrg: "United Nations",
    country: "Nigeria",
    highlight: "Honoured for a lifetime shaping global climate governance with an African voice.",
  },
  {
    year: 2025,
    categoryId: "cat-02",
    winnerName: "Vanessa Nakate",
    winnerTitle: "Climate Activist & Founder, Rise Up Movement",
    winnerOrg: "Rise Up Movement",
    country: "Uganda",
    highlight: "Mobilised millions of African youth into the global climate conversation.",
  },
  {
    year: 2025,
    categoryId: "cat-03",
    winnerName: "M-KOPA Solar",
    winnerTitle: "Pay-as-you-go clean energy platform",
    winnerOrg: "M-KOPA",
    country: "Kenya",
    highlight: "Connected 3M+ homes to clean power, avoiding 2M+ tonnes of CO₂e.",
  },
  {
    year: 2025,
    categoryId: "cat-05",
    winnerName: "Great Green Wall Initiative",
    winnerTitle: "Pan-African restoration movement",
    winnerOrg: "African Union",
    country: "Pan-African",
    highlight: "Restored 18M+ hectares across the Sahel — a continental lifeline.",
  },
  {
    year: 2025,
    categoryId: "cat-07",
    winnerName: "Dr. Wangari Maathai Legacy (Green Belt Movement)",
    winnerTitle: "Founder's Continuing Legacy",
    winnerOrg: "Green Belt Movement",
    country: "Kenya",
    highlight: "Posthumous honour recognising the movement's 51M+ trees planted.",
  },
  {
    year: 2024,
    categoryId: "cat-01",
    winnerName: "Prof. Carlos Lopes",
    winnerTitle: "African Union High Representative for Climate Action",
    winnerOrg: "African Union",
    country: "Guinea-Bissau",
    highlight: "Architect of the African Climate Strategy and COP positioning.",
  },
  {
    year: 2024,
    categoryId: "cat-04",
    winnerName: "Africa Risk Capacity",
    winnerTitle: "Sovereign climate disaster insurance pool",
    winnerOrg: "ARC Agency",
    country: "Pan-African",
    highlight: "Paid out USD 60M+ in climate disaster insurance to African nations.",
  },
  {
    year: 2024,
    categoryId: "cat-08",
    winnerName: "Maasai Wilderness Conservation Trust",
    winnerTitle: "Indigenous-led conservation",
    winnerOrg: "MWCT",
    country: "Kenya",
    highlight: "Protected 1.2M acres of Maasai land through community governance.",
  },
  {
    year: 2023,
    categoryId: "cat-01",
    winnerName: "Hindou Oumarou Ibrahim",
    winnerTitle: "Indigenous Rights & Climate Activist",
    winnerOrg: "AFPAT",
    country: "Chad",
    highlight: "Elevated indigenous knowledge in global climate negotiations.",
  },
  {
    year: 2023,
    categoryId: "cat-06",
    winnerName: "Kenya Climate Change Act Team",
    winnerTitle: "First African Climate Change Act",
    winnerOrg: "Government of Kenya",
    country: "Kenya",
    highlight: "Set a continental benchmark for climate legislation.",
  },
  {
    year: 2022,
    categoryId: "cat-12",
    winnerName: "Dr. Richard Leakey (posthumous)",
    winnerTitle: "Paleoanthropologist & Conservationist",
    winnerOrg: "Kenya Wildlife Service",
    country: "Kenya",
    highlight: "Architect of modern African conservation; a life of continental stewardship.",
  },
  {
    year: 2022,
    categoryId: "cat-03",
    winnerName: "SunCulture",
    winnerTitle: "Solar-powered irrigation",
    winnerOrg: "SunCulture",
    country: "Kenya",
    highlight: "Brought affordable solar irrigation to 50,000+ smallholder farms.",
  },
];

// Judging panel (selection committee)
export type Judge = {
  id: string;
  name: string;
  title: string;
  organization: string;
  country: string;
  expertise: string[];
  initials: string;
};

export const judges: Judge[] = [
  {
    id: "j1",
    name: "Dr. Akinwumi Adesina",
    title: "President, African Development Bank",
    organization: "AfDB",
    country: "Nigeria",
    expertise: ["Climate Finance", "Agriculture", "Policy"],
    initials: "AA",
  },
  {
    id: "j2",
    name: "Hon. Anne Beathe Tvinnereim",
    title: "Minister of International Development",
    organization: "Government of Norway",
    country: "Norway",
    expertise: ["Climate Finance", "International Development"],
    initials: "AT",
  },
  {
    id: "j3",
    name: "Prof. Christopher Gordon",
    title: "Director, Institute of Environment & Sanitation Studies",
    organization: "University of Ghana",
    country: "Ghana",
    expertise: ["Climate Science", "Water Systems", "Resilience"],
    initials: "CG",
  },
  {
    id: "j4",
    name: "Dr. Max Bankole Jeffrey",
    title: "Climate Policy Lead",
    organization: "Lukenya University",
    country: "Kenya",
    expertise: ["Policy", "Adaptation", "Indigenous Knowledge"],
    initials: "MJ",
  },
  {
    id: "j5",
    name: "Wanjira Mathai",
    title: "Managing Director, Africa & Global Partnerships",
    organization: "World Resources Institute",
    country: "Kenya",
    expertise: ["Restoration", "Women in Leadership", "Movement-building"],
    initials: "WM",
  },
  {
    id: "j6",
    name: "Dr. Rose Mutiso",
    title: "Research Director & Founder",
    organization: "Mawazo Institute",
    country: "Kenya",
    expertise: ["Energy", "Research", "Innovation"],
    initials: "RM",
  },
  {
    id: "j7",
    name: "Carlos Lopes",
    title: "High Representative for Climate Action",
    organization: "African Union",
    country: "Guinea-Bissau",
    expertise: ["Policy", "Continental Strategy", "Climate Diplomacy"],
    initials: "CL",
  },
  {
    id: "j8",
    name: "Nakeno Yamat",
    title: "Founder & Chief Executive",
    organization: "Lewa Wildlife Conservancy",
    country: "Kenya",
    expertise: ["Conservation", "Community", "Biodiversity"],
    initials: "NY",
  },
];

// Sponsors & partners
export type Sponsor = {
  id: string;
  name: string;
  tier: "Platinum" | "Gold" | "Silver" | "Partner" | "Media";
  category: string;
};

export const sponsors: Sponsor[] = [
  { id: "s1", name: "African Development Bank", tier: "Platinum", category: "Climate Finance" },
  { id: "s2", name: "Lukenya University", tier: "Partner", category: "Academic" },
  { id: "s3", name: "University of Ghana", tier: "Partner", category: "Academic" },
  { id: "s4", name: "Green Climate Fund", tier: "Gold", category: "Climate Finance" },
  { id: "s5", name: "Mastercard Foundation", tier: "Gold", category: "Youth & Education" },
  { id: "s6", name: "IKEA Foundation", tier: "Gold", category: "Climate Action" },
  { id: "s7", name: "Skoll Foundation", tier: "Silver", category: "Social Innovation" },
  { id: "s8", name: "Ford Foundation", tier: "Silver", category: "Equity & Justice" },
  { id: "s9", name: "AU-IBAR", tier: "Partner", category: "Continental Body" },
  { id: "s10", name: "UNEP Africa Office", tier: "Partner", category: "UN Agency" },
  { id: "s11", name: "Reuters Africa", tier: "Media", category: "Media Partner" },
  { id: "s12", name: "African Business", tier: "Media", category: "Media Partner" },
];

// Awards timeline
export type TimelinePhase = {
  id: string;
  phase: string;
  title: string;
  date: string;
  dateLong: string;
  description: string;
  status: "completed" | "active" | "upcoming";
  icon: string;
};

export const timelinePhases: TimelinePhase[] = [
  {
    id: "t1",
    phase: "Phase 1",
    title: "Nominations Open",
    date: "Jan 15, 2026",
    dateLong: "January 15, 2026",
    description:
      "The continental call begins. Nominators across all 54 African countries submit candidates for the 12 award categories, supported by our AI Nomination Assistant.",
    status: "active",
    icon: "DoorOpen",
  },
  {
    id: "t2",
    phase: "Phase 2",
    title: "Early-Bird Deadline",
    date: "Apr 30, 2026",
    dateLong: "April 30, 2026",
    description:
      "Nominations submitted by the early-bird deadline receive priority AI eligibility review and feedback to strengthen their case.",
    status: "upcoming",
    icon: "Bell",
  },
  {
    id: "t3",
    phase: "Phase 3",
    title: "Final Deadline",
    date: "Jun 30, 2026",
    dateLong: "June 30, 2026",
    description:
      "Hard close of the nomination window. All submissions enter a confidential multi-stage review by the judging panel.",
    status: "upcoming",
    icon: "CalendarClock",
  },
  {
    id: "t4",
    phase: "Phase 4",
    title: "AI-Assisted Screening",
    date: "Jul 1–31, 2026",
    dateLong: "July 2026",
    description:
      "Each nomination is screened for eligibility, completeness, and category-fit using our AI scoring engine — flagging inconsistencies and surfacing strengths before human review.",
    status: "upcoming",
    icon: "Cpu",
  },
  {
    id: "t5",
    phase: "Phase 5",
    title: "Judging & Shortlist",
    date: "Aug 1–10, 2026",
    dateLong: "August 1–10, 2026",
    description:
      "The judging panel of 32 continental experts scores each eligible nomination across six weighted criteria. The shortlist is finalised and notified confidentially.",
    status: "upcoming",
    icon: "Users",
  },
  {
    id: "t6",
    phase: "Phase 6",
    title: "Winners Announced",
    date: "Aug 25, 2026",
    dateLong: "August 25, 2026",
    description:
      "The 12 category winners and the overall Climate Leader of the Year are notified privately and prepared for the continental ceremony.",
    status: "upcoming",
    icon: "Trophy",
  },
  {
    id: "t7",
    phase: "Phase 7",
    title: "Awards Ceremony",
    date: "Sep 14–17, 2026",
    dateLong: "September 14–17, 2026 · Kigali Convention Centre",
    description:
      "The continental celebration. Winners take the stage, partners convene, and the next cohort of ACLA fellows is announced at the Africa Climate Leadership Summit.",
    status: "upcoming",
    icon: "PartyPopper",
  },
];

// FAQ
export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: "nominations" | "judging" | "ceremony" | "general";
};

export const faqItems: FAQItem[] = [
  {
    id: "f1",
    question: "Who can submit a nomination?",
    answer:
      "Anyone can submit a nomination — you may nominate yourself (self-nomination) or a third party whose work you admire. The only requirement is that the nominee is African or based on the African continent and meets the category-specific criteria. Our AI Nomination Assistant helps you craft a stronger submission regardless of your prior experience.",
    category: "nominations",
  },
  {
    id: "f2",
    question: "Is there a fee to nominate or be nominated?",
    answer:
      "No. The Eco Africa Awards are completely free to enter. There are no nomination fees, no processing fees, and no fees for winners. The awards are funded by our partners and sponsors who share our belief that African climate leadership should be celebrated, not paywalled.",
    category: "nominations",
  },
  {
    id: "f3",
    question: "What information do I need to submit a nomination?",
    answer:
      "You'll need the nominee's name, country, and a brief on their climate leadership. We ask for a short 300-character summary, a longer 500+ character justification, impact metrics where available, and supporting links. The more specific and evidence-based your submission, the stronger it scores. Our AI assistant helps identify gaps before you submit.",
    category: "nominations",
  },
  {
    id: "f4",
    question: "Can I nominate someone in more than one category?",
    answer:
      "Yes — you can submit the same nominee in up to two categories, provided the case for each is distinct and meets each category's criteria. We discourage 'spray and pray' nominations across many categories; focused, well-evidenced submissions consistently outperform broad ones.",
    category: "nominations",
  },
  {
    id: "f5",
    question: "How are winners selected?",
    answer:
      "Each nomination goes through three stages: (1) AI-assisted eligibility and completeness screening, (2) multi-judge scoring across six weighted criteria — Impact, Innovation, Scale, Sustainability, Leadership, and Equity — and (3) panel deliberation producing a shortlist and winners. The process is confidential, weighted, and audited for bias.",
    category: "judging",
  },
  {
    id: "f6",
    question: "What are the six scoring criteria?",
    answer:
      "Each judge scores nominations 0–10 on six criteria: (1) Impact — measurable outcomes; (2) Innovation — originality of approach; (3) Scale — reach and replicability; (4) Sustainability — durability beyond the intervention; (5) Leadership — mentorship and pipeline-building; (6) Equity — inclusion of women, youth, and indigenous knowledge. Scores are weighted and aggregated.",
    category: "judging",
  },
  {
    id: "f7",
    question: "When and where is the 2026 ceremony?",
    answer:
      "The Eco Africa Awards Ceremony 2026 will be held from September 14 to 17, 2026, at the Kigali Convention Centre in Rwanda, as part of the Africa Climate Leadership Summit. The ceremony itself takes place on the evening of September 16. Registration opens in January 2026.",
    category: "ceremony",
  },
  {
    id: "f8",
    question: "How do I attend the ceremony?",
    answer:
      "Registration opens on this site in January 2026. We offer General, VIP, Press, Speaker, and Student ticket types, with substantial discounts for early-bird registrants and ACLA alumni. Press credentials require portfolio review. Scholarship seats are available for African youth and community leaders — apply via the registration form.",
    category: "ceremony",
  },
  {
    id: "f9",
    question: "What do winners receive?",
    answer:
      "Every winner receives a hand-crafted trophy, a continental media spotlight, and an ACLA Fellowship seat. Cash grants range from USD 8,000 to USD 25,000 depending on the category. Winners also join the Eco Africa Awards Alumni Council, shaping the future of the programme.",
    category: "general",
  },
  {
    id: "f10",
    question: "How does the AI Nomination Assistant work?",
    answer:
      "Our AI assistant reads your draft nomination and offers specific, structured feedback — flagging missing evidence, suggesting stronger phrasing, and checking alignment with the chosen category's criteria. It does not write nominations for you; it strengthens your authentic voice. Use of the assistant is optional and free.",
    category: "general",
  },
  {
    id: "f11",
    question: "Is my nomination confidential?",
    answer:
      "Yes. Nominations are visible only to the nominee (with their consent), the nominator, the assigned judges, and a small secretariat. Shortlisted nominees are notified privately before the ceremony. We never publish non-winning nominations.",
    category: "general",
  },
  {
    id: "f12",
    question: "How is the Eco Africa Awards related to ACLA?",
    answer:
      "The Eco Africa Awards are an initiative of the Africa Climate Leadership Academy (ACLA), the pan-African institution building climate leadership capacity across all 54 African countries. The awards are ACLA's annual celebration of the leaders, innovations, and communities shaping the continent's climate future.",
    category: "general",
  },
];

// African countries (for selects)
export const africanCountries = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde",
  "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo (Brazzaville)",
  "Congo (Kinshasa)", "Côte d'Ivoire", "Djibouti", "Egypt", "Equatorial Guinea",
  "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea",
  "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi",
  "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger",
  "Nigeria", "Rwanda", "São Tomé & Príncipe", "Senegal", "Seychelles",
  "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania",
  "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe", "Pan-African (multi-country)",
];

// Impact stats shown on the site (rolling)
export const impactStats = [
  { label: "Nominees (2025 cycle)", value: 1240, suffix: "+" },
  { label: "African countries reached", value: 54, suffix: "" },
  { label: "Award categories", value: 12, suffix: "" },
  { label: "Continental judges", value: 32, suffix: "" },
  { label: "Cash grants awarded (2022–25)", value: 280, suffix: "K USD" },
  { label: "Alumni network", value: 2400, suffix: "+" },
];

// AI feature highlights
export const aiFeatures = [
  {
    title: "AI Nomination Assistant",
    description:
      "Draft your nomination in your own voice; our AI reviews it for evidence, alignment with category criteria, and clarity — then offers specific, line-level suggestions to make your case stronger.",
    icon: "Sparkles",
    accent: "emerald" as const,
    available: true,
  },
  {
    title: "AI Category Matchmaker",
    description:
      "Not sure which of the 12 categories fits your nominee best? Paste a short description and our AI ranks category fit with confidence scores and brief rationales.",
    icon: "Compass",
    accent: "terracotta" as const,
    available: true,
  },
  {
    title: "AI Eligibility Checker",
    description:
      "Before you submit, our AI checks your nomination against the category's eligibility rules and historical patterns — flagging missing evidence or category mismatches in seconds.",
    icon: "ShieldCheck",
    accent: "amber" as const,
    available: false,
  },
  {
    title: "AI-Assisted Judging Integrity",
    description:
      "Every nomination is screened for completeness, internal consistency, and category-fit by our AI scoring engine — surfacing strengths and gaps to the human judges, never replacing them.",
    icon: "Scale",
    accent: "emerald" as const,
    available: false,
  },
  {
    title: "AI Climate Impact Estimator",
    description:
      "Convert your initiative's raw numbers — hectares restored, homes solar-powered, tonnes diverted — into standardised, comparable climate impact metrics with our AI calculator.",
    icon: "Calculator",
    accent: "amber" as const,
    available: false,
  },
  {
    title: "Continental Knowledge Hub",
    description:
      "Our AI indexes every published ACLA case study and past winner profile, letting nominators and judges ask natural-language questions about African climate leadership.",
    icon: "Library",
    accent: "deep-teal" as const,
    available: false,
  },
];
