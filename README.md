# gabecurran.me

Source for my personal portfolio at [gabecurran.me](https://gabecurran.me).

Built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind 4**. Deployed on Vercel.

## Some things worth looking at

- **Typed intro with impatience detection** (`components/TypingIntro.tsx`): the hero paragraph types out on first load. Scroll or press a key once and it speeds up; twice and it finishes instantly. A live "life-seconds" counter inside the paragraph ticks down the remaining seconds of a roughly 80-year lifespan in real time.
- **Sticky nav with an expanding underline** (`components/Header.tsx`): the coral line under the nav items expands to fill the viewport when you scroll, and contracts back when you return to the top.
- **Project cards** (`components/ProjectsGrid.tsx`): themed gradient strip plus a real screenshot thumbnail, captured from each live site by `scripts/capture-previews.mjs` using Puppeteer. Collaborator footer, a mobile-note system for desktop-only or in-progress-on-mobile projects, and `↗` hover animations.
- **Skills section** (`components/SkillsSection.tsx`): chip grid with each tool's brand color on hover via CSS custom properties and `color-mix()`. Every chip links to the tool's docs.

## Run locally

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

To refresh the project preview thumbnails (requires Chrome installed at the default Windows path):

```bash
npm run capture-previews
```

## Notes

Code is here for reference, feel free to fork for your own portfolio. The content (project descriptions, screenshots, resume, personal copy) is mine, so please don't lift it wholesale.
