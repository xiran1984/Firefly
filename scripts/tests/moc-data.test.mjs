import assert from "node:assert/strict";
import test from "node:test";
import {
	parseMocDocument,
	resolveMocMemberships,
	toContentId,
} from "../lib/moc-data.mjs";

test("parses a MOC title, summary, and note links", () => {
	const source = `---
tags:
  - moc
---

# 🤖 MOC - AI商业与经济

> [!summary] 核心主张
> AI 商业、Token 经济、变现逻辑。

## 笔记列表

- [[第一篇笔记]]
- [[第二篇笔记|显示名称]]
`;

	assert.deepEqual(parseMocDocument(source), {
		name: "AI商业与经济",
		description: "AI 商业、Token 经济、变现逻辑。",
		notes: ["第一篇笔记", "第二篇笔记"],
	});
});

test("resolves known title differences and reports missing notes", () => {
	const result = resolveMocMemberships(
		[
			{
				name: "AI工具与技术",
				description: "工具",
				notes: ["AI工具的赛博格化", "不存在的笔记"],
			},
		],
		[
			{
				id: "ai-cyborg",
				title: "AI工具的赛博格化——获取不平等与适配度差异",
			},
		],
	);

	assert.deepEqual(result.mocs[0].noteIds, ["ai-cyborg"]);
	assert.deepEqual(result.unresolved, [
		{ moc: "AI工具与技术", title: "不存在的笔记" },
	]);
});

test("normalizes filenames to Astro content IDs", () => {
	assert.equal(
		toContentId("AI工具的赛博格化——获取不平等与适配度差异"),
		"ai工具的赛博格化获取不平等与适配度差异",
	);
	assert.equal(toContentId("ASD-沟通模式"), "asd-沟通模式");
});
