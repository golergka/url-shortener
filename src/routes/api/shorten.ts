import { Router } from 'express'
import { UrlService } from '../../services/url'

export = (urlService: UrlService): Router => {
	const router = Router()

	router.post('/', async (req, res, next) => {
		try {
			const {
				body: { url, alias, domain }
			} = req
			const shortenResult = await urlService.shorten(url, domain, true, alias)
			res.status(shortenResult.success ? 200 : 400).send(shortenResult)
		} catch (e) {
			// Throwing erros is not supported until Express 5?...
			next(e)
		}
	})

	return router
}
