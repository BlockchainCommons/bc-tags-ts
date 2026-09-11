/**
 * The definitions in `tags.ts`, the export list in `index.ts` and the
 * `ALL_TAGS` array are three hand-maintained lists of the same tags.
 * The golden table pins that they agree in size; this pins that they agree
 * as a *set*, by identity, so a missing entry is reported by name.
 */
import type { Tag } from "@blockchaincommons/dcbor";
import * as tags from "../src";

const isTag = (x: unknown): x is Tag =>
  typeof x === "object" && x !== null && "value" in x && "name" in x;

describe("export set", () => {
  const exported = new Map<string, Tag>();
  for (const [k, v] of Object.entries(tags)) if (isTag(v)) exported.set(k, v);
  for (const [k, v] of Object.entries(tags.LEGACY_TAGS)) exported.set(`LEGACY_TAGS.${k}`, v);

  it("every exported tag is in ALL_TAGS", () => {
    const missing = [...exported].filter(([, t]) => !tags.ALL_TAGS.includes(t)).map(([k]) => k);
    expect(missing).toEqual([]);
  });

  it("every ALL_TAGS entry is exported (by identity)", () => {
    const values = new Set(exported.values());
    const unexported = tags.ALL_TAGS.filter((t) => !values.has(t)).map(
      (t) => `${t.value} ${t.name}`,
    );
    expect(unexported).toEqual([]);
  });

  it("the two lists have the same size", () => {
    expect(exported.size).toBe(tags.ALL_TAGS.length);
  });
});
