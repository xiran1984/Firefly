import { SKIP, visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import { parseWikiLink, resolveWikiTarget } from "../lib/note-links.mjs";

const WIKI_LINK_PATTERN = /\[\[([^\]\n]+)\]\]/g;

function createWikiLinkNode(rawValue, noteMap) {
	const { target, label } = parseWikiLink(rawValue);
	const slug = resolveWikiTarget(target, noteMap);

	if (!slug) {
		return {
			type: "text",
			value: label,
			data: {
				hName: "span",
				hProperties: {
					className: ["wikilink-unpublished"],
					title: "未发布笔记",
				},
			},
		};
	}

	return {
		type: "link",
		url: `/notes/${slug}/`,
		children: [{ type: "text", value: label }],
		data: {
			hProperties: {
				className: ["wikilink"],
			},
		},
	};
}

export function remarkWikiLinks({
	noteMap = {},
	stripRelationSection = false,
} = {}) {
	return (tree) => {
		if (stripRelationSection) {
			const relationIndex = tree.children.findIndex(
				(node) =>
					node.type === "heading" &&
					node.depth === 2 &&
					toString(node).trim() === "关联",
			);
			if (relationIndex >= 0) {
				const nextSectionOffset = tree.children
					.slice(relationIndex + 1)
					.findIndex((node) => node.type === "heading" && node.depth <= 2);
				const deleteCount =
					nextSectionOffset < 0
						? tree.children.length - relationIndex
						: nextSectionOffset + 1;
				tree.children.splice(relationIndex, deleteCount);
			}
		}

		visit(tree, "text", (node, index, parent) => {
			if (!parent || index === undefined || parent.type === "link") return;

			const matches = [...node.value.matchAll(WIKI_LINK_PATTERN)];
			if (matches.length === 0) return;

			const replacement = [];
			let cursor = 0;

			for (const match of matches) {
				if (match.index > cursor) {
					replacement.push({
						type: "text",
						value: node.value.slice(cursor, match.index),
					});
				}
				replacement.push(createWikiLinkNode(match[1], noteMap));
				cursor = match.index + match[0].length;
			}

			if (cursor < node.value.length) {
				replacement.push({ type: "text", value: node.value.slice(cursor) });
			}

			parent.children.splice(index, 1, ...replacement);
			return [SKIP, index + replacement.length];
		});
	};
}
