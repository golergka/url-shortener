import request from 'supertest'
import { appTest } from '../test_common'

describe(`redirect route`, () => {
	it.concurrent(`redirects on an existing record`, () =>
		appTest(async ({ app, db }) => {
			await db.query(
				`INSERT INTO urls (short, original, domain_id) VALUES ('test', 'http://google.com', 1)`
			)

			await request(app).get('/test').expect(308)
		})
	)

	it.concurrent(`returns 404 for an absent record`, () =>
		appTest(async ({ app }) => {
			await request(app).get('/test').expect(404)
		})
	)
})
