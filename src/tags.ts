/**
 * The Blockchain Commons CBOR tag registry.
 *
 * Values are the CBOR tag numbers on the wire; names are wire too, since
 * `uniform-resources` derives UR types from them (`ur:envelope`). Neither
 * may change without a specification change. Every constant is frozen.
 *
 * Tags compare by value: `TAG_ENVELOPE === Tag.from(200, "envelope")` is
 * `false` (two objects), `Tag.equals(a, b)` and `a.value === b.value` are
 * the comparisons to write.
 *
 * @see https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md
 * @module tags
 */
import {
  Tag,
  TAG_ENCODED_CBOR as IANA_ENCODED_CBOR,
  TAG_URI as IANA_URI,
  TAG_UUID as IANA_UUID,
} from "@blockchaincommons/dcbor";

/**
 * One immutable tag. dcbor's `Tag.from` returns a plain object whose
 * `readonly` is a compile-time promise only; the names here are wire,
 * so nothing may rewrite them process-wide.
 */
const tag = (value: number, name: string): Tag => Object.freeze(Tag.from(value, name));

// IANA standard tags this stack uses. dcbor owns the numbers (it defines
// them unnamed); this registry owns the names.

/** #6.32: URI (RFC 8949 §3.4.5.3), named `url` in this stack. */
export const TAG_URI: Tag = tag(IANA_URI, "url");
/** #6.37: binary UUID (RFC 4122). */
export const TAG_UUID: Tag = tag(IANA_UUID, "uuid");

// Core Envelope tags. #6.24 was used as the leaf header by an earlier spec
// (incorrectly: RFC 8949 §3.4.5.1 requires a byte string); #6.201 replaced
// it and #6.24 is still recognised on decode. #6.200 and #6.201 are the only
// Blockchain Commons tags in IANA's "Specification Required" range.

/** #6.24: encoded CBOR data item; the pre-#6.201 Envelope leaf header, accepted on decode only. */
export const TAG_ENCODED_CBOR: Tag = tag(IANA_ENCODED_CBOR, "encoded-cbor");
/** #6.200: Gordian Envelope. */
export const TAG_ENVELOPE: Tag = tag(200, "envelope");
/** #6.201: dCBOR data item; the Envelope leaf case. */
export const TAG_LEAF: Tag = tag(201, "leaf");
/** #6.262: byte string holding UTF-8 JSON text. */
export const TAG_JSON: Tag = tag(262, "json");

// Envelope extensions.

/** #6.40000: known value, a registered unsigned integer with a fixed meaning. */
export const TAG_KNOWN_VALUE: Tag = tag(40000, "known-value");
/** #6.40001: SHA-256 digest. */
export const TAG_DIGEST: Tag = tag(40001, "digest");
/** #6.40002: encrypted message (IETF ChaCha20-Poly1305). */
export const TAG_ENCRYPTED: Tag = tag(40002, "encrypted");
/** #6.40003: DEFLATE-compressed data with the digest of the original. */
export const TAG_COMPRESSED: Tag = tag(40003, "compressed");

// Distributed function calls.

/** #6.40004: request. */
export const TAG_REQUEST: Tag = tag(40004, "request");
/** #6.40005: response. */
export const TAG_RESPONSE: Tag = tag(40005, "response");
/** #6.40006: function identifier. */
export const TAG_FUNCTION: Tag = tag(40006, "function");
/** #6.40007: parameter identifier. */
export const TAG_PARAMETER: Tag = tag(40007, "parameter");
/** #6.40008: placeholder. */
export const TAG_PLACEHOLDER: Tag = tag(40008, "placeholder");
/** #6.40009: replacement. */
export const TAG_REPLACEMENT: Tag = tag(40009, "replacement");

// Cryptographic components.

