import { validateLoggerConfig } from "@/contracts"
import { formatLog } from "@/formatter"
import { getSupportedLevels, shouldLogLevel } from "@/levels"
import type { Logger, LoggerConfig } from "@/types"
import type { JsonObject } from "type-fest"

const supportedLevels = getSupportedLevels()

export function createLogger(
	input: LoggerConfig,
	context?: JsonObject,
): Logger {
	const config = validateLoggerConfig(input)
	const logger: Partial<Logger> = {}

	for (const level of supportedLevels) {
		logger[level] = (msg, meta) => {
			if (!shouldLogLevel(level, config.level)) return

			const metaWithContext = context ? { ...meta, context } : meta
			console[level](formatLog(level, config.format, msg, metaWithContext))
		}
	}

	return new Proxy(logger as Logger, {
		get(target, prop) {
			if (prop in target) return target[prop as keyof Logger]
			console.warn(
				`logger.${String(prop)} is not supported in this environment. Supported: ${supportedLevels.join(", ")}`,
			)
			return () => {}
		},
	})
}

export type { Logger, LoggerConfig } from "@/types"
