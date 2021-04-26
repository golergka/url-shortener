/* eslint-disable no-console */

import { Pool } from 'pg'
import { makeApp } from './app'

const { PORT: port, HOSTNAME: hostname } = process.env

if (!port) {
	throw new Error(`please specify PORT to listen on`)
}

if (!hostname) {
	throw new Error(`please specify HOSTNAME for current app`)
}

;(async function () {
	console.log(`Starting up...`)
	const db = new Pool() // Using standard environment variables
	const app = await makeApp({ db, hostname })
	app.listen(port, () => {
		console.log(`🚀 App launched and listening on ${hostname}`)
	})
})()
