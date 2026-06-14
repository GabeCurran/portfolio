// Central SEO config + structured-data helpers.
// Pure module (no "use client") so it can be imported from server components,
// sitemap.ts, robots.ts, and metadata exports alike.

import type { CaseStudyMeta } from "@/content/caseStudies";

export const SITE_URL = "https://gabecurran.me";
export const SITE_NAME = "Gabe Curran";
export const AUTHOR = "Gabe Curran";
export const JOB_TITLE = "Software Engineer";

// Keyword-relevant default description, drawn from the real homepage intro copy
// (content/typingIntro.ts). No fabrication.
export const DEFAULT_DESCRIPTION =
  "Gabe Curran is a full-stack software engineer building real-time web apps, " +
  "games, and internal data tools with TypeScript, Next.js, and PostgreSQL. " +
  "See projects including Reibu and Junjo.";

// Site-wide social profile image used as the default OG/Twitter image.
// No dedicated home social image exists, so reuse an existing project preview.
export const DEFAULT_OG_IMAGE = "/img/previews/reibu.png";

// Public social profiles (mirrors components/Footer.tsx) — used for schema.org sameAs.
export const SOCIAL_LINKS = [
  "https://github.com/GabeCurran/",
  "https://www.linkedin.com/in/gabe-curran/",
  "https://www.instagram.com/gabe_curran/",
];

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return new URL(path, SITE_URL).toString();
}

// schema.org Person — the site-wide entity for this portfolio.
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR,
    url: SITE_URL,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    jobTitle: JOB_TITLE,
    worksFor: {
      "@type": "Organization",
      name: "WebstaurantStore",
      url: "https://www.webstaurantstore.com/",
    },
    knowsAbout: [
      "TypeScript",
      "Next.js",
      "React",
      "Node.js",
      "PostgreSQL",
      "Prisma",
      "Full-stack web development",
      "Real-time systems",
      "Databases",
    ],
    sameAs: SOCIAL_LINKS,
  };
}

// schema.org WebSite — the portfolio itself, authored by the Person.
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    author: {
      "@type": "Person",
      name: AUTHOR,
      url: SITE_URL,
    },
  };
}

// schema.org BreadcrumbList for detail pages.
export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

// Parse a "Sep 2025 - Present" style range into an ISO-ish start date ("2025-09").
// Returns undefined if it can't be parsed.
function parseStartDate(dateRange?: string): string | undefined {
  if (!dateRange) return undefined;
  const start = dateRange.split("-")[0]?.trim();
  if (!start) return undefined;
  const months: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };
  const m = start.match(/^([A-Za-z]{3})[a-z]*\s+(\d{4})$/);
  if (m) {
    const mon = months[m[1].toLowerCase()];
    if (mon) return `${m[2]}-${mon}`;
  }
  const yearOnly = start.match(/^(\d{4})$/);
  if (yearOnly) return yearOnly[1];
  return undefined;
}

// schema.org CreativeWork for a case-study project page.
export function caseStudyJsonLd(meta: CaseStudyMeta, slug: string) {
  const dateCreated = parseStartDate(meta.dateRange);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: meta.title,
    description: meta.description,
    url: absoluteUrl(`/projects/${slug}`),
    ...(meta.ogImage ? { image: absoluteUrl(meta.ogImage) } : {}),
    ...(dateCreated ? { dateCreated } : {}),
    author: {
      "@type": "Person",
      name: AUTHOR,
      url: SITE_URL,
    },
  };
}
