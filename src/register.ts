/**
 * Registration into a dCBOR tags store.
 *
 * @module register
 */
import { type TagsStore, getGlobalTagsStore, registerStandardTags } from "@blockchaincommons/dcbor";
import { ALL_TAGS } from "./tags.js";

/**
 * Register dcbor's standard tags and every tag in {@link ALL_TAGS} into
 * `store` (default: the global store). Idempotent; a value already
 * registered under a different name throws, as dcbor's store does.
 */
export function registerTags(store: TagsStore = getGlobalTagsStore()): void {
  registerStandardTags(store);
  store.registerAll([...ALL_TAGS]);
}
