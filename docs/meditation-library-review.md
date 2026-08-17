# Meditation recordings library — migrated

## Status: complete

The old Wix password-protected page at `https://www.odedarbel.com/meditationrec`
has four guided meditation recordings. They were downloaded and moved into the
new site's password-gated library:

| Track | Duration | Local file |
| --- | ---: | --- |
| ריכוז בנשימה / Focus on the Breath | 10:12 | `gated-assets/meditation-library/focus-on-the-breath.mp3` |
| סריקת גוף / Body Scan | 24:25 | `gated-assets/meditation-library/body-scan.mp3` |
| קשב פתוח / Open Attention | 22:22 | `gated-assets/meditation-library/open-attention.mp3` |
| הנחיות לזאזן / Zazen Instructions | 30:03 | `gated-assets/meditation-library/zazen-instructions.mp3` |

The files are tracked by git LFS via `.gitattributes`:

```gitattributes
gated-assets/meditation-library/*.mp3 filter=lfs diff=lfs merge=lfs -text
```

The Astro gated-pages integration copies them to
`dist/_gated/meditation-library/` during `npm run build`. The public gated
loader pages and `_gated` asset URLs are excluded from the generated sitemap by
the sitemap filter in `astro.config.mjs`; the raw plaintext pages are removed
from `dist` after encryption.

The page content is rendered from `src/meditationLibrary.ts` through
`src/components/MeditationPlayer.astro` into both raw gated routes:

- `src/content/pages/he/meditationlibrary.mdx`
- `src/content/pages/en/meditationlibrary.mdx`
- `src/pages/[...slug].astro`

The source MDX files now only contain the page introduction text; track metadata
and audio links are centralized in the TypeScript helper so the Hebrew and
English pages stay in sync. The player JavaScript is registered by
`PasswordGate.astro`, so the custom player upgrades after the encrypted content
is unlocked.
