import { Router } from 'express'
import { User } from '../../providers/user'
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
			let userId = null
			if (req.user) {
				userId = (req.user as User).id
			}
			const result = await shortenService.shorten(
				url,
				userId,
				domain,
				storeAuth,
				alias
			)
			if (result.success && !req.user) {
				const { short, original, id } = result
				req.session.links = req.session.links || []
				req.session.links.push({ short, original, id })
			}
			res.render('index', { ...req.body, ...result, domains })
		} catch (e) {
			next(e)
		}
	})

	return router
}
