import { Pool, PoolClient } from 'pg'
import Redis from 'ioredis'
import {
	getOriginalUrl,
	tryStoreUrl,
	getDomainId,
	getDomains
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

	public async getOriginalUrl(
		short: string,
		domain: string
	): Promise<string | null> {
		const domainID = await this.getDomainId(domain)

		if (this.redis) {
			const url = await this.redis.get(this.makeRedisKey(short, domainID))
			if (url) {
				return url
			}
		}

		const [entry] = await getOriginalUrl.run({ short, domainID }, this.db)
		const url = entry?.original

		if (url && this.redis) {
			await this.redis.set(this.makeRedisKey(short, domainID), url)
		}
		return url
	}

	public async isShortAvailable(
		short: string,
		domain: string
	): Promise<boolean> {
		return !(await this.getOriginalUrl(short, domain))
	}

	/**
	 * Attempts to store the shortened url
	 *
	 * @returns was the attempt successful
	 */
	public async tryStoreUrl(
		short: string,
		original: string,
		domain: string
	): Promise<boolean> {
		const domainId = await this.getDomainId(domain)

		if (this.redis) {
			const stored = await this.redis.get(this.makeRedisKey(short, domainId))
			if (stored) {
				return stored === original
			}
		}

		// We try storing, but don't override existing value
		await tryStoreUrl.run({ short, original, domainId }, this.db)

		// Then we check what value was stored
		const [{ original: stored }] = await getOriginalUrl.run(
			{ short, domainID: domainId },
			this.db
		)

		if (this.redis) {
			await this.redis.set(this.makeRedisKey(short, domainId), stored)
		}

		// If it's the same as the one we wanted to store, we're successful.
		// It could happen even if it was stored there before and we didn't
		// actually write anything.
		return stored === original
	}
}
