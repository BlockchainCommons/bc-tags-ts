/**
 * Pick the store class that matches the module shape: the pre-redesign
 * module registers into dcbor-compat's `TagsStore` (`insertAll`), the
 * redesigned one into canonical dcbor's (`registerAll`). Computed
 * specifiers keep this typechecking after dcbor-compat leaves package.json.
 */
import type { StoreLike } from "./table";

export async function makeStoreFor(m: Record<string, unknown>): Promise<() => StoreLike> {
  const pkg =
    typeof m["registerTagsIn"] === "function"
      ? ["@blockchaincommons", "dcbor-compat"].join("/")
      : ["@blockchaincommons", "dcbor"].join("/");
  const mod = (await import(pkg)) as { TagsStore: new () => StoreLike };
  return () => new mod.TagsStore();
}
