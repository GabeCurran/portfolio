import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiPhp,
  SiDart,
  SiLua,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiReact,
  SiNextdotjs,
  SiAngular,
  SiVuedotjs,
  SiNodedotjs,
  SiExpress,
  SiLaravel,
  SiFlask,
  SiFlutter,
  SiElectron,
  SiThreedotjs,
  SiUnity,
  SiWebgl,
  SiPostgresql,
  SiMysql,
  SiSqlite,
  SiMongodb,
  SiPrisma,
  SiSupabase,
  SiApacheairflow,
  SiDocker,
  SiGithub,
  SiVercel,
  SiRailway,
  SiNpm,
  SiGnubash,
  SiDocusaurus,
  SiDotnet,
  SiSelenium,
  SiQlik,
  SiSharp,
  SiC,
  SiLiquibase,
  SiVitest,
} from "react-icons/si";
import { FaJava, FaGamepad, FaTheaterMasks } from "react-icons/fa";
import { TbBrandPowershell, TbShield, TbKey } from "react-icons/tb";
import { DiMsqlServer } from "react-icons/di";
import { VscAzureDevops } from "react-icons/vsc";

type Skill = {
  label: string;
  icon?: IconType;
  href?: string;
};

type Group = {
  title: string;
  items: Skill[];
};

