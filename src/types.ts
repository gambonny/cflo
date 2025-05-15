import type { InferOutput } from "valibot"
import type { LoggerConfigContract } from "@/contracts"

// exports
export type LoggerConfig = InferOutput<typeof LoggerConfigContract>
export type LogMethod = (msg: string, meta?: unknown) => void

export interface Logger {
	debug: LogMethod
	info: LogMethod
	log: LogMethod
	warn: LogMethod
	error: LogMethod
}
