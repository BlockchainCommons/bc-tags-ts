# Migrating from `@bcts/tags` to `@blockchaincommons/tags`

`@blockchaincommons/tags` is the redesigned successor to `@bcts/tags`.

## TL;DR checklist

- [ ] Replace the `@bcts/tags` dependency with `@blockchaincommons/tags`.
- [ ] Rewrite import specifiers: `@bcts/tags` becomes `@blockchaincommons/tags`.
- [ ] Every current tag is spelled `TAG_<NAME>`: `ENVELOPE` → `TAG_ENVELOPE`,
      `SEED` → `TAG_SEED`, `JSON` → `TAG_JSON`, … (the Rust reference's and
      dcbor's spelling). Delete any `import { X as TAG_X }` alias.
- [ ] Every constant, `LEGACY_TAGS` and `ALL_TAGS` are frozen; code that
      mutated one now throws a `TypeError`.
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
+ import { TAG_ENVELOPE, registerTags } from "@blockchaincommons/tags";
+ import { getGlobalTagsStore } from "@blockchaincommons/dcbor";
```

## 2. Renames

| `@bcts/tags` | `@blockchaincommons/tags` |
| --- | --- |
| `ENVELOPE`, `LEAF`, `SEED`, `JSON`, `XID`, … (66 current tags) | `TAG_ENVELOPE`, `TAG_LEAF`, `TAG_SEED`, `TAG_JSON`, `TAG_XID`, … — the same name with the `TAG_` prefix, for every one of the 66 |
| `SEED_V1`, `EC_KEY_V1`, `SSKR_SHARE_V1`, `HDKEY_V1`, `DERIVATION_PATH_V1`, `USE_INFO_V1`, `OUTPUT_DESCRIPTOR_V1`, `PSBT_V1`, `ACCOUNT_V1` | `LEGACY_TAGS.SEED_V1`, … (same names as keys) |
| `registerTagsIn(store)` | `registerTags(store)` |
| `registerTags()` | unchanged (registers into the global store) |
| `getGlobalTagsStore`, `TagsStore` (re-exported) | import from `@blockchaincommons/dcbor` |
| — | `ALL_TAGS: readonly Tag[]`, every tag in registration order |
| mutable objects | every constant, `LEGACY_TAGS` and `ALL_TAGS` are `Object.freeze`d |

## 3. Legacy tags

The nine `*_V1` tags (300–311) are superseded and accepted on decode only.
They are grouped so that they do not read as peers of the current tags:

```diff
- import { SEED, SEED_V1 } from "@bcts/tags";
- const tags = [SEED, SEED_V1];
+ import { TAG_SEED, LEGACY_TAGS } from "@blockchaincommons/tags";
+ const tags = [TAG_SEED, LEGACY_TAGS.SEED_V1];
```

They are still in `ALL_TAGS` and still registered by `registerTags()`.

## 4. Registration semantics

`registerTags(store)` calls dcbor's `registerStandardTags(store)` (date and
bignum tags with their summarizers) and then registers `ALL_TAGS`. It is
idempotent. Registering a value that is already present under a *different*
name throws, as dcbor's store does.

## 5. Identity and immutability

Tags compare by value: `TAG_ENVELOPE === Tag.from(200, "envelope")` is
`false` (two objects). Write `Tag.equals(a, b)` or `a.value === b.value`.

Every constant is frozen. `(TAG_ENVELOPE as any).name = "x"` used to
succeed in `@bcts/tags` and silently rename the wire tag for every later
`registerTags()`; it now throws a `TypeError`.

## 6. Node and TypeScript floors

Node **22.12** and TypeScript **5.7**. The IIFE / global-script build is
gone; use the ESM or CJS entry.

## 7. What did not change

- Every tag value and name, and the registration order.
- `registerTags()` with no argument.
