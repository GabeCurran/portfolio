import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getCaseStudySlugs } from "@/content/caseStudies";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const home: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const caseStudies: MetadataRoute.Sitemap = getCaseStudySlugs().map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...home, ...caseStudies];
}
