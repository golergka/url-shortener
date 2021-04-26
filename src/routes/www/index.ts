import express, { Router } from 'express'
import { ShortenService } from '../../services/shorten'
import shortenRouter from './shorten'

export = (shortenService: ShortenService): Router => {
	const router = Router()

	router.use(express.urlencoded({ extended: true }))

	router.get('/', async (req, res) => {
		res.render('index')
	})

	router.use('/shorten', shortenRouter(shortenService))

	return router
}
