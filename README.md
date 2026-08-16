# odedarbel.com — site rebuild

A custom-coded rebuild of [odedarbel.com](https://www.odedarbel.com/) (currently a Wix
site), redesigned to match the visual language of
[psychedelictherapy.co.il](https://www.psychedelictherapy.co.il/): warm desert tones,
serif display headings, pill-shaped buttons, and circular icon feature sections.

Built with [Astro](https://astro.build), bilingual (Hebrew default/RTL at `/`, English
at `/en/`).

## Project structure

```
/
├── content/           # scraped source content from the original site (reference/markdown)
├── docs/               # planning notes (e.g. meditation-library-review.md)
├── src/
│   ├── components/     # Nav, Footer, Hero, FeatureTriad, PillButton, ProsePage
│   ├── layouts/         # BaseLayout.astro — html/head, skip link, RTL/LTR
│   ├── i18n.ts          # nav items + UI strings per locale
│   ├── pages/           # Hebrew pages at the root
│   └── pages/en/        # English pages
└── public/              # static assets (favicon, images once added)
```

## Commands

| Command           | Action                                      |
| :----------------- | :------------------------------------------- |
| `npm install`       | Install dependencies                         |
| `npm run dev`        | Start local dev server at `localhost:4321`   |
| `npm run build`       | Build the static site to `./dist/`           |
| `npm run preview`      | Preview the production build locally          |

## Known follow-ups

- **Hero image**: the hero currently uses a gradient placeholder, not a real photo —
  swap in a full-bleed desert/nature photo (`src/components/Hero.astro`) to fully match
  the reference design.
- **Meditation recordings library** (`/meditationpractice`): the original site's
  password-protected recordings page hasn't been reviewed yet — see
  `docs/meditation-library-review.md`. Two provided passwords were rejected by the live
  site; need the correct one to inventory and rebuild this section.
- **Contact form**: not wired to a real submission backend yet (e.g. Formspree).
- **Translations**: English pages are a first-pass translation of the Hebrew content —
  worth a native-speaker review before publishing.
- **Deploy**: GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and
  deploys to GitHub Pages on push to `main`. Enable GitHub Pages ("GitHub Actions" as
  the source) in the repo settings after the first push.
