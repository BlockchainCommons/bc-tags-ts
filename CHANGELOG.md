# Changelog

## Unreleased

Requires `@blockchaincommons/dcbor` ^1.0.0-beta.3. The registry produced by
`registerTags` matches `bc_tags::register_tags_in` probe for probe, and the
Rust harness now proves it for identifiers, order, summarizers, names,
conflicts and rendering in both dcbor builds.

### Changed

- **Tags 2 and 3 are unnamed in the default registry**, as in the reference's
  default build: dcbor names the bignum tags only on request
  (`registerStandardTags(store, { bignum: true })`), and `bc-tags` depends on
  dcbor without its `num-bigint` feature, so `registerTags` now produces the
  same registry as `bc_tags::register_tags_in`. The registry vector and golden
  snapshot are regenerated and the differential pins the flip. For the
  `num-bigint` registry call `registerStandardTags(store, { bignum: true })`
  **before** `registerTags(store)`, the reference's registration order.
- **The dcbor floor is `^1.0.0-beta.3`, and `bun.lock` resolves it.** The
  committed lock used to pin dcbor 1.0.0-beta.1, which names tags 2 and 3,
  so a standalone install tested a registry that contradicts the snapshot.
  dcbor 1.0.0-beta.3 is the release whose `registerStandardTags` registers
  unconditionally (a name registered under another value moves back to the
  standard value, as the reference's `insert_all` does), whose stored and
  created tags are frozen, and whose global store is one per process across
  the ESM and CommonJS builds; this package's registry depends on all three.
- **The IANA tag numbers are written in this package.** dcbor 1.0.0-beta.3 no
  longer exports numeric `TAG_URI`, `TAG_UUID` and `TAG_ENCODED_CBOR`, so 32,
  37 and 24 are literals here, as `bc-tags` writes them. Values and names are
  unchanged.
- `registerTags` registers `ALL_TAGS` directly (dcbor's `registerAll` takes
  any iterable); no copy is made.

### Added

- Rust harness (`tests/rust-validation`): every constant is checked **by
  identifier** against a table `build.rs` compiles from the vectors
  (`TAG_SEED` ↔ `bc_tags::TAG_SEED`/`TAG_NAME_SEED`, `LEGACY_TAGS.SEED_V1` ↔
  `TAG_SEED_V1`; an identifier the crate lacks fails the build), plus new
  vector blocks for summarizer presence, dcbor's names, the registration
  order, conflicting-registration messages and the store after a
  re-pointed name, and annotated, summarised and hex-annotated rendering
  through the registry. Two builds: the default (the reference every Rust
  consumer uses) and `--features bignum` for the documented recipe, each
  skipping the rows that describe the other. `fixtures/swapped-identifiers.json`
  is a committed negative fixture that must fail with two identifier
  mismatches. A `rust-validation` CI job runs both builds and the fixture.
- Registration-contract tests: the conflict text and the store after it,
  name re-pointing including dcbor's `date`, the default registry's unnamed
  2 and 3, the bignum recipe in both orders and its register sequence, frozen
  stored tags held by identity, the global store after a conflict, non-store
  arguments, and `registerTags` through the CommonJS entry naming the ESM
  global store.

### Fixed

- Documentation: a conflicting registration throws dcbor's `CborError` (code
  `Custom`) with the reference's panic text, not a bare `Error` (JSDoc, API
  report, README); `registerTags` registers the `date` tag only, not the
  bignum tags (MIGRATION, example); `RUST_DIVERGENCES.md` rewritten with the
  harness result lines, the kept post-conflict differences and the mapping
  table.

### Consumers

- Raise `@blockchaincommons/dcbor` to `^1.0.0-beta.3` and this package to the
  release carrying this entry, then regenerate lockfiles. The published
  `@blockchaincommons/tags` 1.0.0-beta.2 over dcbor 1.0.0-beta.1 still names
  tags 2 and 3.
- Only `TAG_*` names are exported (never `PROVENANCE_MARK`, `XID` or
  `KNOWN_VALUE`); a Rust harness that enables `dcbor/num-bigint` validates a
  registry no Blockchain Commons crate builds.

## 1.0.0-beta.2

Documents the registry behavior and updates repository tooling. Public tag values,
names, and registration logic are unchanged.

### Changed

- Clarified the bignum registration difference in `RUST_DIVERGENCES.md`:
  TypeScript always registers tags 2 and 3; Rust requires `num-bigint`.
  The Rust harness enables that feature and matches 75 tags and 80 probes.

## 1.0.0-beta.1

Initial beta implementation.
