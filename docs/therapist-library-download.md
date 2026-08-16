# Therapists program library — downloaded and wired

Goal: download all 30 PDFs from the old Wix site's password-protected
"ספריית תוכנית המטפלים" (therapists program library) at
`https://www.odedarbel.com/therapistdoc`, store them in this repo via
**git LFS**, and serve them from the new site (using the same password-gate
mechanism as the meditation library — see
`docs/password-gate.md`) instead of linking out to Wix. This is part of
moving fully off Wix hosting.

## Status: complete

The 30 PDFs are now in `gated-assets/therapist-library/`, and the new site has
password-gated routes at `/therapistdoc` and `/en/therapistdoc`. During
`astro build`, `scripts/gated-pages.integration.mjs` encrypts the raw page
content, removes `dist/raw-content`, and copies the PDFs into
`dist/_gated/therapist-library/`.

The sitemap filter in `astro.config.mjs` excludes gated public routes, raw
plaintext routes, and `_gated` asset URLs. The PDF download links are only
rendered inside encrypted raw page content, not on public pages or in the
sitemap.

### Done

- **git-lfs installed** locally: `brew install git-lfs` +
  `git lfs install --local` (scoped to this repo's `.git/config`, not the
  user's global gitconfig). Still need to decide/set up `.gitattributes`
  tracking (e.g. `*.pdf filter=lfs diff=lfs merge=lfs -text`) once files are
  actually being added.
- **Password confirmed**: `Mindthegap` (capital M) unlocks `/therapistdoc`.
- **Download mechanism understood**: each file row has a "⋮" (more actions)
  button → "הורדה" (download) menu item. Clicking it:
  1. POSTs to `https://www.odedarbel.com/api/v1/file-sharing/library-items/download`
     (200 OK, response body not yet captured — see "Blocked" below)
  2. Which returns/triggers a GET to a **signed, short-lived URL** like
     `https://download-files.wixmp.com/raw/<hash>.pdf?token=<JWT>` — the JWT
     `exp`/`iat` claims show a **~15 minute** validity window, so any signed
     URL must be downloaded (via `curl`) promptly after being obtained.
  3. The `<hash>.pdf` raw filename is **not derivable from the item's UUID**
     — it's a separate Wix-internal file hash, only obtainable via the
     download flow itself.
- **Bulk "select all → download" was tried and rejected**: it requires
  signing up as a Wix site member (Google/Facebook/email signup dialog
  appeared). Did not proceed — account creation is out of scope/policy here.
  Per-file download (the "⋮" menu) does **not** require this.
- **All 30 files' real item IDs extracted** (via React internal props on the
  DOM — `item.id` / `item.name`, walking up from each `[title$=".pdf"]`
  element to find the fiber node holding `props.item`). Full list below.
- Two real signed URLs were successfully obtained end-to-end as a proof of
  concept (both now expired):
  - `8 Principles Of Hakomi.pdf` → raw hash `44d76c_8852f37b486c491eadf1c2a82a34fc59.pdf`
  - `100 Years Of Pt. Hillman.pdf` → raw hash `44d76c_192584134ffc44bcaa5180bf5f1059e0.pdf`

### Historical blocked note

Tried to skip the UI entirely by POSTing directly to
`/api/v1/file-sharing/library-items/download` with guessed body shapes
(`{libraryItemId}`, `{id}`, `{itemId}`, `{libraryItemIds: [...]}`) — **all
returned `500 Internal Server Error`**. The real request body Wix's own JS
sends has not been captured yet. Was mid-way through patching
`XMLHttpRequest.prototype.send` (not `window.fetch` — an earlier fetch-patch
attempt captured nothing, suggesting this call uses XHR, not fetch) to log
the real request when the UI's "⋮ → הורדה" is clicked, to learn the correct
body shape and replicate it in a loop over all 30 items instead of clicking
through the UI 30 times.

**Original next-session plan, now obsolete:**

1. Navigate to `https://www.odedarbel.com/therapistdoc`, log in with
   `Mindthegap` (the password field needs a JS-dispatched `input` event to
   register reliably — see the login snippet below; plain synthetic typing
   was flaky in this session for reasons unclear).
2. Patch `XMLHttpRequest.prototype.open`/`send` (see snippet below) to log
   any request whose URL includes `file-sharing`, then click through one
   file's "⋮ → הורדה" via the UI to capture the real POST body shape for
   `/api/v1/file-sharing/library-items/download`.
3. Replicate that exact request shape in a `fetch`/XHR loop over all 30
   `{id, name}` pairs below to get 30 signed wixmp URLs in one shot.
4. `curl` all 30 immediately (15-minute token window) into a new directory —
   **not yet decided**, proposed: `gated-assets/therapist-library/` at the
   repo root (keeps large binaries out of `src/`, out of Astro's Vite
   processing, but still git-lfs-tracked and deployable). Confirm with user
   if unsure.
5. Set up `.gitattributes` for git-lfs (`git lfs track "gated-assets/**/*.pdf"`),
   commit the 30 PDFs via LFS.
6. Only after that: wire them into the site as a gated page (new content
   collection entries / raw+loader pages under the `docs/password-gate.md`
   pattern, listing each PDF with a download link).

### Login snippet (password field needs a real `input` event)

```js
const input = document.getElementById('SM_ROOT_COMP_input');
const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
nativeSetter.call(input, 'Mindthegap');
input.dispatchEvent(new Event('input', {bubbles: true}));
input.dispatchEvent(new Event('change', {bubbles: true}));
// then click the submit button via .click() (JS click), not coordinate-based —
// coordinate clicks on this Wix login form were unreliable this session:
Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('כניסה')).click();
```

### XHR capture snippet (not yet run to completion)

