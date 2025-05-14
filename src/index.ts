import type { Logger, LoggerConfig, LogLevel } from "./types"
import { getSupportedLevels, levelOrder } from "./levels"
import { formatLog } from "./format"

export function createLogger(config: LoggerConfig): Logger {
	const supported = getSupportedLevels()

	const shouldLog = (level: LogLevel): boolean => {
		return levelOrder[level] >= levelOrder[config.level]
	}

	const logger: Partial<Logger> = {}

	for (const level of supported) {
		logger[level] = (msg, meta) => {
			if (!shouldLog(level)) return
			console[level](
				formatLog(
					level,
					config.format,
					config.hostname ?? "unknown",
					msg,
					meta,
				),
			)
		}
	}

	return new Proxy(logger as Logger, {
		get(target, prop) {
			if (prop in target) return target[prop as keyof Logger]
			console.warn(
				`logger.${String(prop)} is not supported in this environment. Supported: ${supported.join(", ")}`,
			)
			return () => {}
		},
	})
}

export type { Logger, LoggerConfig } from "./types"
