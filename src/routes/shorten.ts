import { Router } from 'express'
import { ShortenService } from '../services/shorten'

export = (shortenService: ShortenService): Router => {
	const router = Router()

	router.post('/', async (req, res, next) => {
		try {
			const shortenResult = await shortenService.shorten(
				req.body.url,
				req.body.storeAuth
			)
			switch (shortenResult.result) {
				case 'success':
					res.status(200).send({
						short: shortenResult.short,
						original: shortenResult.original
					})
					break
				case 'invalid_url':
					res.status(400).send({
						error: 'Invalid URL'
					})
					break
				case 'auth_leaked':
					res.status(400).send({
						error: `Authentication information leaked - use storeAuth:true if it's intended`
					})
			}
		} catch (e) {
			// Throwing erros is not supported until Express 5?...
			next(e)
		}
	})

	return router
}
