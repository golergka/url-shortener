import express, { Router } from 'express'
import { UrlService } from '../../services/url'
import shortenRouter from './shorten'
import urlRouter from './url'
import domainsRouter from './domains'

export = (urlService: UrlService, domains: string[]): Router => {
	const router = Router()

	router.use(express.json())
	router.use('/shorten', shortenRouter(urlService))
	router.use('/url', urlRouter(urlService))
	router.use('/domains', domainsRouter(domains))

	return router
}
