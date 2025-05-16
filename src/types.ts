import type { LoggerConfigContract } from "@/contracts"
import type { RequireAllOrNone } from "type-fest"
import type { InferOutput } from "valibot"

// Restrict each segment to lowercase only
type LowercaseSegment = `${Lowercase<string>}`

// Recursive pattern: at least one dot required
export type DotSeparated =
	| `${LowercaseSegment}.${LowercaseSegment}`
	| `${LowercaseSegment}.${LowercaseSegment}.${LowercaseSegment}`
	| `${LowercaseSegment}.${LowercaseSegment}.${LowercaseSegment}.${LowercaseSegment}`
	| `${LowercaseSegment}.${LowercaseSegment}.${LowercaseSegment}.${LowercaseSegment}.${LowercaseSegment}`

type StructuredMeta = {
	event: DotSeparated
	scope: DotSeparated
}

export type Meta = RequireAllOrNone<StructuredMeta> & {
	[key: string]: unknown
}

// exports
export type LoggerConfig = InferOutput<typeof LoggerConfigContract>
export type LogMethod = (msg: string, meta: Meta) => void

export interface Logger {
	debug: LogMethod
	info: LogMethod
	log: LogMethod
	warn: LogMethod
	error: LogMethod
}
