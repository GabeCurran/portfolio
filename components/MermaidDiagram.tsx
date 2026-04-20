"use client";
import { useEffect, useRef, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { FiZoomIn, FiZoomOut, FiMaximize, FiMinimize } from "react-icons/fi";
import { MdOutlineCenterFocusWeak } from "react-icons/md";

interface MermaidDiagramProps {
  source: string;
  caption?: string;
  ariaLabel?: string;
  /** Pixel height of the interactive viewport. Defaults to 520. */
  height?: number;
}

let initialized = false;

async function ensureMermaid() {
  const mermaid = (await import("mermaid")).default;
  if (!initialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "loose",
      themeVariables: {
        darkMode: true,
        background: "transparent",
        primaryColor: "rgba(237,237,237,0.04)",
        primaryTextColor: "#ededed",
        primaryBorderColor: "rgba(237,237,237,0.22)",
        clusterBkg: "rgba(237,237,237,0.018)",
        clusterBorder: "rgba(237,237,237,0.18)",
        titleColor: "rgba(237,237,237,0.55)",
        lineColor: "rgba(247,106,106,0.6)",
        edgeLabelBackground: "#2b2b2b",
        mainBkg: "rgba(237,237,237,0.04)",
        secondBkg: "rgba(237,237,237,0.07)",
        tertiaryBkg: "rgba(237,237,237,0.06)",
        secondaryColor: "rgba(237,237,237,0.06)",
        tertiaryColor: "rgba(237,237,237,0.05)",
        tertiaryBorderColor: "rgba(237,237,237,0.30)",
        secondaryBorderColor: "rgba(237,237,237,0.30)",
        secondaryTextColor: "#ededed",
        tertiaryTextColor: "#ededed",
        noteBkgColor: "rgba(237,237,237,0.05)",
        noteTextColor: "#ededed",
        noteBorderColor: "rgba(237,237,237,0.25)",
        textColor: "#ededed",
        nodeBorder: "rgba(237,237,237,0.22)",
        fontFamily:
          "var(--font-exo), system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: "14px",
      },
      flowchart: {
        curve: "basis",
        padding: 16,
        nodeSpacing: 50,
        rankSpacing: 70,
        htmlLabels: true,
        useMaxWidth: false,
      },
      sequence: {
        useMaxWidth: false,
        actorMargin: 60,
        boxMargin: 12,
        messageMargin: 38,
        mirrorActors: false,
        wrap: true,
      },
    });
    initialized = true;
  }
  return mermaid;
}

export default function MermaidDiagram({
  source,
  caption,
  ariaLabel,
  height = 520,
}: MermaidDiagramProps) {
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 11)}`);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = await ensureMermaid();
        const { svg: rendered } = await mermaid.render(idRef.current, source);
        if (!cancelled) setSvg(rendered);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to render diagram"
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source]);

  const fitAndCenter = (animationMs: number) => {
    const container = containerRef.current;
    const svgEl = renderRef.current?.querySelector("svg");
    if (!container || !svgEl) return;
    const vb = svgEl
      .getAttribute("viewBox")
      ?.split(/\s+/)
      .map(Number);
    const sw = vb?.[2] || svgEl.clientWidth || 1;
    const sh = vb?.[3] || svgEl.clientHeight || 1;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const scale = Math.max(0.2, Math.min(Math.min(cw / sw, ch / sh) * 0.95, 1));
    const x = (cw - sw * scale) / 2;
    const y = (ch - sh * scale) / 2;
    transformRef.current?.setTransform(x, y, scale, animationMs, "easeOut");
  };

  // After SVG mounts, fit it to the container and center it.
  useEffect(() => {
    if (!svg) return;
    const id = window.setTimeout(() => fitAndCenter(0), 50);
    return () => window.clearTimeout(id);
  }, [svg]);

  const fitView = () => fitAndCenter(250);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.().catch(() => {});
    }
  };

  // Re-fit after entering or exiting fullscreen so the diagram fills the new size.
  // Use rAF (no animation) so the diagram is already centered the first frame
  // the new container size is painted — no visible "snap into place" movement.
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
      requestAnimationFrame(() => fitAndCenter(0));
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <figure className="my-6">
      <div
        ref={containerRef}
        className="mermaid-fs-target relative rounded-lg border border-foreground/10 bg-foreground/[0.015] overflow-hidden"
        style={{ height }}
      >
        {error ? (
          <pre className="text-sm text-red-400 whitespace-pre-wrap p-4">
            {error}
          </pre>
        ) : svg ? (
          <>
            <TransformWrapper
              ref={transformRef}
              initialScale={1}
              minScale={0.25}
              maxScale={3}
              centerOnInit
              limitToBounds={false}
              wheel={{
                step: 0.0008,
                activationKeys: isFullscreen ? [] : ["Shift"],
              }}
              doubleClick={{ disabled: false, step: 0.25 }}
              panning={{ velocityDisabled: true }}
            >
              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{
                  transition: "transform 90ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                  willChange: "transform",
                }}
              >
                <div
                  ref={renderRef}
                  className="mermaid-render"
                  role="img"
                  aria-label={ariaLabel}
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </TransformComponent>
            </TransformWrapper>
            <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
              <ZoomButton
                onClick={() => transformRef.current?.zoomIn()}
                label="Zoom in"
              >
                <FiZoomIn size={14} />
              </ZoomButton>
              <ZoomButton
                onClick={() => transformRef.current?.zoomOut()}
                label="Zoom out"
              >
                <FiZoomOut size={14} />
              </ZoomButton>
              <ZoomButton onClick={fitView} label="Fit to view">
                <MdOutlineCenterFocusWeak size={16} />
              </ZoomButton>
              <ZoomButton
                onClick={toggleFullscreen}
                label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <FiMinimize size={14} /> : <FiMaximize size={14} />}
              </ZoomButton>
            </div>
            <div className="absolute bottom-2 left-2 text-[0.65rem] text-foreground/40 pointer-events-none select-none">
              {isFullscreen ? "scroll" : "shift + scroll"} to zoom · drag to pan · double-click to zoom in
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-foreground/40 text-sm">
            Loading diagram…
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="text-xs text-foreground/55 mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function ZoomButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-7 h-7 flex items-center justify-center rounded border border-foreground/15 bg-background/80 backdrop-blur-sm text-foreground/70 hover:text-accent hover:border-accent/40 transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}
