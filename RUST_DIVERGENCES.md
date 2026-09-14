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

## 1. True behavioral divergences (same input, different outcome)

None. No tag number, name, registration order, conflict message, lookup or encoded byte differs from the reference for any input both sides can hold. A conflicting registration throws dcbor's `CborError` (code `Custom`) where the reference panics, at the same tag with the same text.

## Maintenance

When the reference changes:
- Review its diff and update `.github/versions.yml`.
- Update the harness pins (`bc-tags`, `dcbor`) and `RUST_TAG_COUNT` (`grep -c 'const_cbor_tag!'`). The identifier rows are generated from the vectors.
- Regenerate vectors (`bun run vectors:generate`, which also rewrites the swapped-identifier fixture).
- Run the package tests and both harness builds, and update the result lines above.

Keep the default build as the reference, since that is how `bc-tags` is built; the `bignum` build validates only the recipe. Keep the `@blockchaincommons/dcbor` floor at a release whose standard-tag registration and global store match this record. Record any newly observed difference here with its input and both outcomes.
