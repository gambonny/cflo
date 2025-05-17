const logFormats = ["json", "pretty"] as const

export function getSupportedFormats(): readonly (typeof logFormats)[number][] {
	return logFormats
}
