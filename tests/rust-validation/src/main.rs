//! Replays tests/vectors/vectors.json against bc-tags 0.12.0 over dcbor 0.25.2.
//!
//!   cargo run --release --offline -- ../vectors/vectors.json
//!   cargo run --release --offline --features bignum -- ../vectors/vectors.json
//!
//! The default build is the reference every Rust consumer uses (`bc-tags`
//! depends on dcbor without `num-bigint`). The `bignum` build validates the
//! documented opt-in recipe (`registerStandardTags(store, { bignum: true })`
//! before `registerTags`): rows that hold only in the other build are skipped
//! and counted in the result line.
//!
//! Checks: every constant by identifier, value and name (the table is
//! compiled against the crate by build.rs); `name_for_value` probes;
//! `tag_for_name` probes; summarizer presence; the registration order; the
//! panic text of conflicting registrations and the store after registrations
//! that re-point a name; annotated, summarised and hex-annotated rendering
//! through the registry. Exit 0 iff nothing mismatches.
use dcbor::{DiagFormatOpts, HexFormatOpts, Tag, TagsStore, TagsStoreOpt, TagsStoreTrait, CBOR};
use serde::Deserialize;
use std::any::Any;
use std::panic::{catch_unwind, AssertUnwindSafe};

// `IDENTS`: one `(identifier, bc_tags::TAG_X, bc_tags::TAG_NAME_X)` row per
// table entry of ../vectors/vectors.json. A TypeScript identifier the crate
// lacks does not compile; the Rust→TypeScript direction is `RUST_TAG_COUNT`.
include!(concat!(env!("OUT_DIR"), "/idents.rs"));

/// `grep -c 'const_cbor_tag!' bc-tags-0.12.0/src/tags_registry.rs`. The
/// crate's store cannot be enumerated, so the count pins "no tag exists on
/// the Rust side only"; the identifier table pins the other direction.
const RUST_TAG_COUNT: usize = 75;
const BIGNUM: bool = cfg!(feature = "bignum");

#[derive(Deserialize)]
struct File {
    count: usize,
    table: Vec<Entry>,
    registry: Vec<(u64, String)>,
    #[serde(default)]
    order: Vec<u64>,
    #[serde(default)]
    summarizers: Vec<(u64, bool)>,
    #[serde(default)]
    names: Vec<(String, Option<u64>)>,
    #[serde(default)]
    conflicts: Vec<Conflict>,
    #[serde(default)]
    format: Vec<Format>,
    #[serde(default)]
    bignum: Option<Bignum>,
}
#[derive(Deserialize)]
struct Entry {
    r#const: String,
    value: u64,
    name: String,
}
#[derive(Deserialize)]
struct Conflict {
    pre: Vec<(u64, String)>,
    message: Option<String>,
    #[serde(default)]
    after: Option<After>,
}
#[derive(Deserialize)]
struct After {
    #[serde(rename = "tagForName", default)]
    tag_for_name: Vec<(String, Option<u64>)>,
    #[serde(rename = "nameForValue", default)]
    name_for_value: Vec<(u64, String)>,
}
#[derive(Deserialize)]
struct Format {
    hex: String,
    annotate: String,
    summarize: String,
    #[serde(rename = "hexAnnotated")]
    hex_annotated: String,
}
#[derive(Deserialize)]
struct Bignum {
    registry: Vec<(u64, String)>,
    summarizers: Vec<(u64, bool)>,
    names: Vec<(String, Option<u64>)>,
    conflicts: Vec<Conflict>,
}

/// Tallies for one block: rows checked, rows skipped (build-scoped), mismatches.
#[derive(Default)]
struct Tally {
    checked: usize,
    skipped: usize,
    mismatch: usize,
}
impl Tally {
    fn hit(&mut self, mismatch: Option<String>) {
        self.checked += 1;
        if let Some(text) = mismatch {
            self.mismatch += 1;
            eprintln!("MISMATCH {text}");
        }
    }
}

fn ident_of(c: &str) -> String {
    if c.starts_with("TAG_") {
        c.to_string()
    } else {
        format!("TAG_{c}")
    }
}

fn panic_message(payload: &Box<dyn Any + Send>) -> String {
    payload
        .downcast_ref::<String>()
        .cloned()
        .or_else(|| payload.downcast_ref::<&str>().map(|s| (*s).to_string()))
        .unwrap_or_else(|| "<non-string panic payload>".to_string())
}

/// Runs `f` with panics caught and the panic hook silenced.
fn quietly<T>(f: impl FnOnce() -> T) -> Result<T, String> {
    let previous = std::panic::take_hook();
    std::panic::set_hook(Box::new(|_| {}));
    let result = catch_unwind(AssertUnwindSafe(f)).map_err(|payload| panic_message(&payload));
    std::panic::set_hook(previous);
    result
}

