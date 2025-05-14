import type { LogFormat, LogLevel } from "./types"

export function formatLog(
	level: LogLevel,
	format: LogFormat,
	hostname: string,
	msg: string,
	meta?: unknown,
): string {
	if (format === "json") {
		return JSON.stringify({
			ts: Date.now(),
			level,
			msg,
			meta,
			hostname,
		})
	}

	return `[${level.toUpperCase()}] ${msg}${meta ? `\n→ ${JSON.stringify(meta)}` : ""}`
}
