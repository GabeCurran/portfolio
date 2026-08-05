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
    title: "Reibu",
    url: "https://reibu.net/",
    description:
      "A real-time collaborative listening room. YouTube and SoundCloud playback stays synced for everyone in the room, with a DJ booth, queue voting, playlists, and chat. It runs on my own Junjo SDK for rooms and roles, encrypts chat and DMs end to end with Olm, and has a live theme editor people use to build and share their own palettes, fonts, and sounds.",
    dateRange: "May 2026 - Present",
    tech: ["TypeScript", "Next.js", "Prisma", "PostgreSQL", "SSE", "Olm", "Ory Kratos"],
    preview: "preview-reibu",
    image: "/img/previews/reibu.png",
  },
  {
    title: "Junjo",
    url: "https://junjo.io/",
    description:
      "A game-backend platform and SDK I'm building that gives multiplayer games drop-in groups, ranks, and permissions (guilds, clans, factions) without each studio rebuilding them. It plugs into a game's existing auth instead of replacing it. The TypeScript SDK and React hooks are published on npm, and it ships with a Roblox client, an admin dashboard, and full docs.",
    dateRange: "May 2026 - Present",
    tech: ["TypeScript", "Hono", "Prisma", "PostgreSQL", "SSE", "Docker", "Railway"],
    preview: "preview-junjo",
    image: "/img/previews/junjo.png",
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
    title: "Revelations",
    // www, not the apex: the apex is on Squarespace domain forwarding, which
    // 301s to plain http. www points straight at Railway over https.
    url: "https://www.revelations.quest/",
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
    title: "Banh Mi Cali",
    url: "https://banh-mi-cali.com/",
    description:
      "A website for a family-run Vietnamese sandwich shop in Philadelphia. The menu, hours, location, and ordering links all live in one place, translated into 22 languages, with a print and QR friendly menu. An admin panel lets the shop update prices, specials, and page content without a redeploy.",
    dateRange: "Jun 2026",
    tech: ["TypeScript", "Next.js", "Drizzle", "PostgreSQL", "Tailwind", "Railway"],
    preview: "preview-banhmicali",
    image: "/img/previews/banhmicali.png",
  },
  {
    title: "DuoSubs",
    url: "https://chromewebstore.google.com/detail/duosubs/igpmpipehnblecibaalpphakcaphoomc",
    description:
      "A Chrome extension for watching video with two subtitle tracks at once, which is how I study Vietnamese. Load several SRT files, then position, style, and time-shift each track independently. It works on any HTML5 video, and a built-in viewer plays local files with the same overlay.",
    dateRange: "Aug 2026",
    tech: ["JavaScript", "Chrome Extension", "Manifest V3"],
    preview: "preview-duosubs",
    image: "/img/previews/duosubs.png",
  },
  {
    title: "Marathon FOV Calculator",
    url: "https://marathon-fov-calc.vercel.app/",
    description:
      "A sensitivity and FOV calculator for Bungie's Marathon. It converts cm/360 between games, works out ADS sensitivity per optic, and includes a loadout builder and a reverse solver for hitting an exact cm/360. Settings travel in the URL, so a build is one link away.",
    dateRange: "May 2026 - Present",
    tech: ["TypeScript", "Next.js", "React", "Tailwind"],
    preview: "preview-marathon",
    image: "/img/previews/marathon.png",
  },
  {
    title: "Vy",
    url: "https://vy.gabecurran.me/",
    description:
      "A private site I built for my girlfriend where we share letters and log the symbolic meanings behind the flowers we love. We can add, edit, and reorder entries, and toggle between English and Vietnamese. Falling cherry blossom petals drift across the page, and the floral borders are drawn in pure CSS.",
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
];
