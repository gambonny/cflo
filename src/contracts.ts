import { getSupportedFormats } from "@/formats"
import { getSupportedLevels } from "@/levels"
import type { LoggerConfig } from "@/types"
import * as v from "valibot"

export const LoggerConfigContract = v.object({
	level: v.picklist(getSupportedLevels()),
	format: v.picklist(getSupportedFormats()),
})

export function validateLoggerConfig(input: unknown): LoggerConfig {
	const result = v.safeParse(LoggerConfigContract, input)

	if (!result.success) {
		console.warn(
			"[cflo] Invalid logger config received. Falling back to defaults:",
			JSON.stringify(v.flatten(result.issues), null, 2),
		)

		return {
			level: getSupportedLevels()[0],
			format: getSupportedFormats()[0],
		}
	}

	return result.output
}
