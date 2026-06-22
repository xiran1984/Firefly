import { mkdir, readdir, rm, rename } from "node:fs/promises";
import { join } from "node:path";

const distDir = join(process.cwd(), "dist");
const resumeDir = join(distDir, "resume");
const stagingDir = join(distDir, ".resume-build");

await rm(stagingDir, { force: true, recursive: true });
await rm(resumeDir, { force: true, recursive: true });
await mkdir(stagingDir, { recursive: true });

const entries = await readdir(distDir, { withFileTypes: true });

for (const entry of entries) {
  if (entry.name === ".resume-build" || entry.name === "resume") continue;
  await rename(join(distDir, entry.name), join(stagingDir, entry.name));
}

await rename(stagingDir, resumeDir);
