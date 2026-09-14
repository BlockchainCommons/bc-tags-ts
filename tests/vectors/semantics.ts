/**
 * The semantic vector blocks: what a consumer observes through
 * `registerTags` beyond the table and the registry - the registration
 * order, which tags carry summarizers, dcbor's own names, the outcome of
 * registering over a pre-populated store, rendering through the registry,
 * and the documented bignum recipe. Every block is produced from the
 * working tree and replayed against the Rust reference by
 * `tests/rust-validation`.
 */
import {
  CborError,
  Tag,
  TagsStore,
  decodeCbor,
  hexToBytes,
  registerStandardTags,
} from "@blockchaincommons/dcbor";
import { diagnostic, hexAnnotated } from "@blockchaincommons/dcbor/diagnostic";
import type { BignumBlock, ConflictRow, FormatRow } from "./table";

/** What the working tree must provide. */
export interface TagsModule {
  registerTags(store?: TagsStore): void;
  ALL_TAGS: readonly Tag[];
}

export interface SemanticsVectors {
  order: number[];
  summarizers: [number, boolean][];
  names: [string, number | null][];
  conflicts: ConflictRow[];
  format: FormatRow[];
  bignum: BignumBlock;
}

/** A registration scenario: what is pre-registered, and what is read back on success. */
interface Scenario {
  pre: [number, string][];
  tagForName: string[];
  nameForValue: number[];
}

/** `summarizer(value)` presence probes: dcbor's standard tags, an unregistered value, a package tag, a large value. */
const SUMMARIZER_PROBES: number[] = [1, 2, 3, 100, 200, 999999];
/** `tagForName` probes: dcbor's standard names and an unknown one. */
const NAME_PROBES: string[] = ["date", "positive-bignum", "negative-bignum", "no-such-tag"];
/** Tagged items rendered through the registry: nested package tags, a legacy tag, the provenance tag, an IANA tag, an unregistered tag. */
const FORMAT_HEX: string[] = [
  "d8c8d8c96648656c6c6f2e",
  "d99c4001",
  "d9012c41ab",
  "da50524f5641ab",
  "d8206968747470733a2f2f78",
  "da000f423f01",
];
const CONFLICT_SCENARIOS: Scenario[] = [
  { pre: [[200, "not-envelope"]], tagForName: [], nameForValue: [] },
  { pre: [[1, "other"]], tagForName: [], nameForValue: [] },
  {
    pre: [
      [300, "x"],
      [40300, "y"],
    ],
    tagForName: [],
    nameForValue: [],
  },
  { pre: [[777, "envelope"]], tagForName: ["envelope"], nameForValue: [777] },
  {
    pre: [
      [1, "date"],
      [99, "date"],
    ],
    tagForName: ["date"],
    nameForValue: [99],
  },
  { pre: [[2, "two"]], tagForName: ["two"], nameForValue: [2] },
];
const BIGNUM_CONFLICT_SCENARIOS: Scenario[] = [
  {
    pre: [
      [2, "positive-bignum"],
      [98, "positive-bignum"],
    ],
    tagForName: ["positive-bignum"],
    nameForValue: [],
  },
];

const valueOf = (tag: Tag | undefined): number | null =>
  tag === undefined ? null : Number(tag.value);

/** A store that records every `register` call, to observe the registration order. */
class RecordingStore extends TagsStore {
  readonly calls: number[] = [];
  override register(tag: Tag): void {
    this.calls.push(Number(tag.value));
    super.register(tag);
  }
}

function runScenario(scenario: Scenario, register: (store: TagsStore) => void): ConflictRow {
  const store = new TagsStore();
  for (const [value, name] of scenario.pre) store.register(Tag.from(value, name));
  try {
    register(store);
  } catch (e) {
    if (!CborError.isCborError(e) || e.code !== "Custom") throw e;
    return { pre: scenario.pre, message: e.message };
  }
  return {
    pre: scenario.pre,
    message: null,
    after: {
      tagForName: scenario.tagForName.map((name) => [name, valueOf(store.tagForName(name))]),
      nameForValue: scenario.nameForValue.map((value) => [value, store.nameForValue(value)]),
    },
  };
}

/** The semantic blocks for the working tree `m`. */
export function semanticsVectors(m: TagsModule): SemanticsVectors {
  // Order: every `register` call `registerTags` makes, minus dcbor's own standard tags.
  const recording = new RecordingStore();
  m.registerTags(recording);
  const own = new Set(m.ALL_TAGS.map((t) => Number(t.value)));
  const order = recording.calls.filter((v) => own.has(v));

  const store = new TagsStore();
  m.registerTags(store);
  const summarizers: [number, boolean][] = SUMMARIZER_PROBES.map((v) => [
    v,
    store.summarizer(v) !== undefined,
  ]);
  const names: [string, number | null][] = NAME_PROBES.map((n) => [
    n,
    valueOf(store.tagForName(n)),
  ]);
  const conflicts = CONFLICT_SCENARIOS.map((s) => runScenario(s, (t) => m.registerTags(t)));
  const format: FormatRow[] = FORMAT_HEX.map((hex) => {
    const value = decodeCbor(hexToBytes(hex));
    return {
      hex,
      annotate: diagnostic(value, { annotate: true, tags: store }),
      summarize: diagnostic(value, { summarize: true, tags: store }),
      hexAnnotated: hexAnnotated(value, { tagsStore: store }),
    };
  });

  // The documented `num-bigint` recipe, in the reference's registration order.
  const recipe = (t: TagsStore): void => {
    registerStandardTags(t, { bignum: true });
    m.registerTags(t);
  };
  const bignumStore = new TagsStore();
  recipe(bignumStore);
  const bignum: BignumBlock = {
    registry: [1, 2, 3].map((v) => [v, bignumStore.nameForValue(v)]),
    summarizers: [1, 2, 3].map((v) => [v, bignumStore.summarizer(v) !== undefined]),
    names: ["positive-bignum", "negative-bignum"].map((n) => [
      n,
      valueOf(bignumStore.tagForName(n)),
    ]),
    conflicts: BIGNUM_CONFLICT_SCENARIOS.map((s) => runScenario(s, recipe)),
  };

  return { order, summarizers, names, conflicts, format, bignum };
}
