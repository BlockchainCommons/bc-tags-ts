/**
 * The global store after a conflict (N3) and non-store arguments (N5). In
 * their own file so the global store these tests dirty is isolated from
 * every other suite.
 */
import { CborError, Tag, TagsStore, getGlobalTagsStore } from "@blockchaincommons/dcbor";
import { registerTags } from "../src";

describe("global store contract (Rust parity)", () => {
  it("N3: a conflict on the global store throws CborError Custom and leaves the store usable", () => {
    const global = getGlobalTagsStore();
    expect(global.tagForValue(200)).toBeUndefined();
    global.register(Tag.from(200, "not-envelope"));

    let err: unknown;
    try {
      registerTags();
    } catch (e) {
      err = e;
    }
    expect(CborError.isCborError(err) && err.code === "Custom").toBe(true);
    expect((err as Error).message).toBe(
      "Attempt to register tag: 200 'not-envelope' with different name: 'envelope'",
    );

    // The reference's `register_tags()` poisons its global Mutex here and every
    // later access panics; the TypeScript global store keeps answering.
    expect(getGlobalTagsStore().nameForValue(200)).toBe("not-envelope");
    expect(getGlobalTagsStore().nameForValue(32)).toBe("url");
    const fresh = new TagsStore();
    registerTags(fresh);
    expect(fresh.nameForValue(200)).toBe("envelope");
  });

  it("N5: a non-store argument throws a TypeError before anything is registered", () => {
    const before = getGlobalTagsStore().tagForValue(201);
    expect(() => registerTags(null as never)).toThrow(TypeError);
    expect(() => registerTags({} as never)).toThrow(TypeError);
    expect(() => registerTags(42 as never)).toThrow(TypeError);
    expect(getGlobalTagsStore().tagForValue(201)).toBe(before);
  });
});
