import request from 'supertest'
import { makeApp } from '../../app'
import { makeHashFunction } from '../../hash_function'
import { appTest, dbTest } from '../../test_common'

describe(`api/v1/shorten route`, () => {
	it.concurrent(`stores a basic url`, () =>
		dbTest(async (db) => {
			const app = await makeApp({
				db,
				hashFunction: function* (original) {
					yield 'yeet'
				},
				hostname: 'http://localhost'
			})

			const res = await request(app)
				.post('/api/v1/shorten')
				.send({ url: 'https://google.com' })
				.expect(200)

			expect(res.body.short).toBe('http://localhost/yeet')
			expect(res.body.original).toBe('https://google.com')
		})
	)

	it.concurrent(`returns success for a url that has already been stored`, () =>
		appTest(async ({ app }) => {
			const res1 = await request(app)
				.post('/api/v1/shorten')
				.send({ url: 'http://reddit.com' })
				.expect(200)

			const res2 = await request(app)
				.post('/api/v1/shorten')
				.send({ url: 'http://reddit.com' })
				.expect(200)

			expect(res1.body.short).toBe(res2.body.short)
		})
	)

	/*
	it.concurrent(`returns 400 when api user misuses API`, () =>
		appTest(async ({ app }) => {
			await request(app)
				.post('/api/v1/shorten')
				.send({ otherParameter: 'something' })
				.expect(400)
		})
	)

	it.concurrent(`returns 500 when hash function is out of values`, () =>
		dbTest(async (db) => {
			const app = await makeApp({
				db,
				hashFunction: function* (_) {
					// empty
				},
				hostname: 'http://localhost'
			})

			await request(app)
				.post('/api/v1/shorten')
				.send({ url: 'https://google.com' })
				.expect(500)
		})
	)

	it.concurrent(`returns 400 when user provides an invalid url`, () =>
		appTest(async ({ app }) => {
			const res = await request(app)
				.post('/api/v1/shorten')
				.send({ url: 'invalid url' })
				.expect(400)

			expect(res.body.error).toBe('Invalid URL')
		})
	)

	it.concurrent(`completes a user provided url with schema prefix`, () =>
		appTest(async ({ app }) => {
			const res = await request(app)
				.post('/api/v1/shorten')
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
					.post('/api/v1/shorten')
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
					.post('/api/v1/shorten')
					.send({
						url: 'http://user:password@domain.com',
						storeAuth: true
					})
					.expect(200)
			})
	)

	it.concurrent(`retrieves a stored url even when hash funciton changes`, () =>
		dbTest(async (db) => {
			const app1 = await makeApp({
				db,
				hashFunction: makeHashFunction('sha1', 'base64', 12),
				hostname: 'http://localhost'
			})

			const {
				body: { short }
			} = await request(app1)
				.post('/api/v1/shorten')
				.send({ url: 'http://google.com' })
				.expect(200)

			const app2 = await makeApp({
				db,
				hashFunction: makeHashFunction('md5', 'base64', 12),
				hostname: 'http://localhost'
			})

			const hash = short.replace('http://localhost/', '')

			await request(app2).get(`/${hash}`).expect(308)
		})
	)

	it.concurrent(
		`doesn't accept a hash that is identical to one of app urls`,
		() =>
			dbTest(async (db) => {
				const app = await makeApp({
					db,
					hashFunction: function* (_) {
						// Roots that should be filtered out:
						yield 'api/v1/shorten' // the current shorten route
						yield 'api/asdasd' // it should filter all routes beginning on API

						// It should fall back to:
						yield 'yeet'
					},
					hostname: 'http://localhost'
				})

				const {
					body: { short }
				} = await request(app)
					.post('/api/v1/shorten')
					.send({ url: 'http://google.com' })
					.expect(200)

				expect(short).toBe('http://localhost/yeet')
			})
	)
	*/
})
