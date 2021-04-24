import { Router } from 'express'
import { HashFunction } from '../hash_function'
import { UrlProvider } from '../providers/url'

export = (urlProvider: UrlProvider, hashFunction: HashFunction): Router => {
	const router = Router()

	router.post('/', async (req, res, next) => {
		const { url } = req.body

		const generator = hashFunction(url)
		let tryResult
		let short
		do {
			const genNext = generator.next()
			if (genNext.done) {
				// Throwing erros is not supported until Express 5?...
				next(new Error(`hash function out of values`))
				return
			} else {
				short = genNext.value
				// eslint-disable-next-line no-await-in-loop
				tryResult = await urlProvider.tryStoreUrl(short, url)
			}
		} while (!tryResult)

		res.status(200).send({ short })
	})

	return router
}
