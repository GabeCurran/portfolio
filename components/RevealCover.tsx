"use client";
import { useEffect, useRef, useState } from "react";
import { hasRecentHomeIntro } from "@/lib/homeIntroCookie";

declare global {
  interface Window { __gcHomeTypedDone?: boolean }
}

export default function RevealCover() {
  const coverRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.__gcHomeTypedDone || hasRecentHomeIntro()) {
      window.__gcHomeTypedDone = true;
      setHidden(true);
      return;
    }

    const syncMeasurements = () => {
      const intro = document.getElementById("intro");
      const el = coverRef.current;
      if (!intro || !el) return;
      const rect = intro.getBoundingClientRect();
      const top = Math.max(0, Math.round(rect.bottom));
      const height = Math.max(0, Math.round(window.innerHeight - rect.bottom));
      el.style.setProperty("--cover-top", `${top}px`);
      el.style.setProperty("--cover-height", `${height}px`);
    };

    syncMeasurements();
    const onResize = () => syncMeasurements();
  const onScroll = () => syncMeasurements();
    window.addEventListener("resize", onResize);
  window.addEventListener("scroll", onScroll, { passive: true });

    let ro: ResizeObserver | undefined;
    const introEl = document.getElementById("intro");
    if (introEl && "ResizeObserver" in window) {
      ro = new ResizeObserver(() => syncMeasurements());
      ro.observe(introEl);
    }

    const onDone = () => {
      const el = coverRef.current;
      if (!el) return;
      const impatience = Number(document.documentElement.dataset.impatience || 0);
      const width = window.innerWidth;
      let baseDur: number;
      if (width < 640) baseDur = 1100;
      else if (width < 1024) baseDur = 1100;
      else if (width < 1536) baseDur = 950;
      else baseDur = 800;
      const duration = impatience >= 2 ? 500 : baseDur;
      el.style.transform = "translateX(100%)";
      el.style.transition = `transform ${duration}ms ease-in-out`;
      const timeout = setTimeout(() => setHidden(true), duration + 50);
      return () => clearTimeout(timeout);
    };

    window.addEventListener("home-typing-done", onDone as EventListener);
    // If user double-scrolls/presses before typing finishes, collapse sooner
    const onImpulse = () => {
      const level = Number(document.documentElement.dataset.impatience || 0);
      if (level >= 2) {
        // accelerate slide if it triggers later
        // No immediate action if typing not done; onDone will pick shorter duration
      }
    };
    window.addEventListener("wheel", onImpulse, { passive: true });
    window.addEventListener("keydown", onImpulse);
    window.addEventListener("touchstart", onImpulse, { passive: true });
    window.addEventListener("touchmove", onImpulse, { passive: true });
    return () => {
      window.removeEventListener("home-typing-done", onDone as EventListener);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onImpulse);
      window.removeEventListener("keydown", onImpulse);
      window.removeEventListener("touchstart", onImpulse);
      window.removeEventListener("touchmove", onImpulse);
      if (ro) ro.disconnect();
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={coverRef}
      aria-hidden="true"
      className="revealCover fixed left-0 right-0 top-(--cover-top,0px) z-30 h-(--cover-height,0px) bg-background"
      style={{ transform: "translateX(0)" }}
    >
      <span className="sr-only">Loading intro…</span>
    </div>
  );
}
