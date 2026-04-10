# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IslandSkiesWeb is a personal astrophotography portfolio site built with Next.js. It showcases deep sky object (DSO) and solar system/planetary photography, with planned sections for articles about astronomical objects and an about page.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19 and TypeScript
- **Styling:** Tailwind CSS 4 (CSS-based config via `@theme inline` in globals.css — no tailwind.config.ts)
- **Linting:** ESLint 9 flat config with next/core-web-vitals and next/typescript
- **Hosting:** Vercel (planned)

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # Run ESLint
```

## Important: Next.js 16 Breaking Changes

This project uses Next.js 16 which has breaking changes from earlier versions. **Always read the relevant guide in `node_modules/next/dist/docs/` before writing any code.** Key differences:
- `searchParams` and `params` in page components are **Promises** — must be `await`ed
- Use `next/image` (not `next/legacy/image`) with `fill` prop for responsive images

## Architecture

### Routing (App Router with `src/` directory)

```
/                      → Landing page
/gallery               → Redirects to /gallery/dso
/gallery/dso           → Deep Sky Objects gallery grid
/gallery/solar-system  → Solar System gallery grid
```

Path alias: `@/*` maps to `./src/*`.

### Theme

Always dark — no light mode. Colors defined as CSS custom properties in `globals.css` and registered in `@theme inline` for Tailwind utility generation (`bg-card`, `text-muted`, `bg-surface`, `text-accent`, etc.).

### Server vs Client Components

Most components are Server Components. Only two need `"use client"`:
- `SearchBar` — handles input state and URL updates via `useRouter`/`useSearchParams`
- `GalleryNav` — uses `usePathname()` to highlight active category

Search is URL-driven: SearchBar updates `?q=` query param, server page components read `searchParams` to filter. This keeps the gallery grid as a Server Component.

### Key Files

- `src/data/gallery-images.ts` — image types, data array, and filter helpers
- `src/app/gallery/layout.tsx` — shared gallery layout (SearchBar + GalleryNav)
- `src/components/gallery/` — ImageCard, GalleryGrid, GalleryNav, SearchBar

### Images

Astrophotography images are stored in `public/images/dso/` and `public/images/solar-system/`. Source images come from `~/Documents/astrophotography/Exports/`.

## Site Sections (Planned)

- **Articles** — Written content about the science behind astronomical objects (not yet built)
- **About** — Author bio and astrophotography background (not yet built)
- **Gallery detail view** — Click-through from thumbnail to full image with metadata (not yet built)
