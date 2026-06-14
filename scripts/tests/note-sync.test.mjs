import assert from "node:assert/strict";
import test from "node:test";
import { convertAtomicNote } from "../lib/note-sync.mjs";

test("converts an atomic note to website frontmatter", () => {
	const source = `---
tags:
  - personal-growth/thinking
  - society/systems
created: 2026-06-14
source: "[[知乎 - 示例]]"
status: active
---

# 示例笔记

> [!summary] 核心主张
> 这是一段**摘要**。

## 核心内容

正文。

## Inbox原文标注

- [[知乎 - 示例#^block]]：来源

## 关联

- [[另一篇笔记]]
- [[MOC - 思维与认知]]
`;

	const output = convertAtomicNote(source);
	assert.match(output, /title: "示例笔记"/);
	assert.match(output, /published: 2026-06-14/);
	assert.match(output, /tags: \["思维认知","社会系统"\]/);
	assert.match(output, /category: "个人成长"/);
	assert.match(output, /## 核心内容/);
	assert.doesNotMatch(output, /Inbox原文标注|知乎 - 示例|MOC - 思维与认知/);
	assert.match(output, /## 关联/);
	assert.match(output, /- \[\[另一篇笔记\]\]/);
});
