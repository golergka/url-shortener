import { Pool, PoolClient } from 'pg'
import tx from 'pg-tx'
import { AppParameters, makeApp } from './app'

export async function dbTest(
	callback: (db: PoolClient) => Promise<unknown>
): Promise<void> {
	const pg = new Pool()
	await tx(pg, callback, true)
	pg.end()
}

export async function appTest(
	callback: (params: {
		app: Express.Application
		db: PoolClient
	}) => Promise<unknown>,
	params?: Partial<Omit<AppParameters, 'db'>>
): Promise<void> {
	await dbTest(async (db) => {
		const app = await makeApp({
			db,
			hostname: params?.hostname || 'http://localhost',
			hashFunction: params?.hashFunction
		})
		await callback({ app, db })
	})
}
