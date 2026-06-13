const WIKI_LINK_PATTERN = /\[\[([^\]\n]+)\]\]/g;

export function normalizeNoteTitle(value) {
	return value.trim().normalize("NFC").toLocaleLowerCase();
}

export function parseWikiLink(value) {
	const [rawTarget, rawLabel] = value.split("|", 2);
	const target = rawTarget.split("#", 1)[0].trim();

	return {
		target,
		label: (rawLabel || target).trim(),
	};
}

export function resolveWikiTarget(target, noteMap) {
	return noteMap[normalizeNoteTitle(target)] || null;
}

export function extractWikiLinks(markdown) {
	const withoutCode = markdown
		.replace(/```[\s\S]*?```/g, "")
		.replace(/~~~[\s\S]*?~~~/g, "")
		.replace(/`[^`\n]*`/g, "");

	return Array.from(withoutCode.matchAll(WIKI_LINK_PATTERN), (match) =>
		parseWikiLink(match[1]),
	);
}

export function extractResolvedNoteLinks(markdown, noteMap) {
	const resolved = extractWikiLinks(markdown)
		.map(({ target }) => resolveWikiTarget(target, noteMap))
		.filter(Boolean);

	return [...new Set(resolved)];
}

export function extractRelationWikiLinks(markdown) {
	const relationMatch = markdown.match(
		/^## 关联[^\S\r\n]*\r?\n([\s\S]*?)(?=^#{1,2}\s|(?![\s\S]))/m,
	);
	return relationMatch ? extractWikiLinks(relationMatch[1]) : [];
}

export function buildNoteGraph(notes, noteMap) {
	const notesById = new Map(notes.map((note) => [note.id, note]));
	const relatedMaps = new Map();
	const unpublishedById = {};

	function addRelation(sourceId, targetId) {
		if (sourceId === targetId || !notesById.has(targetId)) return;
		const target = notesById.get(targetId);
		const relations = relatedMaps.get(sourceId) || new Map();
		relations.set(targetId, { id: targetId, title: target.title });
		relatedMaps.set(sourceId, relations);
	}

	for (const note of notes) {
		for (const targetId of extractResolvedNoteLinks(note.body, noteMap)) {
			addRelation(note.id, targetId);
			addRelation(targetId, note.id);
		}

		unpublishedById[note.id] = [
			...new Set(
				extractRelationWikiLinks(note.body)
					.filter(({ target }) => !resolveWikiTarget(target, noteMap))
					.map(({ label }) => label),
			),
		];
	}

	const relatedById = {};
	for (const [id, relations] of relatedMaps) {
		relatedById[id] = [...relations.values()].sort((a, b) =>
			a.title.localeCompare(b.title, "zh-CN"),
		);
	}

	return { relatedById, unpublishedById };
}
