import { Pool, PoolClient } from 'pg'
import Redis from 'ioredis'
import {
	getOriginalUrl,
	tryStoreUrl,
	getDomainId,
	getDomains,
	setUrlsUserId,
	setUrlAlias
} from './url.queries'

export class UrlProvider {
	constructor(
		private readonly db: Pool | PoolClient,
		private readonly redis?: Redis.Redis
	) {}

	makeRedisKey = (short: string, domainId: number): string =>
		`url:${short}:${domainId}`

	private domainCache: {
		[domain: string]: number
	} = {}

	public async getDomains(): Promise<string[]> {
		const domains = await getDomains.run(undefined, this.db)
		domains.forEach(({ domain, id }) => (this.domainCache[domain] = id))
		return domains.map(({ domain }) => domain)
	}

	private async getDomainId(domain: string): Promise<number> {
		// There most likely will be less than 100 domains overall, so it makes
		// sense to cache the IDs
		const cachedId = this.domainCache[domain]
		if (cachedId) {
			return cachedId
		}

		const [result] = await getDomainId.run({ domain }, this.db)
		if (!result) {
			throw new Error(`domain ${domain} not found`)
		}

		const { id } = result
		this.domainCache[domain] = id
		return id
	}

	async cache(
		alias: string,
		domainId: number,
		original: string | null
	): Promise<void> {
		if (!this.redis || !original) {
			return
		}

		const key = this.makeRedisKey(alias, domainId)
		await this.redis.set(key, original)
	}

	async getCached(alias: string, domainId: number): Promise<string | null> {
		if (!this.redis) {
			return null
		}

		const key = this.makeRedisKey(alias, domainId)
		return await this.redis.get(key)
	}

	public async getOriginalUrl(
		alias: string,
		domain: string
	): Promise<string | null> {
		const domainId = await this.getDomainId(domain)

		const cached = await this.getCached(alias, domainId)
		if (cached) {
			return cached
		}

		const [entry] = await getOriginalUrl.run(
			{ alias, domainID: domainId },
			this.db
		)
		const url = entry?.original

		await this.cache(alias, domainId, url)
		return url
	}

	public async isAliasAvailable(
		short: string,
		domain: string
	): Promise<boolean> {
		return !(await this.getOriginalUrl(short, domain))
	}

	/**
	 * Attempts to store the shortened url
	 *
	 * @returns id if the attempt was successful
	 */
	public async tryStoreUrl(
		alias: string,
		original: string,
		domain: string,
		userId: number | null
	): Promise<number | null> {
		const domainId = await this.getDomainId(domain)

		if (await this.getCached(alias, domainId)) {
			return null
		}

		// We try storing, but don't override existing value
		const [stored] = await tryStoreUrl.run(
			{ alias, original, domainId, userId },
			this.db
		)
		if (!stored) {
			return null
		}

		await this.cache(alias, domainId, original)

		const { id } = stored

		return id
	}

	public async setUrlsUser(urlIds: number[], userId: number): Promise<void> {
		if (urlIds.length === 0) {
			throw new Error(`no urls provided`)
		}

		await setUrlsUserId.run({ urlIds, userId }, this.db)
	}

	public async setUrlAlias(
		urlId: number,
		userId: number,
		alias: string
	): Promise<void> {
		const [stored] = await setUrlAlias.run({ urlId, userId, alias }, this.db)
		if (!stored) {
			throw new Error(`wrong url id ${urlId} or user id ${userId}`)
		}
	}
}
