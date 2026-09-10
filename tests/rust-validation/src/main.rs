//! Replays tests/vectors/vectors.json against bc-tags 0.12.0.
//!
//!   cargo run --release -- ../vectors/vectors.json
use dcbor::{TagsStore, TagsStoreTrait};
use serde::Deserialize;

/// `grep -c 'const_cbor_tag!' bc-tags-0.12.0/src/tags_registry.rs`. Rust's
/// store cannot be enumerated, so the count pins "no tag exists on one side
/// only" together with the per-entry checks below.
const RUST_TAG_COUNT: usize = 75;

#[derive(Deserialize)]
struct File { count: usize, table: Vec<Entry>, registry: Vec<(u64, String)> }
#[derive(Deserialize)]
struct Entry { r#const: String, value: u64, name: String }

fn main() {
    let path = std::env::args().nth(1).expect("path");
    let file: File = serde_json::from_str(&std::fs::read_to_string(path).unwrap()).unwrap();
    let mut store = TagsStore::default();
    bc_tags::register_tags_in(&mut store);

    let mut mismatch = 0;
    for e in &file.table {
        match store.tag_for_value(e.value).and_then(|t| t.name()) {
            Some(n) if n == e.name => {}
            got => { mismatch += 1; eprintln!("MISMATCH {} ({}): rust {:?} ts {:?}", e.r#const, e.value, got, e.name); }
        }
        match store.tag_for_name(&e.name).map(|t| t.value()) {
            Some(v) if v == e.value => {}
            got => { mismatch += 1; eprintln!("MISMATCH name {} : rust {:?} ts {}", e.name, got, e.value); }
        }
    }
    for (v, n) in &file.registry {
        let got = store.name_for_value(*v);
        if &got != n { mismatch += 1; eprintln!("MISMATCH registry {v}: rust {got:?} ts {n:?}"); }
    }
    if file.count != RUST_TAG_COUNT || file.table.len() != RUST_TAG_COUNT {
        mismatch += 1;
        eprintln!("MISMATCH count: rust {RUST_TAG_COUNT} ts {}", file.table.len());
    }
    println!("{} tags, {} registry probes - {} MISMATCH", file.table.len(), file.registry.len(), mismatch);
    std::process::exit(if mismatch == 0 { 0 } else { 1 });
}
