const logLevels = ["debug", "info", "log", "warn", "error"] as const

export function getSupportedLevels(): readonly (typeof logLevels)[number][] {
	return logLevels
}

export const levelOrder = {
	debug: 0,
	info: 1,
	log: 2,
	warn: 3,
	error: 4,
}
