"use client";
import { useEffect, useState } from "react";
import Divider from "./Divider";
import ProjectsGrid from "./ProjectsGrid";
import SkillsSection from "./SkillsSection";
import { hasRecentHomeIntro } from "@/lib/homeIntroCookie";

declare global {
  interface Window { __gcHomeTypedDone?: boolean }
}

export default function DeferredHomeSections() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__gcHomeTypedDone || hasRecentHomeIntro()) {
      window.__gcHomeTypedDone = true;
      setReady(true);
      return;
    }
    const onDone = () => setReady(true);
    window.addEventListener("home-typing-done", onDone as EventListener);
    return () => window.removeEventListener("home-typing-done", onDone as EventListener);
  }, []);

  // When we become ready and a hash is present (e.g. /#projects from a case study),
  // scroll to it, since the anchored element didn't exist during the browser's initial scroll.
  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    const id = hash.slice(1);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }, [ready]);

  return (
    <div
      aria-hidden={!ready}
      className={`transition-opacity duration-500 ${
        ready ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <Divider className="mx-auto sectionContainer" />
      <ProjectsGrid />
      <Divider className="mx-auto sectionContainer" />
      <SkillsSection />
    </div>
  );
}
