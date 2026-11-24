import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { get, list, put } from "@vercel/blob";
import sharp from "sharp";

const prefix = "immich/shengtu";
const manifestPath = `${prefix}/manifest.json`;
const albumName = "生图";
const uuid = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

const hash = (value) => createHash("sha256").update(value).digest("hex");

function readConfig(env, dryRun) {
	const immichUrl = new URL(env.IMMICH_URL || "http://127.0.0.1:2283");
	if (
		!["http:", "https:"].includes(immichUrl.protocol) ||
		immichUrl.username ||
		immichUrl.password ||
		immichUrl.search ||
		immichUrl.hash
	) {
		throw new Error(
			"IMMICH_URL must be an HTTP or HTTPS base URL without credentials",
		);
	}
	const config = {
		api: `${immichUrl.href.replace(/\/$/, "").replace(/\/api$/, "")}/api`,
		albumId: env.IMMICH_ALBUM_ID,
		apiKey: env.IMMICH_API_KEY,
		blobToken: env.BLOB_READ_WRITE_TOKEN,
	};
	if (
		!uuid.test(config.albumId || "") ||
		!config.apiKey ||
		(!dryRun && !config.blobToken)
	) {
		throw new Error(
			"Set IMMICH_ALBUM_ID, IMMICH_API_KEY and BLOB_READ_WRITE_TOKEN (optional for --dry-run)",
		);
	}
	return config;
}

async function immichRequest(config, route, body) {
	const response = await fetch(`${config.api}/${route}`, {
		method: body ? "POST" : "GET",
		headers: { "x-api-key": config.apiKey, "content-type": "application/json" },
		body: body && JSON.stringify(body),
		redirect: "error",
		signal: AbortSignal.timeout(30000),
	});
	if (!response.ok)
		throw new Error(`Immich ${route.split("?")[0]} HTTP ${response.status}`);
	return response;
}

async function readAlbum(config) {
	const album = await (
		await immichRequest(config, `albums/${config.albumId}`)
	).json();
	if (
		album.id !== config.albumId ||
		album.albumName !== albumName ||
		!Number.isInteger(album.assetCount) ||
		album.assetCount < 0
	) {
		throw new Error(
			"Configured Immich album must match the 生图 album ID and name",
		);
	}

	const assets = new Map();
	const cursors = new Set();
	let cursor;
	do {
		const page = await (
			await immichRequest(config, "search/metadata", {
				filter: { albumIds: { any: [config.albumId] } },
				size: 100,
				cursor,
			})
		).json();
		const result = page.assets;
		if (
			!Array.isArray(result?.items) ||
			!(result.nextCursor === null || typeof result.nextCursor === "string")
		) {
			throw new Error("Unexpected Immich search response");
		}
		for (const asset of result.items) {
			if (!uuid.test(asset.id || "") || assets.has(asset.id)) {
				throw new Error("Invalid or repeated Immich asset ID while paging");
			}
			assets.set(asset.id, asset);
		}
		cursor = result.nextCursor;
		if (cursor && cursors.has(cursor))
			throw new Error("Immich repeated a pagination cursor");
		cursors.add(cursor);
	} while (cursor);

	if (assets.size !== album.assetCount) {
		throw new Error(
			`Immich returned ${assets.size} of ${album.assetCount} album assets`,
		);
	}
	const photos = [...assets.values()]
		.filter(
			({ type, isTrashed, visibility }) =>
				type === "IMAGE" && !isTrashed && visibility !== "locked",
		)
		.sort(
			(a, b) =>
				(b.fileCreatedAt || "").localeCompare(a.fileCreatedAt || "") ||
				a.id.localeCompare(b.id),
		)
		.map(({ id, updatedAt, fileModifiedAt, checksum }) => ({
			id,
			revision: hash(JSON.stringify([1, updatedAt, fileModifiedAt, checksum])),
		}));
	const coverId = photos.some(({ id }) => id === album.albumThumbnailAssetId)
		? album.albumThumbnailAssetId
		: (photos[0]?.id ?? null);
	return { photos, coverId, assetCount: assets.size };
}

