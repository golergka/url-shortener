import express, { Router } from 'express'
import { ShortenService } from '../../services/shorten'
import session from 'express-session'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { UserService } from '../../services/user'
import registerRouter from './register'
import loginRouter from './login'
import logoutRouter from './logout'
import shortenRouter from './shorten'
import { isUser } from '../../providers/user'

export = ({
	shortenService,
	userService,
	domains,
	sessionSecret,
	sessionStore
}: {
	shortenService: ShortenService
	userService: UserService
	domains: string[]
	sessionSecret?: string
	sessionStore?: session.Store
}): Router => {
	const router = Router()

	passport.use(new LocalStrategy(userService.login))
	passport.serializeUser(userService.serializeUser)
	passport.deserializeUser(userService.deserializeUser)

	router.use(express.urlencoded({ extended: true }))
	if (sessionSecret && sessionStore) {
		router.use(
			session({
				secret: sessionSecret,
				resave: false,
				store: sessionStore,
				saveUninitialized: false
			})
		)
	}
	router.use(passport.initialize())
	router.use(passport.session())

	// Our layout template uses this
	router.use((req, res, next) => {
		if (isUser(req.user)) {
			const { username } = req.user
			res.locals.user = { username }
		}
		next()
	})

	router.use('/', shortenRouter(shortenService, domains))
	router.use('/register', registerRouter(userService))
	router.use('/login', loginRouter())
	router.use('/logout', logoutRouter())

	return router
}