```js
window.__xhrCaptured = [];
const origOpen = XMLHttpRequest.prototype.open;
const origSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.open = function (method, url, ...rest) {
	this.__method = method;
	this.__url = url;
	return origOpen.call(this, method, url, ...rest);
};
XMLHttpRequest.prototype.send = function (body) {
	if (this.__url && this.__url.includes('file-sharing')) {
		window.__xhrCaptured.push({ method: this.__method, url: this.__url, body });
	}
	return origSend.call(this, body);
};
```

Then trigger one file's "⋮ → הורדה" via the UI (real click, not just
`.click()` on the menu item might be needed if it's a portal — inspect via
screenshot first to find the open menu's coordinates), then read
`window.__xhrCaptured`.

## Full file list (30 items)

`parentFolderId` (the library folder itself): `1b6c2c64-1bcc-4c85-ae5f-8e47cbe84f31`

| # | Item ID (UUID) | Filename |
|---|---|---|
| 1 | c2b52963-a84f-44e5-a5e9-d1f347b49fbb | 8 Principles Of Hakomi.pdf |
| 2 | b77c30c2-26a3-4551-aae9-affbb7a7600c | 100 Years Of Pt. Hillman.pdf |
| 3 | e861bec6-793c-4bc8-a2b1-a0d9d01dbbdc | Chief Seattles Letter.pdf |
| 4 | 6c6e9ab4-346f-4330-92e5-457ae7a683f7 | Constancy Suzuki 2.pdf |
| 5 | 0699b98e-2a10-44f9-9c15-7502c9404344 | Constancy Suzuki.pdf |
| 6 | ade6c9b4-b4c8-464f-b838-d8de42ed74ac | Encouragement Of Zazen.pdf |
| 7 | 8b0b70b7-6ffd-413f-ab1f-a0d7cd19fb28 | Enso.pdf |
| 8 | 765b3793-0625-4514-adc5-12e1f8e2329b | Fixing And Healing.pdf |
| 9 | b719a4c9-7ebf-4ff8-93b3-00ab121a878e | Ghant Masochism Submission Surrender 2.pdf |
| 10 | 0d94929f-04d4-42be-acb9-0a29ace0779f | Ghent Surrender.pdf |
| 11 | dc0b4466-3e1a-4438-aeac-8747350c3979 | Healing Presence.pdf |
| 12 | 3ea2a009-217f-4291-a8cc-2ce8922df88e | Heart Sutra Tanahashi.pdf |
| 13 | 1f8fb3b4-5e0d-43d2-8e83-e5712c5defaa | How To Be.pdf |
| 14 | 39a3f6cf-1520-4333-8209-1e835e4dbf27 | Listening With The Body.pdf |
| 15 | 5d07e6a3-3829-4bc8-8faf-061d66a09ce1 | Love After Love.pdf |
| 16 | 548072ae-590f-47fc-9de2-1051fa36f51c | Ma.pdf |
| 17 | 480bd4f7-e280-4a4e-b776-34129b673a9f | Maka Han Nya Hara Mita Shin Gyo.pdf |
| 18 | 4f653c96-9cf5-4c2a-853e-1f4c461571d0 | Mindfulness Meditation To Teach Beginning Therapists Therapeutic Presence.pdf |
| 19 | 8964040b-dc1d-49a2-b35a-165ae44214c6 | No Mud No Lotus.pdf |
| 20 | 9c9b7827-9ad0-42c0-b4f7-0c98955698ef | No Self Barry Magid.pdf |
| 21 | 6952dd17-5460-41c5-ac9b-b64f62d43883 | No Trace Suzuki Zmbm.pdf |
| 22 | 7ad49c1d-b6bd-487f-9ee2-00cb5eaa024d | Non Interpretive Mechanisms In Psychoanalytic Therapy.pdf |
| 23 | 62e60778-fc6e-40bd-b6cc-962475c738a0 | Only Dont Know.pdf |
| 24 | cc1a63b3-d78d-412f-a5e0-990d4e95558f | Posture.pdf |
| 25 | ad786e7d-9105-4a1f-97b8-294e36b6db2c | Psychology Of Awekaning Chapter11.pdf |
| 26 | f457cbb9-fc84-4ebd-8d67-a2febec605ab | Psychology Of Awekaning Chapter12.pdf |
| 27 | 3974eacb-173d-4e88-b3e1-e36d0af8c5a5 | Psychology Of Awekaning Chapter16.pdf |
| 28 | f68fe873-61a7-4ab6-bf12-1864951d6ebc | Psychology Of Awekaning Chapter17.pdf |
| 29 | 6900b853-9c4a-49dc-9ef3-56722ebf2630 | Pt As A Practice Of Love Welwood.pdf |
| 30 | d54c5181-5b31-4070-98a1-dee6104f4f13 | Radicalacceptance Chapter3 (1).pdf |

If re-extracting this list is ever needed again (e.g. the folder contents
changed), here's the working extraction snippet, run after logging in:

```js
function findReactProps(el) {
	const key = Object.keys(el).find((k) => k.startsWith('__reactProps$') || k.startsWith('__reactFiber$'));
	return key ? el[key] : null;
}
function getItem(el) {
	let node = el;
	for (let i = 0; i < 12 && node; i++) {
		const props = findReactProps(node);
		const p = props && (props.memoizedProps || props.pendingProps);
		if (p && p.children && p.children.props && p.children.props.item) {
			return p.children.props.item;
		}
		node = node.parentElement;
	}
	return null;
}
const items = new Map();
for (const el of document.querySelectorAll('[title$=".pdf"]')) {
	const it = getItem(el);
	if (it) items.set(it.id, it.name);
}
Array.from(items, ([id, name]) => ({ id, name }));
```
