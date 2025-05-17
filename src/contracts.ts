import { getSupportedFormats } from "@/formats"
import { getSupportedLevels } from "@/levels"
import type { LoggerConfig } from "@/types"
import type { UnknownRecord } from "type-fest"
import * as v from "valibot"

const ContextContract = v.record(v.string(), v.unknown())

export const LoggerConfigContract = v.object({
	level: v.picklist(getSupportedLevels()),
	format: v.picklist(getSupportedFormats()),
	context: v.optional(ContextContract),
})

const [levelFallback] = getSupportedLevels()
const [formatFallback] = getSupportedFormats()

export function validateLoggerConfig(input: unknown): LoggerConfig {
	const result = v.safeParse(LoggerConfigContract, input)

	if (!result.success) {
		console.warn(
			"[cflo] Invalid logger config received. Falling back to defaults:",
			JSON.stringify(v.flatten(result.issues), null, 2),
		)

		// Recover context even if config validation failed
		const { context: maybeContext } = result.output as UnknownRecord
		const contextResult = v.safeParse(ContextContract, maybeContext)

		if (contextResult.success) {
			return {
				level: levelFallback,
				format: formatFallback,
				context: contextResult.output,
			}
		}

		return {
			level: levelFallback,
			format: formatFallback,
		}
	}

	return result.output
}
