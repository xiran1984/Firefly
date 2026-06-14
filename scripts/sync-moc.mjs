import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	parseMocDocument,
	resolveMocMemberships,
	toContentId,
} from "./lib/moc-data.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const knowledgeNotesDir =
	process.env.KNOWLEDGE_NOTES_DIR ?? "E:\\我的知识库\\Notes";
const websiteNotesDir = path.join(projectRoot, "src", "content", "notes");
const outputFile = path.join(projectRoot, "src", "data", "note-mocs.json");

const mocFiles = (await readdir(knowledgeNotesDir, { withFileTypes: true }))
	.filter(
		(entry) =>
			entry.isFile() &&
			entry.name.startsWith("MOC - ") &&
			entry.name.endsWith(".md") &&
			entry.name !== "MOC - 总索引.md",
	)
	.sort((left, right) => left.name.localeCompare(right.name, "zh-CN"));

const mocs = await Promise.all(
	mocFiles.map(async (entry) =>
		parseMocDocument(
			await readFile(path.join(knowledgeNotesDir, entry.name), "utf8"),
		),
	),
);

const noteFiles = (await readdir(websiteNotesDir, { withFileTypes: true })).filter(
	(entry) => entry.isFile() && /\.mdx?$/.test(entry.name),
);
const siteNotes = await Promise.all(
	noteFiles.map(async (entry) => {
		const source = await readFile(path.join(websiteNotesDir, entry.name), "utf8");
		const title = source.match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1]?.trim();
		if (!title) throw new Error(`网站笔记缺少 title：${entry.name}`);
		return {
			id: toContentId(entry.name.replace(/\.mdx?$/, "")),
			title,
		};
	}),
);

const result = resolveMocMemberships(mocs, siteNotes);
if (result.unresolved.length > 0) {
	const details = result.unresolved
		.map((item) => `- ${item.moc}: ${item.title}`)
		.join("\n");
	throw new Error(`以下 MOC 成员无法匹配网站笔记：\n${details}`);
}

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(
	outputFile,
	`${JSON.stringify(
		{
			mocs: result.mocs,
		},
		null,
		2,
	)}\n`,
	"utf8",
);

console.log(
	`已同步 ${result.mocs.length} 个 MOC，共 ${result.mocs.reduce((sum, moc) => sum + moc.noteIds.length, 0)} 条目录关系。`,
);
