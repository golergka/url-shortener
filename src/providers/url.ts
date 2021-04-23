import { Pool, PoolClient } from 'pg'
import { getOriginal } from './url.queries'

export class UrlProvider {
	constructor(private readonly db: Pool | PoolClient) {}

	public async getOriginalUrl(short: string): Promise<string | null> {
		const [url] = await getOriginal.run({ short }, this.db)
		return url?.original
	}
}
