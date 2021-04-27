/** Types generated for queries found in "src/providers/user.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'GetUserByName' parameters type */
export interface IGetUserByNameParams {
	username: string | null | void
}

/** 'GetUserByName' return type */
export interface IGetUserByNameResult {
	id: number
	username: string
	passwordHash: string
}

/** 'GetUserByName' query type */
export interface IGetUserByNameQuery {
	params: IGetUserByNameParams
	result: IGetUserByNameResult
}

const getUserByNameIR: any = {
	name: 'getUserByName',
	params: [
		{
			name: 'username',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 110, b: 117, line: 5, col: 18 }] }
		}
	],
	usedParamSet: { username: true },
	statement: {
		body:
			'SELECT\n  id, username, password_hash AS "passwordHash"\nFROM users\nWHERE username = :username',
		loc: { a: 26, b: 117, line: 2, col: 0 }
	}
}

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id, username, password_hash AS "passwordHash"
 * FROM users
 * WHERE username = :username
 * ```
 */
export const getUserByName = new PreparedQuery<
	IGetUserByNameParams,
	IGetUserByNameResult
>(getUserByNameIR)

/** 'GetUserById' parameters type */
export interface IGetUserByIdParams {
	id: number | null | void
}

/** 'GetUserById' return type */
export interface IGetUserByIdResult {
	id: number
	username: string
	passwordHash: string
}

/** 'GetUserById' query type */
export interface IGetUserByIdQuery {
	params: IGetUserByIdParams
	result: IGetUserByIdResult
}

const getUserByIdIR: any = {
	name: 'getUserById',
	params: [
		{
			name: 'id',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 223, b: 224, line: 11, col: 12 }] }
		}
	],
	usedParamSet: { id: true },
	statement: {
		body:
			'SELECT\n  id, username, password_hash AS "passwordHash"\nFROM users\nWHERE id = :id',
		loc: { a: 145, b: 224, line: 8, col: 0 }
	}
}

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id, username, password_hash AS "passwordHash"
 * FROM users
 * WHERE id = :id
 * ```
 */
export const getUserById = new PreparedQuery<
	IGetUserByIdParams,
	IGetUserByIdResult
>(getUserByIdIR)

/** 'CreateUser' parameters type */
export interface ICreateUserParams {
	username: string | null | void
	passwordHash: string | null | void
}

/** 'CreateUser' return type */
export interface ICreateUserResult {
	id: number
}

/** 'CreateUser' query type */
export interface ICreateUserQuery {
	params: ICreateUserParams
	result: ICreateUserResult
}

const createUserIR: any = {
	name: 'createUser',
	params: [
		{
			name: 'username',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 304, b: 311, line: 15, col: 9 }] }
		},
		{
			name: 'passwordHash',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 315, b: 326, line: 15, col: 20 }] }
		}
	],
	usedParamSet: { username: true, passwordHash: true },
	statement: {
		body:
			'INSERT INTO users (username, password_hash)\nVALUES (:username, :passwordHash)\nRETURNING id',
		loc: { a: 251, b: 340, line: 14, col: 0 }
	}
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (username, password_hash)
 * VALUES (:username, :passwordHash)
 * RETURNING id
 * ```
 */
export const createUser = new PreparedQuery<
	ICreateUserParams,
	ICreateUserResult
>(createUserIR)

/** 'ChangeUserPasswordHash' parameters type */
export interface IChangeUserPasswordHashParams {
	passwordHash: string | null | void
	id: number | null | void
}

/** 'ChangeUserPasswordHash' return type */
export type IChangeUserPasswordHashResult = void

/** 'ChangeUserPasswordHash' query type */
export interface IChangeUserPasswordHashQuery {
	params: IChangeUserPasswordHashParams
	result: IChangeUserPasswordHashResult
}

const changeUserPasswordHashIR: any = {
	name: 'changeUserPasswordHash',
	params: [
		{
			name: 'passwordHash',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 413, b: 424, line: 20, col: 21 }] }
		},
		{
			name: 'id',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 438, b: 439, line: 21, col: 12 }] }
		}
	],
	usedParamSet: { passwordHash: true, id: true },
	statement: {
		body: 'UPDATE users\nSET password_hash = :passwordHash\nWHERE id = :id',
		loc: { a: 379, b: 439, line: 19, col: 0 }
	}
}

/**
 * Query generated from SQL:
 * ```
 * UPDATE users
 * SET password_hash = :passwordHash
 * WHERE id = :id
 * ```
 */
export const changeUserPasswordHash = new PreparedQuery<
	IChangeUserPasswordHashParams,
	IChangeUserPasswordHashResult
>(changeUserPasswordHashIR)
