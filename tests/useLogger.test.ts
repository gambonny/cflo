import { describe, it, expect, vi, beforeEach } from "vitest"
import { Hono } from "hono"
import { useLogger } from "../src/integrations/hono/useLogger"
import type { LoggerConfig, LoggerContext } from "../src/types"
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
		const app = new Hono<{ Variables: LoggerContext }>()

		const config: LoggerConfig = {
			level: "info",
			format: "json",
		}

		app.use(useLogger(config))

		app.get("/signup", c => {
			const logger = c.var.getLogger("auth.routes.signup")
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
})
