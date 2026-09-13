# Compatibility with the Rust reference

This package tracks `bc-tags` **0.12.0**, commit
[`fc30b65c82eeca3124288fb9096c31a5631adc87`](https://github.com/BlockchainCommons/bc-tags-rust/commit/fc30b65c82eeca3124288fb9096c31a5631adc87).
The version and commit are recorded in [`.github/versions.yml`](./.github/versions.yml).

## Resolved: default bignum registration

TypeScript's `registerTags` calls dcbor's `registerStandardTags`, which
registers `date` (tag 1) and — since dcbor 1.0.0-beta.2 — the bignum tags
`positive-bignum` (2) and `negative-bignum` (3) only when asked
(`registerStandardTags(store, { bignum: true })`). Rust's
`bc_tags::register_tags_in` calls `dcbor::register_tags_in`, which names tags
2 and 3 only when dcbor's `num-bigint` feature is enabled; `bc-tags` depends
on dcbor without that feature, so the reference's default registry returns
the numeric names `"2"` and `"3"` and has no bignum summarizers. The
TypeScript registry now does the same: `registerTags` produces the
reference's default registry probe for probe (executed: the harness built
with dcbor's default features reports `"2"` / `"3"` on both sides). A
consumer that wants the `num-bigint` registry calls
`registerStandardTags(store, { bignum: true })` as well.

Before dcbor 1.0.0-beta.2 the TypeScript registry always named tags 2 and 3,
and the harness enabled `num-bigint` to match it; the frozen baseline
(`tests/differential.test.ts`) still names them, and the differential pins
exactly that flip. bc-tags does not change CBOR tag numbers or encoded bytes.

## Validation

Run from `tests/rust-validation`:

```sh
cargo run --release -- ../vectors/vectors.json
```

Result on 2026-09-13, with dcbor's default features (no `num-bigint`):

```
75 tags, 80 registry probes - 0 MISMATCH
```

The harness checks registered names by value, values by name, registry probes,
and the expected count of 75 constants. It does not exhaust every possible store
state or prove error-message equivalence. TypeScript tests additionally cover
registration and exported constants. No other behavioral difference is currently
recorded.

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
  cause a dcbor `CborError` (`Custom`) in TypeScript and a panic in Rust. These are
  language-specific failure mechanisms, not a promise of identical exception types.

## Maintenance

When the reference changes, review its diff, update `.github/versions.yml` and
the harness dependency, regenerate vectors, and run both package tests and Rust
validation. Keep the harness on dcbor's default features, as `bc-tags` is
built. Record newly observed
behavioral differences with reproducible inputs and outcomes.
