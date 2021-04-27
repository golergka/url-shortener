import { Router } from 'express'
import { ShortenService } from '../../services/shorten'

export = (shortenService: ShortenService, domains: string[]) => {
	const router = Router()

	router.get('/', async (req, res) => {
		res.render('index', { domains })
	})

	router.post('/', async (req, res, next) => {
		try {
			const {
				body: { url, storeAuth, alias, domain }
			} = req
			const result = await shortenService.shorten(url, domain, storeAuth, alias)
			res.render('index', { ...req.body, ...result, domains })
		} catch (e) {
			next(e)
		}
	})

	return router
}
