# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A custom-coded rebuild of [odedarbel.com](https://www.odedarbel.com/) (currently a Wix
site), redesigned to match the visual language of
[psychedelictherapy.co.il](https://www.psychedelictherapy.co.il/). Built with
[Astro](https://astro.build), static output, bilingual: Hebrew (default, RTL) at `/`,
English (LTR) at `/en/`.

## Commands

| Command         | Action                                    |
| :-------------- | :----------------------------------------- |
| `npm install`     | Install dependencies                       |
| `npm run dev`      | Start dev server at `localhost:4321`        |
| `npm run build`    | Build static site to `./dist/`              |
| `npm run preview`   | Preview the production build locally         |

There is no test suite or linter configured in this project.

Requires Node **>=22.12.0** (Astro 7 requirement — the GitHub Actions deploy workflow
pins `node-version: 22` for this reason; do not downgrade it).

## Architecture

- **Bilingual routing**: `astro.config.mjs` sets `i18n.locales: ['he', 'en']` with
  `he` as the default (unprefixed) locale. Hebrew pages live at `src/pages/*.astro`;
  English equivalents are the same filename under `src/pages/en/`. There is no
  automatic content sync between them — each language's copy is hand-written in its
  own `.astro` file, so any content change on one side needs to be applied to the
  other manually.
- **`src/i18n.ts`** is the single source of truth for per-locale nav items and UI
  strings (`nav`, `uiStrings`, `dir`). `Nav.astro` and `Footer.astro` read from it
  rather than hardcoding labels.
- **`src/layouts/BaseLayout.astro`** sets `<html lang dir>` per locale, loads Google
  Fonts, and renders the skip link + `Nav` + `<main>` + `Footer`. All pages should go
  through this (directly, or via `ProsePage.astro` for simple text pages).
- **`src/components/ProsePage.astro`** wraps `BaseLayout` for the simple
  text-only pages (Tamar Amit, therapists program, meditation practice, etc.) — use it
  instead of duplicating the `<section><div class="container prose">` boilerplate for
  any new simple content page.
- **Design tokens** (`src/styles/tokens.css`) hold the color palette, font stacks
  (separate Hebrew/Latin display and body fonts), spacing scale, and shared component
  classes (`.container`, `section.cream`, focus-visible outlines, skip link). Colors
  were deliberately darkened from the reference site's literal values to pass WCAG AA
  contrast — see the comments inline before changing them.
- **`content/` and `docs/`** are not part of the built site — `content/he/*.md` holds
  the raw scraped source content from the original Wix site as a reference/archive,
  and `docs/meditation-library-review.md` is planning notes for the still-unbuilt
  meditation recordings library section.
- **Deploy**: `.github/workflows/deploy.yml` builds and deploys to GitHub Pages via
  GitHub Actions (not the legacy `gh-pages` branch method) on every push to `main`.
  `astro.config.mjs` sets `base: '/odedarbel-site'` and every internal `href` is routed
  through the `withBase()` helper (`src/i18n.ts`) instead of being hardcoded
  root-relative, so links resolve correctly on the interim GitHub Pages URL
  (`https://avishalom.github.io/odedarbel-site/`). `public/CNAME` points at
  `odedarbel.com` for when DNS is switched over — at that point, remove `base` from
  `astro.config.mjs` and rebuild; `withBase()` will resolve links at the domain root
  automatically, no per-page edits needed.

## TODO.md

`TODO.md` at the repo root tracks everything still left to do on this site — blocked
items (e.g. the password-protected meditation recordings library), content gaps,
unwired functionality (contact form), and deploy steps (DNS cutover). Check it before
starting new work, and keep it updated as items are completed or new gaps are found —
it's the authoritative task list for this project, not just a one-time snapshot.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
