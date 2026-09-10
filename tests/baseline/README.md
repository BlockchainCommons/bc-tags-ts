# Frozen baseline build

`tags-baseline.mjs` is the self-contained ESM bundle of `@blockchaincommons/tags` built from
commit `2b5a23cd4c03a88bf09329acd083c46da69f0d1b`, the pre-redesign wire-format reference. Sibling
`@blockchaincommons/*` packages are INLINED from their own frozen baseline
bundles (@blockchaincommons/crypto, @blockchaincommons/rand), so this bundle keeps the
pre-redesign behaviour of its dependencies after they change.
`tags-baseline.d.mts` is the public surface at that commit (Phase 0.5).

`tests/differential.test.ts` runs every corpus recipe through this bundle and
the working tree and asserts identical outcomes; it pins the sha256 below so
an accidental rebuild cannot turn the differential into a self-comparison.

Baseline commit: 2b5a23cd4c03a88bf09329acd083c46da69f0d1b
Baseline sha256: 0b4c20c01f055f00192ec7929b2e276823eedf073a0f15e26bc443315e5ba850
