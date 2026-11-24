import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import { test } from "node:test";
import sharp from "sharp";
import { syncGallery } from "./sync-immich-gallery.mjs";

const albumId = "a49fc3e4-0be7-47a0-8d9b-3e31cc872d38";
const first = {
	id: "3c81d0cd-abff-4486-89b1-68123a4bf281",
	type: "IMAGE",
	checksum: "first",
};
const second = {
	id: "5aa2c2ff-95a0-46c7-b796-ea81cd9e0284",
	type: "IMAGE",
	checksum: "second",
};
const manifestPath = "immich/shengtu/manifest.json";

async function fixture(t) {
	const photo = await sharp({
		create: { width: 1000, height: 500, channels: 3, background: "#32658e" },
	})
		.withExif({ IFD0: { Artist: "test photographer" } })
		.jpeg()
		.toBuffer();
	const rows = { assets: [first], reportedCount: undefined, previewReads: 0 };
	const server = createServer((req, res) => {
		if (req.url === `/api/albums/${albumId}`) {
			res.end(
				JSON.stringify({
					id: albumId,
					albumName: "生图",
					assetCount: rows.reportedCount ?? rows.assets.length,
				}),
			);
		} else if (req.url === "/api/search/metadata") {
			res.end(
				JSON.stringify({ assets: { items: rows.assets, nextCursor: null } }),
			);
		} else if (req.url?.includes("/thumbnail?size=preview")) {
			rows.previewReads++;
			res.end(photo);
		} else {
			res.writeHead(404).end();
		}
	});
	server.listen(0, "127.0.0.1");
	await once(server, "listening");
	t.after(() => new Promise((resolve) => server.close(resolve)));

	const storage = new Map();
	const uploads = [];
	const blob = {
		failAfterPhotos: false,
		staleManifest: false,
		list: async () => ({ blobs: [...storage.values()] }),
		get: async () => {
			const entry = storage.get(manifestPath);
			return {
				statusCode: 200,
				stream: new Response(entry.data).body,
				blob: {
					...entry,
					etag: blob.staleManifest ? 'W/"stale"' : `W/${entry.etag}`,
				},
			};
		},
		put: async (pathname, data, options) => {
			if (blob.failAfterPhotos && pathname.endsWith("-preview.webp"))
				throw new Error("Upload failed");
			if (pathname === manifestPath && storage.has(pathname)) {
				assert.equal(options.ifMatch, storage.get(pathname).etag);
			}
			const entry = {
				pathname,
				data,
				url: `https://fixture.public.blob.vercel-storage.com/${pathname}`,
				etag: `"${uploads.length}"`,
			};
			storage.set(pathname, entry);
			uploads.push(pathname);
			return entry;
		},
	};
	const config = {
		api: `http://127.0.0.1:${server.address().port}/api`,
		albumId,
		apiKey: "fixture",
		blobToken: "fixture",
	};
	return {
		blob,
		config,
		rows,
		storage,
		uploads,
		readIndex: () => JSON.parse(storage.get(manifestPath).data),
	};
}

test("uploads metadata-free previews once and removes the listing for removed photos", async (t) => {
	const { blob, config, rows, storage, uploads, readIndex } = await fixture(t);
	const firstSync = await syncGallery(config, { blob });
	assert.equal(firstSync.uploaded, 1);
	assert.equal(uploads.length, 3);
	assert.equal(uploads.at(-1), manifestPath);
	const thumbnail = storage.get(
		new URL(readIndex().photos[0].thumbnail).pathname.slice(1),
	);
	const { exif, width, height, format } = await sharp(
		thumbnail.data,
	).metadata();
	assert.deepEqual(
		{ exif, width, height, format },
		{ exif: undefined, width: 480, height: 240, format: "webp" },
	);

	assert.equal((await syncGallery(config, { blob })).published, false);
	assert.equal(uploads.length, 3);
	assert.equal(rows.previewReads, 1);
	rows.assets = [];
	assert.equal((await syncGallery(config, { blob })).removed, 1);
	assert.deepEqual(readIndex().photos, []);
	assert.equal(uploads.length, 4);
});

test("failed upload and incomplete album listing keep the prior published manifest", async (t) => {
	const { blob, config, rows, readIndex } = await fixture(t);
	await syncGallery(config, { blob });
	const published = readIndex();
	rows.assets = [first, second];
	blob.staleManifest = true;
	await assert.rejects(syncGallery(config, { blob }), /cache is stale/);
	assert.deepEqual(readIndex(), published);
	blob.staleManifest = false;
	blob.failAfterPhotos = true;
	await assert.rejects(syncGallery(config, { blob }), /Upload failed/);
	assert.deepEqual(readIndex(), published);

	rows.reportedCount = 3;
	await assert.rejects(syncGallery(config, { blob }), /returned 2 of 3/);
	assert.deepEqual(readIndex(), published);
});

test("dry run enumerates photos without calling Blob", async (t) => {
	const { config } = await fixture(t);
	assert.deepEqual(await syncGallery(config, { dryRun: true, blob: {} }), {
		images: 1,
		skipped: 0,
	});
});
