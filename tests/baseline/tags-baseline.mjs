//#region ../bc-dcbor-compat-ts/node_modules/@blockchaincommons/dcbor/dist/error-BXLcx8Bl.mjs
const MajorType$1 = {
	Unsigned: 0,
	Negative: 1,
	ByteString: 2,
	Text: 3,
	Array: 4,
	Map: 5,
	Tagged: 6,
	Simple: 7
};
const isCborNumber$1 = (value) => {
	return typeof value === "number" || typeof value === "bigint";
};
const isCbor$1 = (value) => {
	return value !== null && typeof value === "object" && "isCbor" in value && value.isCbor === true;
};
/**
* Compare two tag values for equality, normalizing `number` vs `bigint`.
* A raw `===` would treat `100n` and `100` as unequal, so a large tag that
* decoded to a `bigint` wouldn't match the same value written as a `number`.
*
* @internal Exported for cross-module use; not part of the public surface -
* use `Tag.equals` instead.
*/
const tagValuesEqual$1 = (a, b) => {
	if (typeof a === "bigint" || typeof b === "bigint") return BigInt(a) === BigInt(b);
	return a === b;
};
/**
* Value-type companion for the `Tag` interface: an interface plus a merged
* `const` with a handful of members. It stays small and must not import the
* encode/format graph.
*/
const Tag = {
	/**
	* Create a Tag from its numeric value, optionally with a name.
	*
	* ```typescript
	* Tag.from(1, "date");
	* Tag.from(12345);
	* ```
	*/
	from(value, name) {
		if (name !== void 0) return {
			value,
			name
		};
		return { value };
	},
	/**
	* Compare two tags for equality: compares by `value` only (normalizing
	* `number` vs `bigint`) and ignores the optional `name`.
	*/
	equals(a, b) {
		return tagValuesEqual$1(a.value, b.value);
	}
};
/**
* Get the string representation of a tag.
* Internal function used for error messages.
*
* @param tag - The tag to represent
* @returns String representation (name if available, otherwise value)
*
* @internal
*/
const tagToString$1 = (tag) => tag.name ?? tag.value.toString();
const captureStackTrace = Error.captureStackTrace;
/**
* The single error type thrown by dCBOR encoding, decoding, and extraction.
*
* @example
* ```typescript
* try {
*   decodeCbor(bytes);
* } catch (e) {
*   if (CborError.isCborError(e) && e.code === "WrongTag") {
*     console.log(e.details.expectedTag, e.details.actualTag);
*   }
* }
* ```
*/
var CborError$1 = class CborError extends Error {
	/** Machine-readable discriminant; switch on this to handle errors. */
	code;
	/** Structured, code-specific data (see {@link CborErrorDetails}). */
	details;
	constructor(code, message, details = {}) {
		super(message);
		this.name = "CborError";
		this.code = code;
		this.details = details;
		Object.setPrototypeOf(this, new.target.prototype);
		if (typeof captureStackTrace === "function") captureStackTrace(this, CborError);
	}
	/** Type guard: is `value` a {@link CborError}? Narrows to the
	* code-discriminated {@link CborErrorTyped} union. */
	static isCborError(value) {
		return value instanceof CborError;
	}
	/** The CBOR data ended before a complete item could be decoded. */
	static underrun() {
		return new CborError("Underrun", "early end of CBOR data");
	}
	/** An unsupported/invalid value was found in a CBOR header byte. */
	static unsupportedHeaderValue(headerValue) {
		return new CborError("UnsupportedHeaderValue", "unsupported value in CBOR header", { headerValue });
	}
	/** A numeric value was not in its shortest/canonical dCBOR form. */
	static nonCanonicalNumeric() {
		return new CborError("NonCanonicalNumeric", "a CBOR numeric value was encoded in non-canonical form");
	}
	/** A major-type-7 simple value other than false/true/null/float. */
	static invalidSimpleValue() {
		return new CborError("InvalidSimpleValue", "an invalid CBOR simple value was encountered");
	}
	/** A text string was not valid UTF-8 (with the underlying reason). */
	static invalidString(cause) {
		return new CborError("InvalidString", `an invalidly-encoded UTF-8 string was encountered in the CBOR (${cause})`, { cause });
	}
	/** A text string was not in Unicode NFC. */
	static nonCanonicalString() {
		return new CborError("NonCanonicalString", "a CBOR string was not encoded in Unicode Canonical Normalization Form C");
	}
	/** The decoded item left `count` trailing bytes unconsumed. */
	static unusedData(count) {
		return new CborError("UnusedData", `the decoded CBOR had ${count} extra bytes at the end`, { count });
	}
	/** Map keys were not in canonical ascending byte order. */
	static misorderedMapKey() {
		return new CborError("MisorderedMapKey", "the decoded CBOR map has keys that are not in canonical order");
	}
	/** A map contained a duplicate key. */
	static duplicateMapKey() {
		return new CborError("DuplicateMapKey", "the decoded CBOR map has a duplicate key");
	}
	/** A requested map key was not present. */
	static missingMapKey() {
		return new CborError("MissingMapKey", "missing CBOR map key");
	}
	/** A numeric value could not be represented in the target type. */
	static outOfRange() {
		return new CborError("OutOfRange", "the CBOR numeric value could not be represented in the specified numeric type");
	}
	/** The CBOR value was not the type expected by a conversion. */
	static wrongType() {
		return new CborError("WrongType", "the decoded CBOR value was not the expected type");
	}
	/** A tagged value had a tag other than the one expected. */
	static wrongTag(expected, actual) {
		return new CborError("WrongTag", `expected CBOR tag ${tagToString$1(expected)}, but got ${tagToString$1(actual)}`, {
			expectedTag: expected,
			actualTag: actual
		});
	}
	/** Invalid UTF-8 in a text string (with the underlying reason). */
	static invalidUtf8(cause) {
		return new CborError("InvalidUtf8", `invalid UTF‑8 string: ${cause}`, { cause });
	}
	/** Invalid ISO 8601 / RFC 3339 date string (with the underlying reason). */
	static invalidDate(cause) {
		return new CborError("InvalidDate", `invalid ISO 8601 date string: ${cause}`, { cause });
	}
	/** An arbitrary error carrying a custom message. */
	static custom(message) {
		return new CborError("Custom", message);
	}
};
//#endregion
//#region ../bc-dcbor-compat-ts/node_modules/@blockchaincommons/dcbor/dist/tags-store-BZjfminT.mjs
/**
* Byte-array utilities shared across the library.
*
* @module stdlib
*/
/**
* Check if two byte arrays are equal.
*/
const areBytesEqual = (a, b) => {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
	return true;
};
/**
* Lexicographically compare two byte arrays.
* Returns: -1 if a < b, 0 if a == b, 1 if a > b
*/
const lexicographicallyCompareBytes = (a, b) => {
	const minLen = Math.min(a.length, b.length);
	for (let i = 0; i < minLen; i++) {
		const aVal = a[i];
		const bVal = b[i];
		if (aVal === void 0 || bVal === void 0) throw CborError$1.custom("Unexpected undefined byte in array");
		if (aVal < bVal) return -1;
		if (aVal > bVal) return 1;
	}
	if (a.length < b.length) return -1;
	if (a.length > b.length) return 1;
	return 0;
};
/**
* A map keyed by encoded CBOR key bytes, kept in canonical (lexicographic)
* byte order.
*
* dCBOR needs exactly one specialised container: keys are the encoded bytes of
* a CBOR value, and the map must iterate in ascending lexicographic byte order
* (that ordering is the deterministic wire contract). This is a thin,
* dependency-free structure over a sorted array with binary-search insertion -
* it gives the exact ordering dCBOR requires, and lets the decode hot path
* append in O(1) since canonical input already arrives sorted.
*
* @module sorted-byte-map
*/
var SortedByteMap = class {
	items = [];
	/** Number of entries. */
	get size() {
		return this.items.length;
	}
	/**
	* Binary search for `key`. Returns the index of an exact match, or the
	* negative value `-(insertionPoint) - 1` when absent, so a single search both
	* tests membership and locates where an insert would go (Java
	* `Arrays.binarySearch` convention).
	*/
	indexOf(key) {
		let lo = 0;
		let hi = this.items.length - 1;
		while (lo <= hi) {
			const mid = lo + hi >>> 1;
			const cmp = lexicographicallyCompareBytes(this.items[mid].key, key);
			if (cmp < 0) lo = mid + 1;
			else if (cmp > 0) hi = mid - 1;
			else return mid;
		}
		return -(lo + 1);
	}
	/** Insert or replace the entry for `key`. */
	set(key, value) {
		const i = this.indexOf(key);
		if (i >= 0) this.items[i] = {
			key,
			value
		};
		else this.items.splice(-i - 1, 0, {
			key,
			value
		});
	}
	/**
	* Append an entry whose key is strictly greater than every existing key.
	* Used by canonical decode, where keys arrive already sorted; the caller must
	* guarantee the ordering (this skips the search + shift that {@link set} does).
	*/
	appendGreatest(key, value) {
		this.items.push({
			key,
			value
		});
	}
	/** The value for `key`, or `undefined` if absent. */
	get(key) {
		const i = this.indexOf(key);
		return i >= 0 ? this.items[i].value : void 0;
	}
	/** Whether `key` is present. */
	has(key) {
		return this.indexOf(key) >= 0;
	}
	/** Remove `key`; returns whether it was present. */
	delete(key) {
		const i = this.indexOf(key);
		if (i < 0) return false;
		this.items.splice(i, 1);
		return true;
	}
	/** The greatest key currently stored (ascending order), or `undefined`. */
	maxKey() {
		const n = this.items.length;
		return n > 0 ? this.items[n - 1].key : void 0;
	}
	/** Map over each value (with its key) in ascending key order. */
	map(fn) {
		return this.items.map((e) => fn(e.value, e.key));
	}
};
/**
* Numeric boundary contract and helpers.
*
* ## The `number` / `bigint` contract
*
* dCBOR integers span `[-(2^64), 2^64)`, which exceeds JavaScript's safe
* integer range (`±(2^53 − 1)`). The single, repo-wide rule is:
*
* - An integer that fits in the IEEE-754 **safe** range is represented as a
*   `number`; anything larger (in magnitude) is a `bigint`.
* - Decoding returns the **narrowest exact** representation via
*   {@link narrowInteger}, so small values are ergonomic `number`s and large
*   ones remain lossless `bigint`s.
* - Encoding accepts either at the public edge and normalises once.
*
* Every module funnels its boundary logic through this file - nothing else
* should hard-code `Number.MAX_SAFE_INTEGER`, `2^64`, etc.
*
* @module numeric
*/
/** `BigInt(Number.MAX_SAFE_INTEGER)` - largest integer exact as a `number`. */
const SAFE_MAX_BIG = BigInt(Number.MAX_SAFE_INTEGER);
/** `BigInt(Number.MIN_SAFE_INTEGER)`. */
const SAFE_MIN_BIG = BigInt(Number.MIN_SAFE_INTEGER);
/** Smallest dCBOR-encodable integer: −(2^64). */
const CBOR_INT_MIN = -(1n << 64n);
/**
* Return the narrowest exact representation of an integer: a `number` when it
* fits the safe-integer range, otherwise the `bigint` unchanged. This is the
* canonical way to hand an integer back to callers.
*/
const narrowInteger = (value) => value >= SAFE_MIN_BIG && value <= SAFE_MAX_BIG ? Number(value) : value;
/**
* A growable output buffer for encoding.
*
* The encoder writes a whole CBOR tree into a single `BufWriter` rather than
* allocating a fresh `Uint8Array` per node and concatenating them (which
* re-copies every subtree at every level): one buffer, geometric growth, one
* final right-sized copy.
*
* @module buf-writer
*/
var BufWriter = class {
	buf;
	view;
	pos = 0;
	constructor(initialCapacity = 64) {
		this.buf = new Uint8Array(initialCapacity);
		this.view = new DataView(this.buf.buffer);
	}
	/** Number of bytes written so far. */
	get length() {
		return this.pos;
	}
	/** Grow the backing store so at least `extra` more bytes fit. */
	ensure(extra) {
		const needed = this.pos + extra;
		if (needed <= this.buf.length) return;
		let capacity = this.buf.length * 2;
		while (capacity < needed) capacity *= 2;
		const next = new Uint8Array(capacity);
		next.set(this.buf.subarray(0, this.pos));
		this.buf = next;
		this.view = new DataView(next.buffer);
	}
	writeByte(byte) {
		this.ensure(1);
		this.buf[this.pos] = byte;
		this.pos += 1;
	}
	writeUint16(value) {
		this.ensure(2);
		this.view.setUint16(this.pos, value, false);
		this.pos += 2;
	}
	writeUint32(value) {
		this.ensure(4);
		this.view.setUint32(this.pos, value, false);
		this.pos += 4;
	}
	writeBigUint64(value) {
		this.ensure(8);
		this.view.setBigUint64(this.pos, value, false);
		this.pos += 8;
	}
	writeBytes(bytes) {
		this.ensure(bytes.length);
		this.buf.set(bytes, this.pos);
		this.pos += bytes.length;
	}
	/** Return the written region as a right-sized copy. */
	toBytes() {
		return this.buf.slice(0, this.pos);
	}
};
const typeBits = (t) => {
	return t << 5;
};
/**
* Write a CBOR head (major type + argument) straight into `writer`, avoiding
* the intermediate `Uint8Array` that {@link encodeVarInt} allocates. This is
* the encoder hot path (every node emits a head). It MUST stay byte-identical
* to {@link encodeVarInt}; the golden vectors cover both.
*/
const writeVarInt = (writer, value, majorType) => {
	if (value < 0) throw CborError$1.outOfRange();
	if (typeof value === "number" && hasFractionalPart(value)) throw CborError$1.outOfRange();
	const type = typeBits(majorType);
	if (isCborNumber$1(value) && value <= Number.MAX_SAFE_INTEGER) {
		const n = Number(value);
		if (n <= 23) writer.writeByte(n | type);
		else if (n <= 255) {
			writer.writeByte(24 | type);
			writer.writeByte(n);
		} else if (n <= 65535) {
			writer.writeByte(25 | type);
			writer.writeUint16(n);
		} else if (n <= 4294967295) {
			writer.writeByte(26 | type);
			writer.writeUint32(n);
		} else {
			writer.writeByte(27 | type);
			writer.writeBigUint64(BigInt(n));
		}
	} else {
		const big = BigInt(value);
		if (big > 18446744073709551615n) throw CborError$1.outOfRange();
		writer.writeByte(27 | type);
		writer.writeBigUint64(big);
	}
};
const encodeVarInt = (value, majorType) => {
	if (value < 0) throw CborError$1.outOfRange();
	if (typeof value === "number" && hasFractionalPart(value)) throw CborError$1.outOfRange();
	const type = typeBits(majorType);
	if (isCborNumber$1(value) && value <= Number.MAX_SAFE_INTEGER) {
		value = Number(value);
		if (value <= 23) return new Uint8Array([value | type]);
		else if (value <= 255) return new Uint8Array([24 | type, value]);
		else if (value <= 65535) {
			const buffer = /* @__PURE__ */ new ArrayBuffer(3);
			const view = new DataView(buffer);
			view.setUint8(0, 25 | type);
			view.setUint16(1, value);
			return new Uint8Array(buffer);
		} else if (value <= 4294967295) {
			const buffer = /* @__PURE__ */ new ArrayBuffer(5);
			const view = new DataView(buffer);
			view.setUint8(0, 26 | type);
			view.setUint32(1, value);
			return new Uint8Array(buffer);
		} else {
			const buffer = /* @__PURE__ */ new ArrayBuffer(9);
			const view = new DataView(buffer);
			view.setUint8(0, 27 | type);
			view.setBigUint64(1, BigInt(value));
			return new Uint8Array(buffer);
		}
	} else {
		const big = BigInt(value);
		if (big > 18446744073709551615n) throw CborError$1.outOfRange();
		const buffer = /* @__PURE__ */ new ArrayBuffer(9);
		const view = new DataView(buffer);
		view.setUint8(0, 27 | type);
		view.setBigUint64(1, big);
		return new Uint8Array(buffer);
	}
};
const hasFract = (n) => {
	return n % 1 !== 0;
};
/**
* Shared float→integer exactness gate for every `Exact<Int>.exactFromF*`. A
* float is an exact integer of a width iff it is finite, whole, and inside that
* width's exclusive `(loEx, hiEx)` bounds (use ±Infinity to skip a side). The
* bounds encode the per-width / per-source-precision limits. The three typed
* wrappers below shape the truncated result.
*/
const isExactIntFloat = (source, loEx, hiEx) => Number.isFinite(source) && source > loEx && source < hiEx && !hasFract(source);
/** float → small integer (`number`). */
const intFromFloatNum = (source, loEx, hiEx) => isExactIntFloat(source, loEx, hiEx) ? Math.trunc(source) : void 0;
/** float → 64-bit integer (`number` if safe, else `bigint`). */
const intFromFloatNarrow = (source, loEx, hiEx) => isExactIntFloat(source, loEx, hiEx) ? narrowInteger(BigInt(Math.trunc(source))) : void 0;
/** float → 128-bit integer (`bigint`). */
const intFromFloatBig = (source, loEx, hiEx) => isExactIntFloat(source, loEx, hiEx) ? BigInt(Math.trunc(source)) : void 0;
/**
* Exact conversions for i128 (JavaScript bigint).
*/
var ExactI128 = class {
	static MIN = -(2n ** 127n);
	static MAX = 2n ** 127n - 1n;
	static exactFromF16(source) {
		return intFromFloatBig(source, -Infinity, Infinity);
	}
	static exactFromF32(source) {
		return intFromFloatBig(source, -Infinity, Infinity);
	}
	static exactFromF64(source) {
		return intFromFloatBig(source, -Infinity, Infinity);
	}
	static exactFromU64(source) {
		return BigInt(source);
	}
	static exactFromI64(source) {
		return BigInt(source);
	}
	static exactFromU128(source) {
		if (source > 2n ** 127n - 1n) return void 0;
		return source;
	}
	static exactFromI128(source) {
		return source;
	}
};
/**
* Exact conversions for u16 (0 to 65535).
*/
var ExactU16 = class {
	static MIN = 0;
	static MAX = 65535;
	static exactFromF16(source) {
		return intFromFloatNum(source, -1, Infinity);
	}
	static exactFromF32(source) {
		return intFromFloatNum(source, -1, 65536);
	}
	static exactFromF64(source) {
		return intFromFloatNum(source, -1, 65536);
	}
	static exactFromU64(source) {
		const n = typeof source === "bigint" ? Number(source) : source;
		if (n > 65535) return void 0;
		return n;
	}
	static exactFromI64(source) {
		const n = typeof source === "bigint" ? Number(source) : source;
		if (n < 0 || n > 65535) return void 0;
		return n;
	}
	static exactFromU128(source) {
		if (source > 65535n) return void 0;
		return Number(source);
	}
	static exactFromI128(source) {
		if (source < 0n || source > 65535n) return void 0;
		return Number(source);
	}
};
/**
* Exact conversions for u32 (0 to 4294967295).
*/
var ExactU32 = class {
	static MIN = 0;
	static MAX = 4294967295;
	static exactFromF16(source) {
		return intFromFloatNum(source, -1, Infinity);
	}
	static exactFromF32(source) {
		return intFromFloatNum(source, -1, 4294967296);
	}
	static exactFromF64(source) {
		return intFromFloatNum(source, -1, 4294967296);
	}
	static exactFromU64(source) {
		const n = typeof source === "bigint" ? Number(source) : source;
		if (n > 4294967295) return void 0;
		return n;
	}
	static exactFromI64(source) {
		const n = typeof source === "bigint" ? Number(source) : source;
		if (n < 0 || n > 4294967295) return void 0;
		return n;
	}
	static exactFromU128(source) {
		if (source > 4294967295n) return void 0;
		return Number(source);
	}
	static exactFromI128(source) {
		if (source < 0n || source > 4294967295n) return void 0;
		return Number(source);
	}
};
/**
* Exact conversions for u64 (0 to 18446744073709551615).
*/
var ExactU64 = class {
	static MIN = 0n;
	static MAX = 18446744073709551615n;
	static exactFromF16(source) {
		return intFromFloatNarrow(source, -1, Infinity);
	}
	static exactFromF32(source) {
		return intFromFloatNarrow(source, -1, 0x10000000000000000);
	}
	static exactFromF64(source) {
		return intFromFloatNarrow(source, -1, 0x10000000000000000);
	}
	static exactFromU64(source) {
		return source;
	}
	static exactFromI64(source) {
		if ((typeof source === "bigint" ? source : BigInt(source)) < 0n) return void 0;
		return source;
	}
	static exactFromU128(source) {
		if (source > 18446744073709551615n) return void 0;
		return narrowInteger(source);
	}
	static exactFromI128(source) {
		if (source < 0n || source > 18446744073709551615n) return void 0;
		return narrowInteger(source);
	}
};
/**
* Float encoding and conversion utilities for dCBOR.
*
* # Floating Point Number Support in dCBOR
*
* dCBOR provides canonical encoding for floating point values.
*
* Per the dCBOR specification, the canonical encoding rules ensure
* deterministic representation:
*
* - Numeric reduction: Floating point values with zero fractional part in
*   range [-2^63, 2^64-1] are automatically encoded as integers (e.g., 42.0
*   becomes 42)
* - Values are encoded in the smallest possible representation that preserves
*   their value
* - All NaN values are canonicalized to a single representation: 0xf97e00
* - Positive/negative infinity are canonicalized to half-precision
*   representations
*
* @module float
*/
/**
* Canonical NaN representation in CBOR: 0xf97e00
*/
const CBOR_NAN = new Uint8Array([
	249,
	126,
	0
]);
/**
* Check if a number has a fractional part.
*/
const hasFractionalPart = (n) => n !== Math.floor(n);
/**
* Read a big-endian IEEE-754 double from the first 8 bytes of `data`.
* @internal
*/
const binary64ToNumber = (data) => new DataView(data.buffer, data.byteOffset, data.byteLength).getFloat64(0, false);
/**
* Encode a number as 4 big-endian bytes of an IEEE-754 single (f32).
*/
const numberToBinary32 = (n) => {
	const data = /* @__PURE__ */ new Uint8Array(4);
	new DataView(data.buffer).setFloat32(0, n, false);
	return data;
};
/**
* Read a big-endian IEEE-754 single (f32) from the first 4 bytes of `data`.
*/
const binary32ToNumber = (data) => new DataView(data.buffer, data.byteOffset, data.byteLength).getFloat32(0, false);
const f32ScratchView = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(4));
/**
* Compute the 16-bit pattern of the IEEE-754 half-precision value nearest `n`,
* rounding ties to even.
*
* All call sites pass values already exactly representable in binary16 (the
* reduction gates in {@link f16CborData} ensure this), so no rounding occurs on
* a value that is actually stored; the rounding path exists only so the
* reduction round-trip probe (`binary16ToNumber(numberToBinary16(n)) === n`)
* answers correctly for non-representable inputs.
*/
const float16Bits = (n) => {
	f32ScratchView.setFloat32(0, n, false);
	const f = f32ScratchView.getUint32(0, false);
	const sign = f >>> 16 & 32768;
	const exp = f >>> 23 & 255;
	const mant = f & 8388607;
	if (exp === 255) return sign | (mant !== 0 ? 32256 : 31744);
	const e = exp - 127 + 15;
	if (e >= 31) return sign | 31744;
	if (e <= 0) {
		if (e < -10) return sign;
		const significand = mant | 8388608;
		const shift = 14 - e;
		let result = significand >>> shift;
		const remainder = significand & (1 << shift) - 1;
		const halfway = 1 << shift - 1;
		if (remainder > halfway || remainder === halfway && (result & 1) === 1) result += 1;
		return sign | result;
	}
	let fraction = mant >>> 13;
	const remainder = mant & 8191;
	let exponent = e;
	if (remainder > 4096 || remainder === 4096 && (fraction & 1) === 1) {
		fraction += 1;
		if (fraction === 1024) {
			fraction = 0;
			exponent += 1;
			if (exponent >= 31) return sign | 31744;
		}
	}
	return sign | exponent << 10 | fraction;
};
/**
* Encode a number as 2 big-endian bytes of an IEEE-754 half (f16).
*/
const numberToBinary16 = (n) => {
	const bits = float16Bits(n);
	return new Uint8Array([bits >> 8 & 255, bits & 255]);
};
/**
* Read a big-endian IEEE-754 half (f16) from the first 2 bytes of `data`.
*/
const binary16ToNumber = (data) => {
	const bits = data[0] << 8 | data[1];
	const sign = (bits & 32768) !== 0 ? -1 : 1;
	const exponent = bits >> 10 & 31;
	const fraction = bits & 1023;
	if (exponent === 0) return sign * fraction * 2 ** -24;
	if (exponent === 31) return fraction !== 0 ? NaN : sign * Infinity;
	return sign * (1 + fraction / 1024) * 2 ** (exponent - 15);
};
/**
* Encode f64 value to CBOR data bytes.
* Implements numeric reduction and canonical encoding rules.
* @internal
*/
const f64CborData = (value) => {
	const n = value;
	const f32Bytes = numberToBinary32(n);
	const f = binary32ToNumber(f32Bytes);
	if (f === n) return f32CborData(f);
	if (n < 0) {
		const i128 = ExactI128.exactFromF64(n);
		if (i128 !== void 0) {
			const i = ExactU64.exactFromI128(-1n - i128);
			if (i !== void 0) return encodeVarInt(i, MajorType$1.Negative);
		}
	}
	const u = ExactU64.exactFromF64(n);
	if (u !== void 0) return encodeVarInt(u, MajorType$1.Unsigned);
	if (Number.isNaN(value)) return CBOR_NAN;
	const buffer = /* @__PURE__ */ new ArrayBuffer(8);
	new DataView(buffer).setFloat64(0, n, false);
	const bytes = new Uint8Array(buffer);
	return new Uint8Array([251, ...bytes]);
};
/**
* Encode f32 value to CBOR data bytes.
* Implements numeric reduction and canonical encoding rules.
* @internal
*/
const f32CborData = (value) => {
	const n = value;
	const f16Bytes = numberToBinary16(n);
	const f = binary16ToNumber(f16Bytes);
	if (f === n) return f16CborData(f);
	if (n < 0) {
		const u = ExactU64.exactFromF32(Math.fround(-1 - n));
		if (u !== void 0) return encodeVarInt(u, MajorType$1.Negative);
	}
	const u = ExactU32.exactFromF32(n);
	if (u !== void 0) return encodeVarInt(u, MajorType$1.Unsigned);
	if (Number.isNaN(value)) return CBOR_NAN;
	const bytes = numberToBinary32(n);
	return new Uint8Array([250, ...bytes]);
};
/**
* Encode f16 value to CBOR data bytes.
* Implements numeric reduction and canonical encoding rules.
* @internal
*/
const f16CborData = (value) => {
	const n = value;
	if (n < 0) {
		const u = ExactU64.exactFromF64(-1 - n);
		if (u !== void 0) return encodeVarInt(u, MajorType$1.Negative);
	}
	const u = ExactU16.exactFromF64(n);
	if (u !== void 0) return encodeVarInt(u, MajorType$1.Unsigned);
	if (Number.isNaN(value)) return CBOR_NAN;
	const bytes = numberToBinary16(value);
	return new Uint8Array([249, ...bytes]);
};
/**
* Render a float to its diagnostic string.
*
* Finite non-zero values with magnitude in [1e-4, 1e16) print in decimal with
* at least one fractional digit (whole values get a trailing `.0`); everything
* else prints in exponential form. Zero prints as `0.0`/`-0.0`.
*
* JS already produces the same shortest round-tripping digits; we only fix up
* the notation threshold, the `e+` → `e` exponent, and the `.0` suffix.
*
* @param value - The float value
* @returns The diagnostic string
*/
const floatDisplayString = (value) => {
	if (Number.isNaN(value)) return "NaN";
	if (!Number.isFinite(value)) return value > 0 ? "Infinity" : "-Infinity";
	if (value === 0) return Object.is(value, -0) ? "-0.0" : "0.0";
	const abs = Math.abs(value);
	if (abs >= 1e-4 && abs < 0x2386f26fc10000) {
		let str = String(value);
		if (!str.includes(".")) str = `${str}.0`;
		return str;
	}
	return value.toExponential().replace("e+", "e");
};
/**
* A forward-only cursor over the input bytes.
*
* Decoding advances a single `pos` through one shared `DataView` rather than
* slicing a fresh sub-view per nested item and threading a consumed-length back
* up the recursion. Every read is bounds-checked against the remaining bytes.
*/
var ByteReader = class {
	view;
	pos = 0;
	constructor(data) {
		this.view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	}
	get byteLength() {
		return this.view.byteLength;
	}
	get remaining() {
		return this.view.byteLength - this.pos;
	}
	/** Read the byte at `offset` relative to the current position (no advance). */
	peek(offset) {
		return this.view.getUint8(this.pos + offset);
	}
	/** Advance the cursor by `count` bytes. */
	advance(count) {
		this.pos += count;
	}
	/** A zero-copy view of `len` bytes at the given absolute offset. */
	bytesAt(offset, len) {
		return new Uint8Array(this.view.buffer, this.view.byteOffset + offset, len);
	}
};
/**
* Decode a single dCBOR item from `data`, enforcing every deterministic
* encoding rule (canonical numeric forms, NFC text, map-key order, no
* trailing bytes). Throws {@link CborError} on any violation.
*
* @example
* ```typescript
* const value = decodeCbor(hexToBytes("a1616101")); // {"a": 1}
* expectMap(value).size; // 1
* ```
*
* @throws {CborError} `Underrun` | `UnsupportedHeaderValue` |
*   `NonCanonicalNumeric` | `InvalidSimpleValue` | `InvalidUtf8` |
*   `NonCanonicalString` | `UnusedData` | `MisorderedMapKey` |
*   `DuplicateMapKey` - see {@link CborErrorDetailsByCode}.
* @public
*
* @remarks Decoded byte strings are zero-copy views aliasing the input
* buffer - mutating the input after decoding (or mutating the returned
* bytes) changes the other side. Call `.slice()` first if you need an
* independent copy. This is deliberate: the zero-copy decode performance
* profile is part of the library's contract.
*/
function decodeCbor$1(data) {
	const reader = new ByteReader(data);
	const cbor = readCbor(reader);
	const remaining = reader.byteLength - reader.pos;
	if (remaining !== 0) throw CborError$1.unusedData(remaining);
	return cbor;
}
function parseHeader(header) {
	return {
		majorType: header >> 5,
		headerValue: header & 31
	};
}
/**
* Read a CBOR head (major type + argument) at the cursor, advancing past it.
* `varIntLen` is the head length (1/2/3/5/9); the argument value is validated
* for canonical minimal-length encoding.
*/
function readHeaderVarint(reader) {
	if (reader.remaining < 1) throw CborError$1.underrun();
	const header = reader.peek(0);
	const { majorType, headerValue } = parseHeader(header);
	const dataRemaining = reader.remaining - 1;
	let value;
	let varIntLen;
	if (headerValue <= 23) {
		value = headerValue;
		varIntLen = 1;
	} else if (headerValue === 24) {
		if (dataRemaining < 1) throw CborError$1.underrun();
		value = reader.peek(1);
		if (value < 24) throw CborError$1.nonCanonicalNumeric();
		varIntLen = 2;
	} else if (headerValue === 25) {
		if (dataRemaining < 2) throw CborError$1.underrun();
		value = (reader.peek(1) << 8 | reader.peek(2)) >>> 0;
		if (value <= 255 && header !== 249) throw CborError$1.nonCanonicalNumeric();
		varIntLen = 3;
	} else if (headerValue === 26) {
		if (dataRemaining < 4) throw CborError$1.underrun();
		value = (reader.peek(1) << 24 | reader.peek(2) << 16 | reader.peek(3) << 8 | reader.peek(4)) >>> 0;
		if (value <= 65535 && header !== 250) throw CborError$1.nonCanonicalNumeric();
		varIntLen = 5;
	} else if (headerValue === 27) {
		if (dataRemaining < 8) throw CborError$1.underrun();
		const a = BigInt(reader.peek(1)) << 56n;
		const b = BigInt(reader.peek(2)) << 48n;
		const c = BigInt(reader.peek(3)) << 40n;
		const d = BigInt(reader.peek(4)) << 32n;
		const e = BigInt(reader.peek(5)) << 24n;
		const f = BigInt(reader.peek(6)) << 16n;
		const g = BigInt(reader.peek(7)) << 8n;
		const h = BigInt(reader.peek(8));
		value = narrowInteger(a | b | c | d | e | f | g | h);
		if (value <= 4294967295 && header !== 251) throw CborError$1.nonCanonicalNumeric();
		varIntLen = 9;
	} else throw CborError$1.unsupportedHeaderValue(headerValue);
	reader.advance(varIntLen);
	return {
		majorType,
		value,
		varIntLen
	};
}
function readCbor(reader) {
	if (reader.remaining < 1) throw CborError$1.underrun();
	const headStart = reader.pos;
	const { majorType, value, varIntLen } = readHeaderVarint(reader);
	switch (majorType) {
		case MajorType$1.Unsigned: {
			const cbor = attachMethods$1({
				isCbor: true,
				type: MajorType$1.Unsigned,
				value
			});
			checkCanonicalEncoding(cbor, reader.bytesAt(headStart, varIntLen));
			return cbor;
		}
		case MajorType$1.Negative: {
			const cbor = attachMethods$1({
				isCbor: true,
				type: MajorType$1.Negative,
				value
			});
			checkCanonicalEncoding(cbor, reader.bytesAt(headStart, varIntLen));
			return cbor;
		}
		case MajorType$1.ByteString: {
			if (typeof value === "bigint") throw CborError$1.underrun();
			if (reader.remaining < value) throw CborError$1.underrun();
			const bytes = reader.bytesAt(reader.pos, value);
			reader.advance(value);
			return attachMethods$1({
				isCbor: true,
				type: MajorType$1.ByteString,
				value: bytes
			});
		}
		case MajorType$1.Text: {
			if (typeof value === "bigint") throw CborError$1.underrun();
			if (reader.remaining < value) throw CborError$1.underrun();
			const textBytes = reader.bytesAt(reader.pos, value);
			reader.advance(value);
			let text;
			try {
				text = new TextDecoder("utf-8", { fatal: true }).decode(textBytes);
			} catch (e) {
				throw CborError$1.invalidUtf8(e instanceof Error ? e.message : String(e));
			}
			if (text.normalize("NFC") !== text) throw CborError$1.nonCanonicalString();
			return attachMethods$1({
				isCbor: true,
				type: MajorType$1.Text,
				value: text
			});
		}
		case MajorType$1.Array: {
			const items = [];
			for (let i = 0; i < value; i++) items.push(readCbor(reader));
			return attachMethods$1({
				isCbor: true,
				type: MajorType$1.Array,
				value: items
			});
		}
		case MajorType$1.Map: {
			const map = new CborMap$1();
			for (let i = 0; i < value; i++) {
				const key = readCbor(reader);
				const val = readCbor(reader);
				map.setNext(key, val);
			}
			return attachMethods$1({
				isCbor: true,
				type: MajorType$1.Map,
				value: map
			});
		}
		case MajorType$1.Tagged: {
			const item = readCbor(reader);
			return attachMethods$1({
				isCbor: true,
				type: MajorType$1.Tagged,
				tag: value,
				value: item
			});
		}
		case MajorType$1.Simple: switch (varIntLen) {
			case 3: {
				const f = binary16ToNumber(reader.bytesAt(headStart + 1, 2));
				checkCanonicalEncoding(f, reader.bytesAt(headStart, varIntLen));
				return attachMethods$1({
					isCbor: true,
					type: MajorType$1.Simple,
					value: {
						type: "Float",
						value: f
					}
				});
			}
			case 5: {
				const f = binary32ToNumber(reader.bytesAt(headStart + 1, 4));
				checkCanonicalEncoding(f, reader.bytesAt(headStart, varIntLen));
				return attachMethods$1({
					isCbor: true,
					type: MajorType$1.Simple,
					value: {
						type: "Float",
						value: f
					}
				});
			}
			case 9: {
				const f = binary64ToNumber(reader.bytesAt(headStart + 1, 8));
				checkCanonicalEncoding(f, reader.bytesAt(headStart, varIntLen));
				return attachMethods$1({
					isCbor: true,
					type: MajorType$1.Simple,
					value: {
						type: "Float",
						value: f
					}
				});
			}
			default: switch (value) {
				case 20: return attachMethods$1({
					isCbor: true,
					type: MajorType$1.Simple,
					value: { type: "False" }
				});
				case 21: return attachMethods$1({
					isCbor: true,
					type: MajorType$1.Simple,
					value: { type: "True" }
				});
				case 22: return attachMethods$1({
					isCbor: true,
					type: MajorType$1.Simple,
					value: { type: "Null" }
				});
				default: throw CborError$1.invalidSimpleValue();
			}
		}
	}
}
function checkCanonicalEncoding(cbor, buf) {
	if (!areBytesEqual(buf, encodeCbor(cbor))) throw CborError$1.nonCanonicalNumeric();
}
/**
* Extract native JavaScript value from CBOR.
* Converts CBOR types to their JavaScript equivalents.
*
* Returns the closed union {@link CborNative}. Note the two asymmetries
* documented there: maps come back as `CborMap` and tagged values as `Cbor`.
*/
const extractCbor$1 = (cbor) => {
	let c;
	if (cbor instanceof Uint8Array) c = decodeCbor$1(cbor);
	else c = cbor;
	switch (c.type) {
		case MajorType$1.Unsigned: return c.value;
		case MajorType$1.Negative: if (typeof c.value === "bigint") return -c.value - 1n;
		else return -c.value - 1;
		case MajorType$1.ByteString: return c.value;
		case MajorType$1.Text: return c.value;
		case MajorType$1.Array: return c.value.map(extractCbor$1);
		case MajorType$1.Map: return c.value;
		case MajorType$1.Tagged: return c;
		case MajorType$1.Simple: {
			const simple = c.value;
			switch (simple.type) {
				case "True": return true;
				case "False": return false;
				case "Null": return null;
				case "Float": return simple.value;
				default: return simple;
			}
		}
		default: return c;
	}
};
/**
* Map Support in dCBOR
*
* A deterministic CBOR map implementation that ensures maps with the same
* content always produce identical binary encodings, regardless of insertion
* order.
*
* ## Deterministic Map Representation
*
* The `CborMap` type follows strict deterministic encoding rules as specified by
* dCBOR:
*
* - Map keys are always sorted in lexicographic order of their encoded CBOR bytes
* - Duplicate keys are not allowed (enforced by the implementation)
* - Keys and values can be any type that can be converted to CBOR
* - Numeric reduction is applied (e.g., 3.0 is stored as integer 3)
*
* ## Vocabulary
*
* `CborMap` mirrors the JS `Map` protocol: `set`, `get`, `getOrThrow`, `has`,
* `delete`, `clear`, `size`, `keys()`, `values()`, `entries()`, `forEach`,
* iteration. `get` returns the STORED `Cbor` node (symmetric with
* `entries()`); extract natives explicitly with `extractCbor(map.get(k))`.
*
* @module map
*/
/**
* A deterministic CBOR map implementation.
*
* Maps are always encoded with keys sorted lexicographically by their
* encoded CBOR representation, ensuring deterministic encoding.
*/
var CborMap$1 = class {
	/** Debug label: `Object.prototype.toString` reports `[object CborMap]`. */
	get [Symbol.toStringTag]() {
		return "CborMap";
	}
	_dict;
	/**
	* Creates a new, empty CBOR Map.
	* Optionally initializes from a JavaScript Map (every key and value must
	* itself be encodable).
	*/
	constructor(map) {
		this._dict = new SortedByteMap();
		if (map !== void 0) for (const [key, value] of map.entries()) this.set(key, value);
	}
	/**
	* Inserts a key-value pair into the map (replacing any entry whose key has
	* the same canonical encoding). Any insertion order is accepted - entries
	* are kept in canonical ascending encoded-key order.
	*
	* @example
	* ```typescript
	* const m = new CborMap();
	* m.set("z", 1);
	* m.set(10, "ten"); // sorts before "z" in the encoding
	* encodeCbor(m);    // deterministic regardless of insertion order
	* ```
	* @public
	*/
	set(key, value) {
		const keyCbor = cbor$1(key);
		const valueCbor = cbor$1(value);
		const keyData = encodeCbor(keyCbor);
		this._dict.set(keyData, {
			key: keyCbor,
			value: valueCbor
		});
	}
	_makeKey(key) {
		return encodeCbor(cbor$1(key));
	}
	/**
	* Get the STORED `Cbor` node for a key, or `undefined` if absent.
	*
	* This is symmetric with `entries()` - no hidden native extraction, no
	* unwitnessed generics. To read a native value, compose explicitly:
	*
	* ```typescript
	* asNumber(map.get("age"));          // number | undefined, checked
	* extractCbor(map.getOrThrow("age")); // CborNative, throws if absent
	* ```
	* @public
	*/
	get(key) {
		return this._dict.get(this._makeKey(key))?.value;
	}
	/**
	* Get the stored `Cbor` node for a key.
	*
	* @throws {CborError} `MissingMapKey` - the key is not present.
	*/
	getOrThrow(key) {
		const value = this.get(key);
		if (value === void 0) throw CborError$1.missingMapKey();
		return value;
	}
	delete(key) {
		const keyData = this._makeKey(key);
		const existed = this._dict.has(keyData);
		this._dict.delete(keyData);
		return existed;
	}
	has(key) {
		return this._dict.has(this._makeKey(key));
	}
	clear() {
		this._dict = new SortedByteMap();
	}
	/** The number of entries in the map. */
	get size() {
		return this._dict.size;
	}
	/**
	* Get the entries of the map as an array, sorted in canonical ascending
	* encoded-key order.
	*
	* @internal Public because the encoder, diagnostic formatter, and hex
	* annotator consume it cross-module; not part of the supported surface.
	*/
	get entriesArray() {
		return this._dict.map((value, _key) => ({
			key: value.key,
			value: value.value
		}));
	}
	/** Iterate keys in canonical (sorted encoded-key) order. */
	*keys() {
		for (const entry of this.entriesArray) yield entry.key;
	}
	/** Iterate values in canonical key order. */
	*values() {
		for (const entry of this.entriesArray) yield entry.value;
	}
	/**
	* Iterate `[key, value]` tuples in canonical key order (the JS
	* `Map.entries()` shape).
	*/
	*entries() {
		for (const entry of this.entriesArray) yield [entry.key, entry.value];
	}
	/** JS `Map.forEach` mirror (value first, then key, then the map). */
	forEach(callback, thisArg) {
		for (const entry of this.entriesArray) callback.call(thisArg, entry.value, entry.key, this);
	}
	*[Symbol.iterator]() {
		for (const entry of this.entriesArray) yield [entry.key, entry.value];
	}
	/**
	* Inserts the next key-value pair into the map during decoding.
	* This is used for efficient map building during CBOR decoding.
	* Throws if the key is not in ascending order or is a duplicate.
	*
	* @internal The decoder's append path; not part of the supported surface.
	*/
	setNext(key, value) {
		const keyCbor = cbor$1(key);
		const newKey = encodeCbor(keyCbor);
		if (this._dict.has(newKey)) throw CborError$1.duplicateMapKey();
		const greatest = this._dict.maxKey();
		if (greatest !== void 0) {
			if (lexicographicallyCompareBytes(newKey, greatest) <= 0) throw CborError$1.misorderedMapKey();
		}
		this._dict.appendGreatest(newKey, {
			key: keyCbor,
			value: cbor$1(value)
		});
	}
	/**
	* Convert to a plain JavaScript `Map` of extracted native values.
	* Tagged values come back as `Cbor` nodes and nested maps as `CborMap`
	* (the {@link CborNative} asymmetries).
	*/
	toMap() {
		const map = /* @__PURE__ */ new Map();
		for (const entry of this.entriesArray) map.set(extractCbor$1(entry.key), extractCbor$1(entry.value));
		return map;
	}
};
/**
* Encodes the simple value to its raw CBOR byte representation.
*
* Returns the CBOR bytes that represent this simple value according to the
* dCBOR deterministic encoding rules:
* - `False` encodes as `0xf4`
* - `True` encodes as `0xf5`
* - `Null` encodes as `0xf6`
* - `Float` values encode according to the IEEE 754 floating point rules,
*   using the shortest representation that preserves precision.
*/
const simpleCborData = (simple) => {
	switch (simple.type) {
		case "False": return encodeVarInt(20, MajorType$1.Simple);
		case "True": return encodeVarInt(21, MajorType$1.Simple);
		case "Null": return encodeVarInt(22, MajorType$1.Simple);
		case "Float": return f64CborData(simple.value);
	}
};
Uint8Array.fromHex;
/**
* Convert bytes to a lowercase hex string.
*
* Delegates to the native `Uint8Array.prototype.toHex` where available.
*/
const bytesToHex$1 = (bytes) => {
	const native = bytes.toHex;
	if (typeof native === "function") return native.call(bytes);
	let out = "";
	for (const byte of bytes) out += byte.toString(16).padStart(2, "0");
	return out;
};
/**
* The dCBOR value core: the `Cbor` union type, the polymorphic constructor
* `cbor()`, the encoder entry `encodeCbor()`, and the tagged-value
* constructor `taggedValue()`.
*
* ## The API in one paragraph
*
* Construct with `cbor(input)` (the single polymorphic constructor) or
* `taggedValue(tag, content)` (the only explicit tagged-value constructor);
* custom types participate by implementing the one structural protocol
* `ToCbor { toCbor(): Cbor }`. Encode with `encodeCbor(value)`. Decode with
* `decodeCbor(bytes)` (throws) or `tryDecode(bytes)` (returns `Result`).
* Read with the free `isX`/`asX`/`expectX` accessor functions. The only
* instance conveniences on a `Cbor` value are `toData()`, `toHex()`, and a
* cheap `toString()`.
*
* @module cbor
*/
/**
* The instance methods shared by every `Cbor` value: exactly three cheap
* conveniences (plus debug symbols below). Everything else is a free function
* so decode-only bundles never carry the diagnostic formatter, hex annotator,
* tag store, or walker.
*
* `String(c)`/template literals/`console.log` produce `Cbor(0x…)`. Diagnostic
* rendering lives in `@blockchaincommons/dcbor/diagnostic`; opt-in diag-flavored debug
* output lives in `@blockchaincommons/dcbor/debug` (`installDebugHooks()`).
*/
const CBOR_METHODS = {
	toData() {
		return encodeCbor(this);
	},
	toHex() {
		return bytesToHex$1(encodeCbor(this));
	},
	toString() {
		return `Cbor(0x${bytesToHex$1(encodeCbor(this))})`;
	},
	[Symbol.toStringTag]: "Cbor",
	[Symbol.for("nodejs.util.inspect.custom")]() {
		return this.toString();
	}
};
/**
* Decorate a bare CBOR value (`{ isCbor, type, value[, tag] }`) with the shared
* instance methods. The methods live on {@link CBOR_METHODS} and are installed
* via the prototype - constructed with `Object.create` (not `setPrototypeOf`,
* which would drop the object off V8's fast path). Only the handful of data
* properties are own-properties; the methods are shared, not per-object.
*
* @internal
*/
const attachMethods$1 = (obj) => {
	const decorated = Object.create(CBOR_METHODS);
	return Object.assign(decorated, obj);
};
const CBOR_FALSE = attachMethods$1({
	isCbor: true,
	type: MajorType$1.Simple,
	value: { type: "False" }
});
const CBOR_TRUE = attachMethods$1({
	isCbor: true,
	type: MajorType$1.Simple,
	value: { type: "True" }
});
const CBOR_NULL = attachMethods$1({
	isCbor: true,
	type: MajorType$1.Simple,
	value: { type: "Null" }
});
const hasTaggedCbor$1 = (value) => {
	return typeof value === "object" && value !== null && "taggedCbor" in value && typeof value.taggedCbor === "function";
};
const hasToCbor$1 = (value) => {
	return typeof value === "object" && value !== null && "toCbor" in value && typeof value.toCbor === "function";
};
/**
* Convert any supported value to its CBOR representation - the single
* polymorphic constructor.
*
* Custom types participate by implementing {@link ToCbor}
* (`toCbor(): Cbor` - the `toJSON` precedent). Tagged values are built with
* {@link taggedValue}.
*
* @example
* ```typescript
* cbor(42);                          // integer
* cbor("héllo");                     // NFC-normalized text
* cbor([1, "two", true, null]);      // array
* cbor(new Map([["k", 1]]));         // map (canonical key order)
* cbor({ name: "Alice", age: 30 });  // plain object -> map
* ```
*
* @throws {CborError} `OutOfRange` - bigint outside `[-(2^64), 2^64 - 1]`.
* @throws {CborError} `Custom` - unsupported input type, or one of the two
*   directive errors below.
* @public
*
* ## Directive errors
*
* Two input shapes throw a directive `CborError` because encoding them
* silently would produce ambiguous or divergent bytes:
*
* - plain objects shaped exactly `{tag, value}`: use
*   `taggedValue(tag, content)` for a tagged value, or add/rename a key for
*   a map;
* - objects implementing `taggedCbor()` but not `toCbor()`: add
*   `toCbor() { return this.taggedCbor(); }`.
*/
const cbor$1 = (value) => {
	if (isCbor$1(value) && "toData" in value) return value;
	if (isCbor$1(value)) return attachMethods$1(value);
	let result;
	if (isCborNumber$1(value)) if (typeof value === "number" && Number.isNaN(value)) result = {
		isCbor: true,
		type: MajorType$1.Simple,
		value: {
			type: "Float",
			value: NaN
		}
	};
	else if (typeof value === "number" && hasFractionalPart(value)) result = {
		isCbor: true,
		type: MajorType$1.Simple,
		value: {
			type: "Float",
			value
		}
	};
	else if (value == Infinity) result = {
		isCbor: true,
		type: MajorType$1.Simple,
		value: {
			type: "Float",
			value: Infinity
		}
	};
	else if (value == -Infinity) result = {
		isCbor: true,
		type: MajorType$1.Simple,
		value: {
			type: "Float",
			value: -Infinity
		}
	};
	else if (typeof value === "number" && !Number.isSafeInteger(value)) {
		const big = BigInt(value);
		if (big >= 0n && big <= 18446744073709551615n) result = {
			isCbor: true,
			type: MajorType$1.Unsigned,
			value: big
		};
		else if (big < 0n && big >= CBOR_INT_MIN) result = {
			isCbor: true,
			type: MajorType$1.Negative,
			value: -big - 1n
		};
		else result = {
			isCbor: true,
			type: MajorType$1.Simple,
			value: {
				type: "Float",
				value
			}
		};
	} else if (typeof value === "bigint" && (value > 18446744073709551615n || value < CBOR_INT_MIN)) throw CborError$1.outOfRange();
	else if (value < 0) if (typeof value === "bigint") result = {
		isCbor: true,
		type: MajorType$1.Negative,
		value: -value - 1n
	};
	else result = {
		isCbor: true,
		type: MajorType$1.Negative,
		value: -value - 1
	};
	else result = {
		isCbor: true,
		type: MajorType$1.Unsigned,
		value
	};
	else if (typeof value === "string") {
		const normalized = value.normalize("NFC");
		result = {
			isCbor: true,
			type: MajorType$1.Text,
			value: normalized
		};
	} else if (value === null || value === void 0) return CBOR_NULL;
	else if (value === true) return CBOR_TRUE;
	else if (value === false) return CBOR_FALSE;
	else if (Array.isArray(value)) result = {
		isCbor: true,
		type: MajorType$1.Array,
		value: value.map(cbor$1)
	};
	else if (value instanceof Uint8Array) result = {
		isCbor: true,
		type: MajorType$1.ByteString,
		value
	};
	else if (value instanceof CborMap$1) result = {
		isCbor: true,
		type: MajorType$1.Map,
		value
	};
	else if (value instanceof Map) result = {
		isCbor: true,
		type: MajorType$1.Map,
		value: new CborMap$1(value)
	};
	else if (value instanceof Set) result = {
		isCbor: true,
		type: MajorType$1.Array,
		value: Array.from(value).map(cbor$1)
	};
	else if (hasToCbor$1(value)) return value.toCbor();
	else if (hasTaggedCbor$1(value)) throw CborError$1.custom("objects implementing taggedCbor() are no longer auto-wrapped by cbor(); implement toCbor() (e.g. `toCbor() { return this.taggedCbor(); }`)");
	else if (typeof value === "object" && "tag" in value && "value" in value) {
		const keys = Object.keys(value);
		if (keys.length === 2 && keys.includes("tag") && keys.includes("value")) throw CborError$1.custom("plain { tag, value } objects are ambiguous and no longer encode as tagged values; use taggedValue(tag, content) for a tagged value, or add/rename a key to encode a map");
		const map = new CborMap$1();
		for (const [key, val] of Object.entries(value)) map.set(cbor$1(key), cbor$1(val));
		result = {
			isCbor: true,
			type: MajorType$1.Map,
			value: map
		};
	} else if (typeof value === "object") {
		const map = new CborMap$1();
		for (const [key, val] of Object.entries(value)) map.set(cbor$1(key), cbor$1(val));
		result = {
			isCbor: true,
			type: MajorType$1.Map,
			value: map
		};
	} else throw CborError$1.custom("Unsupported type for CBOR encoding");
	return attachMethods$1(result);
};
const textEncoder = new TextEncoder();
/**
* Write a CBOR value into `writer`. The whole tree encodes into one growable
* buffer, so nested containers don't allocate-and-concatenate a fresh array
* per level.
*/
const writeCborInto = (writer, value) => {
	const c = cbor$1(value);
	switch (c.type) {
		case MajorType$1.Unsigned:
			writeVarInt(writer, c.value, MajorType$1.Unsigned);
			return;
		case MajorType$1.Negative:
			writeVarInt(writer, c.value, MajorType$1.Negative);
			return;
		case MajorType$1.ByteString:
			if (c.value instanceof Uint8Array) {
				writeVarInt(writer, c.value.length, MajorType$1.ByteString);
				writer.writeBytes(c.value);
				return;
			}
			break;
		case MajorType$1.Text:
			if (typeof c.value === "string") {
				const utf8Bytes = textEncoder.encode(c.value);
				writeVarInt(writer, utf8Bytes.length, MajorType$1.Text);
				writer.writeBytes(utf8Bytes);
				return;
			}
			break;
		case MajorType$1.Tagged:
			if (typeof c.tag === "bigint" || typeof c.tag === "number") {
				writeVarInt(writer, c.tag, MajorType$1.Tagged);
				writeCborInto(writer, c.value);
				return;
			}
			break;
		case MajorType$1.Simple:
			writer.writeBytes(simpleCborData(c.value));
			return;
		case MajorType$1.Array:
			writeVarInt(writer, c.value.length, MajorType$1.Array);
			for (const item of c.value) writeCborInto(writer, item);
			return;
		case MajorType$1.Map: {
			const entries = c.value.entriesArray;
			writeVarInt(writer, entries.length, MajorType$1.Map);
			for (const { key, value: entryValue } of entries) {
				writeCborInto(writer, key);
				writeCborInto(writer, entryValue);
			}
			return;
		}
	}
	throw CborError$1.wrongType();
};
/**
* Encode a value to deterministic CBOR bytes. Accepts anything `cbor()`
* accepts; equal values always produce identical bytes (dCBOR determinism).
*
* @example
* ```typescript
* encodeCbor({ a: 1 });            // Uint8Array [0xa1, 0x61, 0x61, 0x01]
* bytesToHex(encodeCbor("Hello")); // "6548656c6c6f"
* ```
*
* @throws {CborError} Whatever `cbor(value)` throws for unsupported inputs
*   (`OutOfRange`, `Custom`).
* @remarks The decoder's canonicality check re-encodes every decoded value
*   through this function, so it is wire-critical.
* @public
*/
const encodeCbor = (value) => {
	const c = cbor$1(value);
	switch (c.type) {
		case MajorType$1.Unsigned: return encodeVarInt(c.value, MajorType$1.Unsigned);
		case MajorType$1.Negative: return encodeVarInt(c.value, MajorType$1.Negative);
		case MajorType$1.Simple: return simpleCborData(c.value);
		default: {
			const writer = new BufWriter();
			writeCborInto(writer, c);
			return writer.toBytes();
		}
	}
};
/**
* Construct a tagged value - the ONLY explicit tagged-value constructor.
*
* @example
* ```typescript
* taggedValue(1, 1675854714);        // epoch date, tag 1
* taggedValue(Tag.from(32), "https://example.com/"); // URI, tag 32
* ```
*
* @param tag - The tag number (`number | bigint`) or a `Tag` object (its
*   `.value` is used; names never reach the wire).
* @param content - Anything `cbor()` accepts.
* @public
*/
const taggedValue = (tag, content) => {
	const tagVal = typeof tag === "object" && "value" in tag ? tag.value : tag;
	return attachMethods$1({
		isCbor: true,
		type: MajorType$1.Tagged,
		tag: tagVal,
		value: cbor$1(content)
	});
};
/**
* Tag registry implementation.
*
* Stores tags with their names and optional summarizer functions.
*/
var TagsStore$1 = class {
	/** Debug label: `Object.prototype.toString` reports `[object TagsStore]`. */
	get [Symbol.toStringTag]() {
		return "TagsStore";
	}
	_tagsByValue = /* @__PURE__ */ new Map();
	_tagsByName = /* @__PURE__ */ new Map();
	_summarizers = /* @__PURE__ */ new Map();
	constructor() {}
	/**
	* Insert a tag into the registry.
	*
	* - Throws if the tag name is undefined or empty
	* - Throws if a tag with the same value exists with a different name
	* - Allows re-registering the same tag value with the same name
	*
	* @param tag - The tag to register (must have a non-empty name)
	* @throws Error if tag has no name, empty name, or conflicts with existing registration
	*
	* @example
	* ```typescript
	* const store = new TagsStore();
	* store.register(Tag.from(12345, 'myCustomTag'));
	* ```
	*/
	register(tag) {
		const name = tag.name;
		if (name === void 0 || name === "") throw new Error(`Tag ${tag.value} must have a non-empty name`);
		const key = this._valueKey(tag.value);
		const existing = this._tagsByValue.get(key);
		if (existing?.name !== void 0 && existing.name !== name) throw new Error(`Attempt to register tag: ${tag.value} '${existing.name}' with different name: '${name}'`);
		this._tagsByValue.set(key, tag);
		this._tagsByName.set(name, tag);
	}
	/**
	* Register multiple tags; the conflict-throwing validation in `register()`
	* applies per tag.
	*/
	registerAll(tags) {
		for (const tag of tags) this.register(tag);
	}
	/**
	* Register a custom summarizer function for a tag.
	*
	* @param tagValue - The numeric tag value
	* @param summarizer - The summarizer function
	*
	* @example
	* ```typescript
	* store.setSummarizer(1, (cbor, flat) => {
	*   // Custom date formatting
	*   return `Date(${extractCbor(cbor)})`;
	* });
	* ```
	*/
	setSummarizer(tagValue, summarizer) {
		const key = this._valueKey(tagValue);
		this._summarizers.set(key, summarizer);
	}
	assignedNameForTag(tag) {
		const key = this._valueKey(tag.value);
		return this._tagsByValue.get(key)?.name;
	}
	nameForTag(tag) {
		return this.assignedNameForTag(tag) ?? tag.value.toString();
	}
	tagForValue(value) {
		const key = this._valueKey(value);
		return this._tagsByValue.get(key);
	}
	tagForName(name) {
		return this._tagsByName.get(name);
	}
	nameForValue(value) {
		const tag = this.tagForValue(value);
		return tag !== void 0 ? this.nameForTag(tag) : value.toString();
	}
	summarizer(tag) {
		const key = this._valueKey(tag);
		return this._summarizers.get(key);
	}
	/**
	* Create a string key for a numeric tag value.
	* Handles both number and bigint types.
	*
	* @private
	*/
	_valueKey(value) {
		return value.toString();
	}
};
/**
* Global singleton instance of the tags store.
*/
let globalTagsStore$1;
/**
* Get the global tags store instance.
*
* Creates the instance on first access.
*
* @returns The global TagsStore instance
*
* @example
* ```typescript
* const store = getGlobalTagsStore();
* store.register(Tag.from(999, 'myTag'));
* ```
*/
const getGlobalTagsStore$1 = () => {
	globalTagsStore$1 ??= new TagsStore$1();
	return globalTagsStore$1;
};
//#endregion
//#region ../bc-dcbor-compat-ts/node_modules/@blockchaincommons/dcbor/dist/index.mjs
/**
* Helper function to validate that a CBOR value has one of the expected tags.
*
* @param cbor - CBOR value to validate
* @param expectedTags - Array of valid tags
* @returns The matching tag
* @throws {CborError} `WrongType` if the value is not tagged; `WrongTag` if
*   the tag matches none of `expectedTags`.
*/
const validateTag$1 = (cbor, expectedTags) => {
	if (cbor.type !== MajorType$1.Tagged) throw CborError$1.wrongType();
	const tagValue = cbor.tag;
	const matchingTag = expectedTags.find((t) => tagValuesEqual$1(t.value, tagValue));
	if (matchingTag === void 0) throw CborError$1.wrongTag(expectedTags[0], { value: tagValue });
	return matchingTag;
};
/**
* Helper function to extract the content from a tagged CBOR value.
*
* @param cbor - Tagged CBOR value
* @returns The untagged content
* @throws {CborError} `WrongType` if the value is not tagged.
*/
const extractTaggedContent$1 = (cbor) => {
	if (cbor.type !== MajorType$1.Tagged) throw CborError$1.wrongType();
	return cbor.value;
};
/**
* Normalize a timestamp (seconds since the Unix epoch) to whole seconds plus a
* non-negative, sub-second nanosecond part, so dates round-trip byte-identically.
*
* The nanosecond part is truncated toward zero and clamped to [0, u32::MAX]. So
* a negative fraction floors the value (`-1.5` becomes `-1.0`) and sub-nanosecond
* precision is dropped (`1.0000000005` becomes `1.0`).
*
* @internal
*/
function normalizeTimestampSeconds(seconds) {
	if (!Number.isFinite(seconds)) throw CborError$1.invalidDate("non-finite timestamp");
	const whole = Math.trunc(seconds);
	let nsecs = Math.trunc((seconds - whole) * 1e9);
	if (nsecs < 0) nsecs = 0;
	else if (nsecs > 4294967295) nsecs = 4294967295;
	return whole + nsecs / 1e9;
}
/**
* A CBOR-friendly representation of a date and time.
*
* The `CborDate` type provides a wrapper around JavaScript's native `Date` that
* supports encoding and decoding to/from CBOR with tag 1, following the CBOR
* date/time standard specified in RFC 8949.
*
* When encoded to CBOR, dates are represented as tag 1 followed by a numeric
* value representing the number of seconds since (or before) the Unix epoch
* (1970-01-01T00:00:00Z). The numeric value can be a positive or negative
* integer, or a floating-point value for dates with fractional seconds.
*
* # Features
*
* - Supports UTC dates with optional fractional seconds
* - Provides convenient constructors for common date creation patterns
* - Implements the `CborTagged` interface and the `ToCbor` protocol
* - Supports arithmetic operations with durations and between dates
*
* @example
* ```typescript
* import { CborDate } from './date';
*
* // Create a date from a timestamp (seconds since Unix epoch)
* const date = CborDate.fromEpochSeconds(1675854714.0);
*
* // Create a date from year, month, day
* const date2 = CborDate.fromYmd(2023, 2, 8);
*
* // Convert to CBOR
* const cborValue = date.taggedCbor();
*
* // Decode from CBOR
* const decoded = CborDate.fromTaggedCbor(cborValue);
* ```
*/
let dateCodec;
var CborDate$1 = class CborDate {
	/** Debug label: `Object.prototype.toString` reports `[object CborDate]`. */
	get [Symbol.toStringTag]() {
		return "CborDate";
	}
	/**
	* Canonical timestamp in seconds since the Unix epoch as a JS `number`
	* (`f64`). dCBOR encodes Date (tag 1) as a numeric value in seconds, so
	* keeping `_seconds` as the source of truth avoids the millisecond-only
	* round-trip precision loss that going through a JS `Date` instance would
	* introduce.
	*
	* f64 bounds the achievable precision (~16 decimal digits, so roughly
	* microseconds for current epoch values), but the encode/decode round-trip
	* is byte-identical.
	*/
	_seconds;
	/**
	* Creates a new `CborDate` from the given JavaScript `Date`.
	*
	* This method creates a new `CborDate` instance by wrapping a
	* JavaScript `Date`.
	*
	* @param dateTime - A `Date` instance to wrap
	*
	* @returns A new `CborDate` instance
	*
	* @example
	* ```typescript
	* const datetime = new Date();
	* const date = CborDate.fromDate(datetime);
	* ```
	*/
	static fromDate(dateTime) {
		const instance = new CborDate();
		instance._seconds = dateTime.getTime() / 1e3;
		return instance;
	}
	/**
	* Creates a new `CborDate` from year, month, and day components.
	*
	* This method creates a new `CborDate` with the time set to 00:00:00 UTC.
	*
	* @param year - The year component (e.g., 2023)
	* @param month - The month component (1-12)
	* @param day - The day component (1-31)
	*
	* @returns A new `CborDate` instance
	*
	* @example
	* ```typescript
	* // Create February 8, 2023
	* const date = CborDate.fromYmd(2023, 2, 8);
	* ```
	*
	* @throws Error if the provided components do not form a valid date.
	*/
	static fromYmd(year, month, day) {
		const dt = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
		return CborDate.fromDate(dt);
	}
	/**
	* Creates a new `CborDate` from year, month, day, hour, minute, and second
	* components.
	*
	* @param year - The year component (e.g., 2023)
	* @param month - The month component (1-12)
	* @param day - The day component (1-31)
	* @param hour - The hour component (0-23)
	* @param minute - The minute component (0-59)
	* @param second - The second component (0-59)
	*
	* @returns A new `CborDate` instance
	*
	* @example
	* ```typescript
	* // Create February 8, 2023, 15:30:45 UTC
	* const date = CborDate.fromYmdHms(2023, 2, 8, 15, 30, 45);
	* ```
	*
	* @throws Error if the provided components do not form a valid date and time.
	*/
	static fromYmdHms(year, month, day, hour, minute, second) {
		const dt = new Date(Date.UTC(year, month - 1, day, hour, minute, second, 0));
		return CborDate.fromDate(dt);
	}
	/**
	* Creates a new `CborDate` from seconds since (or before) the Unix epoch.
	*
	* This method creates a new `CborDate` representing the specified number of
	* seconds since the Unix epoch (1970-01-01T00:00:00Z). Negative values
	* represent times before the epoch.
	*
	* @param secondsSinceUnixEpoch - Seconds from the Unix epoch (positive or
	*   negative), which can include a fractional part for sub-second
	*   precision
	*
	* @returns A new `CborDate` instance
	*
	* @example
	* ```typescript
	* // Create a date from a timestamp
	* const date = CborDate.fromEpochSeconds(1675854714.0);
	*
	* // Create a date one second before the Unix epoch
	* const beforeEpoch = CborDate.fromEpochSeconds(-1.0);
	*
	* // Create a date with fractional seconds
	* const withFraction = CborDate.fromEpochSeconds(1675854714.5);
	* ```
	*/
	static fromEpochSeconds(secondsSinceUnixEpoch) {
		const instance = new CborDate();
		instance._seconds = normalizeTimestampSeconds(secondsSinceUnixEpoch);
		return instance;
	}
	/**
	* Creates a new `CborDate` from a string containing an ISO-8601 (RFC-3339)
	* date (with or without time).
	*
	* This method parses a string representation of a date or date-time in
	* ISO-8601/RFC-3339 format and creates a new `CborDate` instance. It
	* supports both full date-time strings (e.g., "2023-02-08T15:30:45Z")
	* and date-only strings (e.g., "2023-02-08").
	*
	* @param value - A string containing a date or date-time in ISO-8601/RFC-3339
	*   format
	*
	* @returns A new `CborDate` instance if parsing succeeds
	*
	* @throws Error if the string cannot be parsed as a valid date or date-time
	*
	* @example
	* ```typescript
	* // Parse a date-time string
	* const date = CborDate.fromString("2023-02-08T15:30:45Z");
	*
	* // Parse a date-only string (time will be set to 00:00:00)
	* const date2 = CborDate.fromString("2023-02-08");
	* ```
	*/
	static fromString(value) {
		const invalidDate = CborError$1.invalidDate("Invalid date string");
		const rfc3339 = /^\d{4}-\d{2}-\d{2}[Tt]\d{2}:\d{2}:\d{2}(\.\d+)?([Zz]|[+-]\d{2}:\d{2})$/;
		const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
		let parsed;
		if (rfc3339.test(value)) parsed = new Date(value);
		else if (dateOnly.test(value)) parsed = /* @__PURE__ */ new Date(`${value}T00:00:00Z`);
		else throw invalidDate;
		const [y, m, d] = value.slice(0, 10).split("-").map(Number);
		const probe = new Date(Date.UTC(y, m - 1, d));
		if (!(probe.getUTCFullYear() === y && probe.getUTCMonth() === m - 1 && probe.getUTCDate() === d) || isNaN(parsed.getTime())) throw invalidDate;
		return CborDate.fromDate(parsed);
	}
	/**
	* Creates a new `CborDate` containing the current date and time.
	*
	* @returns A new `CborDate` instance representing the current UTC date and time
	*
	* @example
	* ```typescript
	* const now = CborDate.now();
	* ```
	*/
	static now() {
		return CborDate.fromDate(/* @__PURE__ */ new Date());
	}
	/**
	* Creates a new `CborDate` containing the current date and time plus the given
	* duration.
	*
	* @param durationMs - The duration in milliseconds to add to the current time
	*
	* @returns A new `CborDate` instance representing the current UTC date and time plus
	* the duration
	*
	* @example
	* ```typescript
	* // Get a date 1 hour from now
	* const oneHourLater = CborDate.withDurationFromNow(3600 * 1000);
	* ```
	*/
	static withDurationFromNow(durationMs) {
		const future = new Date((/* @__PURE__ */ new Date()).getTime() + durationMs);
		return CborDate.fromDate(future);
	}
	/**
	* Returns the underlying JavaScript `Date` object.
	*
	* This method provides access to the wrapped JavaScript `Date`
	* instance.
	*
	* @returns The wrapped `Date` instance
	*
	* @example
	* ```typescript
	* const date = CborDate.now();
	* const datetime = date.toDate();
	* const year = datetime.getFullYear();
	* ```
	*/
	toDate() {
		return /* @__PURE__ */ new Date(this._seconds * 1e3);
	}
	/**
	* The date as the number of seconds since the Unix epoch
	* (1970-01-01T00:00:00Z), as a floating-point `number`. Negative values
	* represent times before the epoch; the fractional part is sub-second
	* precision.
	*
	* @example
	* ```typescript
	* const date = CborDate.fromYmd(2023, 2, 8);
	* const timestamp = date.epochSeconds;
	* ```
	*/
	get epochSeconds() {
		return this._seconds;
	}
	/**
	* Add seconds to this date.
	*
	* @param seconds - Seconds to add (can be fractional)
	* @returns New CborDate instance
	*
	* @example
	* ```typescript
	* const date = CborDate.fromYmd(2022, 3, 21);
	* const tomorrow = date.add(24 * 60 * 60);
	* ```
	*/
	add(seconds) {
		return CborDate.fromEpochSeconds(this.epochSeconds + seconds);
	}
	/**
	* Subtract seconds from this date.
	*
	* @param seconds - Seconds to subtract (can be fractional)
	* @returns New CborDate instance
	*
	* @example
	* ```typescript
	* const date = CborDate.fromYmd(2022, 3, 21);
	* const yesterday = date.subtract(24 * 60 * 60);
	* ```
	*/
	subtract(seconds) {
		return CborDate.fromEpochSeconds(this.epochSeconds - seconds);
	}
	/**
	* Get the difference in seconds between this date and another.
	*
	* @param other - Other CborDate to compare with
	* @returns Difference in seconds (this - other)
	*
	* @example
	* ```typescript
	* const date1 = CborDate.fromYmd(2022, 3, 22);
	* const date2 = CborDate.fromYmd(2022, 3, 21);
	* const diff = date1.difference(date2);
	* // Returns 86400 (one day in seconds)
	* ```
	*/
	difference(other) {
		return this.epochSeconds - other.epochSeconds;
	}
	/**
	* Implementation of the `CborTagged` interface for `CborDate`.
	*
	* This implementation specifies that `CborDate` values are tagged with CBOR tag 1,
	* which is the standard CBOR tag for date/time values represented as seconds
	* since the Unix epoch per RFC 8949.
	*
	* @returns A vector containing tag 1
	*/
	cborTags() {
		return [Tag.from(1, "date")];
	}
	/**
	* Converts this `CborDate` to its untagged CBOR content: the epoch-seconds
	* numeric value. It may be an integer or a floating-point number,
	* depending on whether the date has fractional seconds.
	*
	* @returns A CBOR value representing the timestamp
	*/
	untaggedCbor() {
		return cbor$1(this.epochSeconds);
	}
	/**
	* Converts this `CborDate` to a tagged CBOR value with tag 1.
	*
	* @returns Tagged CBOR value
	*/
	taggedCbor() {
		const tag = this.cborTags()[0];
		if (tag === void 0) throw CborError$1.custom("No tags defined for this type");
		return taggedValue(tag, this.untaggedCbor());
	}
	/**
	* The `ToCbor` protocol: dates encode as their tagged form.
	*/
	toCbor() {
		return this.taggedCbor();
	}
	/**
	* Populates this `CborDate` in place from an untagged CBOR value, which
	* must be a number (integer or floating-point) of seconds since the Unix
	* epoch. The static `CborDate.fromUntaggedCbor` is the usual entry point;
	* this instance form exists for reuse.
	*
	* @param cbor - The untagged CBOR value
	*
	* @returns this (populated in place)
	*
	* @throws Error if the CBOR value is not a valid timestamp
	*/
	fromUntaggedCbor(cbor) {
		let timestamp;
		switch (cbor.type) {
			case MajorType$1.Unsigned:
				timestamp = typeof cbor.value === "number" ? cbor.value : Number(cbor.value);
				break;
			case MajorType$1.Negative:
				if (typeof cbor.value === "bigint") timestamp = Number(-cbor.value - 1n);
				else timestamp = -cbor.value - 1;
				break;
			case MajorType$1.Simple:
				if (cbor.value.type === "Float") timestamp = cbor.value.value;
				else throw CborError$1.wrongType();
				break;
			default: throw CborError$1.wrongType();
		}
		this._seconds = normalizeTimestampSeconds(timestamp);
		return this;
	}
	/**
	* Populates this `CborDate` in place from a tag-1 CBOR value.
	*
	* @param cbor - Tagged CBOR value
	*
	* @returns this (populated in place)
	*
	* @throws Error if the CBOR value has the wrong tag or cannot be decoded
	*/
	fromTaggedCbor(cbor) {
		validateTag$1(cbor, this.cborTags());
		const content = extractTaggedContent$1(cbor);
		return this.fromUntaggedCbor(content);
	}
	/**
	* Static method to create a CborDate from tagged CBOR.
	*
	* @param cbor - Tagged CBOR value
	* @returns New CborDate instance
	*/
	static fromTaggedCbor(cbor) {
		return new CborDate().fromTaggedCbor(cbor);
	}
	/**
	* The {@link CborCodec} exemplar: a runtime witness that binds
	* `T = CborDate` for `decodeWith(bytes, CborDate.codec)`.
	*
	* A lazy getter (memoized) rather than a static field: the date ↔ tags
	* module cycle makes an eager initializer hit the temporal dead zone.
	*
	* @beta
	*/
	static get codec() {
		dateCodec ??= {
			tags: [Tag.from(1, "date")],
			decode: (c) => CborDate.fromTaggedCbor(c),
			encode: (value) => value.taggedCbor()
		};
		return dateCodec;
	}
	static fromUntaggedCbor(cbor) {
		return new CborDate().fromUntaggedCbor(cbor);
	}
	/**
	* Implementation of the `toString` method for `CborDate`.
	*
	* This implementation provides a string representation of a `CborDate` in ISO-8601
	* format. For dates with time exactly at midnight (00:00:00), only the date
	* part is shown. For other times, a full date-time string is shown.
	*
	* @returns String representation in ISO-8601 format
	*
	* @example
	* ```typescript
	* // A date at midnight will display as just the date
	* const date = CborDate.fromYmd(2023, 2, 8);
	* // Returns "2023-02-08"
	* console.log(date.toString());
	*
	* // A date with time will display as date and time
	* const date2 = CborDate.fromYmdHms(2023, 2, 8, 15, 30, 45);
	* // Returns "2023-02-08T15:30:45.000Z"
	* console.log(date2.toString());
	* ```
	*/
	toString() {
		const dt = /* @__PURE__ */ new Date(this._seconds * 1e3);
		if (!(dt.getUTCHours() !== 0 || dt.getUTCMinutes() !== 0 || dt.getUTCSeconds() !== 0)) {
			const datePart = dt.toISOString().split("T")[0];
			if (datePart === void 0) throw CborError$1.custom("Invalid ISO string format");
			return datePart;
		} else return dt.toISOString().replace(/\.\d{3}Z$/, "Z");
	}
	/**
	* Compare two dates for equality.
	*
	* @param other - Other CborDate to compare
	* @returns true if dates represent the same moment in time
	*/
	equals(other) {
		return this._seconds === other._seconds;
	}
	/**
	* Compare two dates.
	*
	* @param other - Other CborDate to compare
	* @returns -1 if this < other, 0 if equal, 1 if this > other
	*/
	compare(other) {
		if (this._seconds < other._seconds) return -1;
		if (this._seconds > other._seconds) return 1;
		return 0;
	}
	/**
	* Convert to JSON (returns ISO 8601 string).
	*
	* @returns ISO 8601 string
	*/
	toJSON() {
		return this.toString();
	}
	constructor() {
		this._seconds = Date.now() / 1e3;
	}
};
/**
* Validates that a bignum magnitude byte string is in shortest canonical form.
*
* Rules:
* - For positive bignums (tag 2): empty byte string represents zero;
*   non-empty must not have leading zero bytes.
* - For negative bignums (tag 3): byte string must not be empty
*   (magnitude zero is encoded as `0x00`); must not have leading zero bytes
*   except when the magnitude is zero (single `0x00`).
*
* @param bytes - The magnitude byte string to validate
* @param isNegative - Whether this is for a negative bignum (tag 3)
* @throws CborError with type NonCanonicalNumeric on validation failure
*/
function validateBignumMagnitude(bytes, isNegative) {
	if (isNegative) {
		if (bytes.length === 0) throw CborError$1.nonCanonicalNumeric();
		if (bytes.length > 1 && bytes[0] === 0) throw CborError$1.nonCanonicalNumeric();
	} else if (bytes.length > 0 && bytes[0] === 0) throw CborError$1.nonCanonicalNumeric();
}
/**
* Convert a big-endian byte array to a bigint.
*
* Empty array returns 0n.
*
* @param bytes - Big-endian byte representation
* @returns The bigint value
*/
function bytesToBigint(bytes) {
	if (bytes.length === 0) return 0n;
	let result = 0n;
	for (const byte of bytes) result = result << 8n | BigInt(byte);
	return result;
}
/**
* Decode a BigUint from an untagged CBOR byte string.
*
* This function is intended for use in tag summarizers where the tag has
* already been stripped. It expects a CBOR byte string representing the
* big-endian magnitude of a positive bignum (tag 2 content).
*
* Enforces canonical encoding: no leading zero bytes (except empty for zero).
*
* @param cbor - A CBOR value that should be a byte string
* @returns Non-negative bigint
* @throws CborError with type WrongType if not a byte string
* @throws CborError with type NonCanonicalNumeric if encoding is non-canonical
*/
function biguintFromUntaggedCbor$1(cbor) {
	if (cbor.type !== MajorType$1.ByteString) throw CborError$1.wrongType();
	const bytes = cbor.value;
	validateBignumMagnitude(bytes, false);
	return bytesToBigint(bytes);
}
/**
* Decode a BigInt from an untagged CBOR byte string for a negative bignum.
*
* This function is intended for use in tag summarizers where the tag has
* already been stripped. It expects a CBOR byte string representing `n` where
* the actual value is `-1 - n` (tag 3 content per RFC 8949).
*
* Enforces canonical encoding: no leading zero bytes (except single `0x00`
* for -1).
*
* @param cbor - A CBOR value that should be a byte string
* @returns Negative bigint
* @throws CborError with type WrongType if not a byte string
* @throws CborError with type NonCanonicalNumeric if encoding is non-canonical
*/
function bigintFromNegativeUntaggedCbor$1(cbor) {
	if (cbor.type !== MajorType$1.ByteString) throw CborError$1.wrongType();
	const bytes = cbor.value;
	validateBignumMagnitude(bytes, true);
	return -(bytesToBigint(bytes) + 1n);
}
//#endregion
//#region ../bc-dcbor-compat-ts/node_modules/@blockchaincommons/dcbor/dist/diag-BpAWXEUJ.mjs
/**
* String utilities for dCBOR, including Unicode normalization.
*
* @module string-util
*/
/**
* Flank a string with left and right strings.
*
* @param s - String to flank
* @param left - Left flanking string
* @param right - Right flanking string
* @returns Flanked string
*/
const flanked = (s, left, right) => left + s + right;
/**
* Check if a character is printable. Internal helper for {@link sanitized}.
*
* @param c - Character to check
* @returns True if printable
*/
const isPrintable = (c) => {
	if (c.length !== 1) return false;
	const code = c.charCodeAt(0);
	return code > 127 || code >= 32 && code <= 126;
};
/**
* Sanitize a string by replacing non-printable characters with dots.
* Returns None if the string has no printable characters.
*
* @param str - String to sanitize
* @returns Sanitized string or undefined if no printable characters
*/
const sanitized = (str) => {
	let hasPrintable = false;
	const chars = [];
	for (const c of str) if (isPrintable(c)) {
		hasPrintable = true;
		chars.push(c);
	} else chars.push(".");
	if (!hasPrintable) return;
	return chars.join("");
};
const resolveOpts = (opts) => {
	const summarize = opts?.summarize ?? false;
	return {
		annotate: opts?.annotate ?? false,
		summarize,
		flat: summarize || (opts?.flat ?? false),
		tags: opts?.tags ?? "global"
	};
};
/**
* Format a CBOR value - or a walk visitor's `WalkElement` - as CBOR
* diagnostic notation.
*
* ```typescript
* diagnostic(value);                       // pretty-printed
* diagnostic(value, { flat: true });       // single line
* diagnostic(value, { annotate: true });   // tag names as annotations
* diagnostic(value, { summarize: true });  // registered summarizers (implies flat)
* ```
*
* @param input - CBOR value, or a `WalkElement` from a walk visitor
* @param opts - Formatting options (explicit `undefined` fields mean
*   "use the default")
* @public
*/
function diagnostic$1(input, opts) {
	const state = resolveOpts(opts);
	if (typeof input === "object" && "type" in input && (input.type === "single" || input.type === "keyvalue")) {
		if (input.type === "single") return diagFormat(diagItem(input.cbor, state), state);
		return `${diagFormat(diagItem(input.key, state), state)}: ${diagFormat(diagItem(input.value, state), state)}`;
	}
	return diagFormat(diagItem(input, state), state);
}
const item = (value) => ({
	kind: "item",
	value
});
const group = (begin, end, items, isPairs, comment) => {
	const g = {
		kind: "group",
		begin,
		end,
		items,
		isPairs
	};
	if (comment !== void 0) g.comment = comment;
	return g;
};
const isGroup = (i) => i.kind === "group";
const containsGroup = (i) => i.kind === "group" && i.items.some(isGroup);
const totalStringsLen = (i) => i.kind === "item" ? i.value.length : i.items.reduce((acc, c) => acc + totalStringsLen(c), 0);
const greatestStringsLen = (i) => i.kind === "item" ? i.value.length : i.items.reduce((acc, c) => Math.max(acc, totalStringsLen(c)), 0);
/**
* Alternates between `pairSeparator` (after even-indexed items - keys) and
* `itemSeparator` (after odd-indexed items - values). Falls back to
* `itemSeparator` for non-pair groups.
*/
function joined(elements, itemSeparator, pairSeparator) {
	const sep = pairSeparator ?? itemSeparator;
	let result = "";
	const len = elements.length;
	for (let i = 0; i < len; i++) {
		result += elements[i];
		if (i !== len - 1) result += (i & 1) !== 0 ? itemSeparator : sep;
	}
	return result;
}
const diagFormat = (i, opts) => diagFormatOpt(i, 0, "", opts);
function diagFormatOpt(i, level, separator, opts) {
	if (i.kind === "item") return formatLine(level, opts, i.value, separator, void 0);
	if (opts.flat !== true && (containsGroup(i) || totalStringsLen(i) > 20 || greatestStringsLen(i) > 20)) return multilineComposition(i, level, separator, opts);
	return singleLineComposition(i, level, separator, opts);
}
function formatLine(level, opts, string, separator, comment) {
	const result = `${opts.flat === true ? "" : " ".repeat(level * 4)}${string}${separator}`;
	if (comment !== void 0) return `${result}   / ${comment} /`;
	return result;
}
function singleLineComposition(i, level, separator, opts) {
	let str;
	let comment;
	if (i.kind === "item") {
		str = i.value;
		comment = void 0;
	} else {
		str = flanked(joined(i.items.map((c) => c.kind === "item" ? c.value : singleLineComposition(c, level + 1, separator, opts)), ", ", i.isPairs ? ": " : ", "), i.begin, i.end);
		comment = i.comment;
	}
	return formatLine(level, opts, str, separator, comment);
}
function multilineComposition(i, level, separator, opts) {
	if (i.kind === "item") return i.value;
	const lines = [];
	const openOpts = {
		...opts,
		flat: false
	};
	lines.push(formatLine(level, openOpts, i.begin, "", i.comment));
	for (let idx = 0; idx < i.items.length; idx++) {
		const sep = idx === i.items.length - 1 ? "" : i.isPairs && (idx & 1) === 0 ? ":" : ",";
		lines.push(diagFormatOpt(i.items[idx], level + 1, sep, opts));
	}
	lines.push(formatLine(level, opts, i.end, separator, void 0));
	return lines.join("\n");
}
function diagItem(cbor, opts) {
	switch (cbor.type) {
		case MajorType$1.Unsigned: return item(formatUnsigned(cbor.value));
		case MajorType$1.Negative: return item(formatNegative(cbor.value));
		case MajorType$1.ByteString: return item(formatBytes(cbor.value));
		case MajorType$1.Text: return item(formatText(cbor.value));
		case MajorType$1.Array: return item_array(cbor.value, opts);
		case MajorType$1.Map: return item_map(cbor.value, opts);
		case MajorType$1.Tagged: return item_tagged(cbor.tag, cbor.value, opts);
		case MajorType$1.Simple: return item(formatSimple(cbor.value));
	}
}
function item_array(items, opts) {
	return group("[", "]", items.map((it) => diagItem(it, opts)), false);
}
function item_map(map, opts) {
	const entries = map?.entriesArray ?? [];
	const flatItems = [];
	for (const e of entries) {
		flatItems.push(diagItem(e.key, opts));
		flatItems.push(diagItem(e.value, opts));
	}
	return group("{", "}", flatItems, true);
}
function item_tagged(tag, content, opts) {
	if (opts.summarize === true) {
		const summarizer = resolveTagsStore(opts.tags)?.summarizer(tag);
		if (summarizer !== void 0) {
			const result = summarizer(content, opts.flat ?? false);
			if (result.ok) return item(result.value);
			return item(`<error: ${result.error.message}>`);
		}
	}
	let comment;
	if (opts.annotate === true) {
		const store = resolveTagsStore(opts.tags);
		const tagObj = { value: tag };
		const assignedName = store?.assignedNameForTag(tagObj);
		if (assignedName !== void 0) comment = assignedName;
	}
	return group(`${String(tag)}(`, ")", [diagItem(content, opts)], false, comment);
}
function formatUnsigned(value) {
	return String(value);
}
function formatNegative(value) {
	if (typeof value === "bigint") return String(-value - 1n);
	return String(-value - 1);
}
function formatBytes(value) {
	return `h'${bytesToHex$1(value)}'`;
}
function formatText(value) {
	return `"${value.replace(/"/g, "\\\"")}"`;
}
function formatSimple(value) {
	switch (value.type) {
		case "True": return "true";
		case "False": return "false";
		case "Null": return "null";
		case "Float": return formatFloat(value.value);
	}
}
/**
* Format a CBOR float for diagnostic output. Shared with the hex-dump
* annotation path; see {@link floatDisplayString}.
*/
function formatFloat(value) {
	return floatDisplayString(value);
}
function resolveTagsStore(tags) {
	if (tags === "none") return void 0;
	if (tags === "global" || tags === void 0) return getGlobalTagsStore$1();
	return tags;
}
//#endregion
//#region ../bc-dcbor-compat-ts/node_modules/@blockchaincommons/dcbor/dist/diagnostic.mjs
/**
* Hex dump utilities for CBOR data.
*
* Affordances for viewing the encoded binary representation of CBOR as hexadecimal.
* Optionally annotates the output, breaking it up into semantically meaningful lines,
* formatting dates, and adding names of known tags.
*
* @module dump
*/
/**
* Render CBOR as an annotated hex dump: the encoding broken into
* semantically meaningful lines with offsets, values, and tag names
* resolved through the tags store.
*
* For plain hex use `c.toHex()` or `bytesToHex(encodeCbor(v))`.
*
* @param cbor - CBOR value to render
* @param opts - Formatting options (explicit `undefined` fields mean
*   "use the default")
*/
const hexAnnotated = (cbor, opts) => {
	const items = dumpItems(cbor, 0, opts?.tagsStore ?? getGlobalTagsStore$1());
	const roundedNoteColumn = (items.reduce((largest, item) => {
		return Math.max(largest, item.formatFirstColumn().length);
	}, 0) + 4 & -4) - 1;
	return items.map((item) => item.format(roundedNoteColumn)).join("\n");
};
/**
* Internal structure for dump items.
*/
var DumpItem = class {
	level;
	data;
	note;
	constructor(level, data, note) {
		this.level = level;
		this.data = data;
		this.note = note;
	}
	format(noteColumn) {
		const column1 = this.formatFirstColumn();
		let column2 = "";
		let padding = "";
		if (this.note !== void 0) {
			const paddingCount = Math.max(1, Math.min(39, noteColumn) - column1.length + 1);
			padding = " ".repeat(paddingCount);
			column2 = `# ${this.note}`;
		}
		return column1 + padding + column2;
	}
	formatFirstColumn() {
		return " ".repeat(this.level * 4) + this.data.map(bytesToHex$1).filter((x) => x.length > 0).join(" ");
	}
};
/**
* Generate dump items for a CBOR value (recursive).
*/
function dumpItems(cbor, level, tagsStore) {
	const items = [];
	switch (cbor.type) {
		case MajorType$1.Unsigned: {
			const data = encodeCbor(cbor);
			items.push(new DumpItem(level, [data], `unsigned(${cbor.value})`));
			break;
		}
		case MajorType$1.Negative: {
			const data = encodeCbor(cbor);
			const actualValue = typeof cbor.value === "bigint" ? -1n - cbor.value : -1 - cbor.value;
			items.push(new DumpItem(level, [data], `negative(${actualValue})`));
			break;
		}
		case MajorType$1.ByteString: {
			const header = encodeVarInt(cbor.value.length, MajorType$1.ByteString);
			items.push(new DumpItem(level, [header], `bytes(${cbor.value.length})`));
			if (cbor.value.length > 0) {
				let note = void 0;
				try {
					const sanitizedText = sanitized(new TextDecoder("utf-8", { fatal: true }).decode(cbor.value));
					if (sanitizedText !== void 0 && sanitizedText !== "") note = flanked(sanitizedText, "\"", "\"");
				} catch {}
				items.push(new DumpItem(level + 1, [cbor.value], note));
			}
			break;
		}
		case MajorType$1.Text: {
			const utf8Data = new TextEncoder().encode(cbor.value);
			const header = encodeVarInt(utf8Data.length, MajorType$1.Text);
			const firstByte = header[0];
			if (firstByte === void 0) throw CborError$1.custom("Invalid varint encoding");
			const headerData = [new Uint8Array([firstByte]), header.slice(1)];
			items.push(new DumpItem(level, headerData, `text(${utf8Data.length})`));
			items.push(new DumpItem(level + 1, [utf8Data], flanked(cbor.value, "\"", "\"")));
			break;
		}
		case MajorType$1.Array: {
			const header = encodeVarInt(cbor.value.length, MajorType$1.Array);
			const firstByte = header[0];
			if (firstByte === void 0) throw CborError$1.custom("Invalid varint encoding");
			const headerData = [new Uint8Array([firstByte]), header.slice(1)];
			items.push(new DumpItem(level, headerData, `array(${cbor.value.length})`));
			for (const item of cbor.value) items.push(...dumpItems(item, level + 1, tagsStore));
			break;
		}
		case MajorType$1.Map: {
			const header = encodeVarInt(cbor.value.size, MajorType$1.Map);
			const firstByte = header[0];
			if (firstByte === void 0) throw CborError$1.custom("Invalid varint encoding");
			const headerData = [new Uint8Array([firstByte]), header.slice(1)];
			items.push(new DumpItem(level, headerData, `map(${cbor.value.size})`));
			for (const entry of cbor.value.entriesArray) {
				items.push(...dumpItems(entry.key, level + 1, tagsStore));
				items.push(...dumpItems(entry.value, level + 1, tagsStore));
			}
			break;
		}
		case MajorType$1.Tagged: {
			const tagValue = cbor.tag;
			if (tagValue === void 0) throw CborError$1.custom("Tagged CBOR value must have a tag");
			const header = encodeVarInt(tagValue, MajorType$1.Tagged);
			const firstByte = header[0];
			if (firstByte === void 0) throw CborError$1.custom("Invalid varint encoding");
			const headerData = [new Uint8Array([firstByte]), header.slice(1)];
			const noteComponents = [`tag(${tagValue})`];
			const tag = Tag.from(tagValue);
			const tagName = tagsStore.assignedNameForTag(tag);
			if (tagName !== void 0) noteComponents.push(tagName);
			const tagNote = noteComponents.join(" ");
			items.push(new DumpItem(level, headerData, tagNote));
			items.push(...dumpItems(cbor.value, level + 1, tagsStore));
			break;
		}
		case MajorType$1.Simple: {
			const data = encodeCbor(cbor);
			const simple = cbor.value;
			let note;
			if (simple.type === "True") note = "true";
			else if (simple.type === "False") note = "false";
			else if (simple.type === "Null") note = "null";
			else if (simple.type === "Float") note = floatDisplayString(simple.value);
			else note = "simple";
			items.push(new DumpItem(level, [data], note));
			break;
		}
	}
	return items;
}
//#endregion
//#region ../bc-dcbor-compat-ts/dist/index.mjs
/**
* Create a new Tag.
*
* @param value - The numeric tag value
* @param name - Optional human-readable name
* @returns A new Tag object
*
* @example
* ```typescript
* const dateTag = createTag(1, 'date');
* const customTag = createTag(12345, 'myCustomTag');
* ```
*/
const createTag = (value, name) => {
	if (name !== void 0) return {
		value,
		name
	};
	return { value };
};
/**
* Compare two tag values for equality, normalizing `number` vs `bigint`.
* A raw `===` would treat `100n` and `100` as unequal, so a large tag that
* decoded to a `bigint` wouldn't match the same value written as a `number`.
*/
const tagValuesEqual = (a, b) => {
	if (typeof a === "bigint" || typeof b === "bigint") return BigInt(a) === BigInt(b);
	return a === b;
};
/**
* Get the string representation of a tag.
* Internal function used for error messages.
*
* @param tag - The tag to represent
* @returns String representation (name if available, otherwise value)
*
* @internal
*/
const tagToString = (tag) => tag.name ?? tag.value.toString();
/**
* Convert an Error to a display string.
*
* Matches Rust's `Display` trait / `to_string()` method.
*/
const errorToString = (error) => {
	switch (error.type) {
		case "Underrun": return "early end of CBOR data";
		case "UnsupportedHeaderValue": return "unsupported value in CBOR header";
		case "NonCanonicalNumeric": return "a CBOR numeric value was encoded in non-canonical form";
		case "InvalidSimpleValue": return "an invalid CBOR simple value was encountered";
		case "InvalidString": return `an invalidly-encoded UTF-8 string was encountered in the CBOR (${error.message})`;
		case "NonCanonicalString": return "a CBOR string was not encoded in Unicode Canonical Normalization Form C";
		case "UnusedData": return `the decoded CBOR had ${error.count} extra bytes at the end`;
		case "MisorderedMapKey": return "the decoded CBOR map has keys that are not in canonical order";
		case "DuplicateMapKey": return "the decoded CBOR map has a duplicate key";
		case "MissingMapKey": return "missing CBOR map key";
		case "OutOfRange": return "the CBOR numeric value could not be represented in the specified numeric type";
		case "WrongType": return "the decoded CBOR value was not the expected type";
		case "WrongTag": return `expected CBOR tag ${tagToString(error.expected)}, but got ${tagToString(error.actual)}`;
		case "InvalidUtf8": return `invalid UTF‑8 string: ${error.message}`;
		case "InvalidDate": return `invalid ISO 8601 date string: ${error.message}`;
		case "Custom": return error.message;
	}
};
/**
* Typed error class for all CBOR-related errors.
*
* Wraps the discriminated union Error type in a JavaScript Error object
* for proper error handling with stack traces.
*
* @example
* ```typescript
* throw new CborError({ type: 'Underrun' });
* throw new CborError({ type: 'WrongTag', expected: tag1, actual: tag2 });
* ```
*/
var CborError = class CborError extends Error {
	/**
	* The structured error information.
	*/
	errorType;
	/**
	* Create a new CborError.
	*
	* @param errorType - The discriminated union error type
	* @param message - Optional custom message (defaults to errorToString(errorType))
	*/
	constructor(errorType, message) {
		super(message ?? errorToString(errorType));
		this.name = "CborError";
		this.errorType = errorType;
		if ("captureStackTrace" in Error) Error.captureStackTrace(this, CborError);
	}
	/**
	* Check if an error is a CborError.
	*
	* @param error - Error to check
	* @returns True if error is a CborError
	*/
	static isCborError(error) {
		return error instanceof CborError;
	}
};
/**
* Convert a legacy node into a canonical `@blockchaincommons/dcbor` node.
*
* Leaves are shared, not copied: the canonical functions never mutate their
* inputs. Map nodes unwrap to the inner canonical `CborMap`, so later
* mutations through the legacy wrapper stay visible.
*/
const toNew = (c) => {
	switch (c.type) {
		case MajorType.Array: return {
			isCbor: true,
			type: MajorType.Array,
			value: c.value.map(toNew)
		};
		case MajorType.Map: return {
			isCbor: true,
			type: MajorType.Map,
			value: c.value._inner
		};
		case MajorType.Tagged: return {
			isCbor: true,
			type: MajorType.Tagged,
			tag: c.tag,
			value: toNew(c.value)
		};
		default: return {
			isCbor: true,
			type: c.type,
			value: c.value
		};
	}
};
/**
* Convert a canonical node into a legacy node with the legacy method set.
* Map nodes wrap the canonical `CborMap` without copying entries.
*/
const fromNew = (n) => {
	switch (n.type) {
		case MajorType.Array: return attachMethods({
			isCbor: true,
			type: MajorType.Array,
			value: n.value.map(fromNew)
		});
		case MajorType.Map: return attachMethods({
			isCbor: true,
			type: MajorType.Map,
			value: CborMap._fromInner(n.value)
		});
		case MajorType.Tagged: return attachMethods({
			isCbor: true,
			type: MajorType.Tagged,
			tag: n.tag,
			value: fromNew(n.value)
		});
		default: return attachMethods({
			isCbor: true,
			type: n.type,
			value: n.value
		});
	}
};
/**
* Translate a canonical `CborError` (code + details) back into the legacy
* discriminated-union `CborError`. Non-CborError values are re-thrown as-is.
*/
const toLegacyError = (e) => {
	if (!CborError$1.isCborError(e)) {
		if (e instanceof CborError) return e;
		throw e;
	}
	const details = e.details;
	let errorType;
	switch (e.code) {
		case "UnsupportedHeaderValue":
			errorType = {
				type: "UnsupportedHeaderValue",
				value: details["headerValue"]
			};
			break;
		case "UnusedData":
			errorType = {
				type: "UnusedData",
				count: details["count"]
			};
			break;
		case "WrongTag":
			errorType = {
				type: "WrongTag",
				expected: details["expectedTag"],
				actual: details["actualTag"]
			};
			break;
		case "InvalidString":
			errorType = {
				type: "InvalidString",
				message: details["cause"] ?? e.message
			};
			break;
		case "InvalidUtf8":
			errorType = {
				type: "InvalidUtf8",
				message: details["cause"] ?? e.message
			};
			break;
		case "InvalidDate":
			errorType = {
				type: "InvalidDate",
				message: details["cause"] ?? e.message
			};
			break;
		case "Custom":
			errorType = {
				type: "Custom",
				message: e.message
			};
			break;
		default: errorType = { type: e.code };
	}
	return new CborError(errorType);
};
/** Run a canonical-package operation, translating thrown errors. */
const delegating = (op) => {
	try {
		return op();
	} catch (e) {
		throw toLegacyError(e);
	}
};
/**
* Copyright © 2023-2026 Blockchain Commons, LLC
*
*
* Tag registry and management system.
*
* The TagsStore provides a centralized registry for CBOR tags,
* including name resolution and custom summarizer functions.
*
* The store wraps the `@blockchaincommons/dcbor` `TagsStore` — and the
* global singleton wraps the canonical package's *global* store — so tag
* names and summarizers registered through this legacy API are visible to
* the delegated diagnostic/hex formatters (and vice versa).
*
* @module tags-store
*/
/**
* Convert a canonical tag (whose `name` may be explicitly `undefined`) to the
* legacy `Tag` shape, which omits the property instead.
*/
const toLegacyTag = (tag) => {
	if (tag === void 0) return void 0;
	return tag.name !== void 0 ? {
		value: tag.value,
		name: tag.name
	} : { value: tag.value };
};
/**
* Tag registry implementation.
*
* Stores tags with their names and optional summarizer functions, delegating
* storage to the canonical `@blockchaincommons/dcbor` store.
*/
var TagsStore = class TagsStore {
	_store;
	/** Original (legacy-signature) summarizers, for the `summarizer()` accessor. */
	_legacySummarizers = /* @__PURE__ */ new Map();
	constructor() {
		this._store = new TagsStore$1();
	}
	/**
	* The wrapped canonical `@blockchaincommons/dcbor` store.
	* @internal
	*/
	get _inner() {
		return this._store;
	}
	/**
	* Wrap an existing canonical store without copying registrations.
	* @internal
	*/
	static _fromInner(inner) {
		const store = new TagsStore();
		store._store = inner;
		return store;
	}
	/**
	* Insert a tag into the registry.
	*
	* Matches Rust's TagsStore::insert() behavior:
	* - Throws if the tag name is undefined or empty
	* - Throws if a tag with the same value exists with a different name
	* - Allows re-registering the same tag value with the same name
	*
	* @param tag - The tag to register (must have a non-empty name)
	* @throws Error if tag has no name, empty name, or conflicts with existing registration
	*
	* @example
	* ```typescript
	* const store = new TagsStore();
	* store.insert(createTag(12345, 'myCustomTag'));
	* ```
	*/
	insert(tag) {
		const name = tag.name;
		if (name === void 0 || name === "") throw new Error(`Tag ${tag.value} must have a non-empty name`);
		const existing = this._store.tagForValue(tag.value);
		if (existing?.name !== void 0 && existing.name !== name) throw new Error(`Attempt to register tag: ${tag.value} '${existing.name}' with different name: '${name}'`);
		this._store.register(Tag.from(tag.value, name));
	}
	/**
	* Insert multiple tags into the registry.
	* Matches Rust's insert_all() method.
	*
	* @param tags - Array of tags to register
	*
	* @example
	* ```typescript
	* const store = new TagsStore();
	* store.insertAll([
	*   createTag(1, 'date'),
	*   createTag(100, 'custom')
	* ]);
	* ```
	*/
	insertAll(tags) {
		for (const tag of tags) this.insert(tag);
	}
	/**
	* Register a custom summarizer function for a tag.
	*
	* The summarizer is adapted and forwarded to the canonical store, so the
	* delegated diagnostic formatters invoke it (with a legacy-shaped node).
	*
	* @param tagValue - The numeric tag value
	* @param summarizer - The summarizer function
	*
	* @example
	* ```typescript
	* store.setSummarizer(1, (cbor, flat) => {
	*   // Custom date formatting
	*   return `Date(${extractCbor(cbor)})`;
	* });
	* ```
	*/
	setSummarizer(tagValue, summarizer) {
		this._legacySummarizers.set(this._valueKey(tagValue), summarizer);
		this._store.setSummarizer(tagValue, (cbor, flat) => {
			const result = summarizer(fromNew(cbor), flat);
			if (result.ok) return result;
			return {
				ok: false,
				error: CborError$1.custom(errorToString(result.error))
			};
		});
	}
	assignedNameForTag(tag) {
		return this._store.tagForValue(tag.value)?.name;
	}
	nameForTag(tag) {
		return this.assignedNameForTag(tag) ?? tag.value.toString();
	}
	tagForValue(value) {
		return toLegacyTag(this._store.tagForValue(value));
	}
	tagForName(name) {
		return toLegacyTag(this._store.tagForName(name));
	}
	nameForValue(value) {
		const tag = this.tagForValue(value);
		return tag !== void 0 ? this.nameForTag(tag) : value.toString();
	}
	summarizer(tag) {
		return this._legacySummarizers.get(this._valueKey(tag));
	}
	_valueKey(value) {
		return value.toString();
	}
};
/**
* Global singleton instance of the tags store.
*/
let globalTagsStore;
/**
* Get the global tags store instance.
*
* Creates the instance on first access, wrapping the canonical package's
* global store so registrations are shared with the delegated formatters.
*
* @returns The global TagsStore instance
*
* @example
* ```typescript
* const store = getGlobalTagsStore();
* store.insert(createTag(999, 'myTag'));
* ```
*/
const getGlobalTagsStore = () => {
	globalTagsStore ??= TagsStore._fromInner(getGlobalTagsStore$1());
	return globalTagsStore;
};
/**
* Copyright © 2023-2026 Blockchain Commons, LLC
*
*
* Hex dump utilities for CBOR data.
*
* Affordances for viewing the encoded binary representation of CBOR as hexadecimal.
* Optionally annotates the output, breaking it up into semantically meaningful lines,
* formatting dates, and adding names of known tags.
*
* The annotated rendering delegates to `@blockchaincommons/dcbor/diagnostic`.
*
* @module dump
*/
/**
* Convert bytes to hex string.
*/
const bytesToHex = (bytes) => {
	return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
};
/**
* Returns the encoded hexadecimal representation of CBOR.
*
* @param cbor - CBOR value to convert
* @returns Hex string
*/
const hex = (cbor) => bytesToHex(cborData(cbor));
/**
* Returns the encoded hexadecimal representation of CBOR with options.
*
* Optionally annotates the output, e.g., breaking the output up into
* semantically meaningful lines, formatting dates, and adding names of
* known tags.
*
* @param cbor - CBOR value to convert
* @param opts - Formatting options
* @returns Hex string (possibly annotated)
*/
const hexOpt = (cbor, opts = {}) => {
	if (opts.annotate !== true) return hex(cbor);
	const tagsStore = opts.tagsStore ?? getGlobalTagsStore();
	return delegating(() => hexAnnotated(toNew(cbor), { tagsStore: tagsStore._inner }));
};
/**
* Copyright © 2023-2026 Blockchain Commons, LLC
*
*
* Enhanced diagnostic formatting for CBOR values.
*
* Provides multiple formatting options including
* - Annotated diagnostics with tag names
* - Summarized values using custom summarizers
* - Flat (single-line) vs. pretty (multi-line) formatting
* - Configurable tag store usage
*
* Rendering delegates to `@blockchaincommons/dcbor/diagnostic` (which shares
* this module's option vocabulary); summarizers registered through this
* package's `TagsStore` are consulted through the wrapped canonical store.
*
* @module diag
*/
/**
* Convert the legacy tags-store option to the canonical one (unwrap a
* wrapped store; pass the string variants through).
*/
const toBcTagsOpt = (tags) => {
	if (tags instanceof TagsStore) return tags._inner;
	return tags;
};
/**
* Format CBOR value as diagnostic notation with options.
*
* @param cbor - CBOR value to format
* @param opts - Formatting options
* @returns Diagnostic string
*
* @example
* ```typescript
* const value = cbor({ name: 'Alice', age: 30 });
* console.log(diagnosticOpt(value, { flat: true }));
* // {\"name\": \"Alice\", \"age\": 30}
* ```
*/
function diagnosticOpt(cbor, opts) {
	return delegating(() => diagnostic$1(toNew(cbor), {
		annotate: opts?.annotate,
		summarize: opts?.summarize,
		flat: opts?.summarize === true ? true : opts?.flat,
		tags: toBcTagsOpt(opts?.tags)
	}));
}
/**
* Format CBOR value as standard diagnostic notation.
*
* @param cbor - CBOR value to format
* @returns Diagnostic string (pretty-printed with multiple lines for complex structures)
*
* @example
* ```typescript
* const value = cbor([1, 2, 3]);
* console.log(diagnostic(value));
* // For simple arrays: "[1, 2, 3]"
* // For nested structures: multi-line formatted output
* ```
*/
function diagnostic(cbor) {
	return diagnosticOpt(cbor);
}
/**
* Checks if the simple value is a floating point number.
*/
const isFloat$1 = (simple) => simple.type === "Float";
/**
* Copyright © 2023-2026 Blockchain Commons, LLC
*
*
* dCBOR decoding — delegates to `@blockchaincommons/dcbor`, the canonical
* implementation, then rewraps the result into this package's legacy node
* shape. All deterministic-encoding enforcement (canonical numeric forms,
* NFC text, map-key order, no trailing bytes) happens in the canonical
* decoder; thrown errors are translated back to the legacy `CborError`.
*/
function decodeCbor(data) {
	return fromNew(delegating(() => decodeCbor$1(data)));
}
/**
* Copyright © 2023-2026 Blockchain Commons, LLC
*
*
* Convenience utilities for working with CBOR values.
*
* Provides type-safe helpers for checking types, extracting values,
* and working with arrays, maps, and tagged values.
*
* @module conveniences
*/
/**
* Extract native JavaScript value from CBOR.
* Converts CBOR types to their JavaScript equivalents.
*/
const extractCbor = (cbor) => {
	let c;
	if (cbor instanceof Uint8Array) c = decodeCbor(cbor);
	else c = cbor;
	switch (c.type) {
		case MajorType.Unsigned: return c.value;
		case MajorType.Negative: if (typeof c.value === "bigint") return -c.value - 1n;
		else return -c.value - 1;
		case MajorType.ByteString: return c.value;
		case MajorType.Text: return c.value;
		case MajorType.Array: return c.value.map(extractCbor);
		case MajorType.Map: return c.value;
		case MajorType.Tagged: return c;
		case MajorType.Simple:
			if (c.value.type === "True") return true;
			if (c.value.type === "False") return false;
			if (c.value.type === "Null") return null;
			if (c.value.type === "Float") return c.value.value;
			return c;
	}
};
/**
* Copyright © 2023-2026 Blockchain Commons, LLC
*
*
* Map Support in dCBOR
*
* A deterministic CBOR map that ensures maps with the same content always
* produce identical binary encodings, regardless of insertion order.
*
* This class keeps the historical `@blockchaincommons/dcbor-compat` map API (Rust-flavored
* `insert`/`containsKey`/`len`/`iter` alongside the JS `Map` vocabulary) but
* stores its entries in a `@blockchaincommons/dcbor` `CborMap` — the
* canonical implementation owns key ordering (lexicographic by encoded CBOR
* bytes), duplicate handling, and the decode-time `setNext` ordering checks.
*
* @module map
*/
/**
* A deterministic CBOR map implementation.
*
* Maps are always encoded with keys sorted lexicographically by their
* encoded CBOR representation, ensuring deterministic encoding.
*/
var CborMap = class CborMap {
	_map;
	/**
	* Creates a new, empty CBOR Map.
	* Optionally initializes from a JavaScript Map.
	*/
	constructor(map) {
		this._map = new CborMap$1();
		if (map !== void 0) for (const [key, value] of map.entries()) this.set(key, value);
	}
	/**
	* The wrapped canonical `@blockchaincommons/dcbor` map.
	* @internal
	*/
	get _inner() {
		return this._map;
	}
	/**
	* Wrap an existing canonical map without copying entries.
	* @internal
	*/
	static _fromInner(inner) {
		const map = new CborMap();
		map._map = inner;
		return map;
	}
	/**
	* Creates a new, empty CBOR Map.
	* Matches Rust's Map::new().
	*/
	static new() {
		return new CborMap();
	}
	/**
	* Inserts a key-value pair into the map.
	* Matches Rust's Map::insert().
	*/
	set(key, value) {
		const keyCbor = cbor(key);
		const valueCbor = cbor(value);
		delegating(() => this._map.set(toNew(keyCbor), toNew(valueCbor)));
	}
	/**
	* Alias for set() to match Rust's insert() method.
	*/
	insert(key, value) {
		this.set(key, value);
	}
	/**
	* Get a value from the map, given a key.
	* Returns undefined if the key is not present in the map.
	* Matches Rust's Map::get().
	*/
	get(key) {
		const stored = delegating(() => this._map.get(toNew(cbor(key))));
		if (stored === void 0) return;
		return extractCbor(fromNew(stored));
	}
	/**
	* Get a value from the map, given a key.
	* Throws an error if the key is not present.
	* Matches Rust's Map::extract().
	*/
	extract(key) {
		const value = this.get(key);
		if (value === void 0) throw new CborError({ type: "MissingMapKey" });
		return value;
	}
	/**
	* Tests if the map contains a key.
	* Matches Rust's Map::contains_key().
	*/
	containsKey(key) {
		return delegating(() => this._map.has(toNew(cbor(key))));
	}
	delete(key) {
		return delegating(() => this._map.delete(toNew(cbor(key))));
	}
	has(key) {
		return this.containsKey(key);
	}
	clear() {
		this._map.clear();
	}
	/**
	* Returns the number of entries in the map.
	* Matches Rust's Map::len().
	*/
	get length() {
		return this._map.size;
	}
	/**
	* Alias for length to match JavaScript Map API.
	* Also matches Rust's Map::len().
	*/
	get size() {
		return this._map.size;
	}
	/**
	* Returns the number of entries in the map.
	* Matches Rust's Map::len().
	*/
	len() {
		return this._map.size;
	}
	/**
	* Checks if the map is empty.
	* Matches Rust's Map::is_empty().
	*/
	isEmpty() {
		return this._map.size === 0;
	}
	/**
	* Get the entries of the map as an array.
	* Keys are sorted in lexicographic order of their encoded CBOR bytes.
	*/
	get entriesArray() {
		const entries = [];
		for (const [key, value] of this._map.entries()) entries.push({
			key: fromNew(key),
			value: fromNew(value)
		});
		return entries;
	}
	/**
	* Gets an iterator over the entries of the CBOR map, sorted by key.
	* Key sorting order is lexicographic by the key's binary-encoded CBOR.
	* Matches Rust's Map::iter().
	*/
	iter() {
		return this.entriesArray;
	}
	/**
	* Returns an iterator of [key, value] tuples for JavaScript Map API compatibility.
	* This matches the standard JavaScript Map.entries() method behavior.
	*/
	*entries() {
		for (const entry of this.entriesArray) yield [entry.key, entry.value];
	}
	/**
	* Inserts the next key-value pair into the map during decoding.
	* This is used for efficient map building during CBOR decoding.
	* Throws if the key is not in ascending order or is a duplicate.
	* Matches Rust's Map::insert_next().
	*/
	setNext(key, value) {
		const keyCbor = cbor(key);
		const valueCbor = cbor(value);
		delegating(() => this._map.setNext(toNew(keyCbor), toNew(valueCbor)));
	}
	get debug() {
		return `map({${this.entriesArray.map(CborMap.entryDebug).join(", ")}})`;
	}
	get diagnostic() {
		return `{${this.entriesArray.map(CborMap.entryDiagnostic).join(", ")}}`;
	}
	static entryDebug(entry) {
		const keyDebug = CborMap.formatDebug(entry.key);
		const valueDebug = CborMap.formatDebug(entry.value);
		return `0x${bytesToHex(encodeCbor$1(entry.key))}: (${keyDebug}, ${valueDebug})`;
	}
	static formatDebug(cbor) {
		switch (cbor.type) {
			case MajorType.Unsigned: return `unsigned(${cbor.value})`;
			case MajorType.Negative: return `negative(${typeof cbor.value === "bigint" ? -cbor.value - 1n : -cbor.value - 1})`;
			case MajorType.ByteString: return `bytes(${bytesToHex(cbor.value)})`;
			case MajorType.Text: return `text("${cbor.value}")`;
			case MajorType.Array: return `array([${cbor.value.map(CborMap.formatDebug).join(", ")}])`;
			case MajorType.Map: return cbor.value.debug;
			case MajorType.Tagged: return `tagged(${cbor.tag}, ${CborMap.formatDebug(cbor.value)})`;
			case MajorType.Simple: {
				const simple = cbor.value;
				if (typeof simple === "object" && simple !== null && "type" in simple) switch (simple.type) {
					case "True": return "simple(true)";
					case "False": return "simple(false)";
					case "Null": return "simple(null)";
					case "Float": return `simple(${simple.value})`;
				}
				return "simple";
			}
			default: return diagnostic(cbor);
		}
	}
	static entryDiagnostic(entry) {
		return `${diagnostic(entry.key)}: ${diagnostic(entry.value)}`;
	}
	*[Symbol.iterator]() {
		for (const entry of this.entriesArray) yield [entry.key, entry.value];
	}
	toMap() {
		const map = /* @__PURE__ */ new Map();
		for (const entry of this.entriesArray) map.set(extractCbor(entry.key), extractCbor(entry.value));
		return map;
	}
};
/**
* Clone helper used to give each descendant subtree an independent copy of
* the post-visit state — mirrors Rust `State: Clone` + `state.clone()` per
* child in `walk.rs`. Falls back to the value as-is for primitives (which
* don't need cloning) and uses `structuredClone` for objects.
*/
const cloneState = (s) => {
	if (s === null) return s;
	const t = typeof s;
	if (t !== "object" && t !== "function") return s;
	return globalThis.structuredClone(s);
};
/**
* Walk a CBOR tree, visiting each element with a visitor function.
*
* The visitor function is called for each element in the tree, in depth-first order.
* State semantics mirror Rust's `walk_internal`:
*
* - The visitor's returned `newState` propagates **down** to descendants of
*   the just-visited node only.
* - Sibling subtrees each receive an independent clone of the parent's
*   post-visit state, so accumulating mutations in one subtree never leak
*   into a sibling.
* - State changes do not propagate **up**: the public `walk` returns `void`.
*
* For maps, the visitor is called with:
* 1. A 'keyvalue' element containing both key and value
* 2. The key individually (if descent wasn't stopped)
* 3. The value individually (if descent wasn't stopped)
*
* @template State - The type of state to pass into each visit
* @param cbor - The CBOR value to traverse
* @param initialState - Initial state value
* @param visitor - Function to call for each element
*/
const walk = (cbor, initialState, visitor) => {
	walkInternal(cbor, 0, { type: "none" }, initialState, visitor);
};
/**
* Internal recursive walk implementation.
*
* @internal
*/
function walkInternal(cbor, level, edge, state, visitor) {
	const [postVisitState, stop] = visitor({
		type: "single",
		cbor
	}, level, edge, state);
	if (stop) return;
	switch (cbor.type) {
		case MajorType.Array:
			walkArray(cbor, level, postVisitState, visitor);
			break;
		case MajorType.Map:
			walkMap(cbor, level, postVisitState, visitor);
			break;
		case MajorType.Tagged: walkTagged(cbor, level, postVisitState, visitor);
	}
}
/**
* Walk an array's elements. Each element is visited with an independent
* clone of `parentState`.
*
* @internal
*/
function walkArray(cbor, level, parentState, visitor) {
	for (let index = 0; index < cbor.value.length; index++) {
		const item = cbor.value[index];
		if (item === void 0) throw new CborError({
			type: "Custom",
			message: `Array element at index ${index} is undefined`
		});
		walkInternal(item, level + 1, {
			type: "array_element",
			index
		}, cloneState(parentState), visitor);
	}
}
/**
* Walk a map's key-value pairs.
*
* Each kv pair receives a clone of `parentState`. If descent isn't stopped,
* the key and value subtrees receive independent clones of the kv-visit's
* post-visit state.
*
* @internal
*/
function walkMap(cbor, level, parentState, visitor) {
	for (const entry of cbor.value.entriesArray) {
		const { key, value } = entry;
		const [kvPostState, kvStop] = visitor({
			type: "keyvalue",
			key,
			value
		}, level + 1, { type: "map_key_value" }, cloneState(parentState));
		if (kvStop) continue;
		walkInternal(key, level + 1, { type: "map_key" }, cloneState(kvPostState), visitor);
		walkInternal(value, level + 1, { type: "map_value" }, cloneState(kvPostState), visitor);
	}
}
/**
* Walk a tagged value's content. The content visit receives a clone of
* `parentState`.
*
* @internal
*/
function walkTagged(cbor, level, parentState, visitor) {
	walkInternal(cbor.value, level + 1, { type: "tagged_content" }, cloneState(parentState), visitor);
}
/**
* Copyright © 2023-2026 Blockchain Commons, LLC
*
*/
const MajorType = {
	Unsigned: 0,
	Negative: 1,
	ByteString: 2,
	Text: 3,
	Array: 4,
	Map: 5,
	Tagged: 6,
	Simple: 7
};
const MajorTypeNames = {
	[MajorType.Unsigned]: "Unsigned",
	[MajorType.Negative]: "Negative",
	[MajorType.ByteString]: "ByteString",
	[MajorType.Text]: "Text",
	[MajorType.Array]: "Array",
	[MajorType.Map]: "Map",
	[MajorType.Tagged]: "Tagged",
	[MajorType.Simple]: "Simple"
};
const getMajorTypeName = (type) => MajorTypeNames[type];
const isCborNumber = (value) => {
	return typeof value === "number" || typeof value === "bigint";
};
const isCbor = (value) => {
	return value !== null && typeof value === "object" && "isCbor" in value && value.isCbor === true;
};
/**
* Type guard to check if value has taggedCbor method.
*/
/**
* Resolve a numeric/bigint tag value to a `Tag` object, looking up the
* canonical name from the global tags store (matches Rust's
* `try_into_tagged_value` returning the stored `Tag`). Falls back to a
* name-less `{ value }` if no name is registered — never synthesizes a
* placeholder `tag-${value}` string.
*/
const resolveTag = (value) => {
	const stored = getGlobalTagsStore().tagForValue(value);
	if (stored !== void 0) return stored;
	return { value };
};
const hasTaggedCbor = (value) => {
	return typeof value === "object" && value !== null && "taggedCbor" in value && typeof value.taggedCbor === "function";
};
/**
* Type guard to check if value has toCbor method.
*/
const hasToCbor = (value) => {
	return typeof value === "object" && value !== null && "toCbor" in value && typeof value.toCbor === "function";
};
/**
* Convert any value to a CBOR representation.
* Matches Rust's `From` trait implementations for CBOR.
*/
const cbor = (value) => {
	if (isCbor(value) && "toData" in value) return value;
	if (isCbor(value)) return attachMethods(value);
	let result;
	if (isCborNumber(value)) {
		if (typeof value === "number" && Number.isNaN(value)) result = {
			isCbor: true,
			type: MajorType.Simple,
			value: {
				type: "Float",
				value: NaN
			}
		};
		else if (typeof value === "number" && hasFractionalPart(value)) result = {
			isCbor: true,
			type: MajorType.Simple,
			value: {
				type: "Float",
				value
			}
		};
		else if (value == Infinity) result = {
			isCbor: true,
			type: MajorType.Simple,
			value: {
				type: "Float",
				value: Infinity
			}
		};
		else if (value == -Infinity) result = {
			isCbor: true,
			type: MajorType.Simple,
			value: {
				type: "Float",
				value: -Infinity
			}
		};
		else if (typeof value === "number" && !Number.isSafeInteger(value)) {
			const big = BigInt(value);
			if (big >= 0n && big <= 18446744073709551615n) result = {
				isCbor: true,
				type: MajorType.Unsigned,
				value: big
			};
			else if (big < 0n && big >= -18446744073709551616n) result = {
				isCbor: true,
				type: MajorType.Negative,
				value: -big - 1n
			};
			else result = {
				isCbor: true,
				type: MajorType.Simple,
				value: {
					type: "Float",
					value
				}
			};
		} else if (typeof value === "bigint" && (value > 18446744073709551615n || value < -18446744073709551616n)) throw new CborError({ type: "OutOfRange" });
		else if (value < 0) {
			if (typeof value === "bigint") result = {
				isCbor: true,
				type: MajorType.Negative,
				value: -value - 1n
			};
			else result = {
				isCbor: true,
				type: MajorType.Negative,
				value: -value - 1
			};
		} else result = {
			isCbor: true,
			type: MajorType.Unsigned,
			value
		};
	} else if (typeof value === "string") {
		const normalized = value.normalize("NFC");
		result = {
			isCbor: true,
			type: MajorType.Text,
			value: normalized
		};
	} else if (value === null || value === void 0) result = {
		isCbor: true,
		type: MajorType.Simple,
		value: { type: "Null" }
	};
	else if (value === true) result = {
		isCbor: true,
		type: MajorType.Simple,
		value: { type: "True" }
	};
	else if (value === false) result = {
		isCbor: true,
		type: MajorType.Simple,
		value: { type: "False" }
	};
	else if (Array.isArray(value)) result = {
		isCbor: true,
		type: MajorType.Array,
		value: value.map(cbor)
	};
	else if (value instanceof Uint8Array) result = {
		isCbor: true,
		type: MajorType.ByteString,
		value
	};
	else if (value instanceof CborMap) result = {
		isCbor: true,
		type: MajorType.Map,
		value
	};
	else if (value instanceof Map) result = {
		isCbor: true,
		type: MajorType.Map,
		value: new CborMap(value)
	};
	else if (value instanceof Set) result = {
		isCbor: true,
		type: MajorType.Array,
		value: Array.from(value).map((v) => cbor(v))
	};
	else if (hasTaggedCbor(value)) return value.taggedCbor();
	else if (hasToCbor(value)) return value.toCbor();
	else if (typeof value === "object" && value !== null && "tag" in value && "value" in value) {
		const keys = Object.keys(value);
		const objValue = value;
		if (keys.length === 2 && keys.includes("tag") && keys.includes("value")) return taggedCbor(objValue.tag, objValue.value);
		const map = new CborMap();
		for (const [key, val] of Object.entries(value)) map.set(cbor(key), cbor(val));
		result = {
			isCbor: true,
			type: MajorType.Map,
			value: map
		};
	} else if (typeof value === "object" && value !== null) {
		const map = new CborMap();
		for (const [key, val] of Object.entries(value)) map.set(cbor(key), cbor(val));
		result = {
			isCbor: true,
			type: MajorType.Map,
			value: map
		};
	} else throw new CborError({
		type: "Custom",
		message: "Unsupported type for CBOR encoding"
	});
	return attachMethods(result);
};
/**
* Encode a CBOR value to binary data.
* Matches Rust's `CBOR::to_cbor_data()` method.
*
* Delegates to `@blockchaincommons/dcbor` — the canonical encoder — via the
* structural node bridge.
*/
const cborData = (value) => {
	const c = cbor(value);
	return delegating(() => encodeCbor(toNew(c)));
};
const encodeCbor$1 = (value) => {
	return cborData(cbor(value));
};
const taggedCbor = (tag, value) => {
	const tagNumber = typeof tag === "number" || typeof tag === "bigint" ? tag : Number(tag);
	return attachMethods({
		isCbor: true,
		type: MajorType.Tagged,
		tag: tagNumber,
		value: cbor(value)
	});
};
/**
* Attaches instance methods to a CBOR value.
* This enables method chaining like cbor.toHex() instead of Cbor.toHex(cbor).
* @internal
*/
const attachMethods = (obj) => {
	return Object.assign(obj, {
		toData() {
			return cborData(this);
		},
		toHex() {
			return bytesToHex(cborData(this));
		},
		toHexAnnotated(tagsStore) {
			tagsStore = tagsStore ?? getGlobalTagsStore();
			return hexOpt(this, {
				annotate: true,
				tagsStore
			});
		},
		toString() {
			return diagnosticOpt(this, { flat: true });
		},
		toDebugString() {
			return diagnosticOpt(this, { flat: false });
		},
		toDiagnostic() {
			return diagnosticOpt(this, { flat: false });
		},
		toDiagnosticAnnotated() {
			return diagnosticOpt(this, { annotate: true });
		},
		isByteString() {
			return this.type === MajorType.ByteString;
		},
		isText() {
			return this.type === MajorType.Text;
		},
		isArray() {
			return this.type === MajorType.Array;
		},
		isMap() {
			return this.type === MajorType.Map;
		},
		isTagged() {
			return this.type === MajorType.Tagged;
		},
		isSimple() {
			return this.type === MajorType.Simple;
		},
		isBool() {
			return this.type === MajorType.Simple && (this.value.type === "True" || this.value.type === "False");
		},
		isTrue() {
			return this.type === MajorType.Simple && this.value.type === "True";
		},
		isFalse() {
			return this.type === MajorType.Simple && this.value.type === "False";
		},
		isNull() {
			return this.type === MajorType.Simple && this.value.type === "Null";
		},
		isNumber() {
			if (this.type === MajorType.Unsigned || this.type === MajorType.Negative) return true;
			if (this.type === MajorType.Simple) return isFloat$1(this.value);
			return false;
		},
		isInteger() {
			return this.type === MajorType.Unsigned || this.type === MajorType.Negative;
		},
		isUnsigned() {
			return this.type === MajorType.Unsigned;
		},
		isNegative() {
			return this.type === MajorType.Negative;
		},
		isNaN() {
			return this.type === MajorType.Simple && this.value.type === "Float" && Number.isNaN(this.value.value);
		},
		isFloat() {
			return this.type === MajorType.Simple && isFloat$1(this.value);
		},
		asByteString() {
			return this.type === MajorType.ByteString ? this.value : void 0;
		},
		asText() {
			return this.type === MajorType.Text ? this.value : void 0;
		},
		asArray() {
			return this.type === MajorType.Array ? this.value : void 0;
		},
		asMap() {
			return this.type === MajorType.Map ? this.value : void 0;
		},
		asTagged() {
			if (this.type !== MajorType.Tagged) return;
			return [resolveTag(this.tag), this.value];
		},
		asBool() {
			if (this.type !== MajorType.Simple) return void 0;
			if (this.value.type === "True") return true;
			if (this.value.type === "False") return false;
		},
		asInteger() {
			if (this.type === MajorType.Unsigned) return this.value;
			else if (this.type === MajorType.Negative) {
				if (typeof this.value === "bigint") return -this.value - 1n;
				else return -this.value - 1;
			}
		},
		asNumber() {
			if (this.type === MajorType.Unsigned) return this.value;
			else if (this.type === MajorType.Negative) {
				if (typeof this.value === "bigint") return -this.value - 1n;
				else return -this.value - 1;
			} else if (this.type === MajorType.Simple && isFloat$1(this.value)) return this.value.value;
		},
		asSimpleValue() {
			return this.type === MajorType.Simple ? this.value : void 0;
		},
		toByteString() {
			if (this.type !== MajorType.ByteString) throw new TypeError(`Cannot convert CBOR to ByteString: expected ByteString type, got ${getMajorTypeName(this.type)}`);
			return this.value;
		},
		toText() {
			if (this.type !== MajorType.Text) throw new TypeError(`Cannot convert CBOR to Text: expected Text type, got ${getMajorTypeName(this.type)}`);
			return this.value;
		},
		toArray() {
			if (this.type !== MajorType.Array) throw new TypeError(`Cannot convert CBOR to Array: expected Array type, got ${getMajorTypeName(this.type)}`);
			return this.value;
		},
		toMap() {
			if (this.type !== MajorType.Map) throw new TypeError(`Cannot convert CBOR to Map: expected Map type, got ${getMajorTypeName(this.type)}`);
			return this.value;
		},
		toTagged() {
			if (this.type !== MajorType.Tagged) throw new TypeError(`Cannot convert CBOR to Tagged: expected Tagged type, got ${getMajorTypeName(this.type)}`);
			return [resolveTag(this.tag), this.value];
		},
		toBool() {
			const result = this.asBool();
			if (result === void 0) throw new TypeError(`Cannot convert CBOR to boolean: expected Simple(True/False) type, got ${getMajorTypeName(this.type)}`);
			return result;
		},
		toInteger() {
			const result = this.asInteger();
			if (result === void 0) throw new TypeError(`Cannot convert CBOR to integer: expected Unsigned or Negative type, got ${getMajorTypeName(this.type)}`);
			return result;
		},
		toNumber() {
			const result = this.asNumber();
			if (result === void 0) throw new TypeError(`Cannot convert CBOR to number: expected Unsigned, Negative, or Float type, got ${getMajorTypeName(this.type)}`);
			return result;
		},
		toSimpleValue() {
			if (this.type !== MajorType.Simple) throw new TypeError(`Cannot convert CBOR to Simple: expected Simple type, got ${getMajorTypeName(this.type)}`);
			return this.value;
		},
		expectTag(expectedTag) {
			if (this.type !== MajorType.Tagged) throw new CborError({ type: "WrongType" });
			const expected = typeof expectedTag === "object" && "value" in expectedTag ? expectedTag : { value: expectedTag };
			if (!tagValuesEqual(this.tag, expected.value)) throw new CborError({
				type: "WrongTag",
				expected,
				actual: { value: this.tag }
			});
			return this.value;
		},
		walk(initialState, visitor) {
			walk(this, initialState, visitor);
		},
		validateTag(expectedTags) {
			if (this.type !== MajorType.Tagged) throw new CborError({ type: "WrongType" });
			const tagValue = this.tag;
			const matchingTag = expectedTags.find((t) => tagValuesEqual(t.value, tagValue));
			if (matchingTag === void 0) throw new CborError({
				type: "WrongTag",
				expected: expectedTags[0],
				actual: { value: tagValue }
			});
			return matchingTag;
		},
		untagged() {
			if (this.type !== MajorType.Tagged) throw new CborError({ type: "WrongType" });
			return this.value;
		}
	});
};
attachMethods({
	isCbor: true,
	type: MajorType.Simple,
	value: { type: "False" }
}), attachMethods({
	isCbor: true,
	type: MajorType.Simple,
	value: { type: "True" }
}), attachMethods({
	isCbor: true,
	type: MajorType.Simple,
	value: { type: "Null" }
}), attachMethods({
	isCbor: true,
	type: MajorType.Simple,
	value: {
		type: "Float",
		value: NaN
	}
});
/**
* Copyright © 2023-2026 Blockchain Commons, LLC
*
*
* Tagged CBOR encoding support.
*
* This module provides the `CborTaggedEncodable` interface, which enables types to
* be encoded as tagged CBOR values.
*
* CBOR tags provide semantic information about the encoded data. For example,
* tag 1 is used for dates, indicating that the value should be interpreted
* as a timestamp. The dCBOR library ensures these tags are encoded
* deterministically.
*
* This interface enables seamless encoding of TypeScript types to properly tagged CBOR
* values.
*
* @module cbor-tagged-encodable
*/
/**
* Helper function to create tagged CBOR from an encodable object.
*
* Uses the first tag from cborTags().
*
* @param encodable - Object implementing CborTaggedEncodable
* @returns Tagged CBOR value
*/
const createTaggedCbor = (encodable) => {
	const tags = encodable.cborTags();
	if (tags.length === 0) throw new CborError({
		type: "Custom",
		message: "No tags defined for this type"
	});
	const tag = tags[0];
	if (tag === void 0) throw new CborError({
		type: "Custom",
		message: "Tag is undefined"
	});
	const untagged = encodable.untaggedCbor();
	return attachMethods({
		isCbor: true,
		type: MajorType.Tagged,
		tag: tag.value,
		value: untagged
	});
};
/**
* Copyright © 2023-2026 Blockchain Commons, LLC
*
*
* Tagged CBOR decoding support.
*
* This module provides the `CborTaggedDecodable` interface, which enables types to
* be decoded from tagged CBOR values.
*
* Tagged CBOR values include semantic information about how to interpret the
* data. This interface allows TypeScript types to verify that incoming CBOR data has the
* expected tag(s) and to decode the data appropriately.
*
* @module cbor-tagged-decodable
*/
/**
* Helper function to validate that a CBOR value has one of the expected tags.
*
* @param cbor - CBOR value to validate
* @param expectedTags - Array of valid tags
* @returns The matching tag
* @throws Error if the value is not tagged or has an unexpected tag
*/
const validateTag = (cbor, expectedTags) => {
	if (cbor.type !== MajorType.Tagged) throw new CborError({ type: "WrongType" });
	const tagValue = cbor.tag;
	const matchingTag = expectedTags.find((t) => tagValuesEqual(t.value, tagValue));
	if (matchingTag === void 0) throw new CborError({
		type: "WrongTag",
		expected: expectedTags[0],
		actual: { value: tagValue }
	});
	return matchingTag;
};
/**
* Helper function to extract the content from a tagged CBOR value.
*
* @param cbor - Tagged CBOR value
* @returns The untagged content
* @throws Error if the value is not tagged
*/
const extractTaggedContent = (cbor) => {
	if (cbor.type !== MajorType.Tagged) throw new CborError({ type: "WrongType" });
	return cbor.value;
};
/**
* Copyright © 2023-2026 Blockchain Commons, LLC
*
*
* Date/time support for CBOR with tag(1) encoding.
*
* A CBOR-friendly representation of a date and time.
*
* The `CborDate` type keeps the historical `@blockchaincommons/dcbor-compat` API
* (`fromTimestamp`/`timestamp()`/`fromDatetime`/`datetime()` alongside the
* tagged-CBOR protocol methods) but wraps the canonical
* `@blockchaincommons/dcbor` `CborDate`, which owns timestamp normalization
* (Rust `Date::from_timestamp` parity), strict RFC-3339 parsing, and
* ISO-8601 formatting.
*
* When encoded to CBOR, dates are represented as tag 1 followed by a numeric
* value representing the number of seconds since (or before) the Unix epoch
* (1970-01-01T00:00:00Z). The numeric value can be a positive or negative
* integer, or a floating-point value for dates with fractional seconds.
*
* @module date
*/
/**
* A CBOR-friendly representation of a date and time.
*
* When encoded to CBOR, dates are represented as tag 1 followed by a numeric
* value representing the number of seconds since (or before) the Unix epoch
* (1970-01-01T00:00:00Z). The numeric value can be a positive or negative
* integer, or a floating-point value for dates with fractional seconds.
*
* # Features
*
* - Supports UTC dates with optional fractional seconds
* - Provides convenient constructors for common date creation patterns
* - Implements the `CborTagged`, `CborTaggedEncodable`, and
*   `CborTaggedDecodable` interfaces
* - Supports arithmetic operations with durations and between dates
*
* @example
* ```typescript
* import { CborDate } from './date';
*
* // Create a date from a timestamp (seconds since Unix epoch)
* const date = CborDate.fromTimestamp(1675854714.0);
*
* // Create a date from year, month, day
* const date2 = CborDate.fromYmd(2023, 2, 8);
*
* // Convert to CBOR
* const cborValue = date.taggedCbor();
*
* // Decode from CBOR
* const decoded = CborDate.fromTaggedCbor(cborValue);
* ```
*/
var CborDate = class CborDate {
	/**
	* The wrapped canonical `@blockchaincommons/dcbor` date. It stores the
	* normalized timestamp (seconds since the Unix epoch as an `f64`), so
	* encoding, equality, and ordering match the Rust reference exactly.
	*/
	_date;
	/**
	* Creates a new `CborDate` from the given JavaScript `Date`.
	*
	* @param dateTime - A `Date` instance to wrap
	* @returns A new `CborDate` instance
	*
	* @example
	* ```typescript
	* const datetime = new Date();
	* const date = CborDate.fromDatetime(datetime);
	* ```
	*/
	static fromDatetime(dateTime) {
		return new CborDate(delegating(() => CborDate$1.fromDate(dateTime)));
	}
	/**
	* Creates a new `CborDate` from year, month, and day components.
	*
	* This method creates a new `CborDate` with the time set to 00:00:00 UTC.
	*
	* @param year - The year component (e.g., 2023)
	* @param month - The month component (1-12)
	* @param day - The day component (1-31)
	* @returns A new `CborDate` instance
	*
	* @example
	* ```typescript
	* // Create February 8, 2023
	* const date = CborDate.fromYmd(2023, 2, 8);
	* ```
	*/
	static fromYmd(year, month, day) {
		return new CborDate(delegating(() => CborDate$1.fromYmd(year, month, day)));
	}
	/**
	* Creates a new `CborDate` from year, month, day, hour, minute, and second
	* components.
	*
	* @param year - The year component (e.g., 2023)
	* @param month - The month component (1-12)
	* @param day - The day component (1-31)
	* @param hour - The hour component (0-23)
	* @param minute - The minute component (0-59)
	* @param second - The second component (0-59)
	* @returns A new `CborDate` instance
	*
	* @example
	* ```typescript
	* // Create February 8, 2023, 15:30:45 UTC
	* const date = CborDate.fromYmdHms(2023, 2, 8, 15, 30, 45);
	* ```
	*/
	static fromYmdHms(year, month, day, hour, minute, second) {
		return new CborDate(delegating(() => CborDate$1.fromYmdHms(year, month, day, hour, minute, second)));
	}
	/**
	* Creates a new `CborDate` from seconds since (or before) the Unix epoch.
	*
	* The value is normalized on construction (matching Rust's
	* `Date::from_timestamp`) so the stored value — and thus its encoding,
	* equality, and ordering — matches the reference.
	*
	* @param secondsSinceUnixEpoch - Seconds from the Unix epoch (positive or
	*   negative), which can include a fractional part for sub-second
	*   precision
	* @returns A new `CborDate` instance
	*
	* @example
	* ```typescript
	* // Create a date from a timestamp
	* const date = CborDate.fromTimestamp(1675854714.0);
	*
	* // Create a date one second before the Unix epoch
	* const beforeEpoch = CborDate.fromTimestamp(-1.0);
	*
	* // Create a date with fractional seconds
	* const withFraction = CborDate.fromTimestamp(1675854714.5);
	* ```
	*/
	static fromTimestamp(secondsSinceUnixEpoch) {
		return new CborDate(delegating(() => CborDate$1.fromEpochSeconds(secondsSinceUnixEpoch)));
	}
	/**
	* Creates a new `CborDate` from a string containing an ISO-8601 (RFC-3339)
	* date (with or without time).
	*
	* Accepts only strict RFC-3339 date-times (with seconds and an explicit
	* `Z`/±HH:MM offset) or bare `YYYY-MM-DD` dates (read as UTC midnight),
	* matching Rust's `Date::from_string`.
	*
	* @param value - A string containing a date or date-time in ISO-8601/RFC-3339
	*   format
	* @returns A new `CborDate` instance if parsing succeeds
	* @throws Error if the string cannot be parsed as a valid date or date-time
	*
	* @example
	* ```typescript
	* // Parse a date-time string
	* const date = CborDate.fromString("2023-02-08T15:30:45Z");
	*
	* // Parse a date-only string (time will be set to 00:00:00)
	* const date2 = CborDate.fromString("2023-02-08");
	* ```
	*/
	static fromString(value) {
		return new CborDate(delegating(() => CborDate$1.fromString(value)));
	}
	/**
	* Creates a new `CborDate` containing the current date and time.
	*
	* @returns A new `CborDate` instance representing the current UTC date and time
	*
	* @example
	* ```typescript
	* const now = CborDate.now();
	* ```
	*/
	static now() {
		return new CborDate(delegating(() => CborDate$1.now()));
	}
	/**
	* Creates a new `CborDate` containing the current date and time plus the given
	* duration.
	*
	* @param durationMs - The duration in milliseconds to add to the current time
	* @returns A new `CborDate` instance representing the current UTC date and time plus
	* the duration
	*
	* @example
	* ```typescript
	* // Get a date 1 hour from now
	* const oneHourLater = CborDate.withDurationFromNow(3600 * 1000);
	* ```
	*/
	static withDurationFromNow(durationMs) {
		const future = new Date((/* @__PURE__ */ new Date()).getTime() + durationMs);
		return CborDate.fromDatetime(future);
	}
	/**
	* Returns the underlying JavaScript `Date` object.
	*
	* @returns The wrapped `Date` instance
	*
	* @example
	* ```typescript
	* const date = CborDate.now();
	* const datetime = date.datetime();
	* const year = datetime.getFullYear();
	* ```
	*/
	datetime() {
		return this._date.toDate();
	}
	/**
	* Returns the `CborDate` as the number of seconds since the Unix epoch.
	*
	* Negative values represent times before the epoch. The fractional
	* part represents sub-second precision.
	*
	* @returns Seconds since the Unix epoch as a `number`
	*
	* @example
	* ```typescript
	* const date = CborDate.fromYmd(2023, 2, 8);
	* const timestamp = date.timestamp();
	* ```
	*/
	timestamp() {
		return this._date.epochSeconds;
	}
	/**
	* Add seconds to this date.
	*
	* @param seconds - Seconds to add (can be fractional)
	* @returns New CborDate instance
	*
	* @example
	* ```typescript
	* const date = CborDate.fromYmd(2022, 3, 21);
	* const tomorrow = date.add(24 * 60 * 60);
	* ```
	*/
	add(seconds) {
		return CborDate.fromTimestamp(this.timestamp() + seconds);
	}
	/**
	* Subtract seconds from this date.
	*
	* @param seconds - Seconds to subtract (can be fractional)
	* @returns New CborDate instance
	*
	* @example
	* ```typescript
	* const date = CborDate.fromYmd(2022, 3, 21);
	* const yesterday = date.subtract(24 * 60 * 60);
	* ```
	*/
	subtract(seconds) {
		return CborDate.fromTimestamp(this.timestamp() - seconds);
	}
	/**
	* Get the difference in seconds between this date and another.
	*
	* @param other - Other CborDate to compare with
	* @returns Difference in seconds (this - other)
	*
	* @example
	* ```typescript
	* const date1 = CborDate.fromYmd(2022, 3, 22);
	* const date2 = CborDate.fromYmd(2022, 3, 21);
	* const diff = date1.difference(date2);
	* // Returns 86400 (one day in seconds)
	* ```
	*/
	difference(other) {
		return this.timestamp() - other.timestamp();
	}
	/**
	* Implementation of the `CborTagged` interface for `CborDate`.
	*
	* This implementation specifies that `CborDate` values are tagged with CBOR tag 1,
	* which is the standard CBOR tag for date/time values represented as seconds
	* since the Unix epoch per RFC 8949.
	*
	* @returns A vector containing tag 1
	*/
	cborTags() {
		return [createTag(1, "date")];
	}
	/**
	* Implementation of the `CborTaggedEncodable` interface for `CborDate`.
	*
	* Converts this `CborDate` to an untagged CBOR value.
	*
	* The date is converted to a numeric value representing the number of
	* seconds since the Unix epoch. This value may be an integer or a
	* floating-point number, depending on whether the date has fractional
	* seconds.
	*
	* @returns A CBOR value representing the timestamp
	*/
	untaggedCbor() {
		return cbor(this.timestamp());
	}
	/**
	* Converts this `CborDate` to a tagged CBOR value with tag 1.
	*
	* @returns Tagged CBOR value
	*/
	taggedCbor() {
		return createTaggedCbor(this);
	}
	/**
	* Implementation of the `CborTaggedDecodable` interface for `CborDate`.
	*
	* Creates a `CborDate` from an untagged CBOR value.
	*
	* The CBOR value must be a numeric value (integer or floating-point)
	* representing the number of seconds since the Unix epoch.
	*
	* @param cbor - The untagged CBOR value
	* @returns This CborDate instance (mutated)
	* @throws Error if the CBOR value is not a valid timestamp
	*/
	fromUntaggedCbor(cbor) {
		let timestamp;
		switch (cbor.type) {
			case MajorType.Unsigned:
				timestamp = typeof cbor.value === "number" ? cbor.value : Number(cbor.value);
				break;
			case MajorType.Negative:
				if (typeof cbor.value === "bigint") timestamp = Number(-cbor.value - 1n);
				else timestamp = -cbor.value - 1;
				break;
			case MajorType.Simple:
				if (cbor.value.type === "Float") timestamp = cbor.value.value;
				else throw new CborError({ type: "WrongType" });
				break;
			default: throw new CborError({ type: "WrongType" });
		}
		this._date = delegating(() => CborDate$1.fromEpochSeconds(timestamp));
		return this;
	}
	/**
	* Creates a `CborDate` from a tagged CBOR value with tag 1.
	*
	* @param cbor - Tagged CBOR value
	* @returns This CborDate instance (mutated)
	* @throws Error if the CBOR value has the wrong tag or cannot be decoded
	*/
	fromTaggedCbor(cbor) {
		const expectedTags = this.cborTags();
		validateTag(cbor, expectedTags);
		const content = extractTaggedContent(cbor);
		return this.fromUntaggedCbor(content);
	}
	/**
	* Static method to create a CborDate from tagged CBOR.
	*
	* @param cbor - Tagged CBOR value
	* @returns New CborDate instance
	*/
	static fromTaggedCbor(cbor) {
		return new CborDate().fromTaggedCbor(cbor);
	}
	/**
	* Static method to create a CborDate from untagged CBOR.
	*
	* @param cbor - Untagged CBOR value
	* @returns New CborDate instance
	*/
	static fromUntaggedCbor(cbor) {
		return new CborDate().fromUntaggedCbor(cbor);
	}
	/**
	* Implementation of the `toString` method for `CborDate`.
	*
	* This implementation provides a string representation of a `CborDate` in ISO-8601
	* format. For dates with time exactly at midnight (00:00:00), only the date
	* part is shown. For other times, a full date-time string is shown.
	*
	* @returns String representation in ISO-8601 format
	*
	* @example
	* ```typescript
	* // A date at midnight will display as just the date
	* const date = CborDate.fromYmd(2023, 2, 8);
	* // Returns "2023-02-08"
	* console.log(date.toString());
	*
	* // A date with time will display as date and time
	* const date2 = CborDate.fromYmdHms(2023, 2, 8, 15, 30, 45);
	* // Returns "2023-02-08T15:30:45Z"
	* console.log(date2.toString());
	* ```
	*/
	toString() {
		return this._date.toString();
	}
	/**
	* Compare two dates for equality.
	*
	* @param other - Other CborDate to compare
	* @returns true if dates represent the same moment in time
	*/
	equals(other) {
		return this.timestamp() === other.timestamp();
	}
	/**
	* Compare two dates.
	*
	* @param other - Other CborDate to compare
	* @returns -1 if this < other, 0 if equal, 1 if this > other
	*/
	compare(other) {
		if (this.timestamp() < other.timestamp()) return -1;
		if (this.timestamp() > other.timestamp()) return 1;
		return 0;
	}
	/**
	* Convert to JSON (returns ISO 8601 string).
	*
	* @returns ISO 8601 string
	*/
	toJSON() {
		return this.toString();
	}
	constructor(date) {
		this._date = date ?? CborDate$1.now();
	}
};
/**
* Decode a BigUint from an untagged CBOR byte string.
*
* Matches Rust's `biguint_from_untagged_cbor()`.
*
* This function is intended for use in tag summarizers where the tag has
* already been stripped. It expects a CBOR byte string representing the
* big-endian magnitude of a positive bignum (tag 2 content).
*
* Enforces canonical encoding: no leading zero bytes (except empty for zero).
*
* @param cbor - A CBOR value that should be a byte string
* @returns Non-negative bigint
* @throws CborError with type WrongType if not a byte string
* @throws CborError with type NonCanonicalNumeric if encoding is non-canonical
*/
function biguintFromUntaggedCbor(cbor) {
	return delegating(() => biguintFromUntaggedCbor$1(toNew(cbor)));
}
/**
* Decode a BigInt from an untagged CBOR byte string for a negative bignum.
*
* Matches Rust's `bigint_from_negative_untagged_cbor()`.
*
* This function is intended for use in tag summarizers where the tag has
* already been stripped. It expects a CBOR byte string representing `n` where
* the actual value is `-1 - n` (tag 3 content per RFC 8949).
*
* Enforces canonical encoding: no leading zero bytes (except single `0x00`
* for -1).
*
* @param cbor - A CBOR value that should be a byte string
* @returns Negative bigint
* @throws CborError with type WrongType if not a byte string
* @throws CborError with type NonCanonicalNumeric if encoding is non-canonical
*/
function bigintFromNegativeUntaggedCbor(cbor) {
	return delegating(() => bigintFromNegativeUntaggedCbor$1(toNew(cbor)));
}
/**
* Name for tag 2 (positive bignum).
* Matches Rust's `TAG_NAME_POSITIVE_BIGNUM`.
*/
const TAG_NAME_POSITIVE_BIGNUM = "positive-bignum";
/**
* Name for tag 3 (negative bignum).
* Matches Rust's `TAG_NAME_NEGATIVE_BIGNUM`.
*/
const TAG_NAME_NEGATIVE_BIGNUM = "negative-bignum";
const TAG_NAME_DATE = "date";
/**
* Register standard tags in a specific tags store.
* Matches Rust's register_tags_in() function.
*
* @param tagsStore - The tags store to register tags into
*/
const registerTagsIn$1 = (tagsStore) => {
	const tags = [createTag(1, TAG_NAME_DATE)];
	tagsStore.insertAll(tags);
	tagsStore.setSummarizer(1, (untaggedCbor, _flat) => {
		try {
			return {
				ok: true,
				value: CborDate.fromUntaggedCbor(untaggedCbor).toString()
			};
		} catch (e) {
			return {
				ok: false,
				error: {
					type: "Custom",
					message: e instanceof Error ? e.message : String(e)
				}
			};
		}
	});
	const biguintTag = createTag(2, TAG_NAME_POSITIVE_BIGNUM);
	const bigintTag = createTag(3, TAG_NAME_NEGATIVE_BIGNUM);
	tagsStore.insertAll([biguintTag, bigintTag]);
	tagsStore.setSummarizer(2, (untaggedCbor, _flat) => {
		try {
			return {
				ok: true,
				value: `bignum(${biguintFromUntaggedCbor(untaggedCbor)})`
			};
		} catch (e) {
			return {
				ok: false,
				error: {
					type: "Custom",
					message: e instanceof Error ? e.message : String(e)
				}
			};
		}
	});
	tagsStore.setSummarizer(3, (untaggedCbor, _flat) => {
		try {
			return {
				ok: true,
				value: `bignum(${bigintFromNegativeUntaggedCbor(untaggedCbor)})`
			};
		} catch (e) {
			return {
				ok: false,
				error: {
					type: "Custom",
					message: e instanceof Error ? e.message : String(e)
				}
			};
		}
	});
};
//#endregion
//#region src/tags-registry.ts
/**
* Copyright © 2023-2026 Blockchain Commons, LLC
*
*
* CBOR Tags Registry
*
* This is a 1:1 port of the Rust bc-tags-rust implementation.
*
* @see https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md
*
* As of August 13 2022, the [IANA registry of CBOR tags](https://www.iana.org/assignments/cbor-tags/cbor-tags.xhtml)
* has the following low-numbered values available:
*
* One byte encoding: 6-15, 19-20
* Two byte encoding: 48-51, 53, 55-60, 62, 88-95, 99, 102, 105-109, 113-119,
* 128-255
*
* Tags in the range 0-23 require "standards action" for the IANA to recognize.
* Tags in the range 24-32767 require a specification to reserve.
* Tags in the range 24-255 only require two bytes to encode.
* Higher numbered tags are first-come, first-served.
*/
const URI = createTag(32, "url");
const UUID = createTag(37, "uuid");
const ENCODED_CBOR = createTag(24, "encoded-cbor");
const ENVELOPE = createTag(200, "envelope");
const LEAF = createTag(201, "leaf");
const JSON = createTag(262, "json");
const KNOWN_VALUE = createTag(4e4, "known-value");
const DIGEST = createTag(40001, "digest");
const ENCRYPTED = createTag(40002, "encrypted");
const COMPRESSED = createTag(40003, "compressed");
const REQUEST = createTag(40004, "request");
const RESPONSE = createTag(40005, "response");
const FUNCTION = createTag(40006, "function");
const PARAMETER = createTag(40007, "parameter");
const PLACEHOLDER = createTag(40008, "placeholder");
const REPLACEMENT = createTag(40009, "replacement");
const X25519_PRIVATE_KEY = createTag(40010, "agreement-private-key");
const X25519_PUBLIC_KEY = createTag(40011, "agreement-public-key");
const ARID = createTag(40012, "arid");
const PRIVATE_KEYS = createTag(40013, "crypto-prvkeys");
const NONCE = createTag(40014, "nonce");
const PASSWORD = createTag(40015, "password");
const PRIVATE_KEY_BASE = createTag(40016, "crypto-prvkey-base");
const PUBLIC_KEYS = createTag(40017, "crypto-pubkeys");
const SALT = createTag(40018, "salt");
const SEALED_MESSAGE = createTag(40019, "crypto-sealed");
const SIGNATURE = createTag(40020, "signature");
const SIGNING_PRIVATE_KEY = createTag(40021, "signing-private-key");
const SIGNING_PUBLIC_KEY = createTag(40022, "signing-public-key");
const SYMMETRIC_KEY = createTag(40023, "crypto-key");
const XID = createTag(40024, "xid");
const REFERENCE = createTag(40025, "reference");
const EVENT = createTag(40026, "event");
const ENCRYPTED_KEY = createTag(40027, "encrypted-key");
const MLKEM_PRIVATE_KEY = createTag(40100, "mlkem-private-key");
const MLKEM_PUBLIC_KEY = createTag(40101, "mlkem-public-key");
const MLKEM_CIPHERTEXT = createTag(40102, "mlkem-ciphertext");
const MLDSA_PRIVATE_KEY = createTag(40103, "mldsa-private-key");
const MLDSA_PUBLIC_KEY = createTag(40104, "mldsa-public-key");
const MLDSA_SIGNATURE = createTag(40105, "mldsa-signature");
const SEED = createTag(40300, "seed");
const HDKEY = createTag(40303, "hdkey");
const DERIVATION_PATH = createTag(40304, "keypath");
const USE_INFO = createTag(40305, "coin-info");
const EC_KEY = createTag(40306, "eckey");
const ADDRESS = createTag(40307, "address");
const OUTPUT_DESCRIPTOR = createTag(40308, "output-descriptor");
const SSKR_SHARE = createTag(40309, "sskr");
const PSBT = createTag(40310, "psbt");
const ACCOUNT_DESCRIPTOR = createTag(40311, "account-descriptor");
const SSH_TEXT_PRIVATE_KEY = createTag(40800, "ssh-private");
const SSH_TEXT_PUBLIC_KEY = createTag(40801, "ssh-public");
const SSH_TEXT_SIGNATURE = createTag(40802, "ssh-signature");
const SSH_TEXT_CERTIFICATE = createTag(40803, "ssh-certificate");
const PROVENANCE_MARK = createTag(1347571542, "provenance");
const SEED_V1 = createTag(300, "crypto-seed");
const EC_KEY_V1 = createTag(306, "crypto-eckey");
const SSKR_SHARE_V1 = createTag(309, "crypto-sskr");
const HDKEY_V1 = createTag(303, "crypto-hdkey");
const DERIVATION_PATH_V1 = createTag(304, "crypto-keypath");
const USE_INFO_V1 = createTag(305, "crypto-coin-info");
const OUTPUT_DESCRIPTOR_V1 = createTag(307, "crypto-output");
const PSBT_V1 = createTag(310, "crypto-psbt");
const ACCOUNT_V1 = createTag(311, "crypto-account");
const OUTPUT_SCRIPT_HASH = createTag(400, "output-script-hash");
const OUTPUT_WITNESS_SCRIPT_HASH = createTag(401, "output-witness-script-hash");
const OUTPUT_PUBLIC_KEY = createTag(402, "output-public-key");
const OUTPUT_PUBLIC_KEY_HASH = createTag(403, "output-public-key-hash");
const OUTPUT_WITNESS_PUBLIC_KEY_HASH = createTag(404, "output-witness-public-key-hash");
const OUTPUT_COMBO = createTag(405, "output-combo");
const OUTPUT_MULTISIG = createTag(406, "output-multisig");
const OUTPUT_SORTED_MULTISIG = createTag(407, "output-sorted-multisig");
const OUTPUT_RAW_SCRIPT = createTag(408, "output-raw-script");
const OUTPUT_TAPROOT = createTag(409, "output-taproot");
const OUTPUT_COSIGNER = createTag(410, "output-cosigner");
/**
* Register all Blockchain Commons tags in a specific tags store.
* This matches the Rust function `register_tags_in()`.
*
* @param tagsStore - The tags store to register tags into
*/
function registerTagsIn(tagsStore) {
	registerTagsIn$1(tagsStore);
	const tags = [
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
		SEED_V1,
		EC_KEY_V1,
		SSKR_SHARE_V1,
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
		HDKEY_V1,
		DERIVATION_PATH_V1,
		USE_INFO_V1,
		OUTPUT_DESCRIPTOR_V1,
		PSBT_V1,
		ACCOUNT_V1,
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
		PROVENANCE_MARK
	];
	tagsStore.insertAll(tags);
}
/**
* Register all Blockchain Commons tags in the global tags store.
* This matches the Rust function `register_tags()`.
*
* This function is idempotent - calling it multiple times is safe.
*/
function registerTags() {
	registerTagsIn(getGlobalTagsStore());
}
//#endregion
export { ACCOUNT_DESCRIPTOR, ACCOUNT_V1, ADDRESS, ARID, COMPRESSED, DERIVATION_PATH, DERIVATION_PATH_V1, DIGEST, EC_KEY, EC_KEY_V1, ENCODED_CBOR, ENCRYPTED, ENCRYPTED_KEY, ENVELOPE, EVENT, FUNCTION, HDKEY, HDKEY_V1, JSON, KNOWN_VALUE, LEAF, MLDSA_PRIVATE_KEY, MLDSA_PUBLIC_KEY, MLDSA_SIGNATURE, MLKEM_CIPHERTEXT, MLKEM_PRIVATE_KEY, MLKEM_PUBLIC_KEY, NONCE, OUTPUT_COMBO, OUTPUT_COSIGNER, OUTPUT_DESCRIPTOR, OUTPUT_DESCRIPTOR_V1, OUTPUT_MULTISIG, OUTPUT_PUBLIC_KEY, OUTPUT_PUBLIC_KEY_HASH, OUTPUT_RAW_SCRIPT, OUTPUT_SCRIPT_HASH, OUTPUT_SORTED_MULTISIG, OUTPUT_TAPROOT, OUTPUT_WITNESS_PUBLIC_KEY_HASH, OUTPUT_WITNESS_SCRIPT_HASH, PARAMETER, PASSWORD, PLACEHOLDER, PRIVATE_KEYS, PRIVATE_KEY_BASE, PROVENANCE_MARK, PSBT, PSBT_V1, PUBLIC_KEYS, REFERENCE, REPLACEMENT, REQUEST, RESPONSE, SALT, SEALED_MESSAGE, SEED, SEED_V1, SIGNATURE, SIGNING_PRIVATE_KEY, SIGNING_PUBLIC_KEY, SSH_TEXT_CERTIFICATE, SSH_TEXT_PRIVATE_KEY, SSH_TEXT_PUBLIC_KEY, SSH_TEXT_SIGNATURE, SSKR_SHARE, SSKR_SHARE_V1, SYMMETRIC_KEY, URI, USE_INFO, USE_INFO_V1, UUID, X25519_PRIVATE_KEY, X25519_PUBLIC_KEY, XID, getGlobalTagsStore, registerTags, registerTagsIn };
