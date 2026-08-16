import { createCipheriv, createHash, randomBytes } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gatedAssetDirectories, gatedPages } from './gated-pages.config.mjs';

const repoRoot = path.resolve(import.meta.dirname, '..');

async function loadDotEnvIfExists() {
	const envPath = path.join(repoRoot, '.env');
	if (!existsSync(envPath)) return;

	const text = await readFile(envPath, 'utf8');
	for (const line of text.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
		if (!match) continue;

		const [, key, rawValue] = match;
		if (process.env[key] !== undefined) continue;
		process.env[key] = rawValue.replace(/^(['"])(.*)\1$/, '$2');
	}
}

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

async function encryptGatedPages(distDir, logger) {
	await loadDotEnvIfExists();

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

		logger.info(`encrypted ${raw} -> ${loader}`);
	}

	await rm(path.join(distDir, 'raw-content'), { recursive: true, force: true });
	logger.info('removed dist/raw-content');
}

async function findLfsPointerFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const pointerFiles = [];

	for (const entry of entries) {
		const filePath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			pointerFiles.push(...(await findLfsPointerFiles(filePath)));
			continue;
		}

		if (!entry.isFile()) continue;

		const fileStat = await stat(filePath);
		if (fileStat.size > 512) continue;

		const start = await readFile(filePath, 'utf8');
		if (start.startsWith('version https://git-lfs.github.com/spec/v1')) {
			pointerFiles.push(filePath);
		}
	}

	return pointerFiles;
}

async function copyGatedAssets(distDir, logger) {
	for (const { source, output } of gatedAssetDirectories) {
		const sourcePath = path.join(repoRoot, source);
		const outputPath = path.join(distDir, output);
		if (!existsSync(sourcePath)) throw new Error(`Gated asset directory not found: ${sourcePath}`);

		const pointerFiles = await findLfsPointerFiles(sourcePath);
		if (pointerFiles.length > 0) {
			throw new Error(
				`Gated assets were checked out as Git LFS pointer files instead of real files:\n${pointerFiles
					.map((file) => `- ${path.relative(repoRoot, file)}`)
					.join('\n')}\nEnable Git LFS checkout before running the build.`,
			);
		}

		await rm(outputPath, { recursive: true, force: true });
		await mkdir(path.dirname(outputPath), { recursive: true });
		await cp(sourcePath, outputPath, { recursive: true });
		logger.info(`copied assets ${source} -> ${output}`);
	}
}

export function gatedPagesIntegration() {
	return {
		name: 'gated-pages',
		hooks: {
			'astro:build:done': async ({ dir, logger }) => {
				const distDir = fileURLToPath(dir);
				await encryptGatedPages(distDir, logger);
				await copyGatedAssets(distDir, logger);
			},
		},
	};
}
