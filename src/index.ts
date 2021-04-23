import { makeApp } from './server'

const { PORT: port } = process.env

if (!port) {
  throw new Error(`please specify PORT to listen on`)
}

(async function() {
  console.log(`Starting up...`)
  const app = await makeApp()
  app.listen(port, () => {
    console.log(`🚀 App launched and listening on http://localhost:${port}`)
  })
})()