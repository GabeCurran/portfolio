import { groups } from "@/content/skills";
import SkillChip from "./SkillChip";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="mx-auto sectionContainer mt-10 mb-24"
      aria-labelledby="skills-heading"
    >
      <h2 id="skills-heading" className="sr-only">
        Skills
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground mb-2">
              {group.title}
            </p>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item.label}>
                  <SkillChip item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
