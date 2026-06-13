import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { slug as githubSlug } from "github-slugger";
import { normalizeNoteTitle } from "../src/lib/note-links.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath =
	process.argv[2] || "E:\\网站内容\\.sync\\notes-manifest.json";
const manifest = JSON.parse(
	(await readFile(manifestPath, "utf8")).replace(/^\uFEFF/, ""),
);
const notesDirectory = path.join(repoRoot, "src", "content", "notes");
const noteMapPath = path.join(repoRoot, "src", "data", "note-link-map.json");

function splitFrontmatter(markdown) {
	const match = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
	if (!match) throw new Error("Website note is missing frontmatter.");
	return { frontmatter: match[0].trimEnd(), body: markdown.slice(match[0].length) };
}

function prepareSourceBody(markdown) {
	let body = markdown
		.replace(/^\uFEFF/, "")
		.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
	body = body.trimStart();
	body = body.replace(/^# .+\r?\n+/, "");
	body = body.trimStart();
	body = body.replace(/^> \[!summary\].*\r?\n(?:>.*\r?\n?)+\r?\n?/, "");
	return body.trim();
}

function sha256(value) {
	return createHash("sha256").update(value).digest("hex");
}

const noteMap = {};

for (const entry of manifest.entries) {
	const sourcePath = path.join(manifest.notesSource, entry.relativePath);
	const websitePath = path.join(notesDirectory, entry.websiteFile);
	const source = await readFile(sourcePath, "utf8");
	const website = await readFile(websitePath, "utf8");
	const { frontmatter } = splitFrontmatter(website);
	const restored = `${frontmatter}\n\n${prepareSourceBody(source)}\n`;

	await writeFile(websitePath, restored, "utf8");

	const slug = githubSlug(path.parse(entry.websiteFile).name);
	for (const title of [
		entry.title,
		entry.websiteTitle,
		path.parse(entry.relativePath).name,
		slug,
	]) {
		noteMap[normalizeNoteTitle(title)] = slug;
	}

	entry.sourceSha256 = sha256(source);
	entry.websiteSha256 = sha256(restored);
}

await writeFile(noteMapPath, `${JSON.stringify(noteMap, null, "\t")}\n`, "utf8");
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(`Restored wikilinks in ${manifest.entries.length} notes.`);
console.log(`Generated ${Object.keys(noteMap).length} note title aliases.`);
