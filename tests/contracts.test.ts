import { beforeEach, describe, expect, it, vi } from "vitest"
import { validateLoggerConfig } from "../src/contracts"
import { getSupportedFormats } from "../src/formats"
import { getSupportedLevels } from "../src/levels"

describe("validateLoggerConfig", () => {
	const levelDefault = getSupportedLevels()[0]
	const formatDefault = getSupportedFormats()[0]

	beforeEach(() => {
		vi.resetAllMocks()
		vi.spyOn(console, "warn").mockImplementation(() => {})
	})

	it("returns config when valid", () => {
		const result = validateLoggerConfig({
			level: levelDefault,
			format: formatDefault,
		})

		expect(result.level).toBe(levelDefault)
		expect(result.format).toBe(formatDefault)
	})

	it("falls back to default when config is empty", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

		const result = validateLoggerConfig({})

		expect(result.level).toBe(levelDefault)
		expect(result.format).toBe(formatDefault)
		expect(warn).toHaveBeenCalledOnce()
		expect(warn.mock.calls[0][0]).toContain("Invalid logger config received")
	})

	it("falls back when config has invalid level", () => {
		const result = validateLoggerConfig({
			level: "banana",
			format: formatDefault,
		})

		expect(result.level).toBe(levelDefault)
		expect(result.format).toBe(formatDefault)
	})

	it("falls back when config has invalid format", () => {
		const result = validateLoggerConfig({
			level: levelDefault,
			format: "rainbow",
		})

		expect(result.level).toBe(levelDefault)
		expect(result.format).toBe(formatDefault)
	})

	it("does not throw for completely invalid input", () => {
		const result = validateLoggerConfig(null)

		expect(result.level).toBe(levelDefault)
		expect(result.format).toBe(formatDefault)
	})
})
