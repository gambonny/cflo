export const getSupportedLevels = () =>
	["debug", "info", "log", "warn", "error"] as const

export const levelOrder = {
	debug: 0,
	info: 1,
	log: 2,
	warn: 3,
	error: 4,
}
