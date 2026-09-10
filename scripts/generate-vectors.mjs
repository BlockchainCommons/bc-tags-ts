/**
 * Golden vector generator (Phase 1.2). `bun scripts/generate-vectors.mjs`.
 * Writes tests/vectors/vectors.json from the WORKING TREE. Regenerating is a
 * deliberate, reviewed act: a changed value or name is a wire change.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as src from "../src/index.ts";
import { redesignedVectors } from "../tests/vectors/table.ts";
import { makeStoreFor } from "../tests/vectors/store.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const vectors = redesignedVectors(src, await makeStoreFor(src));
writeFileSync(join(root, "tests/vectors/vectors.json"), JSON.stringify(vectors, null, 1) + "\n");
console.log(`wrote ${vectors.count} tags, ${vectors.registry.length} registry probes`);
