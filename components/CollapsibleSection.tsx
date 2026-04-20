"use client";

import { useId, useState, type ReactNode } from "react";
import { FiChevronRight } from "react-icons/fi";

export interface CollapsibleSectionProps {
  title: string;
  id?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({
  title,
  id,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const autoId = useId();
  const panelId = `collapsible-${autoId}`;

  return (
    <section id={id} className="mt-10 md:mt-14 scroll-mt-24">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="group/summary inline-flex items-baseline gap-2.5 cursor-pointer bg-transparent border-0 p-0 text-left"
      >
        <h2 className="m-0 transition-colors group-hover/summary:text-accent/80">
          {title}
        </h2>
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center rounded-full border border-foreground/25 bg-foreground/[0.04] w-6 h-6 text-foreground/70 transition-colors group-hover/summary:text-foreground group-hover/summary:border-foreground/50 -translate-y-[0.25em]"
        >
          <FiChevronRight
            size={13}
            className={`shrink-0 transition-transform duration-300 ${
              open ? "rotate-90" : "rotate-0"
            }`}
          />
        </span>
      </button>
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="overflow-hidden min-h-0">{children}</div>
      </div>
    </section>
  );
}
