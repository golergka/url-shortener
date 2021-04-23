import pg from 'pg'
import { migrate } from 'postgres-migrations'

console.log(`⏰ Started migrations...`)
const client = new pg.Pool()
await migrate({ client }, 'migrations')
console.log('🚀 Migrations complete')
process.exit(0)