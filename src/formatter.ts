import type { LoggerConfig, Meta } from "@/types"

export function formatLog(
	level: LoggerConfig["level"],
	format: LoggerConfig["format"],
	msg: string,
	meta?: Meta,
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
