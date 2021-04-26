import express, { ErrorRequestHandler } from 'express'
import { Pool, PoolClient } from 'pg'
import { migrate } from 'postgres-migrations'
import { defaultHashFunction, HashFunction } from './hash_function'
import { UrlProvider } from './providers/url'
import { ShortenService } from './services/shorten'
import redirectRouter from './routes/redirect'
import apiRouter from './routes/api'
import wwwRouter from './routes/www'

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
		['/api', '/static']
	)

	const app: express.Application = express()

	app.use('/static', express.static('public'))
	app.set('view engine', 'pug')

	app.use('/', redirectRouter(urlProvider))
	app.use('/', wwwRouter(shortenService))
	app.use('/api/v1', apiRouter(shortenService))

	const errorHandler: ErrorRequestHandler = function (err, req, res) {
		// set locals, only providing error in development
		res.locals.message = err.message
		res.locals.error = req.app.get('env') === 'development' ? err : {}

		// render the error page
		res.status(err.status || 500)
		res.render('error')

		// eslint-disable-next-line no-console
		console.error(err)
	}

	// error handler
	app.use(errorHandler)

	return app
}
