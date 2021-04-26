/* eslint-disable no-console */

import { Pool } from 'pg'
import { makeApp } from './app'

const {
	PORT: port,
	HOSTNAME: hostname,
	NODE_ENV: nodeEnv = 'development'
} = process.env

if (!port) {
	throw new Error(`please specify PORT to listen on`)
}

if (!hostname) {
	throw new Error(`please specify HOSTNAME for current app`)
}

;(async function () {
	const debug = nodeEnv === 'development'
	console.log(`⏰ Starting up in ${debug ? 'debug' : 'production'} mode...`)
	const db = new Pool() // Using standard environment variables
	const app = await makeApp({
		db,
		hostname,
		debug
	})
	app.listen(port, () => {
		console.log(`🚀 App launched and listening on ${hostname}`)
	})
})()
