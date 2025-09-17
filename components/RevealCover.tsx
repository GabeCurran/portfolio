"use client";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window { __gcHomeTypedDone?: boolean }
}

export default function RevealCover() {
  const coverRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.__gcHomeTypedDone) {
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
      el.style.transform = "translateX(100%)";
      el.style.transition = "transform 1.75s ease-in-out";
      const timeout = setTimeout(() => setHidden(true), 1800);
      return () => clearTimeout(timeout);
    };

    window.addEventListener("home-typing-done", onDone as EventListener);
    return () => {
      window.removeEventListener("home-typing-done", onDone as EventListener);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      if (ro) ro.disconnect();
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={coverRef}
      aria-hidden="true"
      className="revealCover fixed left-0 right-0 top-[var(--cover-top,0px)] z-30 h-[var(--cover-height,0px)] bg-background"
      style={{ transform: "translateX(0)" }}
    >
      <span className="sr-only">Loading intro…</span>
    </div>
  );
}
