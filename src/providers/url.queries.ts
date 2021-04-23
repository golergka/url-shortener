/** Types generated for queries found in "src/providers/url.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'GetOriginalUrl' parameters type */
export interface IGetOriginalUrlParams {
	short: string | null | void
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
			codeRefs: { used: [{ a: 68, b: 72, line: 4, col: 15 }] }
		}
	],
	usedParamSet: { short: true },
	statement: {
		body: 'SELECT original\nFROM urls\nWHERE short = :short',
		loc: { a: 27, b: 72, line: 2, col: 0 }
	}
}

/**
 * Query generated from SQL:
 * ```
 * SELECT original
 * FROM urls
 * WHERE short = :short
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
}

/** 'TryStoreUrl' return type */
export interface ITryStoreUrlResult {
	original: string
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
			name: 'short',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 144, b: 148, line: 8, col: 9 }] }
		},
		{
			name: 'original',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 152, b: 159, line: 8, col: 17 }] }
		}
	],
	usedParamSet: { short: true, original: true },
	statement: {
		body:
			'INSERT INTO urls (short, original)\nVALUES (:short, :original)\nON CONFLICT DO NOTHING\nRETURNING original',
		loc: { a: 100, b: 202, line: 7, col: 0 }
	}
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO urls (short, original)
 * VALUES (:short, :original)
 * ON CONFLICT DO NOTHING
 * RETURNING original
 * ```
 */
export const tryStoreUrl = new PreparedQuery<
	ITryStoreUrlParams,
	ITryStoreUrlResult
>(tryStoreUrlIR)
