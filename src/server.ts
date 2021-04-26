/* eslint-disable no-console */

import { Pool } from 'pg'
import { makeApp } from './app'
import Redis from 'ioredis'

const {
	PORT: port,
	HOSTNAME: hostname,
	NODE_ENV: nodeEnv = 'development',
	REDIS_URL: redisUrl
} = process.env

if (!port) {
	throw new Error(`please specify PORT to listen on`)
}

if (!hostname) {
	throw new Error(`please specify HOSTNAME for current app`)
}

;(async function () {
	const debug = nodeEnv === 'development'

	console.log(`⏰ Starting up...`)
	console.log(`➡️  Environment: ${debug ? `Debug` : `Production`}`)
	console.log(`➡️  Redis: ${redisUrl ? `on` : `off`}`)

	// We use standard environment varilables
	// https://www.postgresql.org/docs/9.1/libpq-envars.html
	const db = new Pool()

	// Our app can live without Redis
	const redis = redisUrl ? new Redis(redisUrl) : undefined

	const app = await makeApp({
		db,
		hostname,
		debug,
		redis
	})
	app.listen(port, () => {
		console.log(`🚀 App launched and listening on ${hostname}`)
	})
})()
