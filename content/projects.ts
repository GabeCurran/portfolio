export type Collaborator = {
  name: string;
  url?: string; // portfolio, GitHub, LinkedIn, etc.
  role?: string; // e.g. "design", "backend", "models, animations"
};

export type Project = {
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
  caseStudySlug?: string; // if set, card renders a "Read case study" link to /projects/<slug>
};

export const projects: Project[] = [
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
      { name: "Hunter Gallo", url: "https://www.linkedin.com/in/hunter-gallo-3660aa209/", role: "Founder" },
    ],
    caseStudySlug: "pokednd",
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
      "The marketing site for a Roblox game, built for Starworks under a local contract. It's built with a custom CMS and admin dashboard where authorized editors can update every page section, upload images, and review contact submissions. Uses Supabase with RLS and ISR.",
    dateRange: "Mar 2026",
    tech: ["TypeScript", "React", "Next.js", "Tailwind", "Supabase"],
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
      { name: "Andrew Matt", url: "https://www.linkedin.com/in/andrew-matt/" },
      { name: "Spencer Heffley", url: "https://www.linkedin.com/in/spheffley/" },
    ],
  },
];
