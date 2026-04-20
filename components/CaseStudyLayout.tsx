import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiArrowLeft } from "react-icons/fi";
import { CollapsibleSection } from "./CollapsibleSection";

export function CaseStudyArticle({ children }: { children: ReactNode }) {
  return <article className="sectionContainer case-study-prose pb-16">{children}</article>;
}

export interface CaseStudyHeroProps {
  title: string;
  tagline?: string;
  dateRange?: string;
  primaryLink?: { label: string; href: string };
  secondaryLink?: { label: string; href: string };
  previewClass?: string;
  coverImage?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    priority?: boolean;
  };
}

export function CaseStudyHero({
  title,
  tagline,
  dateRange,
  primaryLink,
  secondaryLink,
  coverImage,
}: CaseStudyHeroProps) {
  return (
    <header className="pt-10 md:pt-14 pb-6 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-start md:gap-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            {title}
          </h1>
          {tagline && (
            <p className="mt-3 text-lg md:text-xl text-foreground/75 max-w-2xl leading-snug">
              {tagline}
            </p>
          )}
          {dateRange && (
            <p className="mt-2 text-sm text-foreground/55">{dateRange}</p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-3 text-sm">
            <BackToProjects />
            {primaryLink && <HeroLink {...primaryLink} variant="primary" />}
            {secondaryLink && <HeroLink {...secondaryLink} variant="secondary" />}
          </div>
        </div>
        {coverImage && (
          <figure className="mt-6 md:mt-0 m-0 shrink-0 w-full md:w-64 lg:w-80 rounded-xl overflow-hidden border border-foreground/15 bg-foreground/[0.02]">
            <Image
              src={coverImage.src}
              alt={coverImage.alt}
              width={coverImage.width}
              height={coverImage.height}
              sizes="(min-width: 1024px) 320px, (min-width: 768px) 256px, 100vw"
              priority={coverImage.priority ?? true}
              className="w-full h-auto block"
            />
          </figure>
        )}
      </div>
    </header>
  );
}

type HeroLinkVariant = "primary" | "secondary";

function HeroLink({
  label,
  href,
  variant = "secondary",
}: {
  label: string;
  href: string;
  variant?: HeroLinkVariant;
}) {
  const isExternal = /^https?:\/\//.test(href);
  const base =
    "group/herolink inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm no-underline transition-colors border border-foreground/20 bg-foreground/[0.03] text-foreground/85 hover:text-foreground hover:bg-foreground/[0.07] hover:border-foreground/35";
  const weight = variant === "primary" ? "font-semibold" : "font-medium";
  const className = `${base} ${weight}`;
  const content = (
    <>
      {label}
      <FiArrowUpRight
        aria-hidden="true"
        size={14}
        className="transition-[transform,color] duration-200 group-hover/herolink:translate-x-0.5 group-hover/herolink:-translate-y-0.5 group-hover/herolink:text-accent"
      />
    </>
  );
  return isExternal ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export interface CaseStudySectionProps {
  title: string;
  id?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CaseStudySection({
  title,
  id,
  collapsible,
  defaultOpen = false,
  children,
}: CaseStudySectionProps) {
  if (collapsible) {
    return (
      <CollapsibleSection title={title} id={id} defaultOpen={defaultOpen}>
        {children}
      </CollapsibleSection>
    );
  }
  return (
    <section id={id} className="mt-10 md:mt-14 scroll-mt-24">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export interface ArchitectureDiagramProps {
  ascii?: string;
  children?: ReactNode;
  caption?: string;
  label?: string;
}

export function ArchitectureDiagram({
  ascii,
  children,
  caption,
  label,
}: ArchitectureDiagramProps) {
  return (
    <figure className="my-4" aria-label={label}>
      <pre className="font-[var(--font-geist-mono)] text-xs sm:text-sm leading-snug overflow-x-auto rounded-lg border border-foreground/15 bg-foreground/[0.03] p-4 whitespace-pre">
        {ascii ?? children}
      </pre>
      {caption && (
        <figcaption className="mt-2 text-sm text-foreground/60">{caption}</figcaption>
      )}
    </figure>
  );
}

export interface KeySystemsGridProps {
  systems: Array<{
    title: string;
    description: ReactNode;
    icon?: ReactNode;
  }>;
}

export function KeySystemsGrid({ systems }: KeySystemsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {systems.map((s) => (
        <div
          key={s.title}
          className="rounded-lg border border-foreground/15 bg-foreground/[0.02] p-4 transition-colors hover:border-accent/40"
        >
          <div className="flex items-center gap-2 mb-2">
            {s.icon}
            <h3 className="text-accent font-semibold text-sm m-0">{s.title}</h3>
          </div>
          <p className="text-sm text-foreground/85 leading-snug m-0">{s.description}</p>
        </div>
      ))}
    </div>
  );
}

export { ScreenshotGrid } from "./ScreenshotGrid";
export type { ScreenshotGridProps } from "./ScreenshotGrid";

import { brandColor, type Skill } from "@/content/skills";

export interface StackChipsProps {
  /** Optional grouped layout (mirrors the home skills section). */
  groups?: { title: string; items: Skill[] }[];
  /** Flat list — used when a single ungrouped row is enough. */
  items?: Skill[];
}

function CaseStudyChip({ item }: { item: Skill }) {
  const Icon = item.icon;
  const iconColor = brandColor[item.label];
  const classes =
    "group/chip inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-foreground/15 bg-foreground/[0.02] text-[0.95rem] leading-none text-foreground transition-colors";
  const inner = (
    <>
      {Icon && (
        <Icon
          aria-hidden="true"
          size={16}
          className="shrink-0"
          style={iconColor ? { color: iconColor } : undefined}
        />
      )}
      <span className="underline decoration-2 underline-offset-4 decoration-transparent group-hover/chip:decoration-accent transition-colors">
        {item.label}
      </span>
    </>
  );
  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={classes}>
        {inner}
      </a>
    );
  }
  return <span className={classes}>{inner}</span>;
}

export function StackChips({ groups, items }: StackChipsProps) {
  if (groups?.length) {
    return (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground mb-3">
              {group.title}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <CaseStudyChip key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {(items ?? []).map((item) => (
        <CaseStudyChip key={item.label} item={item} />
      ))}
    </div>
  );
}

export function BackToProjects() {
  return (
    <Link
      href="/#projects"
      className="group/back inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground/[0.03] px-4 py-2 text-sm font-medium text-foreground/85 no-underline transition-colors hover:text-foreground hover:bg-foreground/[0.07] hover:border-foreground/35"
    >
      <FiArrowLeft
        aria-hidden="true"
        size={14}
        className="transition-[transform,color] duration-200 group-hover/back:-translate-x-0.5 group-hover/back:text-accent"
      />
      Back to projects
    </Link>
  );
}
