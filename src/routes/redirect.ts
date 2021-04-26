import { Router } from 'express'
import { UrlProvider } from '../providers/url'

export = (urlProvider: UrlProvider): Router => {
	const router = Router()

	router.get('/:short', async (req, res, next) => {
		const { short } = req.params
		if (short === '') {
			next('route')
			return
		}

		const url = await urlProvider.getOriginalUrl(short)
		if (!url) {
			next('route')
		} else {
			// Reason for 308 code
			// https://stackoverflow.com/a/42138726/312725

			res.set('Location', url)
			res.set('Content-Type', 'text/html')
			res.status(308)
			res.render('redirect', { url })
		}
	})

	return router
}
