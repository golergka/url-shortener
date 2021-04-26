import { Router } from 'express'
import { ShortenService } from '../../services/shorten'

export = (shortenService: ShortenService): Router => {
	const router = Router()

	router.post('/', async (req, res, next) => {
		try {
			const {
				body: { url, storeAuth, alias }
			} = req
			const shortenResult = await shortenService.shorten(url, storeAuth, alias)
			res.status(shortenResult.success ? 200 : 400).send(shortenResult)
		} catch (e) {
			// Throwing erros is not supported until Express 5?...
			next(e)
		}
	})

	return router
}
