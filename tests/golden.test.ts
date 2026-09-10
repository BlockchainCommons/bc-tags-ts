/**
 * Golden snapshots (Phase 0.2): the full `[value, name]` table sorted by
 * value, and the registry a fresh `registerTags()` produces.
 */
import * as tags from "../src";
import { redesignedVectors } from "./vectors/table";
import { makeStoreFor } from "./vectors/store";

const v = redesignedVectors(tags, await makeStoreFor(tags));

describe("golden: tag table", () => {
  it("table (sorted by value)", () => {
    expect(v.table.map((t) => `${t.value} ${t.name} (${t.const})`)).toMatchSnapshot();
  });
  it("registry after registerTags on a fresh store", () => {
    expect(v.registry.map(([value, name]) => `${value} → ${name}`)).toMatchSnapshot();
  });
  it("values are unique and names are lowercase-hyphenated", () => {
    expect(new Set(v.table.map((t) => t.value)).size).toBe(v.table.length);
    for (const t of v.table) expect(t.name).toMatch(/^[a-z0-9-]+$/);
  });
});
