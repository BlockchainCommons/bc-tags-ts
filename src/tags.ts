/**
 * The Blockchain Commons CBOR tag registry.
 *
 * Values are the CBOR tag numbers on the wire; names are wire too, since
 * `uniform-resources` derives UR types from them (`ur:envelope`). Neither
 * may change without a specification change.
 *
 * @see https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md
 * @module tags
 */
import { Tag } from "@blockchaincommons/dcbor";

// IANA standard tags this stack uses (also defined by dcbor; named here for
// the registry).
export const URI: Tag = Tag.from(32, "url");
export const UUID: Tag = Tag.from(37, "uuid");

// Core Envelope tags. #6.24 was used as the leaf header by an earlier spec
// (incorrectly: RFC 8949 §3.4.5.1 requires a byte string); #6.201 replaced
// it and #6.24 is still recognised on decode. #6.200 and #6.201 are the only
// Blockchain Commons tags in IANA's "Specification Required" range.
export const ENCODED_CBOR: Tag = Tag.from(24, "encoded-cbor");
export const ENVELOPE: Tag = Tag.from(200, "envelope");
export const LEAF: Tag = Tag.from(201, "leaf");
export const JSON: Tag = Tag.from(262, "json");

// Envelope extensions.
export const KNOWN_VALUE: Tag = Tag.from(40000, "known-value");
export const DIGEST: Tag = Tag.from(40001, "digest");
export const ENCRYPTED: Tag = Tag.from(40002, "encrypted");
export const COMPRESSED: Tag = Tag.from(40003, "compressed");

// Distributed function calls.
export const REQUEST: Tag = Tag.from(40004, "request");
export const RESPONSE: Tag = Tag.from(40005, "response");
export const FUNCTION: Tag = Tag.from(40006, "function");
export const PARAMETER: Tag = Tag.from(40007, "parameter");
export const PLACEHOLDER: Tag = Tag.from(40008, "placeholder");
export const REPLACEMENT: Tag = Tag.from(40009, "replacement");

// Cryptographic components.
export const X25519_PRIVATE_KEY: Tag = Tag.from(40010, "agreement-private-key");
export const X25519_PUBLIC_KEY: Tag = Tag.from(40011, "agreement-public-key");
export const ARID: Tag = Tag.from(40012, "arid");
export const PRIVATE_KEYS: Tag = Tag.from(40013, "crypto-prvkeys");
export const NONCE: Tag = Tag.from(40014, "nonce");
export const PASSWORD: Tag = Tag.from(40015, "password");
export const PRIVATE_KEY_BASE: Tag = Tag.from(40016, "crypto-prvkey-base");
export const PUBLIC_KEYS: Tag = Tag.from(40017, "crypto-pubkeys");
export const SALT: Tag = Tag.from(40018, "salt");
export const SEALED_MESSAGE: Tag = Tag.from(40019, "crypto-sealed");
export const SIGNATURE: Tag = Tag.from(40020, "signature");
export const SIGNING_PRIVATE_KEY: Tag = Tag.from(40021, "signing-private-key");
export const SIGNING_PUBLIC_KEY: Tag = Tag.from(40022, "signing-public-key");
export const SYMMETRIC_KEY: Tag = Tag.from(40023, "crypto-key");
export const XID: Tag = Tag.from(40024, "xid");
export const REFERENCE: Tag = Tag.from(40025, "reference");
export const EVENT: Tag = Tag.from(40026, "event");
export const ENCRYPTED_KEY: Tag = Tag.from(40027, "encrypted-key");

// Post-quantum.
export const MLKEM_PRIVATE_KEY: Tag = Tag.from(40100, "mlkem-private-key");
export const MLKEM_PUBLIC_KEY: Tag = Tag.from(40101, "mlkem-public-key");
export const MLKEM_CIPHERTEXT: Tag = Tag.from(40102, "mlkem-ciphertext");
export const MLDSA_PRIVATE_KEY: Tag = Tag.from(40103, "mldsa-private-key");
export const MLDSA_PUBLIC_KEY: Tag = Tag.from(40104, "mldsa-public-key");
export const MLDSA_SIGNATURE: Tag = Tag.from(40105, "mldsa-signature");

// Seeds, keys and wallets.
export const SEED: Tag = Tag.from(40300, "seed");
export const HDKEY: Tag = Tag.from(40303, "hdkey");
export const DERIVATION_PATH: Tag = Tag.from(40304, "keypath");
export const USE_INFO: Tag = Tag.from(40305, "coin-info");
export const EC_KEY: Tag = Tag.from(40306, "eckey");
export const ADDRESS: Tag = Tag.from(40307, "address");
export const OUTPUT_DESCRIPTOR: Tag = Tag.from(40308, "output-descriptor");
export const SSKR_SHARE: Tag = Tag.from(40309, "sskr");
export const PSBT: Tag = Tag.from(40310, "psbt");
export const ACCOUNT_DESCRIPTOR: Tag = Tag.from(40311, "account-descriptor");

// SSH.
export const SSH_TEXT_PRIVATE_KEY: Tag = Tag.from(40800, "ssh-private");
export const SSH_TEXT_PUBLIC_KEY: Tag = Tag.from(40801, "ssh-public");
export const SSH_TEXT_SIGNATURE: Tag = Tag.from(40802, "ssh-signature");
export const SSH_TEXT_CERTIFICATE: Tag = Tag.from(40803, "ssh-certificate");

