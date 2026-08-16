// Postbuild step: for each entry in gated-pages.config.mjs, encrypt the
// rendered "raw" page's body content with a key derived from the plain
// password (SHA-256 -> AES-256-GCM), inject the ciphertext into the built
// loader page, and delete the raw page so its plaintext never ships.
//
// This is intentionally low-security (no KDF work factor, no rate limiting) —
// it just keeps the content out of page source until the password is
// entered client-side. See docs/password-gate.md.
import { createCipheriv, createHash, randomBytes } from 'node:crypto';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { gatedPages } from './gated-pages.config.mjs';

const distDir = path.resolve(import.meta.dirname, '../dist');

function encrypt(plaintext, password) {
	const key = createHash('sha256').update(password, 'utf8').digest();
	const iv = randomBytes(12);
	const cipher = createCipheriv('aes-256-gcm', key, iv);
	const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
	const authTag = cipher.getAuthTag();
	return {
		iv: iv.toString('base64'),
		cipher: Buffer.concat([encrypted, authTag]).toString('base64'),
	};
}

function extractBody(html) {
	const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
	if (!match) throw new Error('Could not find <body> in raw page HTML');
	return match[1];
}

for (const { raw, loader, passwordEnv } of gatedPages) {
	const password = process.env[passwordEnv];
	if (!password) {
		throw new Error(
			`Missing password: env var ${passwordEnv} is not set. Add it to .env (see .env.example) or, in CI, to the repo's GitHub Actions secrets.`,
		);
	}

	const rawPath = path.join(distDir, raw, 'index.html');
	const loaderPath = path.join(distDir, loader, 'index.html');

	if (!existsSync(rawPath)) throw new Error(`Raw page not built: ${rawPath}`);
	if (!existsSync(loaderPath)) throw new Error(`Loader page not built: ${loaderPath}`);

	const rawHtml = await readFile(rawPath, 'utf8');
	const bodyHtml = extractBody(rawHtml);
	const { iv, cipher } = encrypt(bodyHtml, password);

	let loaderHtml = await readFile(loaderPath, 'utf8');
	if (!loaderHtml.includes('__GATE_IV__') || !loaderHtml.includes('__GATE_CIPHER__')) {
		throw new Error(`Loader page missing gate placeholders: ${loaderPath}`);
	}
	loaderHtml = loaderHtml.replace('__GATE_IV__', iv).replace('__GATE_CIPHER__', cipher);
	await writeFile(loaderPath, loaderHtml, 'utf8');

	console.log(`[gated] encrypted ${raw} -> ${loader}`);
}

// Remove the raw-content/ output directory so no plaintext gated content ships.
await rm(path.join(distDir, 'raw-content'), { recursive: true, force: true });
console.log('[gated] removed dist/raw-content');
