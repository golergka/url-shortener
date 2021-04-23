/** Types generated for queries found in "src/providers/url.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'GetOriginal' parameters type */
export interface IGetOriginalParams {
	short: string | null | void
}

/** 'GetOriginal' return type */
export interface IGetOriginalResult {
	original: string
}

/** 'GetOriginal' query type */
export interface IGetOriginalQuery {
	params: IGetOriginalParams
	result: IGetOriginalResult
}

const getOriginalIR: any = {
	name: 'getOriginal',
	params: [
		{
			name: 'short',
			transform: { type: 'scalar' },
			codeRefs: { used: [{ a: 65, b: 69, line: 4, col: 15 }] }
		}
	],
	usedParamSet: { short: true },
	statement: {
		body: 'SELECT original\nFROM urls\nWHERE short = :short',
		loc: { a: 24, b: 69, line: 2, col: 0 }
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
export const getOriginal = new PreparedQuery<
	IGetOriginalParams,
	IGetOriginalResult
>(getOriginalIR)
