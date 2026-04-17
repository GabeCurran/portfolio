"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window { __gcHomeTypedDone?: boolean }
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [ready, setReady] = useState(!isHome);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isHome) return;
    if (typeof window === "undefined") return;
    if (window.__gcHomeTypedDone) {
      setReady(true);
      return;
    }
    const onDone = () => setReady(true);
    window.addEventListener("home-typing-done", onDone as EventListener);
    return () => window.removeEventListener("home-typing-done", onDone as EventListener);
  }, [isHome]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NavLink = ({ targetId, label }: { targetId: string; label: string }) => {
    const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
      const isHome = pathname === "/";
      if (!isHome) return;
      e.preventDefault();
      const start = window.scrollY;
      // Account for sticky header's actual rendered height + breathing room.
      const headerH = headerRef.current?.getBoundingClientRect().height ?? 48;
      const offset = headerH + 16;
      const targetTop =
        targetId === "home"
          ? 0
          : Math.max(
              0,
              (document.getElementById(targetId)?.getBoundingClientRect().top ?? 0) + window.scrollY - offset
            );

  const distance = targetTop - start;
  const width = window.innerWidth;
  const isCoarse = (typeof window !== "undefined" && (window.matchMedia?.('(pointer: coarse)')?.matches ?? false));
  let speedFactor: number;
  let minDur: number;
  let maxDur: number;
  if (isCoarse || width < 640) {
    speedFactor = 0.35;
    minDur = 120;
    maxDur = 280;
  } else if (width < 1024) {
    speedFactor = 0.7;
    minDur = 260;
    maxDur = 900;
  } else if (width < 1536) {
    speedFactor = 0.9;
    minDur = 360;
    maxDur = 1200;
  } else {
    speedFactor = 1.05;
    minDur = 420;
    maxDur = 1600;
  }
  const absDist = Math.abs(distance);
  const base = absDist * speedFactor;
  let longMult = 1;
  if (absDist > 3500) longMult = 1.5;
  else if (absDist > 2000) longMult = 1.25;
  const duration = Math.min(maxDur, Math.max(minDur, base * longMult));
      let startTime: number | null = null;
      let impatienceCount = 0;
      let lastImpulse = 0;
      const onImpulse = () => {
        const now = performance?.now?.() ?? Date.now();
        if (now - lastImpulse < 200) return;
        lastImpulse = now;
        impatienceCount += 1;
      };
      window.addEventListener("wheel", onImpulse, { passive: true });
      window.addEventListener("touchstart", onImpulse, { passive: true });
      window.addEventListener("keydown", onImpulse);

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const step = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const extraAccel = impatienceCount >= 2 ? 1.6 : impatienceCount === 1 ? 1.15 : 1;
        const elapsed = (timestamp - startTime) * extraAccel;
        const t = Math.min(1, elapsed / duration);
        const eased = easeOutCubic(t);
        window.scrollTo(0, start + distance * eased);
        if (t < 1) requestAnimationFrame(step);
        else {
          window.removeEventListener("wheel", onImpulse as EventListener);
          window.removeEventListener("touchstart", onImpulse as EventListener);
          window.removeEventListener("keydown", onImpulse as EventListener);
        }
      };

      requestAnimationFrame(step);

    };

    const isHome = pathname === "/";
    const href = isHome ? `#${targetId}` : `/#${targetId}`;

    return (
      <Link
        href={href}
        prefetch={false}
        onClick={onClick}
        className={`inline-flex items-center whitespace-nowrap px-2 sm:px-4 py-3 sm:py-2 text-sm sm:text-base transition-colors hover:text-[#a33131]`}
        aria-current={undefined}
      >
        {label}
      </Link>
    );
  };
  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 flex items-center justify-center bg-background overflow-x-clip transition-all duration-700 ${
        ready ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none select-none"
      }`}
    >
      <nav className="w-full">
        <div className="mx-auto sectionContainer">
          <div className="mx-auto w-fit relative pt-2 md:pt-0 pb-0.5 px-3">
            <div className="flex flex-nowrap items-center justify-center gap-1 sm:gap-6">
              <NavLink targetId="projects" label="Projects" />
              <NavLink targetId="skills" label="Skills" />
              <NavLink targetId="contact" label="Contact" />
              <a
                href="/GabeCurranResume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center whitespace-nowrap px-1.5 sm:px-4 py-3 sm:py-2 text-sm sm:text-base transition-colors hover:text-[#a33131]"
                aria-label="Resume"
              >
                Resume
              </a>
            </div>
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] bg-accent transition-[width] duration-500 ease-out hidden md:block ${
                scrolled ? "w-full md:w-screen" : "w-full"
              }`}
            />
          </div>
        </div>
      </nav>
      <div
        aria-hidden="true"
        className="md:hidden pointer-events-none absolute bottom-0 left-4 right-4 h-[2px] bg-accent"
      />
    </header>
  );
}
