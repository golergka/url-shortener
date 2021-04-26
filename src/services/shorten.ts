import normalizeUrl from 'normalize-url'
import { HashFunction } from '../hash_function'
import { UrlProvider } from '../providers/url'

type UrlProblem =
	| { result: 'invalid_url'; input: 'url' }
	| { result: 'auth_leaked'; fixedUrl: string; input: 'url' }

type NormalizeUrlResult =
	| { result: 'success'; normalizedUrl: string }
	| UrlProblem

type AliasProblem =
	| { result: 'invalid_alias'; input: 'alias' }
	| { result: 'alias_unavaiable'; input: 'alias' }

type CheckStoreAliasResult = { result: 'success'; short: string } | AliasProblem

type ShortenProblem = UrlProblem | AliasProblem

export type ShortenResult =
	| { success: true; short: string; original: string }
	| { success: false; problems: ShortenProblem[] }

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

	private normalizeUrl(url: string, storeAuth?: boolean): NormalizeUrlResult {
		const normalizeOptions: normalizeUrl.Options = {
			stripTextFragment: false,
			stripWWW: false,
			removeQueryParameters: []
		}

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
				return { result: 'auth_leaked', fixedUrl, input: 'url' }
			}

			if (parsedUrl.hostname.split('.').length < 2) {
				return { result: 'invalid_url', input: 'url' }
			}

			return { result: 'success', normalizedUrl }
		} catch (_) {
			return { result: 'invalid_url', input: 'url' }
		}
	}

	/** Checks alias for correctnes and attempts to store it, or just checks */
	private async tryStoreAlias(
		alias: string,
		domain: string,
		store: false
	): Promise<CheckStoreAliasResult>
	private async tryStoreAlias(
		alias: string,
		domain: string,
		normalizedUrl: string,
		store: true
	): Promise<CheckStoreAliasResult>
	private async tryStoreAlias(
		alias: string,
		domain: string,
		normalizedUrl: string | false
	): Promise<CheckStoreAliasResult> {
		// Alias can contain only lower case letters and digits, and be up to 20 characters
		const aliasRegex = /^[a-z0-9-_]{1,20}$/gm
		if (!aliasRegex.test(alias)) {
			return { result: 'invalid_alias', input: 'alias' }
		}

		let shortUrl: string
		try {
			shortUrl = normalizeUrl(`${this.hostname}/${alias}`)
		} catch (_) {
			return { result: 'invalid_alias', input: 'alias' }
		}

		if (this.reservedURLs.some((r) => shortUrl.includes(r))) {
			return { result: 'invalid_alias', input: 'alias' }
		}

		const storeResult = normalizedUrl
			? await this.urlProvider.tryStoreUrl(alias, normalizedUrl, domain)
			: await this.urlProvider.isShortAvailable(alias, domain)

		return storeResult
			? { result: 'success', short: shortUrl }
			: { result: 'alias_unavaiable', input: 'alias' }
	}

	private async generateAndStoreShortUrl(
		normalizedUrl: string,
		domain: string
	): Promise<string> {
		const generator = this.hashFunction(normalizedUrl)
		const maxAttempts = 100

		for (let attempts = 0; attempts < maxAttempts; attempts++) {
			const genNext = generator.next()
			if (genNext.done) {
				throw new Error(`hash function out of values`)
			} else {
				const alias = genNext.value
				// eslint-disable-next-line no-await-in-loop
				const normalizeAliasResult = await this.tryStoreAlias(
					alias,
					domain,
					normalizedUrl,
					true
				)
				if (normalizeAliasResult.result === 'success') {
					return normalizeAliasResult.short
				}
			}
		}

		throw new Error(`couldn't generate short url in ${maxAttempts} attempts`)
	}

	public async shorten(
		url: string,
		domain?: string,
		storeAuth?: boolean,
		alias?: string
	): Promise<ShortenResult> {
		const problems: ShortenProblem[] = []

		const urlResult = this.normalizeUrl(url, storeAuth)

		if (urlResult.result !== 'success') {
			problems.push(urlResult)
		}

		let short: string | null = null

		if (alias) {
			// I miss the Result monad and pattern matching
			const aliasResult =
				urlResult.result === 'success'
					? await this.tryStoreAlias(
							alias,
							domain ?? this.hostname,
							urlResult.normalizedUrl,
							true
					  )
					: await this.tryStoreAlias(alias, domain ?? this.hostname, false)

			if (aliasResult.result !== 'success') {
				problems.push(aliasResult)
			} else {
				;({ short } = aliasResult)
			}
		} else if (urlResult.result === 'success') {
			short = await this.generateAndStoreShortUrl(
				urlResult.normalizedUrl,
				domain ?? this.hostname
			)
		}

		if (urlResult.result === 'success' && short) {
			return {
				success: true,
				original: urlResult.normalizedUrl,
				short
			}
		} else {
			return {
				success: false,
				problems
			}
		}
	}
}
