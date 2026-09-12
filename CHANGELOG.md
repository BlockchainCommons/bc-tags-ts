# Changelog

## 1.0.0-beta.2

Documents the registry behavior and updates repository tooling. Public tag values,
names, and registration logic are unchanged.

### Changed

- Clarified the bignum registration difference in `RUST_DIVERGENCES.md`:
  TypeScript always registers tags 2 and 3; Rust requires `num-bigint`.
  The Rust harness enables that feature and matches 75 tags and 80 probes.

## 1.0.0-beta.1

Initial beta implementation.