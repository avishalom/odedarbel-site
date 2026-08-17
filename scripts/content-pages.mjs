import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const pagesDir = path.join(repoRoot, 'src/content/pages');

function parseScalar(value) {
	const trimmed = value.trim();
	if (trimmed === 'true') return true;
	if (trimmed === 'false') return false;
	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1);
	}
	return trimmed;
}

function parseFrontmatter(text, filePath) {
	const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) throw new Error(`Missing frontmatter: ${filePath}`);

	const data = {};
	let parent = null;

	for (const rawLine of match[1].split(/\r?\n/)) {
		if (!rawLine.trim()) continue;

		const nested = rawLine.match(/^  ([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
		if (nested && parent) {
			data[parent][nested[1]] = parseScalar(nested[2]);
			continue;
		}

		const topLevel = rawLine.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
		if (!topLevel) throw new Error(`Unsupported frontmatter line in ${filePath}: ${rawLine}`);

		const [, key, value] = topLevel;
		if (value === '') {
			data[key] = {};
			parent = key;
		} else {
			data[key] = parseScalar(value);
			parent = null;
		}
	}

	return data;
}

function walk(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const filePath = path.join(dir, entry.name);
		if (entry.isDirectory()) return walk(filePath);
		if (entry.isFile() && entry.name.endsWith('.mdx')) return [filePath];
		return [];
	});
}

export function loadContentPages() {
	return walk(pagesDir).map((filePath) => ({
		filePath,
		data: parseFrontmatter(readFileSync(filePath, 'utf8'), filePath),
	}));
}

const toRoute = (pagePath) => pagePath.replace(/^\/|\/$/g, '');

export function loadGatedPages() {
	return loadContentPages()
		.filter(({ data }) => data.gate?.passwordEnv)
		.map(({ data }) => ({
			raw: toRoute(`/raw-content${data.path}`),
			loader: toRoute(data.path),
			passwordEnv: data.gate.passwordEnv,
		}));
}
