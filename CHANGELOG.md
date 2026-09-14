# Changelog

## 1.0.0-beta.3 - 2026-09-14

Requires `@blockchaincommons/dcbor` ^1.0.0-beta.3. The registry produced by
`registerTags` matches `bc_tags::register_tags_in` probe for probe.

### Changed

- **Tags 2 and 3 are unnamed in the default registry**, as in the reference's
  default build: dcbor names the bignum tags only on request
  (`registerStandardTags(store, { bignum: true })`), and `bc-tags` depends on
  dcbor without its `num-bigint` feature, so `registerTags` now produces the
  same registry as `bc_tags::register_tags_in`. The registry vector and golden
  snapshot are regenerated and the differential pins the flip. For the
  `num-bigint` registry call `registerStandardTags(store, { bignum: true })`
  **before** `registerTags(store)`, the reference's registration order.
- **The IANA tag numbers are written in this package.** dcbor 1.0.0-beta.3 no
  longer exports numeric `TAG_URI`, `TAG_UUID` and `TAG_ENCODED_CBOR`, so 32,
  37 and 24 are literals here, as `bc-tags` writes them. Values and names are
  unchanged.
- `registerTags` registers `ALL_TAGS` directly (dcbor's `registerAll` takes
  any iterable); no copy is made.

### Fixed

- Documentation: a conflicting registration throws dcbor's `CborError` (code
  `Custom`) with the reference's panic text, not a bare `Error`;
  `registerTags` registers the `date` tag only, not the bignum tags.

## 1.0.0-beta.2 - 2026-09-12

Documents the registry behavior and updates repository tooling. Public tag values,
names, and registration logic are unchanged.

### Changed

- Clarified the bignum registration difference in `RUST_DIVERGENCES.md`:
  TypeScript always registers tags 2 and 3; Rust requires `num-bigint`.
  The Rust harness enables that feature and matches 75 tags and 80 probes.

## 1.0.0-beta.1 - 2026-09-09

Initial beta implementation.
