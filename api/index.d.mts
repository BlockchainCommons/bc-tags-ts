import { Tag, TagsStore } from "@blockchaincommons/dcbor";
//#region src/tags.d.ts
/** #6.32: URI (RFC 8949 §3.4.5.3), named `url` in this stack. */
export declare const TAG_URI: Tag;
/** #6.37: binary UUID (RFC 4122). */
export declare const TAG_UUID: Tag;
/** #6.24: encoded CBOR data item; the pre-#6.201 Envelope leaf header, accepted on decode only. */
export declare const TAG_ENCODED_CBOR: Tag;
/** #6.200: Gordian Envelope. */
export declare const TAG_ENVELOPE: Tag;
/** #6.201: dCBOR data item; the Envelope leaf case. */
export declare const TAG_LEAF: Tag;
/** #6.262: byte string holding UTF-8 JSON text. */
export declare const TAG_JSON: Tag;
/** #6.40000: known value, a registered unsigned integer with a fixed meaning. */
export declare const TAG_KNOWN_VALUE: Tag;
/** #6.40001: SHA-256 digest. */
export declare const TAG_DIGEST: Tag;
/** #6.40002: encrypted message (IETF ChaCha20-Poly1305). */
export declare const TAG_ENCRYPTED: Tag;
/** #6.40003: DEFLATE-compressed data with the digest of the original. */
export declare const TAG_COMPRESSED: Tag;
/** #6.40004: request. */
export declare const TAG_REQUEST: Tag;
/** #6.40005: response. */
export declare const TAG_RESPONSE: Tag;
/** #6.40006: function identifier. */
export declare const TAG_FUNCTION: Tag;
/** #6.40007: parameter identifier. */
export declare const TAG_PARAMETER: Tag;
/** #6.40008: placeholder. */
export declare const TAG_PLACEHOLDER: Tag;
/** #6.40009: replacement. */
export declare const TAG_REPLACEMENT: Tag;
/** #6.40010: X25519 key-agreement private key. */
export declare const TAG_X25519_PRIVATE_KEY: Tag;
/** #6.40011: X25519 key-agreement public key. */
export declare const TAG_X25519_PUBLIC_KEY: Tag;
/** #6.40012: apparently random identifier (32 bytes). */
export declare const TAG_ARID: Tag;
/** #6.40013: a signing and an encapsulation private key together. */
export declare const TAG_PRIVATE_KEYS: Tag;
/** #6.40014: nonce. */
export declare const TAG_NONCE: Tag;
/** #6.40015: password. */
export declare const TAG_PASSWORD: Tag;
/** #6.40016: private key base, the material every other key derives from. */
export declare const TAG_PRIVATE_KEY_BASE: Tag;
/** #6.40017: a signing and an encapsulation public key together. */
export declare const TAG_PUBLIC_KEYS: Tag;
/** #6.40018: salt. */
export declare const TAG_SALT: Tag;
/** #6.40019: sealed message, encrypted to a recipient's public keys. */
export declare const TAG_SEALED_MESSAGE: Tag;
/** #6.40020: signature. */
export declare const TAG_SIGNATURE: Tag;
/** #6.40021: signing private key. */
export declare const TAG_SIGNING_PRIVATE_KEY: Tag;
/** #6.40022: signing public key. */
export declare const TAG_SIGNING_PUBLIC_KEY: Tag;
/** #6.40023: symmetric encryption key. */
export declare const TAG_SYMMETRIC_KEY: Tag;
/** #6.40024: extensible identifier (XID). */
export declare const TAG_XID: Tag;
/** #6.40025: reference to an identifier by a prefix of it. */
export declare const TAG_REFERENCE: Tag;
/** #6.40026: distributed function call event. */
export declare const TAG_EVENT: Tag;
/** #6.40027: symmetric key wrapped for a recipient. */
export declare const TAG_ENCRYPTED_KEY: Tag;
/** #6.40100: ML-KEM (FIPS 203) private key. */
export declare const TAG_MLKEM_PRIVATE_KEY: Tag;
/** #6.40101: ML-KEM (FIPS 203) public key. */
export declare const TAG_MLKEM_PUBLIC_KEY: Tag;
/** #6.40102: ML-KEM (FIPS 203) encapsulated ciphertext. */
export declare const TAG_MLKEM_CIPHERTEXT: Tag;
/** #6.40103: ML-DSA (FIPS 204) private key. */
export declare const TAG_MLDSA_PRIVATE_KEY: Tag;
/** #6.40104: ML-DSA (FIPS 204) public key. */
export declare const TAG_MLDSA_PUBLIC_KEY: Tag;
/** #6.40105: ML-DSA (FIPS 204) signature. */
export declare const TAG_MLDSA_SIGNATURE: Tag;
/** #6.40300: cryptographic seed. */
export declare const TAG_SEED: Tag;
/** #6.40303: BIP-32 hierarchical deterministic key. */
export declare const TAG_HDKEY: Tag;
/** #6.40304: BIP-32 derivation path. */
export declare const TAG_DERIVATION_PATH: Tag;
/** #6.40305: coin type and network (`coin-info`). */
export declare const TAG_USE_INFO: Tag;
/** #6.40306: elliptic-curve key. */
export declare const TAG_EC_KEY: Tag;
/** #6.40307: address. */
export declare const TAG_ADDRESS: Tag;
/** #6.40308: output descriptor. */
export declare const TAG_OUTPUT_DESCRIPTOR: Tag;
/** #6.40309: SSKR share. */
export declare const TAG_SSKR_SHARE: Tag;
/** #6.40310: partially signed Bitcoin transaction. */
export declare const TAG_PSBT: Tag;
/** #6.40311: account descriptor. */
export declare const TAG_ACCOUNT_DESCRIPTOR: Tag;
/** #6.40800: OpenSSH text-format private key. */
export declare const TAG_SSH_TEXT_PRIVATE_KEY: Tag;
/** #6.40801: OpenSSH text-format public key. */
export declare const TAG_SSH_TEXT_PUBLIC_KEY: Tag;
/** #6.40802: OpenSSH text-format signature. */
export declare const TAG_SSH_TEXT_SIGNATURE: Tag;
/** #6.40803: OpenSSH text-format certificate. */
export declare const TAG_SSH_TEXT_CERTIFICATE: Tag;
/** #6.1347571542: provenance mark. */
export declare const TAG_PROVENANCE_MARK: Tag;
/** #6.400: output descriptor `sh` (script hash). */
export declare const TAG_OUTPUT_SCRIPT_HASH: Tag;
/** #6.401: output descriptor `wsh` (witness script hash). */
export declare const TAG_OUTPUT_WITNESS_SCRIPT_HASH: Tag;
/** #6.402: output descriptor `pk` (public key). */
export declare const TAG_OUTPUT_PUBLIC_KEY: Tag;
/** #6.403: output descriptor `pkh` (public key hash). */
export declare const TAG_OUTPUT_PUBLIC_KEY_HASH: Tag;
/** #6.404: output descriptor `wpkh` (witness public key hash). */
export declare const TAG_OUTPUT_WITNESS_PUBLIC_KEY_HASH: Tag;
/** #6.405: output descriptor `combo`. */
export declare const TAG_OUTPUT_COMBO: Tag;
/** #6.406: output descriptor `multi` (multisig). */
export declare const TAG_OUTPUT_MULTISIG: Tag;
/** #6.407: output descriptor `sortedmulti` (sorted multisig). */
export declare const TAG_OUTPUT_SORTED_MULTISIG: Tag;
/** #6.408: output descriptor `raw` (raw script). */
export declare const TAG_OUTPUT_RAW_SCRIPT: Tag;
/** #6.409: output descriptor `tr` (taproot). */
export declare const TAG_OUTPUT_TAPROOT: Tag;
/** #6.410: output descriptor cosigner. */
export declare const TAG_OUTPUT_COSIGNER: Tag;
/** The legacy tag set; see {@link LEGACY_TAGS}. */
interface LegacyTags {
  /** #6.300: `crypto-seed`, superseded by {@link TAG_SEED}. */
  readonly SEED_V1: Tag;
  /** #6.306: `crypto-eckey`, superseded by {@link TAG_EC_KEY}. */
  readonly EC_KEY_V1: Tag;
  /** #6.309: `crypto-sskr`, superseded by {@link TAG_SSKR_SHARE}. */
  readonly SSKR_SHARE_V1: Tag;
  /** #6.303: `crypto-hdkey`, superseded by {@link TAG_HDKEY}. */
  readonly HDKEY_V1: Tag;
  /** #6.304: `crypto-keypath`, superseded by {@link TAG_DERIVATION_PATH}. */
  readonly DERIVATION_PATH_V1: Tag;
  /** #6.305: `crypto-coin-info`, superseded by {@link TAG_USE_INFO}. */
  readonly USE_INFO_V1: Tag;
  /** #6.307: `crypto-output`, superseded by {@link TAG_OUTPUT_DESCRIPTOR}. */
  readonly OUTPUT_DESCRIPTOR_V1: Tag;
  /** #6.310: `crypto-psbt`, superseded by {@link TAG_PSBT}. */
  readonly PSBT_V1: Tag;
  /** #6.311: `crypto-account`, superseded by {@link TAG_ACCOUNT_DESCRIPTOR}. */
  readonly ACCOUNT_V1: Tag;
}
/**
 * Superseded tags, accepted on decode only. They sit in IANA's
 * "Specification Required" range (300–311) and were replaced by the
 * first-come-first-served 40300+ tags above; existing data still uses them.
 * Never emit these for new data. Frozen, like every entry in it.
 */
export declare const LEGACY_TAGS: LegacyTags;
/**
 * Every tag this package defines, in registration order (the order the
 * Rust reference registers them). Iterate this rather than the constants.
 * Frozen, like every entry in it.
 */
export declare const ALL_TAGS: readonly Tag[];
//#endregion
//#region src/register.d.ts
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
export declare function registerTags(store?: TagsStore): void;
//#endregion
export type { LegacyTags };
//# sourceMappingURL=index.d.mts.map