import { Pool, PoolClient } from 'pg'
import tx from 'pg-tx'

export = async function <T>(
	pg: Pool | PoolClient,
	callback: (db: PoolClient) => Promise<T>
): Promise<T> {
	if (pg instanceof Pool) {
		return tx(pg, callback)
	} else {
		return callback(pg)
	}
}