async function readPublishedManifest(config, blob) {
	const page = await blob.list({
		prefix: manifestPath,
		token: config.blobToken,
		abortSignal: AbortSignal.timeout(30000),
	});
	const entry = page.blobs.find(({ pathname }) => pathname === manifestPath);
	if (!entry) return null;
	const response = await blob.get(entry.url, {
		access: "public",
		token: config.blobToken,
		abortSignal: AbortSignal.timeout(30000),
	});
	if (
		response?.statusCode !== 200 ||
		!entry.etag ||
		response.blob.etag.replace(/^W\//, "") !== entry.etag
	) {
		throw new Error(
			"Published manifest changed or its cache is stale. Try the next sync.",
		);
	}
	const manifest = await new Response(response.stream).json();
	if (
		manifest.version !== 1 ||
		manifest.albumId !== config.albumId ||
		!Array.isArray(manifest.photos)
	) {
		throw new Error(
			"Published manifest is incompatible or belongs to another Immich album",
		);
	}
	return { etag: entry.etag, manifest };
}

async function publishPhoto(config, photo, blob) {
	const response = await immichRequest(
		config,
		`assets/${photo.id}/thumbnail?size=preview&edited=true`,
	);
	const input = Buffer.from(await response.arrayBuffer());
	const encoder = sharp(input).rotate();
	const [thumbnail, preview] = await Promise.all([
		encoder
			.clone()
			.resize({
				width: 480,
				height: 480,
				fit: "inside",
				withoutEnlargement: true,
			})
			.webp({ quality: 78 })
			.toBuffer({ resolveWithObject: true }),
		encoder
			.resize({
				width: 1600,
				height: 1600,
				fit: "inside",
				withoutEnlargement: true,
			})
			.webp({ quality: 86 })
			.toBuffer(),
	]);
	function uploadImage(data, size) {
		return blob.put(`${prefix}/${photo.id}/${hash(data)}-${size}.webp`, data, {
			access: "public",
			token: config.blobToken,
			contentType: "image/webp",
			addRandomSuffix: false,
			allowOverwrite: true,
			abortSignal: AbortSignal.timeout(60000),
		});
	}
	const [tile, full] = await Promise.all([
		uploadImage(thumbnail.data, "thumb"),
		uploadImage(preview, "preview"),
	]);
	return {
		...photo,
		thumbnail: tile.url,
		preview: full.url,
		width: thumbnail.info.width,
		height: thumbnail.info.height,
	};
}

export async function syncGallery(
	config,
	{ dryRun = false, blob = { get, list, put } } = {},
) {
	const album = await readAlbum(config);
	if (dryRun)
		return {
			images: album.photos.length,
			skipped: album.assetCount - album.photos.length,
		};

	const current = await readPublishedManifest(config, blob);
	const previous = new Map(
		(current?.manifest.photos ?? []).map((photo) => [photo.id, photo]),
	);
	const photos = [];
	let uploaded = 0;
	for (const photo of album.photos) {
		const cached = previous.get(photo.id);
		if (cached?.revision === photo.revision) {
			photos.push(cached);
		} else {
			photos.push(await publishPhoto(config, photo, blob));
			uploaded++;
		}
	}
	const photoIds = new Set(photos.map(({ id }) => id));
	const result = {
		images: photos.length,
		uploaded,
		removed: [...previous.keys()].filter((id) => !photoIds.has(id)).length,
	};
	if (
		current &&
		current.manifest.coverId === album.coverId &&
		JSON.stringify(current.manifest.photos) === JSON.stringify(photos)
	) {
		return { ...result, published: false };
	}
	if (JSON.stringify(await readAlbum(config)) !== JSON.stringify(album)) {
		throw new Error("Immich album changed during sync. Try the next sync.");
	}

	const manifest = {
		version: 1,
		albumId: config.albumId,
		coverId: album.coverId,
		photos,
	};
	const published = await blob.put(manifestPath, JSON.stringify(manifest), {
		access: "public",
		token: config.blobToken,
		contentType: "application/json; charset=utf-8",
		addRandomSuffix: false,
		cacheControlMaxAge: 60,
		allowOverwrite: Boolean(current),
		ifMatch: current?.etag,
		abortSignal: AbortSignal.timeout(30000),
	});
	return { ...result, published: true, manifestUrl: published.url };
}

if (
	process.argv[1] &&
	pathToFileURL(process.argv[1]).href === import.meta.url
) {
	const logPath = process.argv
		.find((arg) => arg.startsWith("--log-file="))
		?.slice("--log-file=".length);
	const time = new Date().toISOString();
	let report;
	try {
		const dryRun = process.argv.includes("--dry-run");
		const result = await syncGallery(readConfig(process.env, dryRun), {
			dryRun,
		});
		report = JSON.stringify({ time, ...result });
		console.log(report);
	} catch (error) {
		report = JSON.stringify({ time, error: error.message });
		console.error(report);
		process.exitCode = 1;
	}
	if (logPath) {
		try {
			await writeFile(logPath, `${report}\n`, "utf8");
		} catch (error) {
			console.error(`Could not write the gallery sync log: ${error.code}`);
			process.exitCode = 1;
		}
	}
}
