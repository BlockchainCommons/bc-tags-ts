/**
 * Name the Blockchain Commons tags in a dcbor store of your own, see the
 * names in diagnostic output, and compare tags the right way.
 *
 *   bun examples/register-and-annotate.ts
 */
import { Tag, TagsStore, bytesToHex, encodeCbor, taggedValue } from "@blockchaincommons/dcbor";
import { diagnostic } from "@blockchaincommons/dcbor/diagnostic";
import { ALL_TAGS, LEGACY_TAGS, TAG_ENVELOPE, TAG_LEAF, registerTags } from "../src/index";

// dcbor's standard tags first (date, bignums), then all 75 of this package.
const store = new TagsStore();
registerTags(store);

const envelope = taggedValue(TAG_ENVELOPE, taggedValue(TAG_LEAF, "Hello."));
console.log("bytes      ", bytesToHex(encodeCbor(envelope)));
console.log("bare       ", diagnostic(envelope, { tags: "none" }));
console.log("annotated  ", diagnostic(envelope, { tags: store, annotate: true }));

// Tags compare by value, never by reference: `===` on two Tag objects is
// always the wrong question.
const same = Tag.from(200, "envelope");
console.log("=== ?      ", TAG_ENVELOPE === same);
console.log("Tag.equals ", Tag.equals(TAG_ENVELOPE, same));

// Legacy tags decode old data only; they are still registered and iterable.
console.log("legacy     ", store.nameForValue(LEGACY_TAGS.SEED_V1.value));
console.log("count      ", ALL_TAGS.length);

// Every constant is frozen; a wire name cannot be rewritten by mistake.
console.log("frozen     ", Object.isFrozen(TAG_ENVELOPE), Object.isFrozen(ALL_TAGS));
