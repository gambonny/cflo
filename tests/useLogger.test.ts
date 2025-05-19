import { describe, it, expect, vi, beforeEach } from "vitest"
import { Hono } from "hono"
import { useLogger } from "../src/integrations/hono/useLogger"
import type { LoggerConfig, GetLoggerFn } from "../src/types"
import { getSupportedLevels } from "../src/levels"

describe("useLogger middleware", () => {
	const outputs: string[] = []

	beforeEach(() => {
		outputs.length = 0
		for (const level of getSupportedLevels()) {
			vi.spyOn(console, level).mockImplementation(msg => {
				outputs.push(msg)
			})
		}
	})

	it("injects getLogger into context and logs with correct route", async () => {
		const app = new Hono<{
			Variables: { getLogger: GetLoggerFn }
		}>()

		const config: LoggerConfig = {
			level: "info",
			format: "json",
		}

		app.use(useLogger(config))

		app.get("/signup", c => {
			const logger = c.var.getLogger({ route: "auth.routes.signup" })
			logger.info("User signed up", {
				event: "user.signup.success",
				scope: "db.write",
				user_id: "u_456",
			})
			return c.text("ok")
		})

		const res = await app.request("/signup")
		expect(res.status).toBe(200)

		const log = outputs.find(line => line.includes("User signed up"))
		if (!log)
			throw new Error("Expected log containing 'User signed up' not found")

		const json = JSON.parse(log)
		expect(json.level).toBe("info")
		expect(json.meta.route).toBe("auth.routes.signup")
		expect(json.meta.event).toBe("user.signup.success")
		expect(json.meta.scope).toBe("db.write")
		expect(json.meta.user_id).toBe("u_456")
	})

	it("logs correctly when getLogger is called with no route", async () => {
		const app = new Hono<{
			Variables: { getLogger: GetLoggerFn }
		}>()

		const config: LoggerConfig = {
			level: "info",
			format: "json",
		}

		app.use(useLogger(config))

		app.get("/health", c => {
			const logger = c.var.getLogger()
			logger.info("health:ping", {
				event: "system.health.ping",
				scope: "system.health",
			})
			return c.text("ok")
		})

		const res = await app.request("/health")
		expect(res.status).toBe(200)

		const log = outputs.find(line => line.includes("health:ping"))
		if (!log) throw new Error("Expected log containing 'health:ping' not found")

		const json = JSON.parse(log)
		expect(json.level).toBe("info")
		expect(json.meta.route).toBeUndefined() // no route injected
		expect(json.meta.event).toBe("system.health.ping")
		expect(json.meta.scope).toBe("system.health")
	})
})
