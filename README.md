# URL-shortener

## Tasks

### Baseline

* [x] Shorten URLs via API
  * [x] Check that URLs have `http://` prepend, so you don't redirect to localhost
  * [x] Check that URLs don't have user and password information by accident
* [x] Redirect from short URL to original URL
  * [x] Return a basic redirect
  * [x] Redirect with HTML that contains a simple text message
  * [x] Return 404 status when failed to find code
  * [ ] Provide a detailed 404 page
* [x] Web app
  * [x] Error page for invalid URL
  * [x] Error page for auth leaked error
  * [x] CSS styling
  * [ ] favicon
  * [x] Internal error 500 page

### Non-functional improvements

* [ ] Caching (Redis)
* [ ] Health checks
* [ ] Error reporting (Sentry)
* [ ] Containerize (Docker)
* [ ] REST API documentation (Swagger?)
* [ ] Automatic horizontal scaling (Kubernetes or just AWS EBS?)
* [ ] Monitoring (Prometeus + Grafana?)
* [ ] Write diagnostic logs
* [ ] Logs collection (AWS Cloudwatchs / ELK)
* [ ] Rate limiting (probably on Nginx/CDN, not in the app)

### Functional improvements

* [ ] Client-side URL validation
* [ ] Custom short URL
* [ ] Multiple domains
* [ ] User login/registration - separate service and db?
* [ ] Editing links (for logged in users) - Kafka for cache layer update
* [ ] Analytics (Kafka + Clickhouse)

## Running the project

### Scripts

* **build** — builds all the javascript files
* **start** — runs the javascript files
* **lint** — highlights all the lint errors
* **lint:fix** — as above, but also fixes everything that it can automatically
* **test** — runs all the tests. *Please remember that tests rely on Postgresql database.*
* **typegen** — checks all the SQL queries and generates types for them
* **migrate** — runs all pending migrations

Typical workflow when updating something with database would be first to edit migrations in `migrations` folder and queries in your code, and then run `migrate`, `typegen` and `lint:fix` scripts.

### .env file

To run various scripts locally, you should defined environment variables. However, because this project uses `env-cmd`, you can create a local `.env` file (ignored by git) instead. Here's what it should look like:

```bash
PGHOST=127.0.0.1
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=url-shortener
PGPORT=5432
PORT=8080

PORT=80
HOSTNAME=http://localhost:80
```

## Libraries used

### Boilerplate Typescript project

This is my boilerplate. There are many like it, but this one is mine.

* **Typescript** — compiler for Typescript files, so I can use Typescript
* **Prettier** — code formatter, so my code is pretty (used with ESLint, below)
* **Jest** - testing framework, so I can have tests
* **TS-Jest** - Typescript pre-processor for Jest, so I can have Typescript tests
* **ESLint** — linter, to keep my code nice, with plugins:
  * **Prettier plugin**
  * **Prettier config**
  * **Promise plugin**
  * **Jest plugin**
  * **Import plugin**
  * **Promise plugin**
  * **Typescript plugin**
  * **Typescript parser**
* **Husky** — git hook integration, to force linter to run before commit
* **lint-staged** — to run linter only on staged files
* **Source map support** — so that my stacktraces show my Typescript traces
* **env-cmd** — so I can use project-specifig .env files

### HTTP API server

* **Express** - standard router and server. It's industry standart, but I'm a bit unhappy with it's liberal use of `any` and should probably find a better alternative one of those days.
* **Supertest** — to build tests on express

### Postgres

* **pg** — the standard node-postgres driver
* **pgtyped** — I dislike ORMs, but I like type safety and checking my code at compilation time instead of run rime. This library allows me to pre-compile my SQL queries against a development database, check them for errors and save type information in my proejct.
* **postgres-migrations** — miminalistic migrations library that have never let me down. Not having down migrations does make development a bit harder, but I still think it's a good decision overall.
* **pg-tx** - minimalistic node-pg transaction wrapper that I wrote. However, I only use transactions for integration tests.

### Logic etc

* **normalize-url** - helps handling client-provided URLs that may be incomplete
* **pug** - templating engine
* **Bulma** — very simple CSS framework so my web pages look just a little bit more sofisticated than c2.com

# Architecture

Project is split into routes, providers and services. Providers are responsible for storage (Postgresql and Redis), routes for interacting with user, and services for business logic.

As a result, I have `shorten.ts` service, `shorten.ts` api route and `shorten.ts` www route. To be honest, it looks quite silly. I should probably medidate on how build this kind of architecture in less of an architecture-astronaut type of way.

Since I want app to be integration tested with cancelled transactions, I want to inject database client instance into all routes. But since there aren't many routes and dependencies, I decided not to use any DI frameworks and just use simple class constructors instead.