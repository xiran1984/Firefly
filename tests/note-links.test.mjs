import assert from "node:assert/strict";
import test from "node:test";
import {
	buildNoteGraph,
	extractResolvedNoteLinks,
	parseWikiLink,
} from "../src/lib/note-links.mjs";

const noteMap = {
	"目标笔记": "目标笔记",
	"目标别名": "目标笔记",
	"另一篇": "另一篇",
};

test("parses aliases and removes Obsidian block references", () => {
	assert.deepEqual(parseWikiLink("目标笔记|显示文字"), {
		target: "目标笔记",
		label: "显示文字",
	});
	assert.deepEqual(parseWikiLink("目标笔记#^block-id"), {
		target: "目标笔记",
		label: "目标笔记",
	});
});

test("extracts only published note links and removes duplicates", () => {
	const body = [
		"链接到 [[目标别名|显示文字]]。",
		"再次链接到 [[目标笔记]]。",
		"未发布的 [[MOC - 总索引]] 保持普通文字。",
		"`[[代码里的链接]]`",
	].join("\n");

	assert.deepEqual(extractResolvedNoteLinks(body, noteMap), ["目标笔记"]);
});

test("builds an undirected note graph without duplicate or self references", () => {
	const notes = [
		{ id: "来源一", title: "来源一", body: "[[目标笔记]]" },
		{ id: "来源二", title: "来源二", body: "[[目标别名]] 和 [[另一篇]]" },
		{ id: "目标笔记", title: "目标笔记", body: "[[目标笔记]]" },
		{ id: "另一篇", title: "另一篇", body: "" },
	];

	assert.deepEqual(buildNoteGraph(notes, noteMap).relatedById, {
		"来源一": [{ id: "目标笔记", title: "目标笔记" }],
		"来源二": [
			{ id: "另一篇", title: "另一篇" },
			{ id: "目标笔记", title: "目标笔记" },
		],
		"目标笔记": [
			{ id: "来源二", title: "来源二" },
			{ id: "来源一", title: "来源一" },
		],
		"另一篇": [{ id: "来源二", title: "来源二" }],
	});
});

test("keeps unpublished nodes from the relation section", () => {
	const notes = [
		{
			id: "来源一",
			title: "来源一",
			body: "正文提到 [[未发布正文来源]]。\n\n## 关联\n\n- [[MOC - 总索引]]",
		},
	];

	assert.deepEqual(buildNoteGraph(notes, noteMap).unpublishedById, {
		"来源一": ["MOC - 总索引"],
	});
});
