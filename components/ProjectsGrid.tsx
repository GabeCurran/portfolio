"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import YouTubeEmbed from "./YouTubeEmbed";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Project = {
  title: string;
  url?: string; // iframe-able demo
  embedUrl?: string; // optional iframe URL distinct from link target
  description: string;
  dateRange?: string;
  images?: string[]; // static images under /public
};

export default function ProjectsGrid() {
  const projects: Project[] = useMemo(
    () => [
      {
        title: "LingoLyrics",
        url: "https://lingolyrics.vercel.app/",
        description:
          "Lyric Translations & Annotations\nBuilt using TypeScript Next.js, Tailwind CSS, OpenAI's API, and other APIs.",
        dateRange: "Jul 2025 - Present",
      },
      {
        title: "Starworks Studios",
        url: "https://www.starworks-studios.com/",
        embedUrl: "https://www.youtube.com/embed/d1YAIFKTK7Q",
        description:
          "Unity game developed with a team of students at Drexel University.\nI worked on early game design and core networking code.",
        dateRange: "May 2024 - Present",
      },
      {
        title: "PokeDnD (Preview)",
        description:
          "UI flows, data modeling, and component architecture.\nBuilt with TypeScript Next.js, Tailwind CSS, Prisma, PostgreSQL, etc.",
        dateRange: "Sep 2025 - Present",
        images: [
          "/img/pokednd/pokednd1.png",
          "/img/pokednd/pokednd2.png",
          "/img/pokednd/pokednd3.png",
          "/img/pokednd/pokednd4.png",
          "/img/pokednd/pokednd5.png",
          "/img/pokednd/pokednd6.png",
          "/img/pokednd/pokednd7.png",
        ],
      },
      {
        title: "Senior Care App",
        url: "https://care-of-yore.herokuapp.com/",
        description:
          "Features roles, permissions, data management, etc.\nBuilt with PHP Laravel, MySQL, Tailwind CSS, and JS",
        dateRange: "Dec 2021 - Dec 2021",
      }
    ],
    []
  );

  // Refs and state to equalize description heights per row on desktop
  const textRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [equalHeights, setEqualHeights] = useState<number[] | null>(null);

  useEffect(() => {
    const measure = () => {
      const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches; // md and up
      if (!isDesktop) {
        setEqualHeights(null);
        return;
      }
      const len = projects.length;
      const heights: number[] = new Array(len).fill(0);
      for (let i = 0; i < len; i += 2) {
        const h1 = textRefs.current[i]?.offsetHeight ?? 0;
        const h2 = textRefs.current[i + 1]?.offsetHeight ?? 0;
        const rowMax = Math.max(h1, h2);
        heights[i] = rowMax;
        if (i + 1 < len) heights[i + 1] = rowMax;
      }
      setEqualHeights(heights);
    };

    // Initial measure after mount and when fonts/assets settle
    const onLoad = () => measure();
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", onLoad);
    };
  }, [projects.length]);

  return (
  <section id="projects" aria-label="Projects" className="mx-auto sectionContainer mt-10">
  <div className="grid gap-6 sm:gap-7 md:gap-8 grid-cols-1 md:grid-cols-2">
        {projects.map((p, i) => (
          <article key={p.title} className="relative flex flex-col gap-3">
            <div
              ref={(el) => {
                textRefs.current[i] = el;
              }}
              className="projectText text-center space-y-1 flex flex-col justify-end min-h-28 sm:min-h-28 md:min-h-28"
              style={equalHeights?.[i] ? { height: equalHeights[i] } : undefined}
            >
              <h3 className="text-lg sm:text-xl font-semibold">
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="groupMates underline underline-offset-2"
                    aria-label={`Open ${p.title} in a new tab`}
                  >
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
              </h3>
              {p.dateRange ? (
                <p className="text-[0.8rem] sm:text-xs text-foreground/70">{p.dateRange}</p>
              ) : null}
              <p className="text-left text-sm sm:text-base text-foreground/85 whitespace-pre-line leading-snug">
                {p.description}
              </p>
            </div>
            {p.images && p.images.length > 0 ? (
              <div className="relative w-full h-[42vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh] xl:h-[58vh]">
                <Gallery title={p.title} images={p.images} />
              </div>
            ) : p.embedUrl || p.url ? (
              <div className="relative w-full h-[42vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh] xl:h-[58vh]">
                {p.embedUrl?.includes("youtube") || p.url?.includes("youtube") || p.embedUrl?.includes("youtu.be") || p.url?.includes("youtu.be") ? (
                  <YouTubeEmbed
                    url={(p.embedUrl ?? p.url)!}
                    title={p.title}
                    className="absolute inset-0 w-full h-full border border-foreground rounded"
                  />
                ) : (
                  <iframe
                    src={p.embedUrl ?? p.url}
                    className="absolute inset-0 w-full h-full border border-foreground rounded"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function Gallery({ title, images }: { title: string; images: string[] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const total = images.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40;
    if (delta > threshold) prev();
    if (delta < -threshold) next();
    touchStartX.current = null;
  };

  return (
    <div
      className="group absolute inset-0 w-full h-full border border-foreground rounded overflow-hidden bg-background"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-300"
        style={{ transform: `translateX(-${(index * 100) / total}%)`, width: `${total * 100}%` }}
        aria-live="polite"
      >
        {images.map((src, idx) => (
          <div
            key={`${title}-img-${idx}`}
            className="relative h-full shrink-0"
            style={{ width: `${100 / total}%` }}
          >
            <Image
              src={src}
              alt={`${title} screenshot ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 48vw, 100vw"
              quality={90}
              priority={idx === 0}
              draggable={false}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous image"
        className="gallery-control absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 md:h-11 md:w-11 rounded-full bg-background/70 border border-foreground/20 text-foreground shadow-sm hover:bg-background/90 hover:shadow transition focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
      >
        <FiChevronLeft size={20} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next image"
        className="gallery-control absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 md:h-11 md:w-11 rounded-full bg-background/70 border border-foreground/20 text-foreground shadow-sm hover:bg-background/90 hover:shadow transition focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
      >
        <FiChevronRight size={20} aria-hidden="true" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={`dot-${i}`}
            type="button"
            aria-label={`Go to image ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => setIndex(i)}
            className={
              "h-3 w-3 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background cursor-pointer " +
              (i === index
                ? "bg-background border-background"
                : "bg-background/20 border-foreground/30 hover:bg-background/40")
            }
          />
        ))}
      </div>
    </div>
  );
}
