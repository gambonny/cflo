import type { InferOutput } from "valibot"
import type { createLoggerContract } from "./contracts"

// exports
export type LoggerConfig = InferOutput<typeof createLoggerContract>

export type LogMethod = (msg: string, meta?: unknown) => void

export interface Logger {
	debug: LogMethod
	info: LogMethod
	log: LogMethod
	warn: LogMethod
	error: LogMethod
}
