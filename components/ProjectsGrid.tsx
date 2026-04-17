"use client";
import { useMemo } from "react";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";

type Collaborator = {
  name: string;
  url?: string; // portfolio, GitHub, LinkedIn, etc.
  role?: string; // e.g. "design", "backend", "models, animations"
};

type Project = {
  title: string;
  url?: string;
  description: string;
  dateRange?: string;
  tech: string[];
  preview: string; // CSS class for themed preview strip (fallback tint under image)
  image?: string; // path under /public, e.g. /img/previews/pokednd.png
  // Small banner shown only on mobile. If blocker is true, the card is also
  // not clickable on mobile (accent color); otherwise it's a soft yellow note.
  mobileNote?: { text: string; blocker?: boolean };
  collaborators?: Collaborator[];
};

export default function ProjectsGrid() {
  const projects: Project[] = useMemo(
    () => [
      {
        title: "PokeDnD",
        url: "https://pokednd.live/",
        description:
          "A Pokémon-themed tabletop RPG web app with real-time battles, dice rolls, music sync, a full Pokédex, and a trainer and campaign management system.",
        dateRange: "Sep 2025 - Present",
        tech: ["TypeScript", "React", "Next.js", "Tailwind", "Prisma", "PostgreSQL", "Ory", "SSE"],
        preview: "preview-pokednd",
        image: "/img/previews/pokednd.png",
        mobileNote: { text: "Mobile styling in progress" },
        collaborators: [
          { name: "Hunter Gallo", url: "https://github.com/Hgallo42" },
        ],
      },
      {
        title: "Revelations",
        url: "https://revelations.quest/",
        description:
          "A web-based PvP dueling game I've been building. The voxel weapon modeling, posing, and animation tools are all things I built to help create the game's assets.",
        dateRange: "Mar 2026 - Present",
        tech: ["TypeScript", "Three.js", "WebGL"],
        preview: "preview-revelations",
        image: "/img/previews/revelations.png",
        mobileNote: { text: "Not built for mobile...yet", blocker: true },
        collaborators: [
          { name: "Shane Donnelly", url: "https://www.linkedin.com/in/shane-donnelly-53b993276/" },
        ],
      },
      {
        title: "LingoLyrics",
        url: "https://lingolyrics.vercel.app/",
        description:
          "Lyric translations and annotations, powered by AI. Fetches synced lyrics for a song and lets you translate and annotate them line by line.",
        dateRange: "Jul 2025 - Present",
        tech: ["TypeScript", "React", "Next.js", "Tailwind", "Claude API", "OpenAI API", "LRCLib"],
        preview: "preview-lingolyrics",
        image: "/img/previews/lingolyrics.png",
        collaborators: [
          { name: "Sylas Serpens", url: "https://www.linkedin.com/in/sylasserpens/" },
          { name: "Brandon White", url: "https://www.linkedin.com/in/brandon-white-drexel/" },
          { name: "Jae Lee", url: "https://www.linkedin.com/in/jae-lee4578/" },
        ],
      },
      {
        title: "Starworks Studios",
        url: "https://starworks-studios.com/",
        description:
          "Boast Guards is a Unity multiplayer game developed by a student-founded studio at Drexel. I've worked on the game's networking systems and built the studio's website.",
        dateRange: "May 2024 - Present",
        tech: ["Unity", "C#", "Netcode for GameObjects", "React", "Next.js", "Supabase"],
        preview: "preview-starworks",
        image: "/img/previews/starworks.png",
        collaborators: [
          { name: "Starworks", url: "https://starworks-studios.com/team" },
        ],
      },
      {
        title: "Blockverse",
        url: "https://blockverseproductions.com/",
        description:
          "For Starworks, I built the website for a Roblox game we got through a local contract.",
        dateRange: "Mar 2026",
        tech: ["React", "Next.js", "Tailwind", "Supabase"],
        preview: "preview-blockverse",
        image: "/img/previews/blockverse.png",
        collaborators: [
          { name: "Starworks", url: "https://starworks-studios.com/team" },
        ],
      },
      {
        title: "Vy",
        url: "https://vy.gabecurran.me/",
        description:
          "A private site I built for my girlfriend where we share letters and log the symbolic meanings behind the flowers we love. We can add, edit, and reorder entries, and toggle between English and Vietnamese. Falling cherry blossom petals drift across the page, and the floral borders on each side are drawn with pure CSS. It's a Next.js app on Supabase, gated behind a shared password for privacy.",
        dateRange: "Feb 2026 - Present",
        tech: ["Next.js", "React 19", "Supabase", "Tailwind"],
        preview: "preview-vy",
        image: "/img/previews/vy.png",
      },
      {
        title: "gen1ify",
        url: "https://modrinth.com/datapack/gen1ify",
        description:
          "A Cobblemon datapack that turns Minecraft into a Gen 1 Pokémon experience. Rebalances fossils, evolution stones, and held items to fit the original 151.",
        dateRange: "Mar 2025",
        tech: ["Cobblemon", "Minecraft", "mcfunction"],
        preview: "preview-gen1ify",
        image: "/img/previews/gen1ify.png",
      },
      {
        title: "Nyctophobic Computer",
        url: "https://www.youtube.com/shorts/6cB0NbZ2yUs",
        description:
          "A computer that gets scared in the dark. A lux sensor feeds ambient light readings over I2C, and when the room goes dark a Plan 9 C program reacts by driving two motors via GPIO.",
        dateRange: "Mar 2025",
        tech: ["C", "Plan 9", "Raspberry Pi", "I2C", "GPIO"],
        preview: "preview-dark",
        image: "/img/previews/dark.png",
      },
      {
        title: "Senior Care App",
        url: "https://care-of-yore.herokuapp.com/",
        description:
          "A senior-care management app with roles, permissions, data management, etc. My first real full-stack project.",
        dateRange: "Dec 2021",
        tech: ["PHP", "Laravel", "MySQL", "Tailwind", "JavaScript"],
        preview: "preview-seniorcare",
        image: "/img/previews/seniorcare.png",
        collaborators: [
          { name: "Andrew Matt", url: "https://www.youtube.com/@Finding_Fortune" },
          { name: "Spencer Heffley", url: "https://www.linkedin.com/in/spheffley/" },
        ],
      },
    ],
    []
  );

  return (
    <section id="projects" aria-label="Projects" className="mx-auto sectionContainer mt-10">
      <div className="grid gap-4 sm:gap-5 md:gap-6 lg:gap-4 xl:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const body = (
    <>
      <div className={`preview ${p.preview} relative h-36 sm:h-40 md:h-44 lg:h-36 xl:h-40 overflow-hidden border-b border-foreground/10`}>
        {p.image ? (
          <Image
            src={p.image}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover/link:scale-[1.04]"
            quality={85}
          />
        ) : (
          <span
            aria-hidden="true"
            className="preview-letter absolute inset-0 flex items-center justify-center text-7xl sm:text-8xl md:text-9xl font-bold text-foreground/10 select-none"
          >
            {p.title.charAt(0)}
          </span>
        )}
        {p.mobileNote && (
          <div
            className={`md:hidden absolute inset-x-0 bottom-0 bg-background/85 backdrop-blur-sm text-center text-xs py-1.5 font-medium border-t ${
              p.mobileNote.blocker
                ? "text-accent border-accent/30"
                : "text-yellow-200 border-yellow-200/30"
            }`}
          >
            {p.mobileNote.text}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-5 sm:p-6 lg:p-4 xl:p-5 flex-1">
        <header>
          <h3 className="text-lg sm:text-xl lg:text-lg font-semibold flex items-start gap-1.5">
            <span className="underline underline-offset-4 decoration-foreground/30 group-hover/link:decoration-accent transition-colors">
              {p.title}
            </span>
            {p.url && (
              <FiArrowUpRight
                aria-hidden="true"
                size={18}
                className="shrink-0 mt-1 text-foreground/40 transition-all duration-200 group-hover/link:text-accent group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            )}
          </h3>
          {p.dateRange && (
            <p className="text-xs sm:text-sm text-foreground/55 mt-1">{p.dateRange}</p>
          )}
        </header>

        <p className="text-sm sm:text-base lg:text-sm text-foreground/85 leading-snug whitespace-pre-line flex-1">
          {p.description}
        </p>

        <ul className="flex flex-wrap gap-1.5 mt-auto">
          {p.tech.map((t) => (
            <li
              key={t}
              className="inline-flex items-center text-xs leading-none px-2 py-1 rounded-full border border-foreground/20 text-foreground/75 group-hover/link:border-foreground/40 transition-colors"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  const outerClasses =
    "relative flex flex-col overflow-hidden rounded-lg border border-foreground/15 transition-colors " +
    (p.url
      ? "has-[[data-project-link]:hover]:border-accent/50 has-[[data-project-link]:hover]:bg-foreground/[0.03]"
      : "");

  const clickable = p.url ? (
    <a
      href={p.url}
      target="_blank"
      rel="noreferrer"
      data-project-link
      className={`group/link flex flex-col flex-1 ${
        p.mobileNote?.blocker ? "pointer-events-none md:pointer-events-auto" : ""
      }`}
      aria-label={`Open ${p.title} in a new tab`}
    >
      {body}
    </a>
  ) : (
    <div className="flex flex-col flex-1">{body}</div>
  );

  return (
    <article className={outerClasses}>
      {clickable}
      {p.collaborators && p.collaborators.length > 0 && (
        <Collaborators people={p.collaborators} />
      )}
    </article>
  );
}

function Collaborators({ people }: { people: Collaborator[] }) {
  return (
    <div className="px-5 sm:px-6 lg:px-4 xl:px-5 py-4 lg:py-3 border-t border-foreground/10">
      <p className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-2.5">
        Collaborators
      </p>
      <ul className="flex flex-wrap gap-2">
        {people.map((c) => (
          <li key={c.name} className="flex">
            <CollaboratorCard c={c} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CollaboratorCard({ c }: { c: Collaborator }) {
  const inner = (
    <div className="flex flex-col leading-tight min-w-0 pr-5">
      <span
        className={`text-xs font-medium whitespace-nowrap transition-colors ${
          c.url ? "group-hover/collab:text-accent" : ""
        }`}
      >
        {c.name}
      </span>
      {c.role && (
        <span className="text-[0.62rem] text-foreground/55 leading-tight mt-0.5 line-clamp-2">
          {c.role}
        </span>
      )}
    </div>
  );

  const base =
    "relative block min-w-[110px] px-3 py-2 rounded-lg border border-foreground/10 bg-foreground/[0.02] transition-colors";

  if (c.url) {
    return (
      <a
        href={c.url}
        target="_blank"
        rel="noreferrer"
        className={`group/collab ${base} hover:border-accent/40 hover:bg-foreground/[0.05]`}
        aria-label={`${c.name}${c.role ? ` — ${c.role}` : ""}`}
      >
        <FiArrowUpRight
          aria-hidden="true"
          size={13}
          className="absolute top-2 right-2 text-foreground/35 transition-all duration-200 group-hover/collab:text-accent group-hover/collab:translate-x-0.5 group-hover/collab:-translate-y-0.5"
        />
        {inner}
      </a>
    );
  }
  return <div className={base}>{inner}</div>;
}

