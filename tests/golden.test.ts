/**
 * Golden snapshots: the full `[value, name]` table sorted by value, the
 * registry a fresh `registerTags()` produces, and the freeze additions:
 * whether every constant is immutable, and what a mutated constant does to
 * a fresh registry.
 */
import { TagsStore } from "@blockchaincommons/dcbor";
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

/**
 * Freeze additions: every constant, `LEGACY_TAGS` and `ALL_TAGS` are frozen,
 * recorded here so a regression is a visible diff.
 */
describe("golden: freeze additions", () => {
  const isTag = (x: unknown): x is { value: unknown; name?: unknown } =>
    typeof x === "object" && x !== null && "value" in x && "name" in x;

  it("Object.isFrozen over every constant, LEGACY_TAGS and ALL_TAGS", () => {
    const lines: string[] = [];
    for (const [k, x] of Object.entries(tags).sort(([a], [b]) => a.localeCompare(b))) {
      if (isTag(x)) lines.push(`${k} frozen=${Object.isFrozen(x)}`);
    }
    for (const [k, x] of Object.entries(tags.LEGACY_TAGS)) {
      lines.push(`LEGACY_TAGS.${k} frozen=${Object.isFrozen(x)}`);
    }
    lines.push(`LEGACY_TAGS frozen=${Object.isFrozen(tags.LEGACY_TAGS)}`);
    lines.push(`ALL_TAGS frozen=${Object.isFrozen(tags.ALL_TAGS)}`);
    expect(lines).toMatchSnapshot();
  });

  it("mutate a constant, then registerTags into a fresh store", () => {
    // `Tag` is `readonly` at the type level only; this is what a consumer bug
    // (or a cast like this one) can do to a wire name process-wide.
    const envelope = tags.TAG_ENVELOPE as { name?: string };
    let assignment: string;
    try {
      envelope.name = "x";
      assignment = "assigned";
    } catch (e) {
      assignment = (e as Error).constructor.name;
    }
    const store = new TagsStore();
    tags.registerTags(store);
    const named = store.nameForValue(200);
    try {
      envelope.name = "envelope";
    } catch {
      // frozen: nothing to restore
    }
    expect(
      `TAG_ENVELOPE.name = "x" → ${assignment}; registerTags on a fresh store names 200 as "${named}"`,
    ).toMatchSnapshot();
  });
});
