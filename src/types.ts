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
// `context` is reserved for internal use and injected automatically during logger creation.
// To prevent accidental overrides, it is explicitly forbidden in the public API.
export type LogMethod = (msg: string, meta: Meta & { context?: never }) => void

export interface Logger {
	debug: LogMethod
	info: LogMethod
	log: LogMethod
	warn: LogMethod
	error: LogMethod
}
