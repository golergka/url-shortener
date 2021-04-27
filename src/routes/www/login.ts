import passport from 'passport'
import { Router } from 'express'

export = () => {
	const router = Router()

	router.get('/', async (_req, res) => {
		res.render('login')
	})

	router.post('/', (req, res, next) => {
		const {
			body: { username, password }
		} = req
		passport.authenticate('local', function (err, user, info) {
			if (err) {
				return next(err)
			}
			if (!user) {
				res.render('login', { ...info, username, password })
				return
			}
			req.login(user, () => res.redirect('/'))
		})(req, res, next)
	})

	return router
}
