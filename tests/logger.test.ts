import { describe, it, expect, vi, beforeEach } from "vitest"
import { createLogger } from "../src"
import { getSupportedLevels } from "../src/levels"

describe("cflo logger", () => {
	const outputs: string[] = []

	beforeEach(() => {
		outputs.length = 0
		for (const level of getSupportedLevels()) {
			vi.spyOn(console, level).mockImplementation(msg => {
				outputs.push(`[${level}] ${msg}`)
			})
		}
	})

	it("logs messages at or above the active level", () => {
		const logger = createLogger({
			level: "info",
			format: "pretty",
		})

		logger.debug("ignored")
		logger.info("included")
		logger.error("also included")

		expect(outputs.some(s => s.includes("ignored"))).toBe(false)
		expect(outputs.some(s => s.includes("included"))).toBe(true)
		expect(outputs.some(s => s.includes("also included"))).toBe(true)
	})

	it("logs in JSON format correctly", () => {
		const jsonOutput: string[] = []

		vi.spyOn(console, "info").mockImplementation(msg => {
			jsonOutput.push(msg)
		})

		const logger = createLogger({
			level: "debug",
			format: "json",
		})

		logger.info("json test", { id: 123 })

		const raw = jsonOutput.find(s => s.includes("json test"))

		expect(raw).toBeDefined()

		const parsed = JSON.parse(raw ?? "")

		expect(parsed.level).toBe("info")
		expect(parsed.meta).toEqual({ id: 123 })
	})

	it("warns when calling unsupported methods", () => {
		const logger = createLogger({ level: "debug", format: "pretty" })
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

		logger.table()

		expect(warn).toHaveBeenCalledOnce()
		expect(warn.mock.calls[0][0]).toContain("logger.table is not supported")
	})
})
