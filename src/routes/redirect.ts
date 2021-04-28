import { Router } from 'express'
import { UrlProvider } from '../providers/url'

export = (urlProvider: UrlProvider, domain: string): Router => {
	const router = Router()

	router.get('/:alias', async (req, res, next) => {
		const { alias } = req.params
		if (!alias) {
			next('route')
			return
		}

		const getResult = await urlProvider.getOriginalUrl(alias, domain)
		if (getResult.result !== `success`) {
			next('route')
		} else {
			const { original: url } = getResult

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
