import express from 'express'
import { Pool, PoolClient } from 'pg'
import { migrate } from 'postgres-migrations'
import { UrlProvider } from './providers/url'
import shortRouter from './routes/short'

export async function makeApp(
	pg?: Pool | PoolClient
): Promise<express.Application> {
	const client = pg || new Pool()
	await migrate({ client }, 'migrations')

	const urlProvider = new UrlProvider(client)

	const app: express.Application = express()

	app.use('/', shortRouter(urlProvider))

	return app
}