/** #6.40010: X25519 key-agreement private key. */
export const TAG_X25519_PRIVATE_KEY: Tag = tag(40010, "agreement-private-key");
/** #6.40011: X25519 key-agreement public key. */
export const TAG_X25519_PUBLIC_KEY: Tag = tag(40011, "agreement-public-key");
/** #6.40012: apparently random identifier (32 bytes). */
export const TAG_ARID: Tag = tag(40012, "arid");
/** #6.40013: a signing and an encapsulation private key together. */
export const TAG_PRIVATE_KEYS: Tag = tag(40013, "crypto-prvkeys");
/** #6.40014: nonce. */
export const TAG_NONCE: Tag = tag(40014, "nonce");
/** #6.40015: password. */
export const TAG_PASSWORD: Tag = tag(40015, "password");
/** #6.40016: private key base, the material every other key derives from. */
export const TAG_PRIVATE_KEY_BASE: Tag = tag(40016, "crypto-prvkey-base");
/** #6.40017: a signing and an encapsulation public key together. */
export const TAG_PUBLIC_KEYS: Tag = tag(40017, "crypto-pubkeys");
/** #6.40018: salt. */
export const TAG_SALT: Tag = tag(40018, "salt");
/** #6.40019: sealed message, encrypted to a recipient's public keys. */
export const TAG_SEALED_MESSAGE: Tag = tag(40019, "crypto-sealed");
/** #6.40020: signature. */
export const TAG_SIGNATURE: Tag = tag(40020, "signature");
/** #6.40021: signing private key. */
export const TAG_SIGNING_PRIVATE_KEY: Tag = tag(40021, "signing-private-key");
/** #6.40022: signing public key. */
export const TAG_SIGNING_PUBLIC_KEY: Tag = tag(40022, "signing-public-key");
/** #6.40023: symmetric encryption key. */
export const TAG_SYMMETRIC_KEY: Tag = tag(40023, "crypto-key");
/** #6.40024: extensible identifier (XID). */
export const TAG_XID: Tag = tag(40024, "xid");
/** #6.40025: reference to an identifier by a prefix of it. */
export const TAG_REFERENCE: Tag = tag(40025, "reference");
/** #6.40026: distributed function call event. */
export const TAG_EVENT: Tag = tag(40026, "event");
/** #6.40027: symmetric key wrapped for a recipient. */
export const TAG_ENCRYPTED_KEY: Tag = tag(40027, "encrypted-key");

// Post-quantum.

/** #6.40100: ML-KEM (FIPS 203) private key. */
export const TAG_MLKEM_PRIVATE_KEY: Tag = tag(40100, "mlkem-private-key");
/** #6.40101: ML-KEM (FIPS 203) public key. */
export const TAG_MLKEM_PUBLIC_KEY: Tag = tag(40101, "mlkem-public-key");
/** #6.40102: ML-KEM (FIPS 203) encapsulated ciphertext. */
export const TAG_MLKEM_CIPHERTEXT: Tag = tag(40102, "mlkem-ciphertext");
/** #6.40103: ML-DSA (FIPS 204) private key. */
export const TAG_MLDSA_PRIVATE_KEY: Tag = tag(40103, "mldsa-private-key");
/** #6.40104: ML-DSA (FIPS 204) public key. */
export const TAG_MLDSA_PUBLIC_KEY: Tag = tag(40104, "mldsa-public-key");
/** #6.40105: ML-DSA (FIPS 204) signature. */
export const TAG_MLDSA_SIGNATURE: Tag = tag(40105, "mldsa-signature");

// Seeds, keys and wallets.

