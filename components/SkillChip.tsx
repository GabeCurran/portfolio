import type { CSSProperties } from "react";
import { brandColor, type Skill } from "@/content/skills";

export default function SkillChip({ item }: { item: Skill }) {
  const Icon = item.icon;
  const color = brandColor[item.label];
  const style = color
    ? ({ "--skill-color": color } as CSSProperties)
    : undefined;
  const classes =
    "skill-chip inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-foreground/15 bg-foreground/[0.02] text-[0.95rem] leading-none";
  const inner = (
    <>
      {Icon && (
        <Icon
          aria-hidden="true"
          size={16}
          className="skill-icon shrink-0"
        />
      )}
      <span>{item.label}</span>
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={classes}
        style={style}
      >
        {inner}
      </a>
    );
  }
  return (
    <span className={classes} style={style}>
      {inner}
    </span>
  );
}
