import { Pool, PoolClient } from 'pg'
import Redis from 'ioredis'
import {
	getOriginalUrl,
	tryStoreUrl,
	getDomainId,
	getDomains
} from './url.queries'

type GetOriginalUrlResult =
	| { result: 'success'; original: string }
	| { result: 'invalid_domain' }
	| { result: 'alias_not_found' }

type StoreUrlReuslt =
	| { result: 'success' }
	| { result: 'invalid_domain' }
	| { result: 'alias_occupied' }

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

	private async getDomainId(domain: string): Promise<number | null> {
		// There most likely will be less than 100 domains overall, so it makes
		// sense to cache the IDs
		const cachedId = this.domainCache[domain]
		if (cachedId) {
			return cachedId
		}

		const [result] = await getDomainId.run({ domain }, this.db)
		if (!result) {
			return null
		}

		const { id } = result
		this.domainCache[domain] = id
		return id
	}

	public async getOriginalUrl(
		short: string,
		domain: string
	): Promise<GetOriginalUrlResult> {
		const domainID = await this.getDomainId(domain)
		if (!domainID) {
			return { result: 'invalid_domain' }
		}

		if (this.redis) {
			const url = await this.redis.get(this.makeRedisKey(short, domainID))
			if (url) {
				return { result: 'success', original: url }
			}
		}

		const [entry] = await getOriginalUrl.run({ short, domainID }, this.db)
		const url = entry?.original

		if (url && this.redis) {
			await this.redis.set(this.makeRedisKey(short, domainID), url)
		}
		return url
			? { result: 'success', original: url }
			: { result: 'alias_not_found' }
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
	): Promise<StoreUrlReuslt> {
		const domainId = await this.getDomainId(domain)
		if (!domainId) {
			return { result: 'invalid_domain' }
		}

		if (this.redis) {
			const stored = await this.redis.get(this.makeRedisKey(short, domainId))
			if (stored) {
				return { result: stored === original ? 'success' : 'alias_occupied' }
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
		return { result: stored === original ? 'success' : 'alias_occupied' }
	}
}
