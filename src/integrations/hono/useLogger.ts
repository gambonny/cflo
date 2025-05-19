import { createLogger } from "@/index"
import type { GetLoggerFn, Logger, LoggerConfig, Meta } from "@/types"
import type { DotSeparated } from "@/types"
import type { MiddlewareHandler } from "hono"

export function useLogger(config: LoggerConfig): MiddlewareHandler {
	const logger = createLogger(config)

	return async (c, next) => {
		// Inject getLogger(route) into c.var
		c.set("getLogger", (({ route }: { route?: DotSeparated } = {}): Logger => {
			const scopedLogger: Partial<Logger> = {}

			for (const level of Object.keys(logger) as Array<keyof Logger>) {
				scopedLogger[level] = (msg: string, meta?: Meta) => {
					const mergedMeta: Meta = {
						...meta,
						...(route && !meta?.route ? { route } : {}),
					}
					logger[level](msg, mergedMeta)
				}
			}

			return scopedLogger as Logger
		}) satisfies GetLoggerFn)

		await next()
	}
}