fn reference_store() -> TagsStore {
    let mut store = TagsStore::default();
    bc_tags::register_tags_in(&mut store);
    store
}

/// Rows that describe only the default build (tags 2 and 3 unnamed).
fn default_only_value(v: u64) -> bool {
    BIGNUM && (v == 2 || v == 3)
}
fn default_only_name(n: &str) -> bool {
    BIGNUM && (n == "positive-bignum" || n == "negative-bignum")
}
fn default_only_conflict(c: &Conflict) -> bool {
    BIGNUM && c.pre.iter().any(|(v, _)| *v == 2 || *v == 3)
}

fn check_identifiers(table: &[Entry], tally: &mut Tally) {
    for e in table {
        let ident = ident_of(&e.r#const);
        tally.hit(match IDENTS.iter().find(|(i, _, _)| *i == ident) {
            Some((_, v, n)) if *v == e.value && *n == e.name => None,
            Some((_, v, n)) => Some(format!(
                "ident {ident}: rust ({v}, {n:?}) ts ({}, {:?})",
                e.value, e.name
            )),
            None => Some(format!(
                "ident {ident}: not in the compiled identifier table (it is built from ../vectors/vectors.json)"
            )),
        });
    }
    if IDENTS.len() != table.len() {
        tally.mismatch += 1;
        eprintln!("MISMATCH ident count: compiled {} ts {}", IDENTS.len(), table.len());
    }
}

fn check_table(store: &TagsStore, table: &[Entry], tally: &mut Tally) {
    for e in table {
        let by_value = match store.tag_for_value(e.value).and_then(|t| t.name()) {
            Some(n) if n == e.name => None,
            got => Some(format!("{} ({}): rust {:?} ts {:?}", e.r#const, e.value, got, e.name)),
        };
        let by_name = match store.tag_for_name(&e.name).map(|t| t.value()) {
            Some(v) if v == e.value => None,
            got => Some(format!("name {} : rust {:?} ts {}", e.name, got, e.value)),
        };
        tally.hit(by_value.or(by_name));
    }
}

fn check_registry(store: &TagsStore, rows: &[(u64, String)], skip: bool, tally: &mut Tally) {
    for (v, n) in rows {
        if skip && default_only_value(*v) {
            tally.skipped += 1;
            continue;
        }
        let got = store.name_for_value(*v);
        tally.hit((got != *n).then(|| format!("registry {v}: rust {got:?} ts {n:?}")));
    }
}

fn check_summarizers(store: &TagsStore, rows: &[(u64, bool)], skip: bool, tally: &mut Tally) {
    for (v, want) in rows {
        if skip && default_only_value(*v) {
            tally.skipped += 1;
            continue;
        }
        let got = store.summarizer(*v).is_some();
        tally.hit((got != *want).then(|| format!("summarizer {v}: rust {got} ts {want}")));
    }
}

fn check_names(store: &TagsStore, rows: &[(String, Option<u64>)], skip: bool, tally: &mut Tally) {
    for (n, want) in rows {
        if skip && default_only_name(n) {
            tally.skipped += 1;
            continue;
        }
        let got = store.tag_for_name(n).map(|t| t.value());
        tally.hit((got != *want).then(|| format!("name {n:?}: rust {got:?} ts {want:?}")));
    }
}

/// Pre-fills a store with every table value under a bogus name, then lets
/// `register_tags_in` panic its way through: each panic names the next value
/// in registration order and leaves that value's entry corrected (the
/// reference inserts before it compares names), so the next call gets one
/// tag further.
fn check_order(table: &[Entry], expected: &[u64], tally: &mut Tally) {
    if expected.is_empty() {
        return;
    }
    let mut store = TagsStore::default();
    for e in table {
        store.insert(Tag::new(e.value, format!("x{}", e.value)));
    }
    let mut observed = Vec::new();
    for _ in 0..100 {
        match quietly(|| bc_tags::register_tags_in(&mut store)) {
            Ok(()) => break,
            Err(message) => {
                // "Attempt to register tag: {value} '{old}' with different name: '{new}'"
                match message.split_whitespace().nth(4).and_then(|w| w.parse::<u64>().ok()) {
                    Some(v) => observed.push(v),
                    None => {
                        tally.mismatch += 1;
                        eprintln!("MISMATCH order: unexpected panic {message:?}");
                        return;
                    }
                }
            }
        }
    }
    let mismatch = (observed != expected).then(|| format!("order: rust {observed:?} ts {expected:?}"));
    tally.checked += expected.len();
    if let Some(text) = mismatch {
        tally.mismatch += 1;
        eprintln!("MISMATCH {text}");
    }
}

fn run_conflict(row: &Conflict) -> Option<String> {
    let mut store = TagsStore::default();
    for (v, n) in &row.pre {
        store.insert(Tag::new(*v, n.clone()));
    }
    let message = quietly(|| bc_tags::register_tags_in(&mut store)).err();
    if message != row.message {
        return Some(format!("conflict {:?}: rust {:?} ts {:?}", row.pre, message, row.message));
    }
    // The post-panic store is not compared (RUST_DIVERGENCES.md §1.1).
    if row.message.is_none() {
        if let Some(after) = &row.after {
            for (n, want) in &after.tag_for_name {
                let got = store.tag_for_name(n).map(|t| t.value());
                if got != *want {
                    return Some(format!("conflict {:?} tagForName {n:?}: rust {got:?} ts {want:?}", row.pre));
                }
            }
            for (v, want) in &after.name_for_value {
                let got = store.name_for_value(*v);
                if got != *want {
                    return Some(format!("conflict {:?} nameForValue {v}: rust {got:?} ts {want:?}", row.pre));
                }
            }
        }
    }
    None
}

fn check_conflicts(rows: &[Conflict], skip: bool, tally: &mut Tally) {
    for row in rows {
        if skip && default_only_conflict(row) {
            tally.skipped += 1;
            continue;
        }
        tally.hit(run_conflict(row));
    }
}

fn check_format(store: &TagsStore, rows: &[Format], tally: &mut Tally) {
    for row in rows {
        let value = match hex::decode(&row.hex).ok().and_then(|b| CBOR::try_from_data(b).ok()) {
            Some(v) => v,
            None => {
                tally.hit(Some(format!("format {}: input does not decode", row.hex)));
                continue;
            }
        };
        let opt = || TagsStoreOpt::Custom(store);
        let rendered = [
            ("annotate", value.diagnostic_opt(&DiagFormatOpts::default().annotate(true).tags(opt())), &row.annotate),
            ("summarize", value.diagnostic_opt(&DiagFormatOpts::default().summarize(true).tags(opt())), &row.summarize),
            ("hexAnnotated", value.hex_opt(&HexFormatOpts::default().annotate(true).context(opt())), &row.hex_annotated),
        ];
        let mismatch = rendered
            .iter()
            .find(|(_, got, want)| got != *want)
            .map(|(field, got, want)| format!("format {} {field}: rust {got:?} ts {want:?}", row.hex));
        tally.hit(mismatch);
    }
}

fn main() {
    let path = std::env::args().nth(1).expect("path to vectors.json");
    let file: File = serde_json::from_str(&std::fs::read_to_string(&path).expect("read vectors")).expect("parse vectors");
    let store = reference_store();

    let (mut tags, mut idents, mut registry, mut order, mut summarizers, mut names, mut conflicts, mut format) =
        (Tally::default(), Tally::default(), Tally::default(), Tally::default(), Tally::default(), Tally::default(), Tally::default(), Tally::default());

    check_table(&store, &file.table, &mut tags);
    if file.count != RUST_TAG_COUNT || file.table.len() != RUST_TAG_COUNT {
        tags.mismatch += 1;
        eprintln!("MISMATCH count: rust {RUST_TAG_COUNT} ts {}", file.table.len());
    }
    check_identifiers(&file.table, &mut idents);
    check_registry(&store, &file.registry, true, &mut registry);
    check_order(&file.table, &file.order, &mut order);
    check_summarizers(&store, &file.summarizers, true, &mut summarizers);
    check_names(&store, &file.names, true, &mut names);
    check_conflicts(&file.conflicts, true, &mut conflicts);
    check_format(&store, &file.format, &mut format);

    // The bignum block describes the `num-bigint` registry: checked by the
    // bignum build, counted as skipped by the default build.
    let mut bignum = Tally::default();
    if let Some(block) = &file.bignum {
        if BIGNUM {
            check_registry(&store, &block.registry, false, &mut bignum);
            check_summarizers(&store, &block.summarizers, false, &mut bignum);
            check_names(&store, &block.names, false, &mut bignum);
            check_conflicts(&block.conflicts, false, &mut bignum);
        } else {
            bignum.skipped = block.registry.len() + block.summarizers.len() + block.names.len() + block.conflicts.len();
        }
    }

    let all = [&tags, &idents, &registry, &order, &summarizers, &names, &conflicts, &format, &bignum];
    let mismatch: usize = all.iter().map(|t| t.mismatch).sum();
    let default_only: usize = [&registry, &summarizers, &names, &conflicts].iter().map(|t| t.skipped).sum();
    let head = format!(
        "{} tags, {} identifiers, {} registry probes, {} order, {} summarizers, {} names, {} conflicts, {} format",
        file.table.len(), idents.checked, registry.checked, order.checked, summarizers.checked, names.checked, conflicts.checked, format.checked
    );
    if BIGNUM {
        println!("{head}, bignum block {} - {mismatch} MISMATCH (default-only: {default_only} skipped)", bignum.checked);
    } else {
        println!("{head} - {mismatch} MISMATCH (bignum block: {} skipped)", bignum.skipped);
    }
    std::process::exit(if mismatch == 0 { 0 } else { 1 });
}
