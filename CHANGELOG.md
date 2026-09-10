# Changelog

## 1.0.0-beta.1

Extracted from the [`paritytech/bcts`](https://github.com/paritytech/bcts)
monorepo (`@bcts/tags`) and redesigned as an idiomatic TypeScript library;
see [MIGRATION.md](./MIGRATION.md). Every tag value and name is unchanged.

- Built on canonical `@blockchaincommons/dcbor` (`Tag.from`,
  `registerStandardTags`, `registerAll`) instead of `dcbor-compat`.
- `registerTags(store = getGlobalTagsStore())` replaces `registerTagsIn` and
  the zero-argument `registerTags`; idempotent.
- `ALL_TAGS`: every tag in registration order.
- The nine superseded `*_V1` tags are grouped under `LEGACY_TAGS`.
- No re-exports from dcbor; explicit export list.
- 75 golden vectors with 80 registry probes, a differential against the
  frozen pre-redesign bundle, and a Rust cross-validation harness
  (`tests/rust-validation`, `bc-tags 0.12.0`: 0 mismatches).

---

## History as `@bcts/tags`

## [1.0.0-beta.6] - 2026-07-29

### Changed

- Workspace version bump

## [1.0.0-beta.5] - 2026-07-01

### Changed

- Workspace version bump

## [1.0.0-beta.4] - 2026-06-28

### Changed

- Dependency sync

## [1.0.0-beta.3] - 2026-06-22

### Changed

- Dependencies bump

## [1.0.0-beta.2] - 2026-06-16

### Changed

- Dependencies bump

## [1.0.0-beta.1] - 2026-05-27

### Changed

- Workspace version bump

## [1.0.0-beta.0] - 2026-04-27

### Changed

- Workspace version bump

## [1.0.0-alpha.23] - 2026-04-24

### Changed

- Workspace version bump

## [1.0.0-alpha.22] - 2026-03-01

### Changed

- Workspace version bump

## [1.0.0-alpha.21] - 2026-02-27

### Changed

- Workspace version bump

## [1.0.0-alpha.20] - 2026-02-12

### Changed

- Workspace version bump

## [1.0.0-alpha.19] - 2026-02-05

### Changed

- Workspace version bump

## [1.0.0-alpha.18] - 2025-01-31

### Changed

- Updated Rust reference implementations
