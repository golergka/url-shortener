import Redis from 'ioredis'
import { Pool, PoolClient } from 'pg'
import tx from '../tx'
import { createUser, getUserById, getUserByName } from './user.queries'

export type User = {
	id: number
	username: string
}

export function isUser(value: any): value is User {
	return (
		value &&
		typeof value['id'] === 'number' &&
		typeof value['username'] === 'string'
	)
}

export type UserWithHash = User & { passwordHash: string }

function isUserWithHash(value: any): value is UserWithHash {
	return value && typeof value['passwordHash'] === 'string' && isUser(value)
}

export class UserProvider {
	public constructor(
		private readonly pg: Pool | PoolClient,
		private readonly redis?: Redis.Redis
	) {}

	makeRedisKey(id: number): string
	makeRedisKey(name: string): string
	makeRedisKey(key: string | number): string
	makeRedisKey(user: User): { idKey: string; nameKey: string }
	makeRedisKey(
		param: string | number | User
	): string | { idKey: string; nameKey: string } {
		if (isUser(param)) {
			const { id, username } = param
			return {
				idKey: `user:id:${id}`,
				nameKey: `user:name:${username}`
			}
		} else if (typeof param === 'string') {
			return `user:name:${param}`
		} else if (typeof param === 'number') {
			return `user:id:${param}`
		} else {
			throw new TypeError(`invalid param: ${param}`)
		}
	}

	async cache(user: UserWithHash | null): Promise<void> {
		if (!this.redis || !user) {
			return
		}

		const { idKey, nameKey } = this.makeRedisKey(user)
		await Promise.all([
			this.redis.set(idKey, JSON.stringify(user)),
			this.redis.set(nameKey, JSON.stringify(user))
		])
	}

	async getCached(username: string): Promise<UserWithHash | null>
	async getCached(id: number): Promise<UserWithHash | null>
	async getCached(param: string | number): Promise<UserWithHash | null> {
		if (!this.redis) {
			return null
		}

		const key = this.makeRedisKey(param)
		const json = await this.redis.get(key)
		if (!json) {
			return null // This is where a result monad would be awesome
		}

		let user
		try {
			user = JSON.parse(json)
		} catch (e) {
			if (e instanceof SyntaxError) {
				await this.redis.del(key)
				return null
			} else {
				throw e
			}
		}

		if (!isUserWithHash(user)) {
			await this.redis.del(key)
			return null
		}

		return user
	}

	public async createUser(
		username: string,
		passwordHash: string
	): Promise<User | null> {
		const cached = await this.getCached(username)
		if (cached) {
			return null
		}

		const user = await tx(this.pg, async (db) => {
			const [existingUser] = await getUserByName.run({ username }, db)
			if (existingUser) {
				return null
			}
			const [{ id }] = await createUser.run({ username, passwordHash }, db)
			return { id, username, passwordHash }
		})

		await this.cache(user)
		return user
	}

	public async getUserByName(username: string): Promise<UserWithHash | null> {
		const cached = await this.getCached(username)
		if (cached) {
			return cached
		}

		const [user] = await getUserByName.run({ username }, this.pg)

		await this.cache(user)
		return user
	}

	public async getUserById(id: number): Promise<UserWithHash | null> {
		const cached = await this.getCached(id)
		if (cached) {
			return cached
		}

		const [user] = await getUserById.run({ id }, this.pg)

		await this.cache(user)
		return user
	}
}
