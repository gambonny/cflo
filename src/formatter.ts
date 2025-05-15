import type { LoggerConfig } from "@/types"

export function formatLog(
	level: LoggerConfig["level"],
	format: LoggerConfig["format"],
	msg: string,
	meta?: unknown,
): string {
	if (format === "json") {
		return JSON.stringify({
			ts: Date.now(),
			level,
			msg,
			meta,
		})
	}

	return `[${level.toUpperCase()}] ${msg}${meta ? `\n→ ${JSON.stringify(meta)}` : ""}`
}
