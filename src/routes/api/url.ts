import { Router } from 'express'
import { GetResult, UrlService } from '../../services/url'

export = (urlService: UrlService): Router => {
	const router = Router()

	router.get('/', async (req, res) => {
		const { alias, domain, shortUrl } = req.query

		let getResult: GetResult
		if (shortUrl && typeof shortUrl === 'string' && !domain && !alias) {
			getResult = await urlService.get(shortUrl)
		} else if (
			domain &&
			alias &&
			typeof domain === 'string' &&
			typeof alias === 'string' &&
			!shortUrl
		) {
			getResult = await urlService.get(alias, domain)
		} else {
			res.status(400).send({ errors: [`invalid_parameter_set`] })
			return
		}

		switch (getResult.result) {
			case 'success':
				res.status(200).send({
					short: getResult.short,
					original: getResult.original
				})
				return
			case 'alias_not_found':
				res.status(404).send({
					errors: ['alias_not_found']
				})
				return
			default:
				res.status(400).send({
					errors: [getResult.result]
				})
				return
		}
	})

	return router
}
