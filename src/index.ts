import { sql } from '@pgtyped/query'
import express, { application } from 'express'
import { Pool } from 'pg'
import { IGetOriginalUrlQuery } from './index.types'

const { PORT: port } = process.env

if (!port) {
  throw new Error(`please specify PORT to listen on`)
}

const getOriginalUrl = sql<IGetOriginalUrlQuery>`
  SELECT original
  FROM urls
  WHERE short = $short
`

const pg = new Pool()
const expressApp = express()

expressApp.get('/:short', async function(req, res) {
  const short: string = req.params.short
  const [url] = await getOriginalUrl.run({ short }, pg)
  if (!url) {
    res.status(404).send()
  } else {
    // Reason for 308 code
    // https://stackoverflow.com/a/42138726/312725
    res.redirect(308, url.original)
  }
})

expressApp.listen(port, () => {
  console.log(`🚀 App launched and listening on port ${port}`)
})