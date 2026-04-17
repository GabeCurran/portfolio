"use client";
import { useEffect, useMemo, useRef } from "react";
import { INTRO_PARAGRAPHS, HIGHLIGHT_TERMS, segmentParagraph, buildParagraphHTML, LINKS } from "@/content/typingIntro";
import { startLifespanSecondsTicker, estimateRemainingSeconds, formatInt, parseDob } from "./age";

declare global {
  interface Window { __gcTypingRunning?: boolean; __gcHomeTypedDone?: boolean }
}

// Dynamic typing with token-based highlights

export default function TypingIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tokensByParagraph = useMemo(() => INTRO_PARAGRAPHS.map(segmentParagraph), []);
  const builtParagraphs = useMemo(() => tokensByParagraph.map(buildParagraphHTML), [tokensByParagraph]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    let runCleanups: Array<() => void> = [];
    let completed = false;
    // If already typed in this session, render built content immediately
    const originalParagraphInit = containerRef.current?.querySelector<HTMLElement>(".originalParagraph");
    const typedParagraphsInit = containerRef.current?.querySelectorAll<HTMLElement>(".typedParagraph");
    if (typeof window !== "undefined" && window.__gcHomeTypedDone && typedParagraphsInit && typedParagraphsInit.length > 0) {
      if (originalParagraphInit) originalParagraphInit.style.display = "none";
      typedParagraphsInit.forEach((el, idx) => {
        if (builtParagraphs[idx] !== undefined) {
          el.innerHTML = builtParagraphs[idx];
        }
      });
      // Start ticker if placeholder exists
      typedParagraphsInit.forEach((el) => {
        const ph = el.querySelector<HTMLElement>(".life-seconds");
        if (ph) cleanups.push(startLifespanSecondsTicker(ph, { expectancyYears: 80, fps: 10 }));
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("home-typing-done"));
      }
      return;
    }

  // Guard against concurrent runs
    if (typeof window !== "undefined" && window.__gcTypingRunning) {
      return;
    }
    if (typeof window !== "undefined") {
      window.__gcTypingRunning = true;
    }

  let cancelled = false;
    let letterDelay = 12;
    let paragraphDelay = 125;

    const speedUp = () => {
      letterDelay = 5;
      paragraphDelay = 25;
    };

    // Track "impatience" impulses (scrolls/keys/touches) cumulatively and escalate speed
    let impulseCount = 0;
    let lastImpulseAt = 0;
    const MIN_IMPULSE_GAP_MS = 200; // debounce bursts from a single wheel gesture
    const setImpatienceLevel = (level: number) => {
      try {
        document.documentElement.dataset.impatience = String(level);
        document.documentElement.classList.toggle("impatient", level >= 1);
      } catch {}
    };
    const finalizeNow = () => {
      if (completed) return;
      completed = true;
      cancelled = true;
      // Stop any in-progress tickers before replacing content
      runCleanups.forEach((fn) => {
        try { fn(); } catch {}
      });
      runCleanups = [];

      const originalParagraph = containerRef.current?.querySelector<HTMLElement>(".originalParagraph");
      if (originalParagraph) originalParagraph.style.display = "none";

      const typedParagraphs = containerRef.current?.querySelectorAll<HTMLElement>(".typedParagraph");
      if (typedParagraphs && typedParagraphs.length > 0) {
        typedParagraphs.forEach((el, idx) => {
          if (builtParagraphs[idx] !== undefined) {
            el.innerHTML = builtParagraphs[idx];
          }
        });
        // Start ticker on rendered content
        typedParagraphs.forEach((el) => {
          const ph = el.querySelector<HTMLElement>(".life-seconds");
          if (ph) cleanups.push(startLifespanSecondsTicker(ph, { expectancyYears: 80, fps: 10 }));
        });
      }
      if (typeof window !== "undefined") {
        window.__gcHomeTypedDone = true;
        window.dispatchEvent(new CustomEvent("home-typing-done"));
      }
    };
    const registerImpulse = (opts?: { light?: boolean }) => {
      const now = (typeof performance !== "undefined" ? performance.now() : Date.now());
      if (opts?.light) {
        setImpatienceLevel(Math.max(1, Number(document.documentElement.dataset.impatience || 0)));
        speedUp();
        return;
      }
      if (now - lastImpulseAt < MIN_IMPULSE_GAP_MS) return; // debounce wheel bursts
      lastImpulseAt = now;
      impulseCount += 1;
      const level = Math.min(impulseCount, 2);
      setImpatienceLevel(level);
      if (impulseCount === 1) {
        // First attempt: go faster
        speedUp();
      } else if (impulseCount >= 2) {
        // Second attempt: instant complete
        finalizeNow();
      }
    };

    const onScroll = () => {
      if (window.scrollY > 200) {
        registerImpulse();
      }
    };
    const onWheel = () => {
      registerImpulse();
    };
    const onTouch = () => {
      registerImpulse();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        registerImpulse();
      }
    };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("touchstart", onTouch, { passive: true });
  window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("keydown", onKey);

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const run = async () => {
      const originalParagraph = containerRef.current?.querySelector<HTMLElement>(".originalParagraph");
      const typedParagraphs = containerRef.current?.querySelectorAll<HTMLElement>(".typedParagraph");
      if (!typedParagraphs || typedParagraphs.length === 0) return;

    // Hide original paragraph
      if (originalParagraph) originalParagraph.style.display = "none";

    // Ensure clean slate when returning to the page
  typedParagraphs.forEach((p) => (p.innerHTML = ""));

  const liveCleanups: Array<() => void> = [];
  runCleanups = liveCleanups;

      for (let pIndex = 0; pIndex < tokensByParagraph.length; pIndex++) {
        const pEl = typedParagraphs[pIndex];
        if (!pEl) break; // No corresponding DOM node
        const tokens = tokensByParagraph[pIndex];
        for (const token of tokens) {
          // Handle custom lifespan token: insert placeholder and start live ticker
          if (token === "[[LIFE_SECONDS]]") {
            const ph = document.createElement("span");
            ph.className = "life-seconds text-accent font-semibold";
            pEl.appendChild(ph);
            // Take a snapshot of the current remaining seconds and type it out
            const snapSecs = estimateRemainingSeconds(parseDob(undefined), 80);
            const snapText = formatInt(snapSecs);
            for (const ch of snapText) {
              if (cancelled) return;
              ph.append(document.createTextNode(ch));
              await sleep(letterDelay);
            }
            // After typing completes, start the live ticker updates
            const stop = startLifespanSecondsTicker(ph, { expectancyYears: 80, fps: 10 });
            liveCleanups.push(stop);
            continue;
          }
          const lower = token.toLowerCase();
          const highlightKey = HIGHLIGHT_TERMS.find((k) => k.toLowerCase() === lower);
          const linkKey = Object.keys(LINKS).find((k) => k.toLowerCase() === lower);

          if (highlightKey) {
            const classAttr = "highlighted";

            const wrapper = document.createElement("span");
            wrapper.className = classAttr;
            pEl.appendChild(wrapper);

            for (const ch of token) {
              if (cancelled) return;
              wrapper.append(document.createTextNode(ch));
              await sleep(letterDelay);
            }

            if (linkKey) {
              const entry = LINKS[linkKey];
              const cfg = typeof entry === "string" ? { href: entry } : entry;
              const a = document.createElement("a");
              a.href = cfg.href;
              if (cfg.className) {
                a.className = Array.isArray(cfg.className) ? cfg.className.join(" ") : cfg.className;
              }
              a.target = cfg.target ?? "_blank";
              a.rel = cfg.rel ?? "noreferrer";
              a.textContent = token;
              // Replace wrapper content with the anchor
              wrapper.innerHTML = "";
              wrapper.appendChild(a);
            }
          } else {
            for (const ch of token) {
              if (cancelled) return;
              pEl.append(document.createTextNode(ch));
              await sleep(letterDelay);
            }
          }
        }
        await sleep(paragraphDelay);
        if (cancelled) return;
      }

      // Stop any in-progress tickers before replacing content
      liveCleanups.forEach((fn) => {
        try { fn(); } catch {}
      });
      liveCleanups.length = 0;

      // Replace with fully built paragraphs
      typedParagraphs.forEach((el, idx) => {
        if (builtParagraphs[idx] !== undefined) {
          el.innerHTML = builtParagraphs[idx];
        }
      });
      // Start ticker on rendered content
      typedParagraphs.forEach((el) => {
        const ph = el.querySelector<HTMLElement>(".life-seconds");
        if (ph) cleanups.push(startLifespanSecondsTicker(ph, { expectancyYears: 80, fps: 10 }));
      });
      if (typeof window !== "undefined") {
        window.__gcHomeTypedDone = true;
        window.dispatchEvent(new CustomEvent("home-typing-done"));
      }
    };

    const start = () => run();
    if (typeof window !== "undefined") {
      let started = false;
      const kickOff = () => { if (!started) { started = true; start(); } };
      // If preload already done, start; else wait for event
      if (!document.documentElement.classList.contains('preload')) {
        // Allow body fade a moment
        setTimeout(kickOff, 0);
      } else {
        const onReady = () => { kickOff(); window.removeEventListener('site-preload-done', onReady as EventListener); };
        window.addEventListener('site-preload-done', onReady as EventListener);
      }
    }

    return () => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("wheel", onWheel);
  window.removeEventListener("touchstart", onTouch);
  window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("keydown", onKey);
      cancelled = true;
      if (typeof window !== "undefined") {
        window.__gcTypingRunning = false;
      }
      // Stop any active tickers
      runCleanups.forEach((fn) => { try { fn(); } catch {} });
      cleanups.forEach((fn) => { try { fn(); } catch {} });
    };
  }, [builtParagraphs, tokensByParagraph]);

  return (
    <section id="intro" ref={containerRef} className="flex flex-col items-center text-center gap-4">
      <h1 id="myName" className="text-4xl sm:text-5xl font-bold hover:text-accent">Gabe Curran</h1>
  <h2 className="text-sm sm:text-xl font-bold whitespace-nowrap">B.S. in Computer Science from <a href="https://www.drexel.edu/" target="_blank" rel="noreferrer" className="college drexel">Drexel University</a></h2>
  <h2 className="text-sm sm:text-xl font-bold whitespace-nowrap">A.A.S. in Software Engineering from <a href="https://stevenscollege.edu/" target="_blank" rel="noreferrer" className="college tsct">TSCT</a></h2>
      <div id="infoP" className="w-full max-w-4xl sm:max-w-4xl md:max-w-4xl mx-auto text-left mt-3 sm:mt-4 space-y-3 sm:space-y-4">
        {/* Fallback paragraph for no-JS; mirrors first intro paragraph */}
        <p className="originalParagraph text-lg sm:text-xl" dangerouslySetInnerHTML={{ __html: builtParagraphs[0] ?? "" }} />
        {INTRO_PARAGRAPHS.map((_, idx) => (
          <p key={idx} className="typedParagraph text-lg sm:text-xl" />
        ))}
      </div>
    </section>
  );
}
