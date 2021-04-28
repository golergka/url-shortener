import request from 'supertest'
import { appTest } from '../../test_common'

describe(`api/v1/url route`, () => {
	it.concurrent(`retrieves a url by shortUrl`, () =>
		appTest(async ({ app, db }) => {
			await db.query(
				`INSERT INTO urls (short, original, domain_id) VALUES ('test', 'http://google.com', 1)`
			)

			const res = await request(app)
				.get('/api/v1/url')
				.query({ shortUrl: 'http://localhost/test' })
				.expect(200)

			expect(res.body.short).toBe(`http://localhost/test`)
			expect(res.body.original).toBe(`http://google.com`)
		})
	)

	it.concurrent(`retrieves a url by domain and alias`, () =>
		appTest(async ({ app, db }) => {
			await db.query(
				`INSERT INTO urls (short, original, domain_id) VALUES ('test', 'http://google.com', 1)`
			)

			const res = await request(app)
				.get('/api/v1/url')
				.query({
					domain: 'http://localhost',
					alias: 'test'
				})
				.expect(200)

			expect(res.body.short).toBe(`http://localhost/test`)
			expect(res.body.original).toBe(`http://google.com`)
		})
	)

	it.concurrent(
		`produces an 'invalid_parameter_set' error when both domain, alias and shortUrl are present`,
		() =>
			appTest(async ({ app, db }) => {
				await db.query(
					`INSERT INTO urls (short, original, domain_id) VALUES ('test', 'http://google.com', 1)`
				)

				const res = await request(app)
					.get('/api/v1/url')
					.query({
						shortUrl: 'http://localhost/test',
						domain: 'http://localhost',
						alias: 'test'
					})
					.expect(400)

				expect(res.body.errors).toEqual(['invalid_parameter_set'])
			})
	)

	it.concurrent(
		`produces an 'invalid_domain' error when domain is not present`,
		() =>
			appTest(async ({ app }) => {
				const res = await request(app)
					.get('/api/v1/url')
					.query({
						domain: 'http://invalid_domain.com',
						alias: 'test'
					})
					.expect(400)

				expect(res.body.errors).toEqual(['invalid_domain'])
			})
	)

	it.concurrent(
		`produces an 'invalid_domain' error when shortUrl contains domain not present`,
		() =>
			appTest(async ({ app }) => {
				const res = await request(app)
					.get('/api/v1/url')
					.query({
						shortUrl: `http://invalid_domain.com/test`
					})
					.expect(400)

				expect(res.body.errors).toEqual(['invalid_domain'])
			})
	)

	it.concurrent(
		`produces an 'invalid_short_url' error when shortUrl cannot be parsed`,
		() =>
			appTest(async ({ app }) => {
				const res = await request(app)
					.get('/api/v1/url')
					.query({
						shortUrl: 'invalid short url'
					})
					.expect(400)

				expect(res.body.errors).toEqual([`invalid_short_url`])
			})
	)

	it.concurrent(`produces as 'alias_not_found' on unknown alias`, () =>
		appTest(async ({ app }) => {
			const res = await request(app)
				.get('/api/v1/url')
				.query({
					domain: 'http://localhost',
					alias: 'unknown'
				})
				.expect(404)

			expect(res.body.errors).toEqual(['alias_not_found'])
		})
	)

	it.concurrent(`produces as 'alias_not_found' on unknown shortUrl`, () =>
		appTest(async ({ app }) => {
			const res = await request(app)
				.get('/api/v1/url')
				.query({
					shortUrl: 'http://localhost/unknown'
				})
				.expect(404)

			expect(res.body.errors).toEqual(['alias_not_found'])
		})
	)
})
