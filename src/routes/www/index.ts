import express, { Router } from 'express'
import { UrlService } from '../../services/url'

export = (urlService: UrlService, domains: string[]): Router => {
	const router = Router()

	router.use(express.urlencoded({ extended: true }))

	router.get('/', async (req, res) => {
		res.render('index', { domains })
	})

	router.post('/', async (req, res, next) => {
		try {
			const {
				body: { url, storeAuth, alias, domain }
			} = req
			const shortenResult = await urlService.shorten(
				url,
				domain,
				storeAuth,
				alias
			)
			res.render('index', { ...req.body, ...shortenResult, domains })
		} catch (e) {
			next(e)
		}
	})

	return router
}
