import { Pool, PoolClient } from 'pg'
import { getOriginalUrl, tryStoreUrl } from './url.queries'

export class UrlProvider {
	constructor(private readonly db: Pool | PoolClient) {}

	public async getOriginalUrl(short: string): Promise<string | null> {
		const [url] = await getOriginalUrl.run({ short }, this.db)
		return url?.original
	}

	/**
	 * Attempts to store the shortened url
	 *
	 * @returns was the attempt successful
	 */
	public async tryStoreUrl(short: string, original: string): Promise<boolean> {
		// We try storing, but don't override existing value
		await tryStoreUrl.run({ short, original }, this.db)

		// Then we check what value was stored
		const [{ original: stored }] = await getOriginalUrl.run({ short }, this.db)

		// If it's the same as the one we wanted to store, we're successful.
		// It could happen even if it was stored there before and we didn't
		// actually write anything.
		return stored === original
	}
}
