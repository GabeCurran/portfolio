This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Responsive Design

The site is mobile-first and responsive across common breakpoints.

- Containers: `.sectionContainer` adds a max width with horizontal padding for small screens.
- Viewport: `app/layout.tsx` sets `width=device-width, initial-scale=1` via `metadata.viewport`.
- Header: Reduced height on small screens; links have comfortable touch targets.
- Projects: Grid is 1 column on mobile, 2 on `md`, and 3 on `xl`. Media heights scale with viewport height. Gallery images use `next/image` with `sizes` tuned per breakpoint.
- Typography: Base size uses `clamp` in `app/globals.css` to scale smoothly with viewport width.

When adding new sections/components, start with single-column mobile layouts and progressively enhance with Tailwind responsive modifiers (e.g., `md:`, `lg:`).

## Resume

- Place your PDF at `public/GabeCurranResume.pdf`.
- It's served at `/GabeCurranResume.pdf` in both dev and production.
- The header and footer include links that open the PDF in a new tab.

Quick test locally:

```powershell
npm install
npm run dev
# Visit http://localhost:3000 and click "Resume"
```
