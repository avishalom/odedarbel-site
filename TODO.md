# TODO

## Blocked — need input from Oded

- [ ] **Meditation library audio files**: the new site's `/meditationlibrary` (see
      "Meditation recordings library" below) lists the 4 real recordings (titles,
      durations, descriptions) but doesn't host the actual audio yet. Verified in code:
      there are no audio files under `public/`, `src/`, or `gated-assets/`, and
      `src/content/gated/*/meditation-library.mdx` still contains a note saying the
      files are missing. Need the audio files themselves from Oded to embed players or
      direct per-recording links, and a decision on whether they should be public or
      stay behind the password gate. Current page links are temporary fallbacks to the
      old Wix library/email.
- [ ] **Podcast episode links**: exact titles are listed (4 episodes under "וידאו /
      אודיו" / "Video / Audio"), but not linked in `src/pages/index.astro` or
      `src/pages/en/index.astro`. Couldn't extract the underlying Spotify/podcast URLs
      from the live site's DOM. Get the actual episode links from Oded and wire them up
      as embeds or links.
- [ ] **Full content for `/psychadelicresearchandtherapy`**: both language pages still
      contain only a short summary and an in-page note that the original page had
      almost no body text. Needs real copy from Oded about the unit's services and
      active research.
- [ ] **Native-speaker review of the English pages** (`src/pages/en/`) — currently a
      first-pass translation of the Hebrew content, not professionally checked.
- [ ] **Verify homepage bio wording**: double-check the "personal note" and "read more"
      bio text in `src/pages/index.astro` against the live site. These were
      reconstructed via an AI page-content summarizer, so exact wording should be
      verified rather than trusted verbatim. Publications and video/audio are verified.

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

## Functionality

- [ ] **Therapists program library page** — no `/therapistdoc` or
      `/en/therapistdoc` routes exist yet, and `scripts/gated-pages.config.mjs` only
      includes the meditation library routes. The 30 PDFs are already in the repo under
      `gated-assets/therapist-library/` (committed via git LFS in 5a98b61). Build a
      password-gated page listing all 30 files with download links, using the same
      `PasswordGate.astro` + `scripts/encrypt-gated.mjs` pattern as the meditation
      library (see `docs/password-gate.md`). The password is known: `Mindthegap`.
      Remember to add the new gate env var to `.env.example` and
      `.github/workflows/deploy.yml`.
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

- [ ] Nav wraps awkwardly on narrower viewports (~900–1100px) — could use a proper
      mobile menu instead of wrapping to a second line.
- [ ] No images from the original site were migrated in (bio photo, section photos) —
      only text content was scraped. Source and add these.
