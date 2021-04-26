import express from 'express'
import { Pool, PoolClient } from 'pg'
import { migrate } from 'postgres-migrations'
import { defaultHashFunction, HashFunction } from './hash_function'
import { UrlProvider } from './providers/url'
import { ShortenService } from './services/shorten'
import getRouter from './routes/get'
import shortenRouter from './routes/shorten'
import indexRouter from './routes/index'
import path from 'path'

export interface AppParameters {
	db: Pool | PoolClient
	hostname: string
	hashFunction?: HashFunction
}

export async function makeApp(
	params: AppParameters
): Promise<express.Application> {
	const hashFunction = params?.hashFunction || defaultHashFunction

	await migrate({ client: params.db }, 'migrations')

	// When there's over 10 providers and services, bring in DI framework

	const urlProvider = new UrlProvider(params.db)
	const shortenService = new ShortenService(
		urlProvider, 
		hashFunction, 
		params.hostname, 
		[ '/api']
	)

	const app: express.Application = express()

	app.set('view engine', 'pug')

	app.use(express.json())

	app.use('/', getRouter(urlProvider))
	app.use('/', indexRouter)
	app.use('/api/v1/shorten', shortenRouter(shortenService))

	return app
}
