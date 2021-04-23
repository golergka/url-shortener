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
		const [result] = await tryStoreUrl.run({ short, original }, this.db)
		return result.original === original
	}
}
