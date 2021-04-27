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
	| { result: 'alias_unavailable'; input: 'alias' }

type CheckAliasParams = {
	alias: string
	domain: string
	store: false
}

type StoreAliasParams = {
	alias: string
	domain: string
	original: string
	userId: number | null
	store: true
}

type CheckAliasSuccess = { result: 'success'; short: string }
type StoreAliasSuccess = CheckAliasSuccess & { id: number; original: string }
type CheckAliasResult = CheckAliasSuccess | AliasProblem
type StoreAliasResult = StoreAliasSuccess | AliasProblem

type ShortenProblem = UrlProblem | AliasProblem

export type ShortenResult =
	| { success: true; short: string; original: string; id: number }
	| { success: false; problems: ShortenProblem[] }

// Alias can contain only lower case letters and digits, and be up to 20 characters
const aliasRegex = /^[a-z0-9\-_]{1,20}$/m

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
		params: CheckAliasParams
	): Promise<CheckAliasResult>
	private async tryStoreAlias(
		params: StoreAliasParams
	): Promise<StoreAliasResult>
	private async tryStoreAlias(
		params: CheckAliasParams | StoreAliasParams
	): Promise<CheckAliasResult | StoreAliasResult> {
		const { alias, domain } = params
		if (!alias || !aliasRegex.test(alias)) {
			return { result: 'invalid_alias', input: 'alias' }
		}

		let short: string
		try {
			short = normalizeUrl(`${this.hostname}/${alias}`)
		} catch (_) {
			return { result: 'invalid_alias', input: 'alias' }
		}

		if (this.reservedURLs.some((r) => short.includes(r))) {
			return { result: 'invalid_alias', input: 'alias' }
		}

		if (!params.store) {
			return (await this.urlProvider.isAliasAvailable(alias, domain))
				? { result: 'success', short }
				: { result: 'alias_unavailable', input: 'alias' }
		} else {
			const { original, userId } = params
			const id = await this.urlProvider.tryStoreUrl(
				alias,
				original,
				domain,
				userId
			)
			return id
				? { result: 'success', short, id, original }
				: { result: 'alias_unavailable', input: 'alias' }
		}
	}

	private async generateAndStoreShortUrl(
		normalizedUrl: string,
		domain: string,
		userId: number | null
	): Promise<StoreAliasSuccess> {
		const generator = this.hashFunction(normalizedUrl)
		const maxAttempts = 100

		for (let attempts = 0; attempts < maxAttempts; attempts++) {
			const genNext = generator.next()
			if (genNext.done) {
				throw new Error(`hash function out of values`)
			} else {
				const alias = genNext.value
				// eslint-disable-next-line no-await-in-loop
				const normalizeAliasResult = await this.tryStoreAlias({
					alias,
					domain,
					original: normalizedUrl,
					userId,
					store: true
				})
				if (normalizeAliasResult.result === 'success') {
					return normalizeAliasResult
				}
			}
		}

		throw new Error(`couldn't generate short url in ${maxAttempts} attempts`)
	}

	public async shorten(
		url: string,
		userId: number | null,
		domain?: string,
		storeAuth?: boolean,
		alias?: string
	): Promise<ShortenResult> {
		const problems: ShortenProblem[] = []

		const urlResult = this.normalizeUrl(url, storeAuth)
		let success: StoreAliasSuccess | null = null

		if (urlResult.result !== 'success') {
			problems.push(urlResult)

			if (alias) {
				const aliasResult = await this.tryStoreAlias({
					alias,
					domain: domain ?? this.hostname,
					store: false
				})
				if (aliasResult.result !== 'success') {
					problems.push(aliasResult)
				}
			}
		} else {
			if (alias) {
				const aliasResult = await this.tryStoreAlias({
					alias,
					domain: domain ?? this.hostname,
					original: urlResult.normalizedUrl,
					userId,
					store: true
				})
				if (aliasResult.result === 'success') {
					success = aliasResult
				} else {
					problems.push(aliasResult)
				}
			} else {
				success = await this.generateAndStoreShortUrl(
					urlResult.normalizedUrl,
					domain ?? this.hostname,
					userId
				)
			}
		}

		if (success) {
			const { short, original, id } = success
			return {
				success: true,
				short,
				original,
				id
			}
		} else {
			return {
				success: false,
				problems
			}
		}
	}
}