const groups: Group[] = [
  {
    title: "Languages",
    items: [
      { label: "TypeScript", icon: SiTypescript, href: "https://www.typescriptlang.org/" },
      { label: "JavaScript", icon: SiJavascript, href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      { label: "Python", icon: SiPython, href: "https://www.python.org/" },
      { label: "C#", icon: SiSharp, href: "https://learn.microsoft.com/en-us/dotnet/csharp/" },
      { label: "Java", icon: FaJava, href: "https://www.java.com/" },
      { label: "PHP", icon: SiPhp, href: "https://www.php.net/" },
      { label: "C", icon: SiC, href: "https://en.cppreference.com/w/c" },
      { label: "Dart", icon: SiDart, href: "https://dart.dev/" },
      { label: "Lua", icon: SiLua, href: "https://www.lua.org/" },
      { label: "HTML", icon: SiHtml5, href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
      { label: "CSS", icon: SiCss3, href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    ],
  },
  {
    title: "Frameworks & Runtimes",
    items: [
      { label: "React", icon: SiReact, href: "https://react.dev/" },
      { label: "Next.js", icon: SiNextdotjs, href: "https://nextjs.org/" },
      { label: "Tailwind", icon: SiTailwindcss, href: "https://tailwindcss.com/" },
      { label: "Node.js", icon: SiNodedotjs, href: "https://nodejs.org/" },
      { label: "Express", icon: SiExpress, href: "https://expressjs.com/" },
      { label: ".NET", icon: SiDotnet, href: "https://dotnet.microsoft.com/" },
      { label: "Angular", icon: SiAngular, href: "https://angular.dev/" },
      { label: "Vue.js", icon: SiVuedotjs, href: "https://vuejs.org/" },
      { label: "Laravel", icon: SiLaravel, href: "https://laravel.com/" },
      { label: "Flask", icon: SiFlask, href: "https://flask.palletsprojects.com/" },
      { label: "Electron", icon: SiElectron, href: "https://www.electronjs.org/" },
      { label: "Flutter", icon: SiFlutter, href: "https://flutter.dev/" },
      { label: "Solar2D", icon: FaGamepad, href: "https://solar2d.com/" },
    ],
  },
  {
    title: "Games & Graphics",
    items: [
      { label: "Unity", icon: SiUnity, href: "https://unity.com/" },
      { label: "Three.js", icon: SiThreedotjs, href: "https://threejs.org/" },
      { label: "WebGL", icon: SiWebgl, href: "https://www.khronos.org/webgl/" },
      { label: "Phaser", icon: FaGamepad, href: "https://phaser.io/" },
    ],
  },
  {
    title: "DB & ORM",
    items: [
      { label: "PostgreSQL", icon: SiPostgresql, href: "https://www.postgresql.org/" },
      { label: "MySQL", icon: SiMysql, href: "https://www.mysql.com/" },
      { label: "SQL Server", icon: DiMsqlServer, href: "https://www.microsoft.com/en-us/sql-server/" },
      { label: "SQLite", icon: SiSqlite, href: "https://sqlite.org/" },
      { label: "MongoDB", icon: SiMongodb, href: "https://www.mongodb.com/" },
      { label: "Prisma", icon: SiPrisma, href: "https://www.prisma.io/" },
      { label: "Supabase", icon: SiSupabase, href: "https://supabase.com/" },
    ],
  },
  {
    title: "Data & Orchestration",
    items: [
      { label: "Apache Airflow", icon: SiApacheairflow, href: "https://airflow.apache.org/" },
      { label: "Qlik", icon: SiQlik, href: "https://www.qlik.com/" },
      { label: "Liquibase", icon: SiLiquibase, href: "https://www.liquibase.com/" },
    ],
  },
  {
    title: "DevOps & Tooling",
    items: [
      { label: "Docker", icon: SiDocker, href: "https://www.docker.com/" },
      { label: "GitHub", icon: SiGithub, href: "https://github.com/" },
      { label: "Azure DevOps", icon: VscAzureDevops, href: "https://azure.microsoft.com/en-us/products/devops" },
      { label: "Vercel", icon: SiVercel, href: "https://vercel.com/" },
      { label: "Railway", icon: SiRailway, href: "https://railway.com/" },
      { label: "Bash", icon: SiGnubash, href: "https://www.gnu.org/software/bash/" },
      { label: "PowerShell", icon: TbBrandPowershell, href: "https://learn.microsoft.com/en-us/powershell/" },
      { label: "npm", icon: SiNpm, href: "https://www.npmjs.com/" },
      { label: "Docusaurus", icon: SiDocusaurus, href: "https://docusaurus.io/" },
    ],
  },
  {
    title: "Auth & Platforms",
    items: [
      { label: "Ory", icon: TbShield, href: "https://ory.sh/" },
      { label: "Oso", icon: TbShield, href: "https://www.osohq.com/" },
      { label: "Descope", icon: TbKey, href: "https://descope.com/" },
    ],
  },
  {
    title: "Testing",
    items: [
      { label: "Playwright", icon: FaTheaterMasks, href: "https://playwright.dev/" },
      { label: "Vitest", icon: SiVitest, href: "https://vitest.dev/" },
      { label: "Selenium", icon: SiSelenium, href: "https://www.selenium.dev/" },
    ],
  },
];

// Official (or brightened-for-dark-bg) brand color per skill. Used as the hover
// highlight color via the --skill-color CSS variable.
const brandColor: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  "C#": "#A179DC",
  Java: "#F89820",
  PHP: "#777BB4",
  C: "#A8B9CC",
  Dart: "#0175C2",
  Lua: "#8F8FC9",
  HTML: "#E34F26",
  CSS: "#1572B6",
  React: "#61DAFB",
  "Next.js": "#FFFFFF",
  Tailwind: "#06B6D4",
  "Node.js": "#5FA04E",
  Express: "#E5E5E5",
  ".NET": "#7D57C1",
  Angular: "#DD0031",
  "Vue.js": "#4FC08D",
  Laravel: "#FF2D20",
  Flask: "#E5E5E5",
  Electron: "#47848F",
  Flutter: "#02569B",
  "Three.js": "#E5E5E5",
  Unity: "#E5E5E5",
  WebGL: "#DB3939",
  Phaser: "#FF4E4E",
  Solar2D: "#45B0E3",
  PostgreSQL: "#4169E1",
  MySQL: "#4479A1",
  "SQL Server": "#CC2927",
  SQLite: "#82B4C9",
  MongoDB: "#47A248",
  Prisma: "#5A67D8",
  Supabase: "#3ECF8E",
  "Apache Airflow": "#017CEE",
  Qlik: "#009848",
  Liquibase: "#2962FF",
  Docker: "#2496ED",
  GitHub: "#E5E5E5",
  "Azure DevOps": "#0078D4",
  Vercel: "#E5E5E5",
  Railway: "#B794F4",
  Bash: "#4EAA25",
  PowerShell: "#5391FE",
  npm: "#CB3837",
  Docusaurus: "#3ECC5F",
  Ory: "#5528FF",
  Oso: "#6366F1",
  Descope: "#10B981",
  Playwright: "#2EAD33",
  Vitest: "#AABC32",
  Selenium: "#43B02A",
};

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
      <div className="columns-1 md:columns-2 gap-x-8">
        {groups.map((group) => (
          <div key={group.title} className="break-inside-avoid mb-8">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground/50 mb-2">
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

function SkillChip({ item }: { item: Skill }) {
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
