import { Pool, PoolClient } from 'pg'
import Redis from 'ioredis'
import { getOriginalUrl, tryStoreUrl } from './url.queries'

export class UrlProvider {
	constructor(
		private readonly db: Pool | PoolClient,
		private readonly redis?: Redis.Redis
	) {}

	makeRedisKey = (short: string) => `url:${short}`

	public async getOriginalUrl(short: string): Promise<string | null> {
		if (this.redis) {
			const url = await this.redis.get(this.makeRedisKey(short))
			if (url) {
				return url
			}
		}

		const [entry] = await getOriginalUrl.run({ short }, this.db)
		const url = entry?.original

		if (url && this.redis) {
			await this.redis.set(this.makeRedisKey(short), url)
		}
		return url
	}

	/**
	 * Attempts to store the shortened url
	 *
	 * @returns was the attempt successful
	 */
	public async tryStoreUrl(short: string, original: string): Promise<boolean> {
		if (this.redis) {
			const stored = await this.redis.get(this.makeRedisKey(short))
			if (stored) {
				return stored === original
			}
		}

		// We try storing, but don't override existing value
		await tryStoreUrl.run({ short, original }, this.db)

		// Then we check what value was stored
		const [{ original: stored }] = await getOriginalUrl.run({ short }, this.db)

		if (this.redis) {
			await this.redis.set(this.makeRedisKey(short), stored)
		}

		// If it's the same as the one we wanted to store, we're successful.
		// It could happen even if it was stored there before and we didn't
		// actually write anything.
		return stored === original
	}
}
