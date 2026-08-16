# Password-gated pages

Some pages (currently the meditation recordings library) need a soft password
gate — enough to keep casual visitors out, not real access control. There's no
backend, so gating happens entirely client-side at build time:

1. **Source content** lives in `src/content/gated/<locale>/<slug>.mdx` — a
   normal MDX content collection entry (see `src/content.config.ts`), editable
   by anyone comfortable with Markdown.
2. **Raw page** — `src/pages/raw-content/**` renders that MDX through the
   normal site layout (`ProsePage` + `BaseLayout`), so it looks like any other
   page. Astro builds it like any other route.
3. **Loader page** — the real public route (e.g. `src/pages/meditationlibrary.astro`)
   renders `<PasswordGate />`: a password field plus a hidden payload
   placeholder (`__GATE_IV__` / `__GATE_CIPHER__`).
4. **Postbuild step** (`scripts/encrypt-gated.mjs`, run via `npm run build`)
   reads each raw page's rendered `<body>`, encrypts it (AES-256-GCM, key =
   SHA-256 of the plain password, via Node's `crypto`), writes the ciphertext
   into the loader page's placeholders, and deletes the raw page's output so
   the plaintext never ships in `dist/`.
5. **Client-side**: `PasswordGate.astro`'s script derives the same AES key
   from whatever the visitor types (SHA-256 → `SubtleCrypto`), tries to
   decrypt, and on success replaces `document.body.innerHTML` with the
   decrypted content — no page reload, no server round-trip.

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
  real values. `npm run build` picks it up automatically via Node's
  `--env-file-if-exists`.
- **CI/deploy**: set as a GitHub Actions repo secret with the same name, and
  reference it in `.github/workflows/deploy.yml`'s build step `env:` block.

## Adding a new gated page

1. Add `src/content/gated/<locale>/<slug>.mdx` with the real content.
2. Add a raw page under `src/pages/raw-content/` that renders it via
   `getEntry`/`render` + `ProsePage`.
3. Add a loader page using `<PasswordGate locale={...} />`.
4. Add an entry to `scripts/gated-pages.config.mjs` with a new `passwordEnv`
   name.
5. Add that env var to `.env.example` and to the deploy workflow's `env:`
   block, and set the matching GitHub Actions secret (`gh secret set <NAME>`).
