import type { ComponentType } from "react";
import PokeDnDCaseStudy, { meta as pokedndMeta } from "./pokednd";

export type CaseStudyMeta = {
  title: string;
  description: string;
  ogImage?: string;
  dateRange?: string;
  tagline?: string;
  primaryLink?: { label: string; href: string };
  secondaryLink?: { label: string; href: string };
  heroPreviewClass?: string;
};

export type CaseStudyEntry = {
  meta: CaseStudyMeta;
  Component: ComponentType;
};

export const caseStudies: Record<string, CaseStudyEntry> = {
  pokednd: { meta: pokedndMeta, Component: PokeDnDCaseStudy },
};

export function getCaseStudy(slug: string): CaseStudyEntry | undefined {
  return caseStudies[slug];
}

export function getCaseStudySlugs(): string[] {
  return Object.keys(caseStudies);
}
