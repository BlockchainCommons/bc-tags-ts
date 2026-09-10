import { Tag, TagsStore } from "@blockchaincommons/dcbor";
//#region src/tags.d.ts
declare const URI: Tag;
declare const UUID: Tag;
declare const ENCODED_CBOR: Tag;
declare const ENVELOPE: Tag;
declare const LEAF: Tag;
declare const JSON: Tag;
declare const KNOWN_VALUE: Tag;
declare const DIGEST: Tag;
declare const ENCRYPTED: Tag;
declare const COMPRESSED: Tag;
declare const REQUEST: Tag;
declare const RESPONSE: Tag;
declare const FUNCTION: Tag;
declare const PARAMETER: Tag;
declare const PLACEHOLDER: Tag;
declare const REPLACEMENT: Tag;
declare const X25519_PRIVATE_KEY: Tag;
declare const X25519_PUBLIC_KEY: Tag;
declare const ARID: Tag;
declare const PRIVATE_KEYS: Tag;
declare const NONCE: Tag;
declare const PASSWORD: Tag;
declare const PRIVATE_KEY_BASE: Tag;
declare const PUBLIC_KEYS: Tag;
declare const SALT: Tag;
declare const SEALED_MESSAGE: Tag;
declare const SIGNATURE: Tag;
declare const SIGNING_PRIVATE_KEY: Tag;
declare const SIGNING_PUBLIC_KEY: Tag;
declare const SYMMETRIC_KEY: Tag;
declare const XID: Tag;
declare const REFERENCE: Tag;
declare const EVENT: Tag;
declare const ENCRYPTED_KEY: Tag;
declare const MLKEM_PRIVATE_KEY: Tag;
declare const MLKEM_PUBLIC_KEY: Tag;
declare const MLKEM_CIPHERTEXT: Tag;
declare const MLDSA_PRIVATE_KEY: Tag;
declare const MLDSA_PUBLIC_KEY: Tag;
declare const MLDSA_SIGNATURE: Tag;
declare const SEED: Tag;
declare const HDKEY: Tag;
declare const DERIVATION_PATH: Tag;
declare const USE_INFO: Tag;
declare const EC_KEY: Tag;
declare const ADDRESS: Tag;
declare const OUTPUT_DESCRIPTOR: Tag;
declare const SSKR_SHARE: Tag;
declare const PSBT: Tag;
declare const ACCOUNT_DESCRIPTOR: Tag;
declare const SSH_TEXT_PRIVATE_KEY: Tag;
declare const SSH_TEXT_PUBLIC_KEY: Tag;
declare const SSH_TEXT_SIGNATURE: Tag;
declare const SSH_TEXT_CERTIFICATE: Tag;
declare const PROVENANCE_MARK: Tag;
declare const OUTPUT_SCRIPT_HASH: Tag;
declare const OUTPUT_WITNESS_SCRIPT_HASH: Tag;
declare const OUTPUT_PUBLIC_KEY: Tag;
declare const OUTPUT_PUBLIC_KEY_HASH: Tag;
declare const OUTPUT_WITNESS_PUBLIC_KEY_HASH: Tag;
declare const OUTPUT_COMBO: Tag;
declare const OUTPUT_MULTISIG: Tag;
declare const OUTPUT_SORTED_MULTISIG: Tag;
declare const OUTPUT_RAW_SCRIPT: Tag;
declare const OUTPUT_TAPROOT: Tag;
declare const OUTPUT_COSIGNER: Tag;
/** The legacy tag set; see {@link LEGACY_TAGS}. */
interface LegacyTags {
  readonly SEED_V1: Tag;
  readonly EC_KEY_V1: Tag;
  readonly SSKR_SHARE_V1: Tag;
  readonly HDKEY_V1: Tag;
  readonly DERIVATION_PATH_V1: Tag;
  readonly USE_INFO_V1: Tag;
  readonly OUTPUT_DESCRIPTOR_V1: Tag;
  readonly PSBT_V1: Tag;
  readonly ACCOUNT_V1: Tag;
}
/**
 * Superseded tags, accepted on decode only. They sit in IANA's
 * "Specification Required" range (300–311) and were replaced by the
 * first-come-first-served 40300+ tags above; existing data still uses them.
 * Never emit these for new data.
 */
declare const LEGACY_TAGS: LegacyTags;
/**
 * Every tag this package defines, in registration order (the order the
 * Rust reference registers them). Iterate this rather than the constants.
 */
declare const ALL_TAGS: readonly Tag[];
//#endregion
//#region src/register.d.ts
/**
 * Register dcbor's standard tags and every tag in {@link ALL_TAGS} into
 * `store` (default: the global store). Idempotent; a value already
 * registered under a different name throws, as dcbor's store does.
 */
declare function registerTags(store?: TagsStore): void;
//#endregion
export { ACCOUNT_DESCRIPTOR, ADDRESS, ALL_TAGS, ARID, COMPRESSED, DERIVATION_PATH, DIGEST, EC_KEY, ENCODED_CBOR, ENCRYPTED, ENCRYPTED_KEY, ENVELOPE, EVENT, FUNCTION, HDKEY, JSON, KNOWN_VALUE, LEAF, LEGACY_TAGS, type LegacyTags, MLDSA_PRIVATE_KEY, MLDSA_PUBLIC_KEY, MLDSA_SIGNATURE, MLKEM_CIPHERTEXT, MLKEM_PRIVATE_KEY, MLKEM_PUBLIC_KEY, NONCE, OUTPUT_COMBO, OUTPUT_COSIGNER, OUTPUT_DESCRIPTOR, OUTPUT_MULTISIG, OUTPUT_PUBLIC_KEY, OUTPUT_PUBLIC_KEY_HASH, OUTPUT_RAW_SCRIPT, OUTPUT_SCRIPT_HASH, OUTPUT_SORTED_MULTISIG, OUTPUT_TAPROOT, OUTPUT_WITNESS_PUBLIC_KEY_HASH, OUTPUT_WITNESS_SCRIPT_HASH, PARAMETER, PASSWORD, PLACEHOLDER, PRIVATE_KEYS, PRIVATE_KEY_BASE, PROVENANCE_MARK, PSBT, PUBLIC_KEYS, REFERENCE, REPLACEMENT, REQUEST, RESPONSE, SALT, SEALED_MESSAGE, SEED, SIGNATURE, SIGNING_PRIVATE_KEY, SIGNING_PUBLIC_KEY, SSH_TEXT_CERTIFICATE, SSH_TEXT_PRIVATE_KEY, SSH_TEXT_PUBLIC_KEY, SSH_TEXT_SIGNATURE, SSKR_SHARE, SYMMETRIC_KEY, URI, USE_INFO, UUID, X25519_PRIVATE_KEY, X25519_PUBLIC_KEY, XID, registerTags };
//# sourceMappingURL=index.d.mts.map