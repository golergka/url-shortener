import { Router } from 'express'
import { UserService } from '../../services/user'

export = (userService: UserService) => {
	const router = Router()

	router.get('/', async (_req, res) => {
		res.render('register')
	})

	router.post('/', async (req, res, next) => {
		try {
			const {
				body: { username, password }
			} = req

			let urlIds: number[] = []
			if (req.session && req.session.links) {
				urlIds = req.session.links.map(({ id }) => id)
				req.session.links = []
			}

			const result = await userService.register(username, password, urlIds)
			if (result.success) {
				req.login(result.user, () => {
					res.redirect('/')
				})
			} else {
				res.render('register', { ...req.body, ...result })
			}
		} catch (e) {
			next(e)
		}
	})

	return router
}
