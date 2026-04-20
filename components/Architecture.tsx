import type { ReactNode } from "react";
import { Children, isValidElement } from "react";
import { FiArrowDown } from "react-icons/fi";

export function Architecture({ children }: { children: ReactNode }) {
  return <div className="my-6 flex flex-col gap-2">{children}</div>;
}

interface ArchitectureLayerProps {
  label?: string;
  outlined?: boolean;
  columns?: 1 | 2 | 3;
  children: ReactNode;
}

export function ArchitectureLayer({
  label,
  outlined,
  columns = 1,
  children,
}: ArchitectureLayerProps) {
  const colClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const containerClass = outlined
    ? "rounded-xl border border-accent/25 bg-accent/[0.025] p-3 sm:p-4"
    : "";

  return (
    <div className={containerClass}>
      {label && (
        <div
          className={`text-[0.65rem] sm:text-xs font-medium tracking-wide mb-2 ${
            outlined ? "text-accent/80" : "text-foreground/55"
          }`}
        >
          {label}
        </div>
      )}
      <div className={`grid ${colClass} gap-2`}>{children}</div>
    </div>
  );
}

type NodeVariant = "default" | "muted" | "edge" | "accent" | "data";

interface ArchitectureNodeProps {
  title: string;
  subtitle?: string;
  detail?: ReactNode;
  variant?: NodeVariant;
  icon?: ReactNode;
}

const nodeToneByVariant: Record<NodeVariant, string> = {
  default: "border-foreground/15 bg-foreground/[0.03]",
  muted: "border-foreground/10 bg-foreground/[0.015]",
  edge: "border-foreground/25 bg-foreground/[0.06]",
  accent: "border-accent/45 bg-accent/[0.05]",
  data: "border-foreground/25 bg-foreground/[0.05]",
};

