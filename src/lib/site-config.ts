// Eco Africa Awards - site configuration
export const siteConfig = {
  name: "Eco Africa Awards",
  shortName: "EAA",
  tagline: "Celebrating Climate Leadership Across Africa",
  parentOrg: "Africa Climate Leadership Academy",
  parentOrgShort: "ACLA",
  parentOrgUrl: "https://acla.io",
  domain: "ecoafricaawards.com",
  url: "https://ecoafricaawards.com",
  email: "awards@acla.io",
  phone: "+254 711 672 118",
  whatsapp: "+254 711 672 118",
  location: "Nairobi, Kenya · Pan-African",
  ceremony: {
    name: "Eco Africa Awards Ceremony 2026",
    theme: "African Solutions for a Just Transition",
    date: "September 14 – 17, 2026",
    venue: "Kigali Convention Centre, Rwanda",
    capacity: 850,
    earlyBirdDeadline: "March 31, 2026",
    regularDeadline: "July 15, 2026",
  },
  nomination: {
    openDate: "January 15, 2026",
    earlyDeadline: "April 30, 2026",
    finalDeadline: "June 30, 2026",
    shortlistDate: "August 10, 2026",
    winnersDate: "August 25, 2026",
  },
  social: {
    twitter: "https://twitter.com/aclaio",
    linkedin: "https://linkedin.com/company/aclaio",
    instagram: "https://instagram.com/aclaio",
    youtube: "https://youtube.com/@aclaio",
  },
  stats: {
    editions: 4,
    countriesCovered: 54,
    nominees2025: 1240,
    categories: 12,
    judges: 32,
    alumni: 2400,
    ceremonyAttendees: 850,
  },
};

export type SiteConfig = typeof siteConfig;
