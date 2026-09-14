# Compatibility with the Rust reference

`@blockchaincommons/tags` is a port of [bc-tags-rust](https://github.com/BlockchainCommons/bc-tags-rust) (crate `bc-tags`), **pinned at `bc-tags = 0.12.0`**, commit [`fc30b65`](https://github.com/BlockchainCommons/bc-tags-rust/commit/fc30b65c82eeca3124288fb9096c31a5631adc87), over `dcbor = 0.25.2`. The version and commit are recorded in [`.github/versions.yml`](./.github/versions.yml). The committed vectors (`tests/vectors/vectors.json`) are cross-validated by `tests/rust-validation/`. The harness runs against the build every Rust consumer uses (dcbor default features, no `num-bigint`), and again with `--features bignum` to validate the documented bignum recipe.

```sh
cd tests/rust-validation
cargo run --release --offline -- ../vectors/vectors.json
cargo run --release --offline --features bignum -- ../vectors/vectors.json
```

Result on 2026-09-14:

```
75 tags, 75 identifiers, 80 registry probes, 75 order, 6 summarizers, 4 names, 6 conflicts, 6 format - 0 MISMATCH (bignum block: 9 skipped)
75 tags, 75 identifiers, 78 registry probes, 75 order, 4 summarizers, 2 names, 5 conflicts, 6 format, bignum block 9 - 0 MISMATCH (default-only: 7 skipped)
```

Against the pinned crate, the harness checks:
- every constant **by identifier** (`TAG_SEED` ↔ `bc_tags::TAG_SEED`/`TAG_NAME_SEED`; `LEGACY_TAGS.SEED_V1` ↔ `TAG_SEED_V1`), value and name, plus the crate's constant count;
- `name_for_value` for every tag value plus 1, 2, 3, 100 and 999999;
- `tag_for_name` for every tag name plus `date`, `positive-bignum`, `negative-bignum`;
- which tags have summarizers;
- the registration order;
- the panic text of conflicting registrations, and the store after registrations that re-point a name;
- annotated, summarised and hex-annotated rendering of tagged items through the registry.

`fixtures/swapped-identifiers.json` must fail with two identifier mismatches.

No tag number, name, order, message or encoded byte differs.

## 1. True behavioral divergences (same input, different outcome)

### 1.1 Conflicting registration

When a store already holds one of these values under a different name:
- `bc_tags::register_tags_in` panics in dcbor's `TagsStore::insert`.
- `registerTags` throws dcbor's `CborError` with code `Custom`.

Both fail at the same tag, in the same order, with the same text (`Attempt to register tag: 200 'not-envelope' with different name: 'envelope'`); this is a harness vector. Tags registered earlier in the same call stay registered on both sides.

The store left behind is not a contract:
- **The conflicting value's entry.** The reference has already replaced it when it panics, and its name map is not updated. TypeScript leaves the entry unchanged, so a caught error has no effect on the entry it rejects. TypeScript could copy the reference's half-written state, but it would then leave `nameForValue` and `tagForName` disagreeing after an ordinary, recoverable error; the reference state is observable only through `catch_unwind`.
- **The global store.** A panic in `register_tags()` poisons the reference's global store, and every later access panics. The TypeScript global store stays usable.

A name already registered under a different value moves back to the registered value on both sides, without an error. This includes dcbor's `date`, and with the bignum recipe `positive-bignum`/`negative-bignum`. The unnamed and empty-name registration errors cannot be reached through this package; see dcbor's `RUST_DIVERGENCES.md` §1.2.

## 2. JS-only input domain (no Rust analog exists)

- **Non-store arguments.** `registerTags(null)`, `registerTags({})` and other values that are not a `TagsStore` throw a `TypeError` from the first store call, before anything is registered. `undefined` selects the global store.
- **Mutating a tag.** Every constant, `LEGACY_TAGS` and `ALL_TAGS` are frozen, and dcbor stores and returns frozen tags. An assignment throws `TypeError` in strict-mode code (every ES module) and does nothing in sloppy-mode scripts, so a registered name cannot be changed through a `Tag`.

## 3. Mapping equivalences (JS-specific inputs validated via their byte-target)

- **Constants.** Rust's `TAG_<NAME>: u64` and `TAG_NAME_<NAME>: &str` are one frozen dcbor `Tag` here: use `.value` and `.name`. Equality is by value on both sides (`Tag.equals`, Rust's `PartialEq`), never by object identity.
- **Legacy tags.** Rust's flat `TAG_SEED_V1` … `TAG_ACCOUNT_V1` are `LEGACY_TAGS.SEED_V1` … `LEGACY_TAGS.ACCOUNT_V1`.
- **`ALL_TAGS`.** The reference's private registration vector, public and frozen here, in the same order.
- **IANA tags.** URI (32), UUID (37) and encoded CBOR (24) are written in this package, as Rust's `bc-tags` writes them; dcbor defines only the date and bignum tags on both sides.
- **Registration.** `registerTags(store?)` is `register_tags_in(&mut store)` with a store and `register_tags()` without one; repeating it is a no-op.
- **Global store.** `registerTags()` fills dcbor's single process-wide store. The ESM and CommonJS builds share it, as Rust has one `GLOBAL_TAGS` per semver-compatible dcbor.
- **No dcbor re-export.** Rust's `bc_tags` re-exports `dcbor::prelude::*`. Import `TagsStore`, `Tag` and the formatters from `@blockchaincommons/dcbor`.
- **Standard tags 2 and 3.** `registerTags` registers dcbor's standard tags as the reference's default build does:
  - `date` (1) with its summarizer;
  - tags 2 and 3 unnamed, with no summarizers, because `bc-tags` depends on dcbor without `num-bigint`.

  For the `num-bigint` registry (`positive-bignum`/`negative-bignum`, `bignum(…)` summaries), call `registerStandardTags(store, { bignum: true })` **before** `registerTags(store)`. That is the reference's registration order. The reverse order gives the same registry on a store without conflicts. The harness's `--features bignum` run validates this recipe. It needs `@blockchaincommons/dcbor` ≥ the declared floor.

## Maintenance

When the reference changes:
- Review its diff and update `.github/versions.yml`.
- Update the harness pins (`bc-tags`, `dcbor`) and `RUST_TAG_COUNT` (`grep -c 'const_cbor_tag!'`). The identifier rows are generated from the vectors.
- Regenerate vectors (`bun run vectors:generate`, which also rewrites the swapped-identifier fixture).
- Run the package tests and both harness builds, and update the result lines above.

Keep the default build as the reference, since that is how `bc-tags` is built; the `bignum` build validates only the recipe. Keep the `@blockchaincommons/dcbor` floor at a release whose standard-tag registration and global store match this record. Record any newly observed difference here with its input and both outcomes.
