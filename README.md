# URL-shortener

## Tasks

### Baseline

* [ ] Shorten URLs via API
* [ ] Redirect from short URL to original URL
* [ ] Web app

### Non-functional improvements

* [ ] Caching (Redis)
* [ ] Error reporting (Sentry)
* [ ] Containerize (Docker)
* [ ] Cluster (Kubernetes)
* [ ] Monitoring (Prometeus+Grafana ?)
* [ ] Logs collection (AWS Cloudwatchs / ELK)

### Functional improvements

* [ ] Custom short URL
* [ ] Multiple domains
* [ ] User login/registration - separate service and db?
* [ ] Editing links (for logged in users) - Kafka for cache layer update
* [ ] Analytics (Kafka + Clickhouse)

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