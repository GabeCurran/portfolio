"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  url: string; // any YouTube URL (watch, share, or embed)
  title?: string;
  className?: string;
};

function parseYouTubeId(input: string): string | null {
  try {
    const url = new URL(input);
    // youtu.be/<id>
    if (url.hostname.endsWith("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0] ?? null;
    }
    // youtube.com/watch?v=<id>
    if (url.searchParams.get("v")) return url.searchParams.get("v");
    // youtube.com/embed/<id>
    const parts = url.pathname.split("/").filter(Boolean);
    const embedIdx = parts.indexOf("embed");
    if (embedIdx !== -1 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    return null;
  } catch {
    return null;
  }
}

export default function YouTubeEmbed({ url, title = "YouTube video", className }: Props) {
  const vid = useMemo(() => parseYouTubeId(url), [url]);
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Only render the iframe once it enters viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
          break;
        }
      }
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // If Safari/iOS shows a black frame occasionally on refresh, remount the iframe once.
  useEffect(() => {
    if (!isVisible || loaded) return;
    const t = setTimeout(() => {
      if (!loaded) setRetryKey((k) => k + 1);
    }, 2000);
    return () => clearTimeout(t);
  }, [isVisible, loaded]);

  const src = useMemo(() => {
    if (!vid) return url; // fallback to given URL if parsing failed
    const base = `https://www.youtube-nocookie.com/embed/${vid}`;
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      enablejsapi: "1",
    });
    if (typeof window !== "undefined" && window.location?.origin) {
      params.set("origin", window.location.origin);
    }
    return `${base}?${params.toString()}`;
  }, [vid, url]);

  return (
    <div ref={containerRef} className={className}>
      {isVisible ? (
        <iframe
          key={retryKey}
          title={title}
          src={src}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
        />
      ) : null}
    </div>
  );
}