/** #6.40300: cryptographic seed. */
export const TAG_SEED: Tag = tag(40300, "seed");
/** #6.40303: BIP-32 hierarchical deterministic key. */
export const TAG_HDKEY: Tag = tag(40303, "hdkey");
/** #6.40304: BIP-32 derivation path. */
export const TAG_DERIVATION_PATH: Tag = tag(40304, "keypath");
/** #6.40305: coin type and network (`coin-info`). */
export const TAG_USE_INFO: Tag = tag(40305, "coin-info");
/** #6.40306: elliptic-curve key. */
export const TAG_EC_KEY: Tag = tag(40306, "eckey");
/** #6.40307: address. */
export const TAG_ADDRESS: Tag = tag(40307, "address");
/** #6.40308: output descriptor. */
export const TAG_OUTPUT_DESCRIPTOR: Tag = tag(40308, "output-descriptor");
/** #6.40309: SSKR share. */
export const TAG_SSKR_SHARE: Tag = tag(40309, "sskr");
/** #6.40310: partially signed Bitcoin transaction. */
export const TAG_PSBT: Tag = tag(40310, "psbt");
/** #6.40311: account descriptor. */
export const TAG_ACCOUNT_DESCRIPTOR: Tag = tag(40311, "account-descriptor");

// SSH.

/** #6.40800: OpenSSH text-format private key. */
export const TAG_SSH_TEXT_PRIVATE_KEY: Tag = tag(40800, "ssh-private");
/** #6.40801: OpenSSH text-format public key. */
export const TAG_SSH_TEXT_PUBLIC_KEY: Tag = tag(40801, "ssh-public");
/** #6.40802: OpenSSH text-format signature. */
export const TAG_SSH_TEXT_SIGNATURE: Tag = tag(40802, "ssh-signature");
/** #6.40803: OpenSSH text-format certificate. */
export const TAG_SSH_TEXT_CERTIFICATE: Tag = tag(40803, "ssh-certificate");

/** #6.1347571542: provenance mark. */
export const TAG_PROVENANCE_MARK: Tag = tag(1347571542, "provenance");

// Output descriptor script types (subtypes of `crypto-output`).

/** #6.400: output descriptor `sh` (script hash). */
export const TAG_OUTPUT_SCRIPT_HASH: Tag = tag(400, "output-script-hash");
/** #6.401: output descriptor `wsh` (witness script hash). */
export const TAG_OUTPUT_WITNESS_SCRIPT_HASH: Tag = tag(401, "output-witness-script-hash");
/** #6.402: output descriptor `pk` (public key). */
export const TAG_OUTPUT_PUBLIC_KEY: Tag = tag(402, "output-public-key");
/** #6.403: output descriptor `pkh` (public key hash). */
export const TAG_OUTPUT_PUBLIC_KEY_HASH: Tag = tag(403, "output-public-key-hash");
/** #6.404: output descriptor `wpkh` (witness public key hash). */
export const TAG_OUTPUT_WITNESS_PUBLIC_KEY_HASH: Tag = tag(404, "output-witness-public-key-hash");
/** #6.405: output descriptor `combo`. */
export const TAG_OUTPUT_COMBO: Tag = tag(405, "output-combo");
/** #6.406: output descriptor `multi` (multisig). */
export const TAG_OUTPUT_MULTISIG: Tag = tag(406, "output-multisig");
/** #6.407: output descriptor `sortedmulti` (sorted multisig). */
export const TAG_OUTPUT_SORTED_MULTISIG: Tag = tag(407, "output-sorted-multisig");
/** #6.408: output descriptor `raw` (raw script). */
export const TAG_OUTPUT_RAW_SCRIPT: Tag = tag(408, "output-raw-script");
/** #6.409: output descriptor `tr` (taproot). */
export const TAG_OUTPUT_TAPROOT: Tag = tag(409, "output-taproot");
/** #6.410: output descriptor cosigner. */
export const TAG_OUTPUT_COSIGNER: Tag = tag(410, "output-cosigner");

