export type HashFunction = (
	original: string
) => Generator<string, void, unknown>

/** Stupid hash function for testing purposes */
export const identityHash: HashFunction = function* (original: string) {
	yield original
}
