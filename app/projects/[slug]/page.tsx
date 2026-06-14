import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CaseStudyArticle,
  BackToProjects,
} from "@/components/CaseStudyLayout";
import { caseStudies, getCaseStudySlugs } from "@/content/caseStudies";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, caseStudyJsonLd } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Array<Params> {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = caseStudies[slug];
  if (!entry) return {};
  const { title, description, ogImage } = entry.meta;
  const fullTitle = `${title} | Gabe Curran`;
  const canonical = `/projects/${slug}`;
  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      type: "article",
      url: absoluteUrl(canonical),
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const entry = caseStudies[slug];
  if (!entry) notFound();
  const { Component } = entry;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/#projects" },
    { name: entry.meta.title, path: `/projects/${slug}` },
  ]);
  return (
    <>
      <JsonLd data={[breadcrumb, caseStudyJsonLd(entry.meta, slug)]} />
      <CaseStudyArticle>
        <Component />
      </CaseStudyArticle>
      <div className="sectionContainer pb-16">
        <BackToProjects />
      </div>
    </>
  );
}
