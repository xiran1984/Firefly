import { cp, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const source = join(root, "website", "dist", "resume");
const target = join(root, "dist", "resume");

await rm(target, { force: true, recursive: true });
await cp(source, target, { recursive: true });
