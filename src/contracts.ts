import * as v from "valibot"

import { getSupportedLevels } from "@/levels"
import { getSupportedFormats } from "@/formats"

const [levelDebug, ...restOfSupportedLevels] = getSupportedLevels()
const [formatPretty, ...restOfSupportedFormats] = getSupportedFormats()

export const createLoggerContract = v.object({
	level: v.fallback(
		v.picklist([levelDebug].concat(restOfSupportedLevels)),
		levelDebug,
	),
	format: v.fallback(
		v.picklist([formatPretty].concat(restOfSupportedFormats)),
		formatPretty,
	),
})
