import request from 'supertest'
import { makeApp } from '../app'
import { appTest, dbTest } from '../test_common'

describe(`shorten route`, () => {
	it.concurrent(`stores a basic url`, () =>
		dbTest(async (db) => {
			const app = await makeApp({
				db,
				hashFunction: function* (original) {
					yield 'yeet'
				}
			})

			const res = await request(app)
				.post('/shorten')
				.send({ url: 'https://google.com' })
				.expect(200)

			expect(res.body.short).toBe('yeet')
			expect(res.body.original).toBe('https://google.com')
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

	it.concurrent(`returns 400 when user provides an invalid url`, () =>
		appTest(async ({ app }) => {
			const res = await request(app)
				.post('/shorten')
				.send({ url: 'invalid url' })
				.expect(400)

			expect(res.body.error).toBe('Invalid URL')
		})
	)

	it.concurrent(`completes a user provided url with schema prefix`, () =>
		appTest(async ({ app }) => {
			const res = await request(app)
				.post('/shorten')
				.send({ url: 'google.com' })
				.expect(200)

			expect(res.body.original).toBe('http://google.com')
		})
	)

	it.concurrent(
		`refuses to store a url with authentication information without storeAuth flag`,
		() =>
			appTest(async ({ app }) => {
				const res = await request(app)
					.post('/shorten')
					.send({ url: 'http://user:password@domain.com' })
					.expect(400)

				expect(res.body.error).toBe(
					`Authentication information leaked - use storeAuth:true if it's intended`
				)
			})
	)

	it.concurrent(
		`stores a url with authentication information with storeAuth flag`,
		() =>
			appTest(async ({ app }) => {
				await request(app)
					.post('/shorten')
					.send({
						url: 'http://user:password@domain.com',
						storeAuth: true
					})
					.expect(200)
			})
	)
})
