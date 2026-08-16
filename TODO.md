# TODO

## Blocked — need input from Oded

- [x] **Podcast episode links**: extracted the four Spotify episode URLs from the
      live odedarbel.com homepage and wired them into `src/pages/index.astro` and
      `src/pages/en/index.astro`.
- [ ] **Full content for `/psychadelicresearchandtherapy`**: both language pages still
      contain only a short summary and an in-page note that the original page had
      almost no body text. Needs real copy from Oded about the unit's services and
      active research.
- [ ] **Native-speaker review of the English pages** (`src/pages/en/`) — currently a
      first-pass translation of the Hebrew content, not professionally checked.
- [x] **Verify homepage bio wording**: compared the "personal note" and "read more"
      bio text in `src/pages/index.astro` against the live odedarbel.com homepage.
      The "read more" bio text was already aligned; replaced the summarized personal
      note with the live Hebrew wording and updated the English translation.
      Publications and video/audio are verified.

## Content

- [x] **Meditation recordings library** (`/meditationlibrary`, `/en/meditationlibrary`):
      rebuilt as a password-gated page (see `docs/password-gate.md`) listing the 4 real
      recordings — titles, durations, one-line descriptions — sourced by logging into
      the original `/meditationrec` with the password Oded gave (`Backwardstep`).
      `/meditationpractice` now links to it instead of the old Wix page. The audio
      files are now served from the new gated page via git LFS-tracked MP3s in
      `gated-assets/meditation-library/`.
- [x] Hero photo: replaced the gradient placeholder with the real desert photo, reused
      (with Oded's OK) from psychedelictherapy.co.il, which he co-founded —
      `public/images/hero-desert.jpg`, wired into `src/components/Hero.astro`.
- [x] Publications list and video embeds on the homepage: replaced the AI-paraphrased
      summary with verbatim citations and the 4 real embedded YouTube videos pulled
      from the live odedarbel.com homepage (see `src/pages/index.astro` /
      `src/pages/en/index.astro`).

## Functionality

- [x] **Therapists program library page** (`/therapistdoc`, `/en/therapistdoc`):
      rebuilt as a password-gated page listing all 30 PDFs under
      `gated-assets/therapist-library/`. Gated page encryption and asset copying now
      run from the Astro build integration (`scripts/gated-pages.integration.mjs`).
      The sitemap excludes gated public routes, raw plaintext routes, and `_gated`
      asset URLs; the PDF download links are only rendered inside encrypted raw page
      content. Added `GATE_THERAPIST_LIBRARY` to `.env.example` and the deploy
      workflow, and set the matching GitHub Actions secret with `gh`.
- [x] Link therapists program pages to the protected therapist library:
      `/therapists-program` links to `/therapistdoc`, and
      `/en/therapists-program` links to `/en/therapistdoc`.
- [ ] Wire the contact form (`/contact`, `/en/contact`) to a real submission backend
      (e.g. Formspree, or a serverless function). Verified in code: both contact pages
      render `<form>` without an `action`, and each page still includes an in-page note
      that the form is not connected.

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

- [x] Nav wraps awkwardly on narrower viewports (~900–1100px): replaced the wrapping
      header with a responsive menu. Verified collapsed/open mobile behavior at 390px,
      menu behavior at 1300px, and a single-row English desktop header at 1366px.
- [x] Original bio photo: sourced Oded's portrait from the live Wix homepage, saved it
      locally at `public/images/oded-arbel-portrait.jpg`, and wired it into both
      homepage locales with responsive desktop/mobile layout.
- [ ] Original section/gallery images: the live homepage includes an unlabeled
      "השפעות" image gallery. Decide whether that gallery should be recreated on the
      new site, and if so add meaningful labels/alt text instead of importing
      unlabeled decorative thumbnails.
