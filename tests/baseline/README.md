# Frozen baseline build

`tags-baseline.mjs` is the self-contained ESM bundle of `@blockchaincommons/tags` built from
commit `2b5a23cd4c03a88bf09329acd083c46da69f0d1b`, the pre-redesign wire-format reference.
The pre-redesign `@blockchaincommons/dcbor-compat` sibling it built on is INLINED, so this
bundle keeps the pre-redesign behaviour of its dependencies after they change.
`tags-baseline.d.mts` is the public surface at that commit.

`tests/differential.test.ts` runs every corpus recipe through this bundle and
the working tree and asserts identical outcomes; it pins the sha256 below so
an accidental rebuild cannot turn the differential into a self-comparison.

Baseline commit: 2b5a23cd4c03a88bf09329acd083c46da69f0d1b
Baseline sha256: b2ead66b75f84a792d71c18abd003d4ab5652491e59f06d1cf2a153e0568243f
