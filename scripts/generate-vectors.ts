/**
 * Golden vector generator. `bun scripts/generate-vectors.ts`.
 * Writes tests/vectors/vectors.json from the WORKING TREE: the tag table and
 * registry, plus the semantic blocks (order, summarizers, names, conflicts,
 * rendering, the bignum recipe). Also writes the harness's negative fixture,
 * tests/rust-validation/fixtures/swapped-identifiers.json, whose two X25519
 * constant labels are swapped so the identifier check is proven to bite.
 * Regenerating is a deliberate, reviewed act: a changed value or name is a
 * wire change.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as src from "../src/index.ts";
import { redesignedVectors, type Vectors } from "../tests/vectors/table.ts";
import { makeStoreFor } from "../tests/vectors/store.ts";
import { semanticsVectors } from "../tests/vectors/semantics.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const base = redesignedVectors(src, await makeStoreFor(src));
const vectors: Vectors = { ...base, ...semanticsVectors(src) };
writeFileSync(join(root, "tests/vectors/vectors.json"), JSON.stringify(vectors, null, 1) + "\n");

const SWAP: Record<string, string> = {
  TAG_X25519_PRIVATE_KEY: "TAG_X25519_PUBLIC_KEY",
  TAG_X25519_PUBLIC_KEY: "TAG_X25519_PRIVATE_KEY",
};
const swapped: Vectors = {
  count: base.count,
  table: base.table.map((t) => ({ ...t, const: SWAP[t.const] ?? t.const })),
  registry: base.registry,
};
const fixtures = join(root, "tests/rust-validation/fixtures");
mkdirSync(fixtures, { recursive: true });
writeFileSync(join(fixtures, "swapped-identifiers.json"), JSON.stringify(swapped, null, 1) + "\n");

const s = vectors;
console.log(
  `wrote ${s.count} tags, ${s.registry.length} registry probes, ${s.order?.length ?? 0} order, ` +
    `${s.summarizers?.length ?? 0} summarizers, ${s.names?.length ?? 0} names, ` +
    `${s.conflicts?.length ?? 0} conflicts, ${s.format?.length ?? 0} format, ` +
    `bignum block ${(s.bignum?.registry.length ?? 0) + (s.bignum?.summarizers.length ?? 0) + (s.bignum?.names.length ?? 0) + (s.bignum?.conflicts.length ?? 0)}; ` +
    `swapped-identifiers fixture`,
);
