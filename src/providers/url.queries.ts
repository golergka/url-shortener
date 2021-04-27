/** Types generated for queries found in "src/providers/url.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'GetOriginalUrl' parameters type */
export interface IGetOriginalUrlParams {
	alias: string | null | void
	domainID: number | null | void
}

/** 'GetOriginalUrl' return type */
export interface IGetOriginalUrlResult {
	original: string
}

/** 'GetOriginalUrl' query type */
export interface IGetOriginalUrlQuery {
	params: IGetOriginalUrlParams
	result: IGetOriginalUrlResult
}

const getOriginalUrlIR: any = {
	name: 'getOriginalUrl',
	params: [
		{
			name: 'alias',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 73, b: 77, line: 6, col: 11 }] }
		},
		{
			name: 'domainID',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 98, b: 105, line: 7, col: 15 }] }
		}
	],
	usedParamSet: { alias: true, domainID: true },
	statement: {
		body:
			'SELECT\n  original\nFROM urls \nWHERE\n  alias = :alias AND\n  domain_id = :domainID',
		loc: { a: 27, b: 105, line: 2, col: 0 }
	}
}

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   original
 * FROM urls
 * WHERE
 *   alias = :alias AND
 *   domain_id = :domainID
 * ```
 */
export const getOriginalUrl = new PreparedQuery<
	IGetOriginalUrlParams,
	IGetOriginalUrlResult
>(getOriginalUrlIR)

/** 'TryStoreUrl' parameters type */
export interface ITryStoreUrlParams {
	alias: string | null | void
	original: string | null | void
	domainId: number | null | void
	userId: number | null | void
}

/** 'TryStoreUrl' return type */
export interface ITryStoreUrlResult {
	id: number
}

/** 'TryStoreUrl' query type */
export interface ITryStoreUrlQuery {
	params: ITryStoreUrlParams
	result: ITryStoreUrlResult
}

const tryStoreUrlIR: any = {
	name: 'tryStoreUrl',
	params: [
		{
			name: 'alias',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 197, b: 201, line: 11, col: 9 }] }
		},
		{
			name: 'original',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 205, b: 212, line: 11, col: 17 }] }
		},
		{
			name: 'domainId',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 216, b: 223, line: 11, col: 28 }] }
		},
		{
			name: 'userId',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 227, b: 232, line: 11, col: 39 }] }
		}
	],
	usedParamSet: { alias: true, original: true, domainId: true, userId: true },
	statement: {
		body:
			'INSERT INTO urls (alias, original, domain_id, user_id)\nVALUES (:alias, :original, :domainId, :userId)\nON CONFLICT DO NOTHING\nRETURNING id',
		loc: { a: 133, b: 269, line: 10, col: 0 }
	}
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO urls (alias, original, domain_id, user_id)
 * VALUES (:alias, :original, :domainId, :userId)
 * ON CONFLICT DO NOTHING
 * RETURNING id
 * ```
 */
export const tryStoreUrl = new PreparedQuery<
	ITryStoreUrlParams,
	ITryStoreUrlResult
>(tryStoreUrlIR)

/** 'GetDomainId' parameters type */
export interface IGetDomainIdParams {
	domain: string | null | void
}

/** 'GetDomainId' return type */
export interface IGetDomainIdResult {
	id: number
}

/** 'GetDomainId' query type */
export interface IGetDomainIdQuery {
	params: IGetDomainIdParams
	result: IGetDomainIdResult
}

const getDomainIdIR: any = {
	name: 'getDomainId',
	params: [
		{
			name: 'domain',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 336, b: 341, line: 18, col: 16 }] }
		}
	],
	usedParamSet: { domain: true },
	statement: {
		body: 'SELECT id\nFROM domains\nWHERE domain = :domain',
		loc: { a: 297, b: 341, line: 16, col: 0 }
	}
}

/**
 * Query generated from SQL:
 * ```
 * SELECT id
 * FROM domains
 * WHERE domain = :domain
 * ```
 */
