"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window { __gcHomeTypedDone?: boolean }
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [ready, setReady] = useState(!isHome);

  useEffect(() => {
    if (!isHome) return; // Show immediately on non-home routes
    if (typeof window === "undefined") return;
    if (window.__gcHomeTypedDone) {
      setReady(true);
      return;
    }
    const onDone = () => setReady(true);
    window.addEventListener("home-typing-done", onDone as EventListener);
    return () => window.removeEventListener("home-typing-done", onDone as EventListener);
  }, [isHome]);

  const NavLink = ({ targetId, label }: { targetId: string; label: string }) => {
    const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
      const isHome = pathname === "/";
      if (!isHome) return; // let Link handle navigation if not on home
      e.preventDefault();
      const start = window.scrollY;
  const offset = window.innerWidth >= 640 ? 24 : 16; // breathing room under nav
      const targetTop =
        targetId === "home"
          ? 0
          : Math.max(
              0,
              (document.getElementById(targetId)?.getBoundingClientRect().top ?? 0) + window.scrollY - offset
            );

      const distance = targetTop - start;
      const duration = Math.min(1200, Math.max(500, Math.abs(distance) * 0.6));
      let startTime: number | null = null;

      const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

      const step = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = easeInOutSine(t);
        window.scrollTo(0, start + distance * eased);
        if (t < 1) requestAnimationFrame(step);
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
        className={`inline-flex items-center whitespace-nowrap px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base transition-colors hover:text-[#a33131]`}
        aria-current={undefined}
      >
        {label}
      </Link>
    );
  };
  return (
    <header
      className={`relative z-40 flex items-center justify-center h-16 sm:h-18 md:h-20 transition-all duration-700 ${
        ready ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none select-none"
      }`}
    >
      <nav className="w-full">
        <div className="mx-auto sectionContainer">
          <div className="mx-auto w-fit border-b-2 border-accent pb-1.5 sm:pb-2.5 px-3">
            <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-6">
              <NavLink targetId="home" label="Home" />
              <NavLink targetId="projects" label="Projects" />
              <NavLink targetId="skills" label="Skills" />
              <NavLink targetId="contact" label="Contact" />
              <a
                href="/GabeCurranResume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center whitespace-nowrap px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base transition-colors hover:text-[#a33131]"
                aria-label="Resume"
              >
                Resume
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
