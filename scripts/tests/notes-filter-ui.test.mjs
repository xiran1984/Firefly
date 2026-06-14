import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const notesPage = await readFile(
	new URL("../../src/pages/notes/index.astro", import.meta.url),
	"utf8",
);

test("notes page only filters by MOC", () => {
	assert.doesNotMatch(notesPage, /时间范围/);
	assert.doesNotMatch(notesPage, /notes-date-from|notes-date-to|data-range/);
});

test("clicking a MOC does not scroll the page", () => {
	assert.doesNotMatch(notesPage, /scrollIntoView/);
});
