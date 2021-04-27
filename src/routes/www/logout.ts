import { Router } from 'express'

export = () => {
	const router = Router()
	router.post('/', (req, res, next) => {
		req.logout()
		res.redirect('/')
	})
	return router
}
