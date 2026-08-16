# Password-gated pages

Some pages (currently the meditation recordings library and Therapists Program
library) need a soft password gate — enough to keep casual visitors out, not
real access control. There's no backend, so gating happens entirely client-side
at build time:

1. **Source content** lives in `src/content/gated/<locale>/<slug>.mdx` — a
   normal MDX content collection entry (see `src/content.config.ts`), editable
   by anyone comfortable with Markdown.
2. **Raw page** — `src/pages/raw-content/**` renders that MDX through the
   normal site layout (`ProsePage` + `BaseLayout`), so it looks like any other
   page. Astro builds it like any other route. This page uses the real
   unlocked title.
3. **Loader page** — the real public route (e.g. `src/pages/meditationlibrary.astro`)
   renders `<PasswordGate />`: a password field plus a hidden payload
   placeholder (`__GATE_IV__` / `__GATE_CIPHER__`). It can use the SEO entry's
   `lockedTitle` and `lockedDescription` so browser/SEO metadata is generic
   before unlock; after unlock, the full decrypted raw document replaces it and
   the tab switches to the real page metadata.
4. **Astro build integration** (`scripts/gated-pages.integration.mjs`, registered
   in `astro.config.mjs`)
   reads each raw page's full rendered HTML document, encrypts it (AES-256-GCM, key =
   SHA-256 of the plain password, via Node's `crypto`), writes the ciphertext
   into the loader page's placeholders, and deletes the raw page's output so
   the plaintext never ships in `dist/`.
5. **Gated assets** for encrypted pages live outside `public/` under
   `gated-assets/`. The same integration copies configured asset folders into
   `dist/_gated/` after page generation. Links to these files should only appear
   inside encrypted page content, and `astro.config.mjs` excludes gated routes,
   raw routes, and `_gated` URLs from the sitemap.
6. **Client-side**: `PasswordGate.astro`'s script derives the same AES key
   from whatever the visitor types (SHA-256 → `SubtleCrypto`), tries to
   decrypt, and on success writes the decrypted full document with
   `document.open()` / `document.write()` / `document.close()`. This lets the
   browser parse the unlocked page normally, including Astro-emitted module
   scripts and hydrated/client-side components — no page reload, no server
   round-trip.

## Why this is intentionally weak

- No KDF work factor (just a single SHA-256, not PBKDF2/scrypt/argon2) and no
  rate limiting — the ciphertext and salt/IV are public in the page source, so
  an attacker can brute-force offline. That's fine here: the content is low
  value (meditation recordings, course handouts for people who already have
  the password), not something that needs real security.
- Use a real backend (Firebase Auth, Cloud Functions, etc.) instead if a
  future gated page actually needs access control.

## Passwords

Passwords are **not** committed to the repo. They come from environment
variables, one per gated page (see `scripts/gated-pages.config.mjs`):

- **Local dev/build**: copy `.env.example` to `.env` (gitignored) and fill in
  real values. The Astro build integration reads `.env` automatically.
- **CI/deploy**: set as a GitHub Actions repo secret with the same name, and
  reference it in `.github/workflows/deploy.yml`'s build step `env:` block.

## Adding a new gated page

1. Add `src/content/gated/<locale>/<slug>.mdx` with the real content.
2. Add a raw page under `src/pages/raw-content/` that renders it via
   `getEntry`/`render` + `ProsePage`.
3. Add a loader page using `<PasswordGate locale={...} />`.
4. Add an entry to `scripts/gated-pages.config.mjs` with a new `passwordEnv`
   name.
5. If the page has downloadable assets, keep them under `gated-assets/`, add
   the directory to `gatedAssetDirectories`, and make sure asset links are only
   rendered by the raw encrypted page.
6. Add that env var to `.env.example` and to the deploy workflow's `env:`
   block, and set the matching GitHub Actions secret (`gh secret set <NAME>`).
