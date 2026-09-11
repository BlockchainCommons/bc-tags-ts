# Rust reference cross-validation

Replays `tests/vectors/vectors.json` against `bc-tags = 0.12.0`.

```sh
cd tests/rust-validation
cargo run --release -- ../vectors/vectors.json
```

Checks, for every TypeScript tag constant, that `register_tags_in` on a
fresh `dcbor::TagsStore` maps the value to the same name and the name to the
same value; that every registry probe (`name_for_value`) matches; and that
the number of constants equals the number of `const_cbor_tag!` lines in the
crate (75), so a tag added on one side only cannot go unnoticed. Exit 0 iff
everything matches. Not wired into CI (needs a Rust toolchain); run manually
before any release.
