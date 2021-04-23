import { sql } from "@pgtyped/query"
import express from "express"
import { Pool, PoolClient } from "pg"
import { migrate } from "postgres-migrations"
import { IGetOriginalUrlQuery } from "./server.types"

const getOriginalUrl = sql<IGetOriginalUrlQuery>`
  SELECT original
  FROM urls
  WHERE short = $short
`

export async function makeApp(pg?: Pool|PoolClient) {
  const client = pg || new Pool()
  await migrate({ client }, 'migrations' )

  const app: express.Application = express()

  app.get('/:short', async function(req, res) {
    const short: string = req.params.short
    const [url] = await getOriginalUrl.run({ short }, client)
    if (!url) {
      res.status(404).send()
    } else {
      // Reason for 308 code
      // https://stackoverflow.com/a/42138726/312725
      res.redirect(308, url.original)
    }
  })

  return app
}