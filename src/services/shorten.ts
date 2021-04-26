import normalizeUrl from 'normalize-url'
import { HashFunction } from '../hash_function'
import { UrlProvider } from '../providers/url'

export type ShortenResult =
	| { result: 'success'; short: string; original: string }
	| { result: 'invalid_url' }
	| { result: 'auth_leaked'; fixedUrl: string }

const normalizeOptions: normalizeUrl.Options = {
	stripTextFragment: false,
	stripWWW: false,
	removeQueryParameters: []
}

export class ShortenService {
	private readonly reservedURLs: string[]

	constructor(
		private readonly urlProvider: UrlProvider,
		private readonly hashFunction: HashFunction,
		private readonly hostname: string,
		reservedPaths: string[]
	) {
		this.reservedURLs = reservedPaths.map((path) =>
			normalizeUrl(`${hostname}/${path}`)
		)
	}

	public async shorten(
		url: string,
		storeAuth?: boolean
	): Promise<ShortenResult> {
		let normalizedUrl
		try {
			normalizedUrl = normalizeUrl(url, {
				stripAuthentication: false, // We will handle it later
				...normalizeOptions
			})

			const parsedUrl = new URL(normalizedUrl)
			if (!storeAuth && (parsedUrl.username || parsedUrl.password)) {
				const fixedUrl = normalizeUrl(url, {
					stripAuthentication: true,
					...normalizeOptions
				})
				return { result: 'auth_leaked', fixedUrl }
			}
			if (parsedUrl.hostname.split('.').length < 2) {
				return { result: 'invalid_url' }
			}
		} catch (_) {
			return { result: 'invalid_url' }
		}

		const generator = this.hashFunction(normalizedUrl)
		let success
		let hash
		let short: string
		do {
			const genNext = generator.next()
			if (genNext.done) {
				throw new Error(`hash function out of values`)
			} else {
				hash = genNext.value
				short = normalizeUrl(`${this.hostname}/${hash}`)
				/* eslint-disable no-await-in-loop */
				success =
					this.reservedURLs.every((r) => !short.includes(r)) &&
					(await this.urlProvider.tryStoreUrl(hash, normalizedUrl))
				/* eslint-enable no-await-in-loop */
			}
		} while (!success)

		return {
			result: 'success',
			original: normalizedUrl,
			short
		}
	}
}
