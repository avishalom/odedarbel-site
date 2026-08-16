# TODO

## Blocked — need input from Oded

- [ ] **Meditation recordings library** (`/meditationpractice`). The original
      `/meditationrec` page is password-protected; both passwords tried so far
      (`backwardstep`, `mindthegap`) were rejected. Need the correct password (or a
      manual export of the recordings — titles, durations, descriptions) to inventory
      the content and rebuild this section properly. See
      `docs/meditation-library-review.md` for the reorganization plan once unblocked.

## Content

- [ ] Swap the hero gradient placeholder (`src/components/Hero.astro`) for a real
      full-bleed desert/nature photo — didn't want to pull one from the web without
      sign-off.
- [ ] Full content review of `/psychadelicresearchandtherapy` — the original page had
      almost no body text (just nav + background image), so the rebuilt page is
      thin. Needs real copy from Oded about the unit's services and active research.
- [ ] Native-speaker review of the English pages (`src/pages/en/`) — currently a
      first-pass translation of the Hebrew content, not professionally checked.
- [ ] Double-check the "personal note," publications list, and video/audio list on the
      homepage against the live site — these were reconstructed via an AI page-content
      summarizer (browser tool was down for part of the scrape), so exact wording,
      citations, and links should be verified rather than trusted verbatim.

## Functionality

- [ ] Wire the contact form (`/contact`, `/en/contact`) to a real submission backend
      (e.g. Formspree, or a serverless function) — it currently only renders, doesn't
      send anywhere.

## Deploy

- [ ] Point `odedarbel.com`'s DNS at GitHub Pages (A/ALIAS + `www` CNAME per GitHub's
      docs) to activate the `public/CNAME` file already in the repo.
- [ ] **When DNS is switched**, remove `base: '/odedarbel-site'` from
      `astro.config.mjs` and rebuild/redeploy — internal links use the `withBase()`
      helper (`src/i18n.ts`) which reads Astro's `BASE_URL`, so removing `base` makes
      every link resolve at the domain root automatically. No per-page changes needed.
      (Previously all internal links only worked on the homepage of the GitHub Pages
      subpath URL; fixed by adding `base` + routing every internal `href` through
      `withBase()`.)

## Nice to have

- [ ] Nav wraps awkwardly on narrower viewports (~900–1100px) — could use a proper
      mobile menu instead of wrapping to a second line.
- [ ] No images from the original site were migrated in (bio photo, section photos) —
      only text content was scraped. Source and add these.
