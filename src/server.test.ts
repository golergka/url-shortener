import { Pool } from "pg"
import tx from 'pg-tx'
import { makeApp } from "./server"
import request from 'supertest'
import { dbTest } from "./test_common"

describe(`makeApp`, () => {
  it.concurrent(`redirects on an existing record`, () => dbTest(async (db) => {
    const app = await makeApp(db)
    await db.query(`INSERT INTO urls (short, original) VALUES ('test', 'http://google.com')`)

    await request(app)
      .get('/test')
      .expect(308)

  }))

  it.concurrent(`returns 404 for an absent record`, () => dbTest(async (db) => {
    const app = await makeApp(db)

    await request(app)
      .get('/test')
      .expect(404)

  }))
})

