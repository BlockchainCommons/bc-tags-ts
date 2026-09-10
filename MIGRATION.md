# Migrating from `@bcts/tags` to `@blockchaincommons/tags`

`@blockchaincommons/tags` is the canonical home of this library. It was
extracted from the [`paritytech/bcts`](https://github.com/paritytech/bcts)
monorepo, where it was published as `@bcts/tags`, into its own Blockchain
Commons repository at
[`BlockchainCommons/bc-tags-ts`](https://github.com/BlockchainCommons/bc-tags-ts),
and redesigned as an idiomatic TypeScript library in the same release.

**Every tag value and name is unchanged.** The 75-entry table and the
registry `registerTags()` produces are frozen as golden vectors and
cross-validated against the Rust reference `bc-tags 0.12.0`. What changed is
the shape of the API and the dcbor it builds on.

## TL;DR checklist

- [ ] Replace the `@bcts/tags` dependency with `@blockchaincommons/tags`.
- [ ] Rewrite import specifiers: `@bcts/tags` becomes `@blockchaincommons/tags`.
- [ ] The tags are now canonical `@blockchaincommons/dcbor` `Tag` values, not
      `dcbor-compat` ones. If you build tagged CBOR with them, use dcbor.
- [ ] `registerTagsIn(store)` → `registerTags(store)`; `registerTags()` is unchanged.
- [ ] `SEED_V1`, `EC_KEY_V1`, `SSKR_SHARE_V1` and the other `*_V1` tags moved
      under `LEGACY_TAGS` (`LEGACY_TAGS.SEED_V1`).
- [ ] Import `getGlobalTagsStore` and `TagsStore` from
      `@blockchaincommons/dcbor`; this package no longer re-exports them.
- [ ] Raise your Node floor to **22.12** and TypeScript to **>= 5.7**.

## 1. Package name and imports

```diff
- import { ENVELOPE, registerTags, getGlobalTagsStore } from "@bcts/tags";
+ import { ENVELOPE, registerTags } from "@blockchaincommons/tags";
+ import { getGlobalTagsStore } from "@blockchaincommons/dcbor";
```

## 2. Renames

| `@bcts/tags` | `@blockchaincommons/tags` |
| --- | --- |
| `ENVELOPE`, `LEAF`, `SEED`, … (66 current tags) | unchanged |
| `SEED_V1`, `EC_KEY_V1`, `SSKR_SHARE_V1`, `HDKEY_V1`, `DERIVATION_PATH_V1`, `USE_INFO_V1`, `OUTPUT_DESCRIPTOR_V1`, `PSBT_V1`, `ACCOUNT_V1` | `LEGACY_TAGS.SEED_V1`, … (same names as keys) |
| `registerTagsIn(store)` | `registerTags(store)` |
| `registerTags()` | unchanged (registers into the global store) |
| `getGlobalTagsStore`, `TagsStore` (re-exported) | import from `@blockchaincommons/dcbor` |
| — | `ALL_TAGS: readonly Tag[]`, every tag in registration order |

## 3. Legacy tags

The nine `*_V1` tags (300–311) are superseded and accepted on decode only.
They are grouped so that they do not read as peers of the current tags:

```diff
- import { SEED, SEED_V1 } from "@bcts/tags";
- const tags = [SEED, SEED_V1];
+ import { SEED, LEGACY_TAGS } from "@blockchaincommons/tags";
+ const tags = [SEED, LEGACY_TAGS.SEED_V1];
```

They are still in `ALL_TAGS` and still registered by `registerTags()`.

## 4. Registration semantics

`registerTags(store)` calls dcbor's `registerStandardTags(store)` (date and
bignum tags with their summarizers) and then registers `ALL_TAGS`. It is
idempotent. Registering a value that is already present under a *different*
name throws, as dcbor's store does.

## 5. Node and TypeScript floors

Node **22.12** and TypeScript **5.7**. The IIFE / global-script build is
gone; use the ESM or CJS entry.

## 6. What did not change

- Every tag value and name, and the registration order.
- `registerTags()` with no argument.
