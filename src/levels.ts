export const logLevels = ["debug", "info", "log", "warn", "error"] as const
export type LogLevel = (typeof logLevels)[number]

export function getSupportedLevels(): LogLevel {
	return logLevels
}

export const levelOrder = {
	debug: 0,
	info: 1,
	log: 2,
	warn: 3,
	error: 4,
}
