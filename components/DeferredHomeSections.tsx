"use client";
import { useEffect, useState } from "react";
import Divider from "./Divider";
import ProjectsGrid from "./ProjectsGrid";
import SkillsSection from "./SkillsSection";

declare global {
  interface Window { __gcHomeTypedDone?: boolean }
}

export default function DeferredHomeSections() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__gcHomeTypedDone) {
      setReady(true);
      return;
    }
    const onDone = () => setReady(true);
    window.addEventListener("home-typing-done", onDone as EventListener);
    return () => window.removeEventListener("home-typing-done", onDone as EventListener);
  }, []);

  if (!ready) return null;

  return (
    <>
  <Divider className="mx-auto sectionContainer" />
      <ProjectsGrid />
  <Divider className="mx-auto sectionContainer" />
      <SkillsSection />
    </>
  );
}
