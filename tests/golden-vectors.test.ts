/**
 * Golden vector suite: the committed table, registry and semantic blocks.
 * Changes only through `bun run vectors:generate`.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as tags from "../src";
import { redesignedVectors, type Vectors } from "./vectors/table";
import { makeStoreFor } from "./vectors/store";
import { semanticsVectors } from "./vectors/semantics";

const here = dirname(fileURLToPath(import.meta.url));
const frozen = JSON.parse(readFileSync(join(here, "vectors/vectors.json"), "utf8")) as Vectors;
const current = redesignedVectors(tags, await makeStoreFor(tags));
const semantics = semanticsVectors(tags);

describe("golden vectors (frozen)", () => {
  it("fixture is self-consistent and non-trivial", () => {
    expect(frozen.table.length).toBe(frozen.count);
    expect(frozen.count).toBeGreaterThanOrEqual(70);
    expect(frozen.order?.length).toBe(frozen.count);
    expect(frozen.format?.length).toBeGreaterThan(0);
  });
  it("table is identical", () => {
    expect(current.table).toEqual(frozen.table);
  });
  it("registry is identical", () => {
    expect(current.registry).toEqual(frozen.registry);
  });
  it("registration order is identical", () => {
    expect(semantics.order).toEqual(frozen.order);
  });
  it("summarizer presence is identical", () => {
    expect(semantics.summarizers).toEqual(frozen.summarizers);
  });
  it("dcbor names are identical", () => {
    expect(semantics.names).toEqual(frozen.names);
  });
  it("conflict outcomes are identical", () => {
    expect(semantics.conflicts).toEqual(frozen.conflicts);
  });
  it("renderings through the registry are identical", () => {
    expect(semantics.format).toEqual(frozen.format);
  });
  it("the bignum recipe's registry is identical", () => {
    expect(semantics.bignum).toEqual(frozen.bignum);
  });
});
