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

	it("injects getLogger context (route + extra keys) into every log", async () => {
		const app = new Hono<{
			Variables: { getLogger: GetLoggerFn }
		}>()

		const config: LoggerConfig = { level: "info", format: "json" }
		app.use(useLogger(config))

		app.get("/signup", c => {
			const logger = c.var.getLogger({
				route: "auth.routes.signup",
				email_hash: "deadbeef",
				user_id: "u_456",
			})
			logger.info("User signed up", {
				event: "user.signup.success",
				scope: "db.write",
			})
			return c.text("ok")
		})

		const res = await app.request("/signup")
		expect(res.status).toBe(200)

		const logLine = outputs.find(l => l.includes("User signed up"))
		if (!logLine) throw new Error("Expected log not found")

		const json = JSON.parse(logLine)

		expect(json.level).toBe("info")
		expect(json.meta).toEqual({
			event: "user.signup.success",
			scope: "db.write",
			route: "auth.routes.signup",
			email_hash: "deadbeef",
			user_id: "u_456",
		})
	})

	it("logs correctly when getLogger is called with no route/context", async () => {
		const app = new Hono<{
			Variables: { getLogger: GetLoggerFn }
		}>()

		const config: LoggerConfig = { level: "info", format: "json" }
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

		const logLine = outputs.find(l => l.includes("health:ping"))
		if (!logLine) throw new Error("Expected log not found")

		const json = JSON.parse(logLine)

		expect(json.level).toBe("info")
		expect(json.meta.route).toBeUndefined() // no route injected
		expect(json.meta.event).toBe("system.health.ping")
		expect(json.meta.scope).toBe("system.health")
	})
})
