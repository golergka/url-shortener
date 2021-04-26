import express, { Router } from 'express'
import { ShortenService } from '../../services/shorten'

export = (shortenService: ShortenService, domains: string[]): Router => {
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
			const shortenResult = await shortenService.shorten(url, storeAuth, alias)
			res.render('index', { ...req.body, ...shortenResult, domains })
		} catch (e) {
			next(e)
		}
	})

	return router
}
