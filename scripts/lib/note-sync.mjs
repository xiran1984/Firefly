const tagLabels = {
	"personal-growth/thinking": "思维认知",
	"personal-growth/social": "社交关系",
	"personal-growth/evolution": "进化策略",
	"personal-growth/psychology": "心理自我",
	"personal-growth/execution": "行动执行",
	"society/systems": "社会系统",
	"ai/tools": "AI工具",
	"ai/business": "AI商业",
};

function parseSource(source) {
	const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
	const title = source.match(/^#\s+(.+)$/m)?.[1]?.trim();
	const description = source.match(
		/^>\s*\[!summary\].*\r?\n>\s*(.+)$/m,
	)?.[1]?.trim();
	const created = frontmatter?.[1].match(/^created:\s*(.+)$/m)?.[1]?.trim();
	const tags =
		frontmatter?.[1].match(/(?:^|\r?\n)tags:\s*\r?\n((?:\s+-\s+.*\r?\n?)+)/)?.[1]
			.match(/^\s+-\s+(.+)$/gm)
			?.map((line) => line.replace(/^\s+-\s+/, "").trim()) ?? [];

	if (!title || !created) {
		throw new Error("原子笔记缺少 H1 标题或 created 日期");
	}

	return { title, description: description ?? "", created, tags };
}

function categoryFor(tags) {
	const primaryTag = tags[0] ?? "";
	if (primaryTag.startsWith("ai/")) return "AI与技术";
	if (primaryTag.startsWith("society/")) return "社会";
	return "个人成长";
}

export function getAtomicNoteTitle(source) {
	return parseSource(source).title;
}

export function convertAtomicNote(source) {
	const note = parseSource(source);
	const summary = source.match(/^>\s*\[!summary\].*\r?\n>\s*.+$/m);
	let body = summary ? source.slice(summary.index + summary[0].length) : source;

	body = body
		.replace(
			/^##\s+Inbox\s*原文标注\s*\r?\n[\s\S]*?(?=^##\s+|\s*$)/m,
			"",
		)
		.replace(/^- \[\[MOC - [^\]]+\]\]\s*$/gm, "")
		.trim();

	const websiteTags = note.tags
		.map((tag) => tagLabels[tag])
		.filter((tag) => Boolean(tag));

	return `---
title: ${JSON.stringify(note.title)}
published: ${note.created}
description: ${JSON.stringify(note.description)}
tags: ${JSON.stringify(websiteTags)}
category: ${JSON.stringify(categoryFor(note.tags))}
draft: false
---

${body}
`;
}