/** The legacy tag set; see {@link LEGACY_TAGS}. */
export interface LegacyTags {
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
export const LEGACY_TAGS: LegacyTags = Object.freeze({
  SEED_V1: tag(300, "crypto-seed"),
  EC_KEY_V1: tag(306, "crypto-eckey"),
  SSKR_SHARE_V1: tag(309, "crypto-sskr"),
  HDKEY_V1: tag(303, "crypto-hdkey"),
  DERIVATION_PATH_V1: tag(304, "crypto-keypath"),
  USE_INFO_V1: tag(305, "crypto-coin-info"),
  OUTPUT_DESCRIPTOR_V1: tag(307, "crypto-output"),
  PSBT_V1: tag(310, "crypto-psbt"),
  ACCOUNT_V1: tag(311, "crypto-account"),
});

/**
 * Every tag this package defines, in registration order (the order the
 * Rust reference registers them). Iterate this rather than the constants.
 * Frozen, like every entry in it.
 */
export const ALL_TAGS: readonly Tag[] = Object.freeze([
  TAG_URI,
  TAG_UUID,
  TAG_ENCODED_CBOR,
  TAG_ENVELOPE,
  TAG_LEAF,
  TAG_JSON,
  TAG_KNOWN_VALUE,
  TAG_DIGEST,
  TAG_ENCRYPTED,
  TAG_COMPRESSED,
  TAG_REQUEST,
  TAG_RESPONSE,
  TAG_FUNCTION,
  TAG_PARAMETER,
  TAG_PLACEHOLDER,
  TAG_REPLACEMENT,
  TAG_EVENT,
  LEGACY_TAGS.SEED_V1,
  LEGACY_TAGS.EC_KEY_V1,
  LEGACY_TAGS.SSKR_SHARE_V1,
  TAG_SEED,
  TAG_EC_KEY,
  TAG_SSKR_SHARE,
  TAG_X25519_PRIVATE_KEY,
  TAG_X25519_PUBLIC_KEY,
  TAG_ARID,
  TAG_PRIVATE_KEYS,
  TAG_NONCE,
  TAG_PASSWORD,
  TAG_PRIVATE_KEY_BASE,
  TAG_PUBLIC_KEYS,
  TAG_SALT,
  TAG_SEALED_MESSAGE,
  TAG_SIGNATURE,
  TAG_SIGNING_PRIVATE_KEY,
  TAG_SIGNING_PUBLIC_KEY,
  TAG_SYMMETRIC_KEY,
  TAG_XID,
  TAG_REFERENCE,
  TAG_ENCRYPTED_KEY,
  TAG_MLKEM_PRIVATE_KEY,
  TAG_MLKEM_PUBLIC_KEY,
  TAG_MLKEM_CIPHERTEXT,
  TAG_MLDSA_PRIVATE_KEY,
  TAG_MLDSA_PUBLIC_KEY,
  TAG_MLDSA_SIGNATURE,
  LEGACY_TAGS.HDKEY_V1,
  LEGACY_TAGS.DERIVATION_PATH_V1,
  LEGACY_TAGS.USE_INFO_V1,
  LEGACY_TAGS.OUTPUT_DESCRIPTOR_V1,
  LEGACY_TAGS.PSBT_V1,
  LEGACY_TAGS.ACCOUNT_V1,
  TAG_HDKEY,
  TAG_DERIVATION_PATH,
  TAG_USE_INFO,
  TAG_ADDRESS,
  TAG_OUTPUT_DESCRIPTOR,
  TAG_PSBT,
  TAG_ACCOUNT_DESCRIPTOR,
  TAG_SSH_TEXT_PRIVATE_KEY,
  TAG_SSH_TEXT_PUBLIC_KEY,
  TAG_SSH_TEXT_SIGNATURE,
  TAG_SSH_TEXT_CERTIFICATE,
  TAG_OUTPUT_SCRIPT_HASH,
  TAG_OUTPUT_WITNESS_SCRIPT_HASH,
  TAG_OUTPUT_PUBLIC_KEY,
  TAG_OUTPUT_PUBLIC_KEY_HASH,
  TAG_OUTPUT_WITNESS_PUBLIC_KEY_HASH,
  TAG_OUTPUT_COMBO,
  TAG_OUTPUT_MULTISIG,
  TAG_OUTPUT_SORTED_MULTISIG,
  TAG_OUTPUT_RAW_SCRIPT,
  TAG_OUTPUT_TAPROOT,
  TAG_OUTPUT_COSIGNER,
  TAG_PROVENANCE_MARK,
]);
