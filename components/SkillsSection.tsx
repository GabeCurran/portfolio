type Skill = {
  label: string;
  note?: string;
  href?: string;
  className?: string;
  subItems?: { label: string; href: string }[];
};

const groups: { title: string; items: Skill[] }[] = [
  {
    title: "Languages",
    items: [
      { label: "HTML" },
      { label: "CSS", note: "Tailwind" },
      { label: "JavaScript", note: "TypeScript" },
      { label: "PHP" },
      { label: "Dart" },
      { label: "Java" },
      { label: "C" },
      { label: "C#", note: ".NET" },
      { label: "Python" },
      { label: "Lua" },
    ],
  },
  {
    title: "Frameworks & Runtimes",
    items: [
      { label: "React", note: "Next.js" },
      { label: "Node.js" },
      { label: "Express" },
      { label: "Three.js" },
      { label: "Electron" },
      {
        label: "Unity",
        subItems: [
          { label: "Netcode for GameObjects", href: "https://docs-multiplayer.unity3d.com/netcode/current/about/" },
        ],
      },
      { label: "Angular" },
      { label: "Vue.js" },
      { label: "Laravel" },
      { label: "Flask" },
      { label: "Flutter" },
      { label: "Solar2D" },
    ],
  },
  {
    title: "DB & ORM",
    items: [
      { label: "SQL", note: "PostgreSQL\nMySQL\nSQL Server\nSQLite" },
      { label: "Prisma" },
      { label: "Supabase" },
      { label: "MongoDB" },
    ],
  },
  {
    title: "Data & Orchestration",
    items: [
      { label: "Apache Airflow" },
      { label: "Qlik" },
      { label: "Liquibase" },
    ],
  },
  {
    title: "DevOps & Tooling",
    items: [
      { label: "Docker" },
      { label: "GitHub" },
      { label: "Azure DevOps" },
      { label: "Vercel" },
      { label: "Bash" },
      { label: "PowerShell" },
      { label: "npm" },
      { label: "Docusaurus" },
    ],
  },
  {
    title: "Auth & Platforms",
    items: [
      {
        label: "Ory",
        href: "https://ory.sh/",
        className: "ory",
        subItems: [
          { label: "Kratos — Identity", href: "https://github.com/ory/kratos" },
          { label: "Hydra — OAuth2/OIDC", href: "https://github.com/ory/hydra" },
          { label: "Elements", href: "https://github.com/ory/elements" },
          { label: "Cloud", href: "https://console.ory.sh/" },
          { label: "SDKs", href: "https://github.com/ory/sdk" },
        ],
      },
      {
        label: "Oso",
        href: "https://www.osohq.com/",
        className: "oso"
      },
      {
        label: "descope",
        href: "https://descope.com/",
        className: "descope"
      },
    ],
  },
  {
    title: "Testing & QA",
    items: [{ label: "Playwright" }, { label: "Vitest" }, { label: "Selenium" }],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="mx-auto sectionContainer mt-10" aria-labelledby="skills-heading">
      <h2 id="skills-heading" className="sr-only">Skills</h2>

      <div className="grid grid-cols-1 md:[grid-template-columns:repeat(2,max-content)] lg:[grid-template-columns:repeat(3,max-content)] gap-10 lg:gap-x-14 lg:gap-y-12 items-start w-fit mx-auto justify-center">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="text-accent text-2xl font-bold mb-2">{group.title}</h3>

            <ul className="space-y-2">
              {group.items.map((i) => (
                <li key={i.label} className="leading-tight">
                  <div className="font-semibold">
                    {i.href ? (
                      <a
                        href={i.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={i.className}
                      >
                        {i.label}
                      </a>
                    ) : (
                      i.label
                    )}
                  </div>

                  {i.subItems ? (
                    <ul className="list-disc pl-6 mt-1">
                      {i.subItems.map((s, idx) => (
                        <li key={idx} className="text-sm">
                          <a
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={i.className}
                            onMouseEnter={(e) => {
                              const marker = (e.currentTarget.parentElement as HTMLLIElement);
                              marker.style.setProperty("--tw-prose-bullets", "#5528ff");
                            }}
                            onMouseLeave={(e) => {
                              const marker = (e.currentTarget.parentElement as HTMLLIElement);
                              marker.style.removeProperty("--tw-prose-bullets");
                            }}
                          >
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : i.note ? (
                    <ul className="list-disc pl-6 mt-1">
                      {i.note.split("\n").map((line, idx) => (
                        <li key={idx} className="text-sm">{line}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
