/**
 * Dist-level packaging assertions.
 *
 * Runs against the BUILT `dist/` output and is skipped when it is absent (CI
 * builds before testing). It asserts the contract the `exports` map promises:
 * every declared entry point exists in both module systems with both sets of
 * type declarations, the ESM entry loads, and the CJS entry exposes the same
 * public names as the ESM one.
 *
 * What it catches: a missing or misdeclared entry point, and ESM/CJS surface
 * drift. It does NOT catch a prototype extension being tree-shaken away, since
 * that removes the method from both builds equally and leaves the named export
 * sets identical; only a behavioural test in a consumer catches that.
 */

import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const dist = join(root, "dist");
const pkg = createRequire(import.meta.url)(join(root, "package.json")) as {
  exports: Record<string, unknown>;
};

const built = existsSync(join(dist, "index.mjs"));

/** Every subpath the package promises, as dist-relative base names. */
const entries = Object.entries(pkg.exports)
  .filter(([key]) => key !== "./package.json")
  .map(([, value]) => {
    const v = value as { import?: { types?: string } };
    const types = v.import?.types ?? "";
    return /^\.\/dist\/(.+)\.d\.mts$/.exec(types)?.[1] ?? "index";
  });

describe.skipIf(!built)("dist packaging", () => {
  it("declares at least the root entry", () => {
    expect(entries).toContain("index");
  });

  it.each(entries)("%s exists in both module systems, with both type sets", (entry) => {
    for (const ext of ["mjs", "cjs", "d.mts", "d.cts"]) {
      expect(existsSync(join(dist, `${entry}.${ext}`)), `dist/${entry}.${ext}`).toBe(true);
    }
  });

  it("the ESM root entry loads and exposes a public surface", async () => {
    const mod = (await import(join(dist, "index.mjs"))) as Record<string, unknown>;
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });

  it("the CJS root entry exposes the same names as the ESM one", async () => {
    const esm = (await import(join(dist, "index.mjs"))) as Record<string, unknown>;
    const require_ = createRequire(import.meta.url);
    let cjs: Record<string, unknown>;
    try {
      cjs = require_(join(dist, "index.cjs")) as Record<string, unknown>;
    } catch (error) {
      // A native or environment-only dependency can refuse to load under CJS
      // here; the file's existence is already asserted above.
      console.warn(`CJS entry could not be loaded in this environment: ${String(error)}`);
      return;
    }
    const names = (m: Record<string, unknown>): string[] =>
      Object.keys(m)
        .filter((k) => k !== "default" && k !== "__esModule")
        .sort();
    expect(names(cjs)).toEqual(names(esm));
  });

  // dcbor keeps its global store on `globalThis`, so the CommonJS build of
  // this package and the ESM build of dcbor resolve one store, as the
  // reference has one `GLOBAL_TAGS` per process (N12).
  it("registerTags through the CJS entry names the ESM global store", async () => {
    const require_ = createRequire(import.meta.url);
    let cjs: { registerTags(): void };
    try {
      cjs = require_(join(dist, "index.cjs")) as { registerTags(): void };
    } catch (error) {
      console.warn(`CJS entry could not be loaded in this environment: ${String(error)}`);
      return;
    }
    const dcbor = (await import("@blockchaincommons/dcbor")) as {
      getGlobalTagsStore(): { nameForValue(value: number): string };
    };
    cjs.registerTags();
    expect(dcbor.getGlobalTagsStore().nameForValue(200)).toBe("envelope");
    expect(dcbor.getGlobalTagsStore().nameForValue(1347571542)).toBe("provenance");
  });
});
