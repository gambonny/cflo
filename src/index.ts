import { validateLoggerConfig } from "@/contracts"
import { formatLog } from "@/formatter"
import { getSupportedLevels, shouldLogLevel } from "@/levels"
import type { Logger, LoggerConfig } from "@/types"

export function createLogger({ level, format, context }: LoggerConfig): Logger {
	const config = validateLoggerConfig({ level, format })
	const logger: Partial<Logger> = {}

	for (const level of getSupportedLevels()) {
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
				`logger.${String(prop)} is not supported in this environment. Supported: ${getSupportedLevels().join(", ")}`,
			)
			return () => {}
		},
	})
}

export { useLogger } from "@/integrations/hono/useLogger"
export type { Logger, LoggerConfig, DotSeparated, GetLoggerFn } from "@/types"
