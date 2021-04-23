/** Types generated for queries found in "src/server.ts" */

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
