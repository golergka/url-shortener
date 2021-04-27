import { VerifyFunction } from 'passport-local'
import { User, UserProvider } from '../providers/user'
import bcrypt from 'bcrypt'
import { UrlProvider } from '../providers/url'

export type RegisterProblem =
	| { result: 'invalid_password'; input: 'password' }
	| { result: 'user_exists'; input: 'username' }
	| { result: 'invalid_username'; input: 'username' }
export type RegisterResult =
	| { success: true; user: User }
	| { success: false; problems: RegisterProblem[] }

const usernameRegex = /^[a-zA-Z0-9\-_]{3,20}$/m
const passwordRegex = /^[a-zA-Z0-9\-_]{8,64}$/m

export class UserService {
	public constructor(
		private readonly userProvider: UserProvider,
		private readonly urlProvider: UrlProvider
	) {}

	public login: VerifyFunction = async (username, password, done) => {
		const user = await this.userProvider.getUserByName(username)

		if (!user) {
			done(null, false, { message: `invalid_username` })
			return undefined
		}
		const { passwordHash } = user
		const passwordCheck = await bcrypt.compare(password, passwordHash)
		if (!passwordCheck) {
			done(null, false, { message: `invalid_password` })
		}
		const { id } = user

		return done(null, { id, username })
	}

	public register = async (
		username: string,
		password: string,
		urlIds: number[]
	): Promise<RegisterResult> => {
		const problems: RegisterProblem[] = []

		if (!password || !passwordRegex.test(password)) {
			problems.push({ result: 'invalid_password', input: 'password' })
		}

		if (!username || !usernameRegex.test(username)) {
			problems.push({ result: 'invalid_username', input: 'username' })
		}

		if (problems.length) {
			const oldUser = await this.userProvider.getUserByName(username)
			if (oldUser) {
				problems.push({ result: 'user_exists', input: 'username' })
			}

			return { success: false, problems }
		} else {
			const passwordHash = await bcrypt.hash(password, 10)
			const user = await this.userProvider.createUser(username, passwordHash)
			if (!user) {
				problems.push({ result: 'user_exists', input: 'username' })
				return { success: false, problems }
			} else {
				if (urlIds.length > 0) {
					await this.urlProvider.setUrlsUser(urlIds, user.id)
				}
				return { success: true, user }
			}
		}
	}

	public serializeUser = (
		user: Express.User,
		done: (err: any, id?: number) => void
	): void => {
		done(null, (user as User).id)
	}

	public deserializeUser = (
		id: number,
		done: (err: any, user?: Express.User | false | null) => void
	): void => {
		this.userProvider
			.getUserById(id)
			.then((user) => {
				if (!user) {
					return done(null, null)
				} else {
					// Do not let passwordHash get out of this level
					const { username, id } = user
					return done(null, { username, id })
				}
			})
			.catch(done)
	}
}