export const PROVENANCE_MARK: Tag = Tag.from(1347571542, "provenance");

// Output descriptor subtypes (crypto-output).
export const OUTPUT_SCRIPT_HASH: Tag = Tag.from(400, "output-script-hash");
export const OUTPUT_WITNESS_SCRIPT_HASH: Tag = Tag.from(401, "output-witness-script-hash");
export const OUTPUT_PUBLIC_KEY: Tag = Tag.from(402, "output-public-key");
export const OUTPUT_PUBLIC_KEY_HASH: Tag = Tag.from(403, "output-public-key-hash");
export const OUTPUT_WITNESS_PUBLIC_KEY_HASH: Tag = Tag.from(404, "output-witness-public-key-hash");
export const OUTPUT_COMBO: Tag = Tag.from(405, "output-combo");
export const OUTPUT_MULTISIG: Tag = Tag.from(406, "output-multisig");
export const OUTPUT_SORTED_MULTISIG: Tag = Tag.from(407, "output-sorted-multisig");
export const OUTPUT_RAW_SCRIPT: Tag = Tag.from(408, "output-raw-script");
export const OUTPUT_TAPROOT: Tag = Tag.from(409, "output-taproot");
export const OUTPUT_COSIGNER: Tag = Tag.from(410, "output-cosigner");

/** The legacy tag set; see {@link LEGACY_TAGS}. */
export interface LegacyTags {
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
export const LEGACY_TAGS: LegacyTags = {
  SEED_V1: Tag.from(300, "crypto-seed"),
  EC_KEY_V1: Tag.from(306, "crypto-eckey"),
  SSKR_SHARE_V1: Tag.from(309, "crypto-sskr"),
  HDKEY_V1: Tag.from(303, "crypto-hdkey"),
  DERIVATION_PATH_V1: Tag.from(304, "crypto-keypath"),
  USE_INFO_V1: Tag.from(305, "crypto-coin-info"),
  OUTPUT_DESCRIPTOR_V1: Tag.from(307, "crypto-output"),
  PSBT_V1: Tag.from(310, "crypto-psbt"),
  ACCOUNT_V1: Tag.from(311, "crypto-account"),
};

/**
 * Every tag this package defines, in registration order (the order the
 * Rust reference registers them). Iterate this rather than the constants.
 */
export const ALL_TAGS: readonly Tag[] = [
  URI,
  UUID,
  ENCODED_CBOR,
  ENVELOPE,
  LEAF,
  JSON,
  KNOWN_VALUE,
  DIGEST,
  ENCRYPTED,
  COMPRESSED,
  REQUEST,
  RESPONSE,
  FUNCTION,
  PARAMETER,
  PLACEHOLDER,
  REPLACEMENT,
  EVENT,
  LEGACY_TAGS.SEED_V1,
  LEGACY_TAGS.EC_KEY_V1,
  LEGACY_TAGS.SSKR_SHARE_V1,
  SEED,
  EC_KEY,
  SSKR_SHARE,
  X25519_PRIVATE_KEY,
  X25519_PUBLIC_KEY,
  ARID,
  PRIVATE_KEYS,
  NONCE,
  PASSWORD,
  PRIVATE_KEY_BASE,
  PUBLIC_KEYS,
  SALT,
  SEALED_MESSAGE,
  SIGNATURE,
  SIGNING_PRIVATE_KEY,
  SIGNING_PUBLIC_KEY,
  SYMMETRIC_KEY,
  XID,
  REFERENCE,
  ENCRYPTED_KEY,
  MLKEM_PRIVATE_KEY,
  MLKEM_PUBLIC_KEY,
  MLKEM_CIPHERTEXT,
  MLDSA_PRIVATE_KEY,
  MLDSA_PUBLIC_KEY,
  MLDSA_SIGNATURE,
  LEGACY_TAGS.HDKEY_V1,
  LEGACY_TAGS.DERIVATION_PATH_V1,
  LEGACY_TAGS.USE_INFO_V1,
  LEGACY_TAGS.OUTPUT_DESCRIPTOR_V1,
  LEGACY_TAGS.PSBT_V1,
  LEGACY_TAGS.ACCOUNT_V1,
  HDKEY,
  DERIVATION_PATH,
  USE_INFO,
  ADDRESS,
  OUTPUT_DESCRIPTOR,
  PSBT,
  ACCOUNT_DESCRIPTOR,
  SSH_TEXT_PRIVATE_KEY,
  SSH_TEXT_PUBLIC_KEY,
  SSH_TEXT_SIGNATURE,
  SSH_TEXT_CERTIFICATE,
  OUTPUT_SCRIPT_HASH,
  OUTPUT_WITNESS_SCRIPT_HASH,
  OUTPUT_PUBLIC_KEY,
  OUTPUT_PUBLIC_KEY_HASH,
  OUTPUT_WITNESS_PUBLIC_KEY_HASH,
  OUTPUT_COMBO,
  OUTPUT_MULTISIG,
  OUTPUT_SORTED_MULTISIG,
  OUTPUT_RAW_SCRIPT,
  OUTPUT_TAPROOT,
  OUTPUT_COSIGNER,
  PROVENANCE_MARK,
];
