import * as tags from "../src/index";
import { getGlobalTagsStore, TagsStore } from "@blockchaincommons/dcbor";

describe("Tags Registry", () => {
  describe("Core Envelope Tags", () => {
    it("should define TAG_ENCODED_CBOR tag (24)", () => {
      expect(tags.TAG_ENCODED_CBOR.value).toBe(24);
      expect(tags.TAG_ENCODED_CBOR.name).toBe("encoded-cbor");
    });

    it("should define TAG_ENVELOPE tag (200)", () => {
      expect(tags.TAG_ENVELOPE.value).toBe(200);
      expect(tags.TAG_ENVELOPE.name).toBe("envelope");
    });

    it("should define TAG_LEAF tag (201)", () => {
      expect(tags.TAG_LEAF.value).toBe(201);
      expect(tags.TAG_LEAF.name).toBe("leaf");
    });

    it("should define TAG_JSON tag (262)", () => {
      expect(tags.TAG_JSON.value).toBe(262);
      expect(tags.TAG_JSON.name).toBe("json");
    });
  });

  describe("Envelope Extension Tags", () => {
    it("should define TAG_KNOWN_VALUE tag (40000)", () => {
      expect(tags.TAG_KNOWN_VALUE.value).toBe(40000);
      expect(tags.TAG_KNOWN_VALUE.name).toBe("known-value");
    });

    it("should define TAG_DIGEST tag (40001)", () => {
      expect(tags.TAG_DIGEST.value).toBe(40001);
      expect(tags.TAG_DIGEST.name).toBe("digest");
    });

    it("should define TAG_ENCRYPTED tag (40002)", () => {
      expect(tags.TAG_ENCRYPTED.value).toBe(40002);
      expect(tags.TAG_ENCRYPTED.name).toBe("encrypted");
    });

    it("should define TAG_COMPRESSED tag (40003)", () => {
      expect(tags.TAG_COMPRESSED.value).toBe(40003);
      expect(tags.TAG_COMPRESSED.name).toBe("compressed");
    });
  });

  describe("Distributed Function Call Tags", () => {
    it("should define TAG_REQUEST tag (40004)", () => {
      expect(tags.TAG_REQUEST.value).toBe(40004);
      expect(tags.TAG_REQUEST.name).toBe("request");
    });

    it("should define TAG_RESPONSE tag (40005)", () => {
      expect(tags.TAG_RESPONSE.value).toBe(40005);
      expect(tags.TAG_RESPONSE.name).toBe("response");
    });

    it("should define TAG_FUNCTION tag (40006)", () => {
      expect(tags.TAG_FUNCTION.value).toBe(40006);
      expect(tags.TAG_FUNCTION.name).toBe("function");
    });

    it("should define TAG_PARAMETER tag (40007)", () => {
      expect(tags.TAG_PARAMETER.value).toBe(40007);
      expect(tags.TAG_PARAMETER.name).toBe("parameter");
    });

    it("should define TAG_PLACEHOLDER tag (40008)", () => {
      expect(tags.TAG_PLACEHOLDER.value).toBe(40008);
      expect(tags.TAG_PLACEHOLDER.name).toBe("placeholder");
    });

    it("should define TAG_REPLACEMENT tag (40009)", () => {
      expect(tags.TAG_REPLACEMENT.value).toBe(40009);
      expect(tags.TAG_REPLACEMENT.name).toBe("replacement");
    });
  });

  describe("Cryptographic Tags", () => {
    it("should define TAG_X25519_PRIVATE_KEY tag (40010)", () => {
      expect(tags.TAG_X25519_PRIVATE_KEY.value).toBe(40010);
      expect(tags.TAG_X25519_PRIVATE_KEY.name).toBe("agreement-private-key");
    });

    it("should define TAG_X25519_PUBLIC_KEY tag (40011)", () => {
      expect(tags.TAG_X25519_PUBLIC_KEY.value).toBe(40011);
      expect(tags.TAG_X25519_PUBLIC_KEY.name).toBe("agreement-public-key");
    });

    it("should define TAG_ARID tag (40012)", () => {
      expect(tags.TAG_ARID.value).toBe(40012);
      expect(tags.TAG_ARID.name).toBe("arid");
    });

    it("should define TAG_PRIVATE_KEYS tag (40013)", () => {
      expect(tags.TAG_PRIVATE_KEYS.value).toBe(40013);
      expect(tags.TAG_PRIVATE_KEYS.name).toBe("crypto-prvkeys");
    });

    it("should define TAG_NONCE tag (40014)", () => {
      expect(tags.TAG_NONCE.value).toBe(40014);
      expect(tags.TAG_NONCE.name).toBe("nonce");
    });

    it("should define TAG_PASSWORD tag (40015)", () => {
      expect(tags.TAG_PASSWORD.value).toBe(40015);
      expect(tags.TAG_PASSWORD.name).toBe("password");
    });

    it("should define TAG_PRIVATE_KEY_BASE tag (40016)", () => {
      expect(tags.TAG_PRIVATE_KEY_BASE.value).toBe(40016);
      expect(tags.TAG_PRIVATE_KEY_BASE.name).toBe("crypto-prvkey-base");
    });

    it("should define TAG_PUBLIC_KEYS tag (40017)", () => {
      expect(tags.TAG_PUBLIC_KEYS.value).toBe(40017);
      expect(tags.TAG_PUBLIC_KEYS.name).toBe("crypto-pubkeys");
    });

    it("should define TAG_SALT tag (40018)", () => {
      expect(tags.TAG_SALT.value).toBe(40018);
      expect(tags.TAG_SALT.name).toBe("salt");
    });

    it("should define TAG_SEALED_MESSAGE tag (40019)", () => {
      expect(tags.TAG_SEALED_MESSAGE.value).toBe(40019);
      expect(tags.TAG_SEALED_MESSAGE.name).toBe("crypto-sealed");
    });

    it("should define TAG_SIGNATURE tag (40020)", () => {
      expect(tags.TAG_SIGNATURE.value).toBe(40020);
      expect(tags.TAG_SIGNATURE.name).toBe("signature");
    });

    it("should define TAG_SIGNING_PRIVATE_KEY tag (40021)", () => {
      expect(tags.TAG_SIGNING_PRIVATE_KEY.value).toBe(40021);
      expect(tags.TAG_SIGNING_PRIVATE_KEY.name).toBe("signing-private-key");
    });

    it("should define TAG_SIGNING_PUBLIC_KEY tag (40022)", () => {
      expect(tags.TAG_SIGNING_PUBLIC_KEY.value).toBe(40022);
      expect(tags.TAG_SIGNING_PUBLIC_KEY.name).toBe("signing-public-key");
    });

    it("should define TAG_SYMMETRIC_KEY tag (40023)", () => {
      expect(tags.TAG_SYMMETRIC_KEY.value).toBe(40023);
      expect(tags.TAG_SYMMETRIC_KEY.name).toBe("crypto-key");
    });

    it("should define TAG_XID tag (40024)", () => {
      expect(tags.TAG_XID.value).toBe(40024);
      expect(tags.TAG_XID.name).toBe("xid");
    });

    it("should define TAG_REFERENCE tag (40025)", () => {
      expect(tags.TAG_REFERENCE.value).toBe(40025);
      expect(tags.TAG_REFERENCE.name).toBe("reference");
    });

    it("should define TAG_EVENT tag (40026)", () => {
      expect(tags.TAG_EVENT.value).toBe(40026);
      expect(tags.TAG_EVENT.name).toBe("event");
    });

    it("should define TAG_ENCRYPTED_KEY tag (40027)", () => {
      expect(tags.TAG_ENCRYPTED_KEY.value).toBe(40027);
      expect(tags.TAG_ENCRYPTED_KEY.name).toBe("encrypted-key");
    });
  });

  describe("Post-Quantum Cryptographic Tags", () => {
    it("should define TAG_MLKEM_PRIVATE_KEY tag (40100)", () => {
      expect(tags.TAG_MLKEM_PRIVATE_KEY.value).toBe(40100);
      expect(tags.TAG_MLKEM_PRIVATE_KEY.name).toBe("mlkem-private-key");
    });

    it("should define TAG_MLKEM_PUBLIC_KEY tag (40101)", () => {
      expect(tags.TAG_MLKEM_PUBLIC_KEY.value).toBe(40101);
      expect(tags.TAG_MLKEM_PUBLIC_KEY.name).toBe("mlkem-public-key");
    });

    it("should define TAG_MLKEM_CIPHERTEXT tag (40102)", () => {
      expect(tags.TAG_MLKEM_CIPHERTEXT.value).toBe(40102);
      expect(tags.TAG_MLKEM_CIPHERTEXT.name).toBe("mlkem-ciphertext");
    });

    it("should define TAG_MLDSA_PRIVATE_KEY tag (40103)", () => {
      expect(tags.TAG_MLDSA_PRIVATE_KEY.value).toBe(40103);
      expect(tags.TAG_MLDSA_PRIVATE_KEY.name).toBe("mldsa-private-key");
    });

    it("should define TAG_MLDSA_PUBLIC_KEY tag (40104)", () => {
      expect(tags.TAG_MLDSA_PUBLIC_KEY.value).toBe(40104);
      expect(tags.TAG_MLDSA_PUBLIC_KEY.name).toBe("mldsa-public-key");
    });

    it("should define TAG_MLDSA_SIGNATURE tag (40105)", () => {
      expect(tags.TAG_MLDSA_SIGNATURE.value).toBe(40105);
      expect(tags.TAG_MLDSA_SIGNATURE.name).toBe("mldsa-signature");
    });
  });

  describe("Wallet and Seed Tags", () => {
    it("should define TAG_SEED tag (40300)", () => {
      expect(tags.TAG_SEED.value).toBe(40300);
      expect(tags.TAG_SEED.name).toBe("seed");
    });

    it("should define TAG_HDKEY tag (40303)", () => {
      expect(tags.TAG_HDKEY.value).toBe(40303);
      expect(tags.TAG_HDKEY.name).toBe("hdkey");
    });

    it("should define TAG_DERIVATION_PATH tag (40304)", () => {
      expect(tags.TAG_DERIVATION_PATH.value).toBe(40304);
      expect(tags.TAG_DERIVATION_PATH.name).toBe("keypath");
    });

    it("should define TAG_USE_INFO tag (40305)", () => {
      expect(tags.TAG_USE_INFO.value).toBe(40305);
      expect(tags.TAG_USE_INFO.name).toBe("coin-info");
    });

    it("should define TAG_EC_KEY tag (40306)", () => {
      expect(tags.TAG_EC_KEY.value).toBe(40306);
      expect(tags.TAG_EC_KEY.name).toBe("eckey");
    });

    it("should define TAG_ADDRESS tag (40307)", () => {
      expect(tags.TAG_ADDRESS.value).toBe(40307);
      expect(tags.TAG_ADDRESS.name).toBe("address");
    });

    it("should define TAG_OUTPUT_DESCRIPTOR tag (40308)", () => {
      expect(tags.TAG_OUTPUT_DESCRIPTOR.value).toBe(40308);
      expect(tags.TAG_OUTPUT_DESCRIPTOR.name).toBe("output-descriptor");
    });

    it("should define TAG_SSKR_SHARE tag (40309)", () => {
      expect(tags.TAG_SSKR_SHARE.value).toBe(40309);
      expect(tags.TAG_SSKR_SHARE.name).toBe("sskr");
    });

    it("should define TAG_PSBT tag (40310)", () => {
      expect(tags.TAG_PSBT.value).toBe(40310);
      expect(tags.TAG_PSBT.name).toBe("psbt");
    });

    it("should define TAG_ACCOUNT_DESCRIPTOR tag (40311)", () => {
      expect(tags.TAG_ACCOUNT_DESCRIPTOR.value).toBe(40311);
      expect(tags.TAG_ACCOUNT_DESCRIPTOR.name).toBe("account-descriptor");
    });
  });

  describe("SSH Tags", () => {
    it("should define TAG_SSH_TEXT_PRIVATE_KEY tag (40800)", () => {
      expect(tags.TAG_SSH_TEXT_PRIVATE_KEY.value).toBe(40800);
      expect(tags.TAG_SSH_TEXT_PRIVATE_KEY.name).toBe("ssh-private");
    });

    it("should define TAG_SSH_TEXT_PUBLIC_KEY tag (40801)", () => {
      expect(tags.TAG_SSH_TEXT_PUBLIC_KEY.value).toBe(40801);
      expect(tags.TAG_SSH_TEXT_PUBLIC_KEY.name).toBe("ssh-public");
    });

    it("should define TAG_SSH_TEXT_SIGNATURE tag (40802)", () => {
      expect(tags.TAG_SSH_TEXT_SIGNATURE.value).toBe(40802);
      expect(tags.TAG_SSH_TEXT_SIGNATURE.name).toBe("ssh-signature");
    });

    it("should define TAG_SSH_TEXT_CERTIFICATE tag (40803)", () => {
      expect(tags.TAG_SSH_TEXT_CERTIFICATE.value).toBe(40803);
      expect(tags.TAG_SSH_TEXT_CERTIFICATE.name).toBe("ssh-certificate");
    });
  });

  describe("Other IANA Tags", () => {
    it("should define TAG_URI tag (32)", () => {
      expect(tags.TAG_URI.value).toBe(32);
      expect(tags.TAG_URI.name).toBe("url");
    });

    it("should define TAG_UUID tag (37)", () => {
      expect(tags.TAG_UUID.value).toBe(37);
      expect(tags.TAG_UUID.name).toBe("uuid");
    });
  });

  describe("Provenance Tag", () => {
    it("should define TAG_PROVENANCE_MARK tag (1347571542)", () => {
      expect(tags.TAG_PROVENANCE_MARK.value).toBe(1347571542);
      expect(tags.TAG_PROVENANCE_MARK.name).toBe("provenance");
    });
  });

  describe("Tag Registration", () => {
    it("should register all tags in the global tags store", () => {
      tags.registerTags();

      const tagsStore = getGlobalTagsStore();

      expect(tagsStore.nameForValue(200)).toBe("envelope");
      expect(tagsStore.nameForValue(201)).toBe("leaf");
      expect(tagsStore.nameForValue(40000)).toBe("known-value");
      expect(tagsStore.nameForValue(40001)).toBe("digest");
      expect(tagsStore.nameForValue(40002)).toBe("encrypted");
      expect(tagsStore.nameForValue(40003)).toBe("compressed");
    });

    it("should be able to look up tags by value", () => {
      tags.registerTags();

      const tagsStore = getGlobalTagsStore();

      expect(tagsStore.nameForValue(tags.TAG_ENVELOPE.value)).toBe("envelope");
      expect(tagsStore.nameForValue(tags.TAG_LEAF.value)).toBe("leaf");
      expect(tagsStore.nameForValue(tags.TAG_KNOWN_VALUE.value)).toBe("known-value");
      expect(tagsStore.nameForValue(tags.TAG_DIGEST.value)).toBe("digest");
    });

    it("registers into a caller-supplied store and is idempotent", () => {
      const store = new TagsStore();
      tags.registerTags(store);
      tags.registerTags(store);
      expect(store.nameForValue(1)).toBe("date");
      expect(store.nameForValue(tags.LEGACY_TAGS.SEED_V1.value)).toBe("crypto-seed");
      expect(store.nameForValue(tags.TAG_PROVENANCE_MARK.value)).toBe("provenance");
      expect(tags.ALL_TAGS.length).toBe(75);
    });

    it("should handle tag lookup for unregistered tags", () => {
      const tagsStore = getGlobalTagsStore();

      // Non-existent tag should return the numeric value as string
      expect(tagsStore.nameForValue(999999)).toBe("999999");
    });
  });

  describe("Tag Value Consistency", () => {
    it("should have unique tag values across all non-deprecated tags", () => {
      const tagValues = new Set<number>();
      const duplicates: number[] = [];

      const tagExports = tags.ALL_TAGS;

      for (const tag of tagExports) {
        if (tagValues.has(Number(tag.value))) {
          duplicates.push(Number(tag.value));
        }
        tagValues.add(Number(tag.value));
      }

      expect(duplicates).toEqual([]);
    });

    it("should have tag values that match CBOR encoding requirements", () => {
      const tagExports = tags.ALL_TAGS;

      for (const tag of tagExports) {
        expect(Number(tag.value)).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(Number(tag.value))).toBe(true);
      }
    });
  });

  describe("Tag Name Consistency", () => {
    it("should have lowercase hyphenated tag names", () => {
      const tagExports = tags.ALL_TAGS;

      for (const tag of tagExports) {
        expect(tag.name).toMatch(/^[a-z0-9-]+$/);
        expect(tag.name).not.toMatch(/[A-Z_]/);
      }
    });
  });
});