export function ArchitectureNode({
  title,
  subtitle,
  detail,
  variant = "default",
  icon,
}: ArchitectureNodeProps) {
  const tone = nodeToneByVariant[variant];
  const titleTone = variant === "accent" ? "text-accent" : "text-foreground";

  return (
    <div
      className={`rounded-lg border px-3 py-2 sm:px-4 sm:py-2.5 flex items-start gap-2.5 leading-tight ${tone}`}
    >
      {icon && (
        <span
          className={`mt-0.5 shrink-0 ${
            variant === "accent" ? "text-accent" : "text-foreground/60"
          }`}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <div className="flex flex-col min-w-0">
        <span className={`text-sm font-medium ${titleTone}`}>{title}</span>
        {subtitle && (
          <span className="text-[0.7rem] sm:text-xs text-foreground/55 mt-0.5">
            {subtitle}
          </span>
        )}
        {detail && (
          <span className="text-[0.7rem] sm:text-xs text-foreground/65 font-[var(--font-geist-mono)] mt-1 break-words">
            {detail}
          </span>
        )}
      </div>
    </div>
  );
}

interface ArchitectureConnectorProps {
  label?: string;
  bidirectional?: boolean;
}

export function ArchitectureConnector({
  label,
  bidirectional,
}: ArchitectureConnectorProps) {
  return (
    <div className="flex flex-col items-center py-1" aria-hidden="true">
      {bidirectional && (
        <FiArrowDown className="text-accent/70 rotate-180" size={14} />
      )}
      <div className="w-px h-2 bg-accent/40" />
      <FiArrowDown className="text-accent/70" size={14} />
      {label && (
        <span className="text-[0.7rem] sm:text-xs text-foreground/55 mt-0.5 font-medium">
          {label}
        </span>
      )}
    </div>
  );
}

interface ArchitectureBranchProps {
  children: ReactNode; // ArchitectureBranchArm elements
}

/**
 * Renders a fan-out from one parent to N parallel arms.
 * Desktop: fork connector + arms side-by-side in equal columns.
 * Mobile: arms stack vertically, each with its own down-connector + label.
 */
export function ArchitectureBranch({ children }: ArchitectureBranchProps) {
  const arms = Children.toArray(children).filter(isValidElement);
  const armCount = arms.length;
  if (armCount === 0) return null;

  const gridColsClass =
    armCount === 2
      ? "md:grid-cols-2"
      : armCount === 3
      ? "md:grid-cols-3"
      : armCount === 4
      ? "md:grid-cols-4"
      : "md:grid-cols-2";

  return (
    <div className="flex flex-col">
      {/* Desktop: fork + labels row + arms */}
      <div className="hidden md:block">
        <Fork armCount={armCount} />
        <div className={`grid ${gridColsClass} gap-x-3`}>
          {arms.map((arm, i) => {
            const label = (arm.props as ArchitectureBranchArmProps).label;
            return (
              <div
                key={i}
                className="text-center text-[0.7rem] sm:text-xs text-foreground/55 font-medium -mt-1 mb-1"
              >
                {label}
              </div>
            );
          })}
        </div>
        <div className={`grid ${gridColsClass} gap-x-3 gap-y-2`}>
          {arms.map((arm, i) => (
            <div key={i} className="flex flex-col gap-2 min-w-0">
              {(arm.props as ArchitectureBranchArmProps).children}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: stacked arms, each with its own labeled connector */}
      <div className="md:hidden flex flex-col gap-2">
        {arms.map((arm, i) => {
          const { label, children: armChildren } =
            arm.props as ArchitectureBranchArmProps;
          return (
            <div key={i} className="flex flex-col gap-2">
              <ArchitectureConnector label={label} />
              {armChildren}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ArchitectureBranchArmProps {
  label?: string;
  children: ReactNode;
}

/**
 * A single arm under an ArchitectureBranch. The `label` annotates
 * the connector leading into this arm (e.g. "publishes", "calls").
 */
export function ArchitectureBranchArm(_props: ArchitectureBranchArmProps) {
  // Rendered by ArchitectureBranch; this wrapper exists so the JSX reads cleanly.
  return null;
}

function Fork({ armCount }: { armCount: number }) {
  // Arm centers as percentages (match the grid: each arm occupies 1/N of the row).
  const positions = Array.from(
    { length: armCount },
    (_, i) => ((i + 0.5) / armCount) * 100
  );
  const first = positions[0];
  const last = positions[armCount - 1];
  const stemHeight = 14; // px, vertical stub from parent node
  const barToArmHeight = 14; // px, vertical from horizontal bar down to each arm
  const totalHeight = stemHeight + barToArmHeight;

  return (
    <div
      className="relative w-full"
      style={{ height: totalHeight }}
      aria-hidden="true"
    >
      {/* Vertical stem, centered */}
      <div
        className="absolute bg-accent/40"
        style={{
          left: "50%",
          top: 0,
          width: 1,
          height: stemHeight,
          transform: "translateX(-0.5px)",
        }}
      />
      {/* Horizontal bar from first arm center to last arm center */}
      <div
        className="absolute bg-accent/40"
        style={{
          left: `${first}%`,
          right: `${100 - last}%`,
          top: stemHeight,
          height: 1,
        }}
      />
      {/* Vertical drops at each arm center */}
      {positions.map((x, i) => (
        <div
          key={i}
          className="absolute bg-accent/40"
          style={{
            left: `${x}%`,
            top: stemHeight,
            width: 1,
            height: barToArmHeight,
            transform: "translateX(-0.5px)",
          }}
        />
      ))}
      {/* Arrowheads at each arm */}
      {positions.map((x, i) => (
        <div
          key={`head-${i}`}
          className="absolute text-accent/70"
          style={{
            left: `${x}%`,
            top: totalHeight - 8,
            transform: "translateX(-50%)",
            lineHeight: 0,
          }}
        >
          <FiArrowDown size={12} />
        </div>
      ))}
    </div>
  );
}
