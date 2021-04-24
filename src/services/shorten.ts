import normalizeUrl from 'normalize-url'
import { HashFunction } from '../hash_function'
import { UrlProvider } from '../providers/url'

export type ShortenResult =
	| { result: 'success'; short: string; original: string }
	| { result: 'invalid_url' }
	| { result: 'auth_leaked' }

export class ShortenService {
	constructor(
		private readonly urlProvider: UrlProvider,
		private readonly hashFunction: HashFunction
	) {}

	public async shorten(url: string, storeAuth?: boolean) {
		let normalizedUrl
		try {
			normalizedUrl = normalizeUrl(url, {
				stripAuthentication: false, // We will handle it later
				stripTextFragment: false,
				stripWWW: false,
				removeQueryParameters: []
			})

			const parsedUrl = new URL(normalizedUrl)
			if (!storeAuth && (parsedUrl.username || parsedUrl.password)) {
				return { result: 'auth_leaked' }
			}
		} catch (_) {
			return { result: 'invalid_url' }
		}

		const generator = this.hashFunction(normalizedUrl)
		let tryResult
		let short
		do {
			const genNext = generator.next()
			if (genNext.done) {
				throw new Error(`hash function out of values`)
			} else {
				short = genNext.value
				// eslint-disable-next-line no-await-in-loop
				tryResult = await this.urlProvider.tryStoreUrl(short, normalizedUrl)
			}
		} while (!tryResult)

		return {
			result: 'success',
			original: normalizedUrl,
			short
		}
	}
}
