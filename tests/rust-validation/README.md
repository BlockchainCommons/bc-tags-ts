# Rust reference cross-validation

Replays `tests/vectors/vectors.json` against `bc-tags = 0.12.0` over
`dcbor = 0.25.2`, in the two builds that matter:

```sh
cd tests/rust-validation
cargo run --release --offline -- ../vectors/vectors.json
cargo run --release --offline --features bignum -- ../vectors/vectors.json
```

The default build is the reference every Rust consumer uses: `bc-tags`
depends on dcbor without its `num-bigint` feature, so tags 2 and 3 are
unnamed and have no summarizers. The `bignum` build validates only the
documented opt-in recipe (`registerStandardTags(store, { bignum: true })`
before `registerTags(store)`), through the vectors' `bignum` block. Rows
that describe one build are skipped by the other and counted in its result
line.

## What is checked

Against the pinned crate, on a fresh store filled by `register_tags_in`:

- every constant **by identifier**, value and name: `build.rs` compiles a
  table of `bc_tags::TAG_<X>` / `TAG_NAME_<X>` from the vectors' `table`
  (`LEGACY_TAGS.SEED_V1` ↔ `TAG_SEED_V1`), so an identifier the crate lacks
  fails the build, and `RUST_TAG_COUNT` (75, `grep -c 'const_cbor_tag!'`)
  pins the other direction;
- `tag_for_value` and `tag_for_name` for every table entry;
- `name_for_value` for every table value plus 1, 2, 3, 100 and 999999
  (`registry`);
- the registration order (`order`): the store is pre-filled with every value
  under a bogus name and `register_tags_in` panics its way through, one tag
  per call;
- which tags carry summarizers (`summarizers`);
- `tag_for_name` for dcbor's own names and an unknown one (`names`);
- the panic text of a conflicting registration, and the store after a
  registration that re-points a name (`conflicts`; the post-panic store is
  not compared, see `RUST_DIVERGENCES.md` §1.1);
- annotated, summarised and hex-annotated rendering of tagged items through
  the registry (`format`).

Exit 0 iff every row matches. The result line names every block:

```
75 tags, 75 identifiers, 80 registry probes, 75 order, 6 summarizers, 4 names, 6 conflicts, 6 format - 0 MISMATCH (bignum block: 9 skipped)
75 tags, 75 identifiers, 78 registry probes, 75 order, 4 summarizers, 2 names, 5 conflicts, 6 format, bignum block 9 - 0 MISMATCH (default-only: 7 skipped)
```

## Negative fixture

`fixtures/swapped-identifiers.json` is the vectors' `table` with the
`TAG_X25519_PRIVATE_KEY` and `TAG_X25519_PUBLIC_KEY` labels swapped. It must
exit 1 with exactly two `MISMATCH ident` lines; CI checks that it does.

```sh
cargo run --release --offline -- fixtures/swapped-identifiers.json
```

## Maintenance

`bun run vectors:generate` rewrites the vectors and the fixture from the
working tree. At a pin bump, update `bc-tags`/`dcbor` in `Cargo.toml`,
`RUST_TAG_COUNT` in `src/main.rs`, and `.github/versions.yml`. The CI job
`rust-validation` runs both builds and the fixture with `--locked`.
