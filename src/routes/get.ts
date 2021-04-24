import { Router } from 'express'
import { UrlProvider } from '../providers/url'

export = (urlProvider: UrlProvider): Router => {
	const router = Router()

	router.get('/:short', async (req, res) => {
		const { short } = req.params
		const url = await urlProvider.getOriginalUrl(short)
		if (!url) {
			res.status(404).send()
		} else {
			// Reason for 308 code
			// https://stackoverflow.com/a/42138726/312725
			res.redirect(308, url)
		}
	})

	return router
}