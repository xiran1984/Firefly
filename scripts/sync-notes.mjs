import { readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	convertAtomicNote,
	getAtomicNoteTitle,
} from "./lib/note-sync.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = process.env.KNOWLEDGE_NOTES_DIR ?? "E:\\我的知识库\\Notes";
const targetRoot = path.join(projectRoot, "src", "content", "notes");

async function markdownFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await markdownFiles(fullPath)));
		} else if (
			entry.isFile() &&
			entry.name.endsWith(".md") &&
			!entry.name.startsWith("MOC - ")
		) {
			files.push(fullPath);
		}
	}
	return files;
}

const sourceNotes = await Promise.all(
	(await markdownFiles(sourceRoot)).map(async (file) => {
		const content = await readFile(file, "utf8");
		return { file, content, title: getAtomicNoteTitle(content) };
	}),
);
const sourceByTitle = new Map(sourceNotes.map((note) => [note.title, note]));

const targetNotes = await Promise.all(
	(await readdir(targetRoot))
		.filter((name) => /\.mdx?$/.test(name))
		.map(async (name) => {
			const file = path.join(targetRoot, name);
			const content = await readFile(file, "utf8");
			const title = content.match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1]?.trim();
			if (!title) throw new Error(`网站笔记缺少 title：${name}`);
			return { file, title };
		}),
);

const removed = [];
for (const note of targetNotes) {
	if (!sourceByTitle.has(note.title)) {
		await rm(note.file);
		removed.push(note.title);
	}
}

const existingTitles = new Set(
	targetNotes
		.filter((note) => sourceByTitle.has(note.title))
		.map((note) => note.title),
);
const added = [];
for (const note of sourceNotes) {
	if (existingTitles.has(note.title)) continue;
	const filename = `${path.basename(note.file, ".md").replaceAll(" ", "-")}.md`;
	await writeFile(
		path.join(targetRoot, filename),
		convertAtomicNote(note.content),
		"utf8",
	);
	added.push(note.title);
}

console.log(`已删除 ${removed.length} 篇网站笔记，新增 ${added.length} 篇。`);
if (removed.length > 0) console.log(`删除：${removed.join("、")}`);
if (added.length > 0) console.log(`新增：${added.join("、")}`);

