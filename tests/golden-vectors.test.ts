/**
 * Golden vector suite (Phase 1.2): the committed table and registry.
 * Changes only through `bun run vectors:generate`.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as tags from "../src";
import { redesignedVectors, type Vectors } from "./vectors/table";
import { makeStoreFor } from "./vectors/store";

const here = dirname(fileURLToPath(import.meta.url));
const frozen = JSON.parse(readFileSync(join(here, "vectors/vectors.json"), "utf8")) as Vectors;
const current = redesignedVectors(tags, await makeStoreFor(tags));

describe("golden vectors (frozen)", () => {
  it("fixture is self-consistent and non-trivial", () => {
    expect(frozen.table.length).toBe(frozen.count);
    expect(frozen.count).toBeGreaterThanOrEqual(70);
  });
  it("table is identical", () => {
    expect(current.table).toEqual(frozen.table);
  });
  it("registry is identical", () => {
    expect(current.registry).toEqual(frozen.registry);
  });
});
