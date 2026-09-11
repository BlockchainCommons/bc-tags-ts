/**
 * Registration into a dCBOR tags store.
 *
 * @module register
 */
import { type TagsStore, getGlobalTagsStore, registerStandardTags } from "@blockchaincommons/dcbor";
import { ALL_TAGS } from "./tags.js";

/**
 * Register dcbor's standard tags and every tag in {@link ALL_TAGS} into
 * `store` (default: the global store).
 *
 * Idempotent: the store compares names, so a value already registered under
 * the same name is a no-op, which is what makes repeated calls safe.
 *
 * @param store - The store to register into; defaults to dcbor's global store.
 * @throws {Error} dcbor's store throws a bare `Error` when a value is
 * already registered under a *different* name
 * (`Attempt to register tag: 200 'foo' with different name: 'envelope'`).
 */
export function registerTags(store: TagsStore = getGlobalTagsStore()): void {
  registerStandardTags(store);
  store.registerAll([...ALL_TAGS]);
}
