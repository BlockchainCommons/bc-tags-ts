# Compatibility with the Rust reference

This package tracks `bc-tags` **0.12.0**, commit
[`fc30b65c82eeca3124288fb9096c31a5631adc87`](https://github.com/BlockchainCommons/bc-tags-rust/commit/fc30b65c82eeca3124288fb9096c31a5631adc87).
The version and commit are recorded in [`.github/versions.yml`](./.github/versions.yml).

## Remaining difference: default bignum registration

TypeScript's `registerTags` calls dcbor's `registerStandardTags`, which registers
`date` (tag 1), `positive-bignum` (tag 2), and `negative-bignum` (tag 3), including
their summarizers. The TypeScript bignum functionality is always available.

Rust's equivalent registers tags 2 and 3 only when dcbor's `num-bigint` feature
is enabled. Without it, the registry returns the numeric names `"2"` and `"3"`
and has no bignum summarizers. This is an observable registry difference for the
same input, rather than an input that only JavaScript can express. It originates
in the dcbor dependency; bc-tags does not change CBOR tag numbers or encoded bytes.

The Rust validation harness enables `num-bigint` explicitly. Its matching results
therefore establish compatibility with that feature configuration, not with a
Rust build lacking bignum support. An optional registration setting in dcbor-ts
would be needed to reproduce the feature-disabled registry without changing its
default behavior.

## Validation

Run from `tests/rust-validation`:

```sh
cargo run --release -- ../vectors/vectors.json
```

Result on 2026-09-12, with `num-bigint` enabled:

```
75 tags, 80 registry probes - 0 MISMATCH
```

The harness checks registered names by value, values by name, registry probes,
and the expected count of 75 constants. It does not exhaust every possible store
state or prove error-message equivalence. TypeScript tests additionally cover
registration and exported constants. No other behavioral difference is currently
recorded for the matching Rust feature configuration.

## API and language mappings

- **Constants:** Rust exposes numeric `TAG_<NAME>` and string `TAG_NAME_<NAME>`
  constants; TypeScript exposes a frozen `Tag` carrying both. Use `.value` for
  the number and `Tag.equals` for value equality, rather than object identity.
- **ALL_TAGS:** TypeScript exports the frozen registration list. Rust keeps its
  registration list inside `register_tags_in`.
- **LEGACY_TAGS:** TypeScript groups the legacy constants under this object;
  Rust exposes flat constants. Their values and names match.
- **Immutability:** TypeScript freezes tag objects and arrays. Assignments fail
  with TypeError in strict-mode code; non-strict assignments may silently do
  nothing. Rust constants cannot be mutated.
- **IANA tags:** URI (32), UUID (37), and encoded CBOR (24) use the same values,
  whether imported from dcbor-ts or written directly in Rust's tag definitions.
- **Registration:** `registerTags(store?)` maps to `register_tags_in` for a
  supplied store and `register_tags` for the global store. Repeating a matching
  value/name registration is a no-op. Conflicting names for an existing value
  cause a dcbor Error in TypeScript and a panic in Rust. These are language-specific
  failure mechanisms, not a promise of identical exception types.

## Maintenance

When the reference changes, review its diff, update `.github/versions.yml` and
the harness dependency, regenerate vectors, and run both package tests and Rust
validation. Keep the feature configuration explicit. Record newly observed
behavioral differences with reproducible inputs and outcomes.
