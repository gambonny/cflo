import type { LoggerConfig } from "@/types"

const logLevels = ["debug", "info", "log", "warn", "error"] as const
const levelOrder = {
	debug: 0,
	info: 1,
	log: 2,
	warn: 3,
	error: 4,
}

export function getSupportedLevels(): readonly (typeof logLevels)[number][] {
	return logLevels
}

export const shouldLogLevel = <T extends LoggerConfig["level"]>(
	level: T,
	levelFromConfig: T,
): boolean => {
	return levelOrder[level] >= levelOrder[levelFromConfig]
}
