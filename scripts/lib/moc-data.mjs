function normalizeTitle(value) {
	return value
		.normalize("NFKC")
		.toLowerCase()
		.replace(/[\s\-—_，。、“”‘’：:（）()·]/g, "");
}

export function toContentId(filename) {
	return filename.normalize("NFKC").toLowerCase().replace(/[—–]/g, "");
}

function similarity(left, right) {
	const a = normalizeTitle(left);
	const b = normalizeTitle(right);
	if (a === b) return 1;
	if (a.startsWith(b) || b.startsWith(a)) {
		const lengthRatio = Math.min(a.length, b.length) / Math.max(a.length, b.length);
		return 0.95 + lengthRatio * 0.05;
	}

	const rows = Array.from({ length: a.length + 1 }, (_, index) => index);
	for (let column = 1; column <= b.length; column += 1) {
		let previous = rows[0];
		rows[0] = column;
		for (let row = 1; row <= a.length; row += 1) {
			const current = rows[row];
			rows[row] = Math.min(
				rows[row] + 1,
				rows[row - 1] + 1,
				previous + (a[row - 1] === b[column - 1] ? 0 : 1),
			);
			previous = current;
		}
	}
	return 1 - rows[a.length] / Math.max(a.length, b.length);
}

export function parseMocDocument(source) {
	const heading = source.match(/^#\s+(?:\p{Extended_Pictographic}\uFE0F?\s*)?MOC\s*-\s*(.+)$/mu);
	if (!heading) {
		throw new Error("MOC 文件缺少“# MOC - 名称”标题");
	}

	const summary = source.match(/^>\s*\[!summary\].*\r?\n>\s*(.+)$/m);
	const notes = [...source.matchAll(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g)].map(
		(match) => match[1].trim(),
	);

	return {
		name: heading[1].trim(),
		description: summary?.[1]?.trim() ?? "",
		notes,
	};
}

export function resolveMocMemberships(mocs, siteNotes) {
	const unresolved = [];
	const resolvedMocs = mocs.map((moc) => {
		const noteIds = [];
		for (const title of moc.notes) {
			const candidates = siteNotes
				.map((note) => ({ note, score: similarity(title, note.title) }))
				.sort((left, right) => right.score - left.score);
			const best = candidates[0];
			const runnerUp = candidates[1];
			if (
				best &&
				best.score >= 0.78 &&
				(!runnerUp || best.score - runnerUp.score >= 0.05)
			) {
				noteIds.push(best.note.id);
			} else {
				unresolved.push({ moc: moc.name, title });
			}
		}
		return {
			name: moc.name,
			description: moc.description,
			noteIds,
		};
	});

	return { mocs: resolvedMocs, unresolved };
}
