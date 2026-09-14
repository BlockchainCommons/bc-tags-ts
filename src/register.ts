/**
 * Registration into a dCBOR tags store.
 *
 * @module register
 */
import { type TagsStore, getGlobalTagsStore, registerStandardTags } from "@blockchaincommons/dcbor";
import { ALL_TAGS } from "./tags.js";

/**
 * Register dcbor's standard tags and every tag in {@link ALL_TAGS} into
 * `store` (default: the global store), in the reference's order: `date`
 * (tag 1) with its summarizer, then the 75 tags of this package.
 *
 * Idempotent: a value already registered under the same name is a no-op,
 * and a name already registered under another value moves to this
 * package's value, as the reference's `insert_all` does. Tags 2 and 3 stay
 * unnamed, as in the reference's default build; for the `num-bigint`
 * registry call `registerStandardTags(store, { bignum: true })` before this
 * function.
 *
 * @param store - The store to register into; defaults to dcbor's global store.
 * @throws {CborError} Code `Custom` (dcbor's store) when a value is already
 * registered under a different name; the message is the reference's panic
 * text, e.g. `Attempt to register tag: 200 'foo' with different name: 'envelope'`.
 * Tags registered earlier in the same call stay registered, and the rejected
 * entry is unchanged.
 */
export function registerTags(store: TagsStore = getGlobalTagsStore()): void {
  registerStandardTags(store);
  store.registerAll(ALL_TAGS);
}
