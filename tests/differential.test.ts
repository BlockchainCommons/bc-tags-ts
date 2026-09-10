/**
 * Differential harness (Phase 1.3): the frozen baseline bundle (dcbor-compat
 * inlined) and the working tree must expose the same table and produce the
 * same registry.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as baselineMod from "./baseline/tags-baseline.mjs";
import * as src from "../src";
import { baselineVectors, redesignedVectors, type StoreLike } from "./vectors/table";
import { makeStoreFor } from "./vectors/store";

const here = dirname(fileURLToPath(import.meta.url));
const BASELINE_SHA256 = "0b4c20c01f055f00192ec7929b2e276823eedf073a0f15e26bc443315e5ba850";

// The baseline exports `TagsStore` only as a type; its inlined dcbor-compat
// global store is a singleton private to the bundle, untouched until here.
const baselineStore = (): StoreLike =>
  (baselineMod as unknown as { getGlobalTagsStore: () => StoreLike }).getGlobalTagsStore();

const a = baselineVectors(baselineMod as unknown as Record<string, unknown>, baselineStore);
const b = redesignedVectors(src, await makeStoreFor(src));

describe("differential: baseline vs working tree", () => {
  it("baseline bundle integrity", () => {
    const sha = createHash("sha256")
      .update(readFileSync(join(here, "baseline/tags-baseline.mjs")))
      .digest("hex");
    expect(sha).toBe(BASELINE_SHA256);
  });
  it("table", () => {
    expect(b.table).toEqual(a.table);
  });
  it("registry", () => {
    expect(b.registry).toEqual(a.registry);
  });
});
