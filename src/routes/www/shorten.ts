import { Router } from 'express'
import { ShortenService } from '../../services/shorten'

export = (shortenService: ShortenService): Router => {
	const router = Router()

	router.post('/', async (req, res, next) => {
		try {
			const {
				body: { url, storeAuth }
			} = req
			const shortenResult = await shortenService.shorten(url, storeAuth)
			switch (shortenResult.result) {
				case 'success':
					{
						const { short, original } = shortenResult
						res.render('shorten-success', { short, original })
					}
					break

				case 'invalid_url':
					res.render('invalid_url', { url })
					break

				case 'auth_leaked':
					{
						const { fixedUrl } = shortenResult
						res.render('auth_leaked', { url, fixedUrl })
					}
					break
			}
		} catch (e) {
			next(e)
		}
	})

	return router
}
