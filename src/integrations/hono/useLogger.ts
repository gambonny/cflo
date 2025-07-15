import { createLogger } from "@/index"
import type { GetLoggerFn, Logger, LoggerConfig, Meta } from "@/types"
import type { MiddlewareHandler } from "hono"

export function useLogger(config: LoggerConfig): MiddlewareHandler {
	const baseLogger = createLogger(config)

	return async (c, next) => {
		const getLogger: GetLoggerFn = context => {
			const scoped: Partial<Logger> = {}

			for (const lvl of Object.keys(baseLogger) as Array<keyof Logger>) {
				scoped[lvl] = (msg: string, meta?: Meta) => {
					const merged: Meta = { ...(context ?? {}), ...(meta ?? {}) }
					baseLogger[lvl](msg, merged)
				}
			}
			return scoped as Logger
		}

		c.set("getLogger", getLogger)
		await next()
	}
}
