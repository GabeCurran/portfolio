import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import type { Collaborator, Project } from "@/content/projects";

export default function ProjectCard({ project: p }: { project: Project }) {
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
    <div className="flex flex-col leading-none min-w-0 pr-5">
      <span
        className={`text-xs font-medium whitespace-nowrap leading-none transition-colors ${
          c.url ? "group-hover/collab:text-accent" : ""
        }`}
      >
        {c.name}
      </span>
      {c.role && (
        <span className="text-[0.62rem] text-foreground/55 leading-tight mt-1 line-clamp-2">
          {c.role}
        </span>
      )}
    </div>
  );

  const base =
    "relative inline-flex items-center min-w-[110px] px-3 py-2 rounded-lg border border-foreground/10 bg-foreground/[0.02] transition-colors";

  if (c.url) {
    return (
      <a
        href={c.url}
        target="_blank"
        rel="noreferrer"
        className={`group/collab ${base} hover:border-accent/40 hover:bg-foreground/5`}
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
