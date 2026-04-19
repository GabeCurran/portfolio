import { projects } from "@/content/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid() {
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
