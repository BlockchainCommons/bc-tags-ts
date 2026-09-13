# Changelog

## Unreleased

### Changed

- **Tags 2 and 3 are unnamed in the default registry**, as in the reference's
  default build: dcbor 1.0.0-beta.2 names the bignum tags only on request
  (`registerStandardTags(store, { bignum: true })`), and `bc-tags` depends on
  dcbor without its `num-bigint` feature, so `registerTags` now produces the
  same registry as `bc_tags::register_tags_in`. No bc-tags code changed: the
  registry vector and golden snapshot are regenerated, the differential pins
  the flip, and the Rust harness runs on dcbor's default features (75 tags,
  80 probes, 0 mismatches). Requires `@blockchaincommons/dcbor` 1.0.0-beta.2.

## 1.0.0-beta.2

Documents the registry behavior and updates repository tooling. Public tag values,
names, and registration logic are unchanged.

### Changed

- Clarified the bignum registration difference in `RUST_DIVERGENCES.md`:
  TypeScript always registers tags 2 and 3; Rust requires `num-bigint`.
  The Rust harness enables that feature and matches 75 tags and 80 probes.

## 1.0.0-beta.1

Initial beta implementation.