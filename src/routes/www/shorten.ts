import { Router } from 'express'
import { ShortenService } from '../../services/shorten'

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
					{
						const { short, original } = shortenResult
						res.render('shorten-success', { short, original })
					}
					break

				case 'invalid_url':
					res.render('invalid-url')
					break

				case 'auth_leaked':
					res.render('auth-leaked', { url: req.body.url })
					break
			}
		} catch (e) {
			next(e)
		}
	})

	return router
}
