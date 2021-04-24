import request from 'supertest'
import { makeApp } from '../app'
import { dbTest } from '../test_common'

describe(`shorten route`, () => {
	it.concurrent(`stores a basic url`, () =>
		dbTest(async (db) => {
			const app = await makeApp({
				db,
				hashFunction: function* (original) {
					yield original
				}
			})

			const res = await request(app)
				.post('/shorten')
				.send({ url: 'https://google.com' })
				.expect(200)

			expect(res.body.short).toBe('https://google.com')
		})
	)

	it.concurrent(`returns 500 when hash function is out of values`, () =>
		dbTest(async (db) => {
			const app = await makeApp({
				db,
				hashFunction: function* (_) {
					/* empty */
				}
			})

			await request(app)
				.post('/shorten')
				.send({ url: 'https://google.com' })
				.expect(500)
		})
	)
})
