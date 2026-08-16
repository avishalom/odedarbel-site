# TODO

## Blocked — need input from Oded

- [ ] **Therapists program library** (`/therapistdoc` on the old Wix site, linked from
      the "תכנית המטפלים" post as "ספריית תוכנית המטפלים"). `Mindthegap` (capital M)
      works — it's a folder of 29 PDF reading texts (Hakomi, Suzuki, the Heart Sutra,
      Barry Magid, Welwood, etc., titled "ספריית תוכנית המטפלים"). Not yet rebuilt on
      the new site — need to decide: host the PDFs ourselves (requires the actual
      files — no direct download links were exposed in the page DOM, only a per-row
      "⋮" menu) or keep linking out to the gated Wix page. Should use the same
      password-gate mechanism (`docs/password-gate.md`) once that's decided.
- [ ] **Meditation library audio files**: the new site's `/meditationlibrary` (see
      "Meditation recordings library" below) lists the 4 real recordings (titles,
      durations, descriptions) but doesn't host the actual audio yet — need the audio
      files themselves from Oded to embed players, and a decision on whether they
      should be public or stay behind the password gate.

## Content

- [x] **Meditation recordings library** (`/meditationlibrary`, `/en/meditationlibrary`):
      rebuilt as a password-gated page (see `docs/password-gate.md`) listing the 4 real
      recordings — titles, durations, one-line descriptions — sourced by logging into
      the original `/meditationrec` with the password Oded gave (`Backwardstep`).
      `/meditationpractice` now links to it instead of the old Wix page. Audio files
      themselves still need to be added — see "Blocked" above.
- [x] Hero photo: replaced the gradient placeholder with the real desert photo, reused
      (with Oded's OK) from psychedelictherapy.co.il, which he co-founded —
      `public/images/hero-desert.jpg`, wired into `src/components/Hero.astro`.
- [x] Publications list and video embeds on the homepage: replaced the AI-paraphrased
      summary with verbatim citations and the 4 real embedded YouTube videos pulled
      from the live odedarbel.com homepage (see `src/pages/index.astro` /
      `src/pages/en/index.astro`).
- [ ] Podcast episode links: exact titles are now listed (4 episodes under "וידאו /
      אודיו" / "Video / Audio"), but not linked — couldn't extract the underlying
      Spotify/podcast URLs from the live site's DOM. Get the actual episode links from
      Oded and wire them up as embeds or links.
- [ ] Full content review of `/psychadelicresearchandtherapy` — the original page had
      almost no body text (just nav + background image), so the rebuilt page is
      thin. Needs real copy from Oded about the unit's services and active research.
- [ ] Native-speaker review of the English pages (`src/pages/en/`) — currently a
      first-pass translation of the Hebrew content, not professionally checked.
- [ ] Double-check the "personal note" and "read more" bio text on the homepage against
      the live site — these were reconstructed via an AI page-content summarizer
      (browser tool was down for part of the scrape), so exact wording should be
      verified rather than trusted verbatim. (Publications and video/audio are now
      verified — see above.)

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
