/**
 * Differential harness: the frozen baseline bundle (dcbor-compat
 * inlined) and the working tree must expose the same table and produce the
 * same registry.
 *
 * The wire is `value` and `name`; both are compared verbatim. The `const`
 * column is the export name, which is API: the working tree spells every
 * current tag `TAG_<NAME>`, so its column is compared with that prefix
 * stripped. Any other rename still fails here by name.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as baselineMod from "./baseline/tags-baseline.mjs";
import * as src from "../src";
import {
  baselineVectors,
  redesignedVectors,
  type StoreLike,
  type TableEntry,
} from "./vectors/table";
import { makeStoreFor } from "./vectors/store";

const here = dirname(fileURLToPath(import.meta.url));
const BASELINE_SHA256 = "b2ead66b75f84a792d71c18abd003d4ab5652491e59f06d1cf2a153e0568243f";

// The baseline exports `TagsStore` only as a type; its inlined dcbor-compat
// global store is a singleton private to the bundle, untouched until here.
const baselineStore = (): StoreLike =>
  (baselineMod as unknown as { getGlobalTagsStore: () => StoreLike }).getGlobalTagsStore();

const a = baselineVectors(baselineMod as unknown as Record<string, unknown>, baselineStore);
const b = redesignedVectors(src, await makeStoreFor(src));
const unprefixed = (t: TableEntry): TableEntry => ({ ...t, const: t.const.replace(/^TAG_/, "") });

describe("differential: baseline vs working tree", () => {
  it("baseline bundle integrity", () => {
    const sha = createHash("sha256")
      .update(readFileSync(join(here, "baseline/tags-baseline.mjs")))
      .digest("hex");
    expect(sha).toBe(BASELINE_SHA256);
  });
  it("table (const column modulo the TAG_ prefix)", () => {
    expect(b.table.map(unprefixed)).toEqual(a.table);
  });
  it("registry (tags 2 and 3 unnamed since dcbor 1.0.0-beta.2)", () => {
    // The baseline's inlined dcbor-compat always named the bignum tags;
    // dcbor 1.0.0-beta.2 names them only on request, as the reference names
    // them only under its `num-bigint` feature — which `bc-tags` does not
    // enable, so `bc_tags::register_tags_in` leaves them unnamed (executed:
    // the harness's default build reports `"2"` / `"3"`). Every other probe
    // is compared verbatim.
    const expected = a.registry.map(([value, name]) =>
      value === 2 || value === 3 ? [value, String(value)] : [value, name],
    );
    expect(b.registry).toEqual(expected);
  });
});
