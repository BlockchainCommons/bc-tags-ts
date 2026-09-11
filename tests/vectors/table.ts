/**
 * The vector shape for this package: the full tag table and the registry a
 * fresh `registerTags()` produces. Works over any module shape, pre- or
 * post-redesign, so the golden, differential and generator scripts share
 * one definition.
 */
export interface TableEntry {
  /** Exported constant name (`SEED_V1` even when grouped under `LEGACY_TAGS`). */
  const: string;
  value: number;
  name: string;
}
export interface Vectors {
  count: number;
  table: TableEntry[];
  /** `[value, nameForValue(value)]` after `registerTags()` on a fresh store. */
  registry: [number, string][];
}

interface TagLike {
  value: number | bigint;
  name?: string | undefined;
}
const isTag = (v: unknown): v is TagLike =>
  typeof v === "object" &&
  v !== null &&
  "value" in v &&
  (typeof (v as TagLike).value === "number" || typeof (v as TagLike).value === "bigint") &&
  typeof (v as TagLike).name === "string";

/** Every tag constant the module exports, flattened one level, sorted by value. */
export function tableOf(m: Record<string, unknown>): TableEntry[] {
  const out: TableEntry[] = [];
  for (const [k, v] of Object.entries(m)) {
    if (isTag(v)) out.push({ const: k, value: Number(v.value), name: v.name ?? "" });
    else if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      // A grouping object such as `LEGACY_TAGS`; the inner key is the constant.
      for (const [ik, iv] of Object.entries(v)) {
        if (isTag(iv)) out.push({ const: ik, value: Number(iv.value), name: iv.name ?? "" });
      }
    }
  }
  return out.sort((a, b) => a.value - b.value || a.const.localeCompare(b.const));
}

/** Registration probes: every table value plus dcbor's own standard tags. */
export const PROBE_EXTRA: number[] = [1, 2, 3, 100, 999999];

export interface StoreLike {
  nameForValue(value: number): string;
}
/**
 * Register into a fresh store and read every probe back. `register` must
 * populate `store`; both module shapes are handled by the callers.
 */
export function registryOf(
  table: TableEntry[],
  store: StoreLike,
  register: (store: StoreLike) => void,
): [number, string][] {
  register(store);
  const values = [...new Set([...table.map((t) => t.value), ...PROBE_EXTRA])].sort((a, b) => a - b);
  return values.map((v) => [v, store.nameForValue(v)]);
}

/** Adapter over the pre-redesign module (`registerTagsIn(store)`, compat store). */
export function baselineVectors(m: Record<string, unknown>, makeStore: () => StoreLike): Vectors {
  const table = tableOf(m);
  const registry = registryOf(table, makeStore(), (s) =>
    (m["registerTagsIn"] as (s: StoreLike) => void)(s),
  );
  return { count: table.length, table, registry };
}

/** Adapter over the redesigned module (`registerTags(store)`), falling back to the old name. */
export function redesignedVectors(m: Record<string, unknown>, makeStore: () => StoreLike): Vectors {
  const table = tableOf(m);
  const register = (m["registerTagsIn"] ?? m["registerTags"]) as (s: StoreLike) => void;
  const registry = registryOf(table, makeStore(), register);
  return { count: table.length, table, registry };
}
