import { Router } from 'express'

export = (domains: string[]): Router => {
	const router = Router()

	router.get('/', async (req, res) => {
		res.status(200).send({
			domains
		})
	})

	return router
}
