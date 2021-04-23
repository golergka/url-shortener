import { Pool, PoolClient } from 'pg'
import tx from 'pg-tx'

export async function dbTest(
	callback: (db: PoolClient) => Promise<unknown>
): Promise<void> {
	const pg = new Pool()
	await tx(pg, callback, true)
	pg.end()
}
