export module 'express-session' {
	export interface SessionData {
		links?: { short: string; original: string; id: number }[]
	}
}
