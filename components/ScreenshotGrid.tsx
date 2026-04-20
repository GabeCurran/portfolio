"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

export interface ScreenshotGridImage {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

export interface ScreenshotGridProps {
  images: ScreenshotGridImage[];
  columns?: 1 | 2 | 3 | 4;
}

export function ScreenshotGrid({ images, columns = 3 }: ScreenshotGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<"closed" | "opening" | "open" | "closing">(
    "closed"
  );

  const open = useCallback((i: number) => {
    setActiveIndex(i);
    setPhase("opening");
    // next frame: flip to open so transitions run
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("open"));
    });
  }, []);

  const close = useCallback(() => {
    setPhase("closing");
    setTimeout(() => {
      setActiveIndex(null);
      setPhase("closed");
    }, 200);
  }, []);

  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? i : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("lightbox-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.documentElement.classList.remove("lightbox-open");
    };
  }, [activeIndex, close, next, prev]);

  const colClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 4
      ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-2 sm:grid-cols-3";

  const thumbSizes =
    columns === 1
      ? "100vw"
      : columns === 2
      ? "(min-width: 640px) 50vw, 100vw"
      : columns === 4
      ? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
      : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

  const active = activeIndex === null ? null : images[activeIndex];

  return (
    <>
      <div className={`grid ${colClass} gap-4 mt-4`}>
        {images.map((img, i) => (
          <figure
            key={img.src + i}
            className="m-0 rounded-lg overflow-hidden border border-foreground/15 bg-foreground/[0.02]"
          >
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Open ${img.alt} in full view`}
              className="group block w-full cursor-zoom-in overflow-hidden"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes={thumbSizes}
                className="w-full h-auto block transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              />
            </button>
            {img.caption && (
              <figcaption className="px-3 py-2 text-sm text-foreground/60 border-t border-foreground/10">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={close}
          data-phase={phase}
          className="screenshot-lightbox fixed z-[100] flex items-center justify-center p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close"
            className="lightbox-btn absolute top-5 right-5 z-10"
          >
            <FiX size={20} />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous screenshot"
                className="lightbox-btn absolute left-5 top-1/2 -translate-y-1/2 z-10"
              >
                <FiChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next screenshot"
                className="lightbox-btn absolute right-5 top-1/2 -translate-y-1/2 z-10"
              >
                <FiChevronRight size={22} />
              </button>
            </>
          )}
          <figure
            className="screenshot-lightbox-figure relative m-0 max-w-[95vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={activeIndex}
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              sizes="95vw"
              priority
              className="block w-auto h-auto max-w-[90vw] max-h-[82vh] sm:max-w-[85vw] rounded-lg shadow-2xl lightbox-swap"
            />
            {active.caption && (
              <figcaption
                key={`cap-${activeIndex}`}
                className="mt-3 text-center text-sm text-foreground/75 lightbox-swap"
              >
                {active.caption}
              </figcaption>
            )}
          </figure>
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-foreground/20 bg-foreground/[0.03] backdrop-blur-sm px-3 py-1 text-xs font-medium text-foreground/80 tabular-nums">
              {activeIndex! + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
