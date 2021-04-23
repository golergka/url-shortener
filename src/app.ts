import express from 'express'
import { Pool, PoolClient } from 'pg'
import { migrate } from 'postgres-migrations'
import { HashFunction, identityHash } from './hash_function'
import { UrlProvider } from './providers/url'
import getRouter from './routes/get'
import shortenRouter from './routes/shorten'

export interface AppParameters {
	db?: Pool | PoolClient
	hashFunction?: HashFunction
}

export async function makeApp(
	params: AppParameters
): Promise<express.Application> {
	const client = params.db || new Pool()
	const hashFunction = params.hashFunction || identityHash

	await migrate({ client }, 'migrations')

	const urlProvider = new UrlProvider(client)

	const app: express.Application = express()

	app.use(express.json())

	app.use('/', getRouter(urlProvider))
	app.use('/shorten', shortenRouter(urlProvider, hashFunction))

	return app
}
