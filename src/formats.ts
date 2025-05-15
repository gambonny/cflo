const logFormats = ["pretty", "json"] as const

export function getSupportedFormats(): readonly (typeof logFormats)[number][] {
	return logFormats
}
