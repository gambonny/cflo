import type { getSupportedLevels } from "./levels"

export type LogLevel = ReturnType<typeof getSupportedLevels>[number]
export type LogFormat = "pretty" | "json"

export interface LoggerConfig {
	level: LogLevel
	format: LogFormat
	hostname?: string
}

export type LogMethod = (msg: string, meta?: unknown) => void

export interface Logger {
	debug: LogMethod
	info: LogMethod
	log: LogMethod
	warn: LogMethod
	error: LogMethod
}
