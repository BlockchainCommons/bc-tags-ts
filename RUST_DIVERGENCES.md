# Divergences from the Rust reference implementation

This library is a TypeScript port of
[`BlockchainCommons/bc-tags-rust`](https://github.com/BlockchainCommons/bc-tags-rust),
tracked at version **0.12.0**
([`fc30b65`](https://github.com/BlockchainCommons/bc-tags-rust/commit/fc30b65c82eeca3124288fb9096c31a5631adc87)).

The tracked version and commit are recorded in
[`.github/versions.yml`](./.github/versions.yml), and the `upstream.yml`
workflow opens a tracking issue whenever the reference implementation moves
ahead of it.

This document is the deliberate record of every place the TypeScript behaviour
differs from the Rust reference. It has three kinds of entry:

1. **True behavioral divergences** - the same input produces a different outcome.
2. **JS-only input domain** - inputs that have no Rust analog, so there is nothing to diverge from.
3. **Mapping equivalences** - JS-specific inputs that are validated through the bytes they produce.

## 1. True behavioral divergences

_None._ Every constant's value and name, and the registry `registerTags()`
produces, match `bc-tags 0.12.0` through `tests/rust-validation`
(`cargo run --release -- ../vectors/vectors.json`): **75 tags, 80 registry
probes, 0 mismatch** (last run 2026-09-11, after the `TAG_` rename).

## 2. JS-only input domain

_None._ The package has no inputs beyond the store to register into.

## 3. Mapping equivalences

- **Constants.** Rust defines, per tag, `TAG_<NAME>: u64`,
  `TAG_NAME_<NAME>: &str` and builds a `Tag` with `cbor_tag!(<NAME>)`;
  TypeScript exports one frozen `TAG_<NAME>: Tag` carrying both (the number
  is `TAG_<NAME>.value`). Same spelling, one constant instead of three.
- **Immutability.** Rust's `const` cannot be mutated; TypeScript's
  constants are `Object.freeze`d, so mutation throws a `TypeError`.
- **IANA tags.** `TAG_URI` (32), `TAG_UUID` (37) and `TAG_ENCODED_CBOR`
  (24) take their numbers from dcbor-ts's constants of the same name;
  Rust's dcbor does not define them, so `bc-tags` writes the numbers.
- **Bignum tags.** `dcbor::register_tags_in` registers tags 2 and 3 only
  with the crate's `num-bigint` feature; TypeScript's `registerStandardTags`
  always does. The harness enables the feature so the registries compare like
  for like.
- **`LEGACY_TAGS`.** Rust exports `SEED_V1` etc. as flat constants;
  TypeScript groups them under `LEGACY_TAGS` with the same keys. The vectors
  record the inner key, so the table is identical.
- **`registerTags(store?)`** ↔ `register_tags_in(&mut store)` /
  `register_tags()`.

## Maintenance

When the upstream reference moves:

1. Review the diff via the link in the `upstream.yml` tracking issue.
2. Port the relevant changes.
3. Update `.github/versions.yml` with the new version and commit.
4. Update the tracked version at the top of this file.
5. Add, amend, or remove divergence entries as the port requires.
