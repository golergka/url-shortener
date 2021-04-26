import { BinaryToTextEncoding, createHash } from 'crypto'

export type HashFunction = (
	original: string
) => Generator<string, void, unknown>

/** Stupid hash function for testing purposes */
export const identityHash: HashFunction = function* (original: string) {
	yield original
}

export function makeHashFunction(
	algorithm: string,
	encoding: BinaryToTextEncoding,
	length: number
): HashFunction {
	return function* (original: string) {
		let counter = 0
		while (true) {
			yield createHash(algorithm)
				.update(`${original}${counter}`)
				.digest(encoding)
				.slice(0, length)
				.toLowerCase()
			counter++
		}
	}
}

/* Default hash function, seems to be okay */
export const defaultHashFunction: HashFunction = makeHashFunction(
	'sha1',
	'base64',
	8
)
