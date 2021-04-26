/** Types generated for queries found in "src/providers/url.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'GetOriginalUrl' parameters type */
export interface IGetOriginalUrlParams {
	short: string | null | void
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
			name: 'short',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 73, b: 77, line: 6, col: 11 }] }
		},
		{
			name: 'domainID',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 98, b: 105, line: 7, col: 15 }] }
		}
	],
	usedParamSet: { short: true, domainID: true },
	statement: {
		body:
			'SELECT\n  original\nFROM urls \nWHERE\n  short = :short AND\n  domain_id = :domainID',
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
 *   short = :short AND
 *   domain_id = :domainID
 * ```
 */
export const getOriginalUrl = new PreparedQuery<
	IGetOriginalUrlParams,
	IGetOriginalUrlResult
>(getOriginalUrlIR)

/** 'TryStoreUrl' parameters type */
export interface ITryStoreUrlParams {
	short: string | null | void
	original: string | null | void
	domainId: number | null | void
}

/** 'TryStoreUrl' return type */
export type ITryStoreUrlResult = void

/** 'TryStoreUrl' query type */
export interface ITryStoreUrlQuery {
	params: ITryStoreUrlParams
	result: ITryStoreUrlResult
}

const tryStoreUrlIR: any = {
	name: 'tryStoreUrl',
	params: [
		{
			name: 'short',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 188, b: 192, line: 11, col: 9 }] }
		},
		{
			name: 'original',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 196, b: 203, line: 11, col: 17 }] }
		},
		{
			name: 'domainId',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 207, b: 214, line: 11, col: 28 }] }
		}
	],
	usedParamSet: { short: true, original: true, domainId: true },
	statement: {
		body:
			'INSERT INTO urls (short, original, domain_id)\nVALUES (:short, :original, :domainId)\nON CONFLICT DO NOTHING',
		loc: { a: 133, b: 238, line: 10, col: 0 }
	}
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO urls (short, original, domain_id)
 * VALUES (:short, :original, :domainId)
 * ON CONFLICT DO NOTHING
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
			codeRefs: { used: [{ a: 305, b: 310, line: 17, col: 16 }] }
		}
	],
	usedParamSet: { domain: true },
	statement: {
		body: 'SELECT id\nFROM domains\nWHERE domain = :domain',
		loc: { a: 266, b: 310, line: 15, col: 0 }
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
		loc: { a: 337, b: 366, line: 20, col: 0 }
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