export const getDomainId = new PreparedQuery<
	IGetDomainIdParams,
	IGetDomainIdResult
>(getDomainIdIR)

/** 'GetDomains' parameters type */
export type IGetDomainsParams = void

/** 'GetDomains' return type */
export interface IGetDomainsResult {
	id: number
	domain: string
}

/** 'GetDomains' query type */
export interface IGetDomainsQuery {
	params: IGetDomainsParams
	result: IGetDomainsResult
}

const getDomainsIR: any = {
	name: 'getDomains',
	params: [],
	usedParamSet: {},
	statement: {
		body: 'SELECT id, domain\nFROM domains',
		loc: { a: 368, b: 397, line: 21, col: 0 }
	}
}

/**
 * Query generated from SQL:
 * ```
 * SELECT id, domain
 * FROM domains
 * ```
 */
export const getDomains = new PreparedQuery<
	IGetDomainsParams,
	IGetDomainsResult
>(getDomainsIR)

/** 'SetUrlsUserId' parameters type */
export interface ISetUrlsUserIdParams {
	urlIds: readonly (number | null | void)[]
	userId: number | null | void
}

/** 'SetUrlsUserId' return type */
export type ISetUrlsUserIdResult = void

/** 'SetUrlsUserId' query type */
export interface ISetUrlsUserIdQuery {
	params: ISetUrlsUserIdParams
	result: ISetUrlsUserIdResult
}

const setUrlsUserIdIR: any = {
	name: 'setUrlsUserId',
	params: [
		{
			name: 'urlIds',
			codeRefs: {
				defined: { a: 437, b: 442, line: 26, col: 9 },
				used: [{ a: 503, b: 508, line: 30, col: 13 }]
			},
			transform: { type: 'array_spread' }
		},
		{
			name: 'userId',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 483, b: 488, line: 29, col: 15 }] }
		}
	],
	usedParamSet: { userId: true, urlIds: true },
	statement: {
		body: 'UPDATE urls\nSET user_id = :userId\nWHERE id IN :urlIds',
		loc: { a: 456, b: 508, line: 28, col: 0 }
	}
}

/**
 * Query generated from SQL:
 * ```
 * UPDATE urls
 * SET user_id = :userId
 * WHERE id IN :urlIds
 * ```
 */
export const setUrlsUserId = new PreparedQuery<
	ISetUrlsUserIdParams,
	ISetUrlsUserIdResult
>(setUrlsUserIdIR)

/** 'SetUrlAlias' parameters type */
export interface ISetUrlAliasParams {
	alias: string | null | void
	urlId: number | null | void
	userId: number | null | void
}

/** 'SetUrlAlias' return type */
export interface ISetUrlAliasResult {
	id: number
	alias: string
}

/** 'SetUrlAlias' query type */
export interface ISetUrlAliasQuery {
	params: ISetUrlAliasParams
	result: ISetUrlAliasResult
}

const setUrlAliasIR: any = {
	name: 'setUrlAlias',
	params: [
		{
			name: 'alias',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 561, b: 565, line: 34, col: 13 }] }
		},
		{
			name: 'urlId',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 582, b: 586, line: 36, col: 8 }] }
		},
		{
			name: 'userId',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 605, b: 610, line: 37, col: 13 }] }
		}
	],
	usedParamSet: { alias: true, urlId: true, userId: true },
	statement: {
		body:
			'UPDATE urls\nSET alias = :alias\nWHERE \n  id = :urlId AND\n  user_id = :userId\nRETURNING id, alias',
		loc: { a: 536, b: 630, line: 33, col: 0 }
	}
}

/**
 * Query generated from SQL:
 * ```
 * UPDATE urls
 * SET alias = :alias
 * WHERE
 *   id = :urlId AND
 *   user_id = :userId
 * RETURNING id, alias
 * ```
 */
export const setUrlAlias = new PreparedQuery<
	ISetUrlAliasParams,
	ISetUrlAliasResult
>(setUrlAliasIR)
