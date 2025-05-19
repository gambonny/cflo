# cflo

> Minimal, runtime-configurable logger for Cloudflare Workers

<br />

Cloudflare Workers **do not offer built-in log level filtering** — every `console.log`, `debug`, or `info` prints to the log stream unconditionally. This can quickly flood your logs and make it hard to focus on meaningful signals.

`cflo` solves this by introducing a **typed, runtime-configurable logger** that lets you:

- Filter logs by severity
- Choose between `pretty` or `json` output
- Enforce safe logging behavior in edge environments
- Validate log config from environment variables or the Cloudflare dashboard

> 🧠 For example: if you're configuring `LOGGER_LEVEL` from your Worker settings, a typo like `"warnn"` will be **caught at runtime**, and `cflo` will fallback to safe defaults and emit a warning.

<br />

## Log Levels

From lowest to highest:

- `"debug"` (everything logs)
- `"info"`
- `"log"`
- `"warn"`
- `"error"` (only errors log)

If you configure `level: "warn"`, only `warn()` and `error()` will produce output.

<br />

## Features

- ✅ Fully typed: `debug()`, `info()`, `log()`, `warn()`, `error()`
- ✅ Runtime log level filtering
- ✅ `pretty` or `json` output
- ✅ Validates logger configuration (with [Valibot](https://valibot.dev))
- ✅ Safe fallback + warning when misconfigured
- ✅ Designed specifically for Cloudflare Workers

<br />

## Usage

```ts
import { createLogger } from '@gambonny/cflo'

// `createLogger` accepts an options object.
// - `level` and `format` define the logger's behavior.
// - `context` is optional and will be injected into every log as `meta.context`.
// Useful for adding environment-level metadata like `request_id`, `region`, or `deployment_id`.
const logger = createLogger({
  level: 'info',
  format: 'json',
  context{
    request_id: 'abc-123',
    region: 'us-east-1'
  }
})

logger.info('User registered')
logger.debug('This won’t print unless level is set to "debug"')
```

You can safely pass configuration from environment variables like this:

```ts
const logger = createLogger({
  level: env.LOGGER_LEVEL,
  format: env.LOGGER_FORMAT,
})
```

If the config is invalid (e.g. `LOGGER_LEVEL="silent"`), `cflo` will:
- Emit a warning via `console.warn`
- Fallback to `level: "debug"` and `format: "json"`

<br />

## Structured Logging

You can optionally enrich your logs with a structured meta object.

```ts
logger.info('User signed up', {
  event: 'user.signup.success',
  scope: 'auth.routes.signup',
  user_id: 'u_123',
  duration_ms: 142,
  outcome: 'success',
})
```

> ⚠️ Important: `context` is a reserved key that will be automatically injected if passed during `createLogger(...)`.
> You must not include `context` manually in the `meta` object — TypeScript will raise an error if you try.

`event` and `scope` properties must be provided in tandem. This ensures that every log is both semantically meaningful and structurally traceable within the system.

```ts
  event: 'user.signup.success'
  scope: 'auth.routes.signup'
```

They must be lowercase dot-separated strings.

If only one of `event` or `scope` is provided, TypeScript will raise an error.

🔗 See implementation details in [#1](https://github.com/gambonny/cflo/pull/1) – Enforce structured meta in logger

<br />

## Hono Integration

If you're using [Hono](https://hono.dev/) in your Cloudflare Worker, you can use the built-in middleware `useLogger()` to inject a route-scoped logger directly into your request context.

This eliminates boilerplate and ensures consistent `meta.route` tagging across your app.

```ts
import { Hono } from 'hono'
import { useLogger, type GetLoggerFn } from '@gambonny/cflo'

const app = new Hono({ Variables: { getLogger: GetLoggerFn } })

app.use(useLogger({
  level: env.LOGGER_LEVEL,
  format: env.LOGGER_FORMAT,
  context: {
    appName: 'auth-worker',
    hostname: env.ENVIRONMENT,
    deployId: env.CF_VERSION_METADATA.id,
  }
}))
```

Once added, you can access a scoped logger using `c.var.getLogger(route)`:

```ts
app.get('/signup', (c) => {
  const logger = c.var.getLogger({ route: 'auth.routes.signup' })

  logger.info('User signed up', {
    event: 'user.signup.success',
    scope: 'db.insert',
    user_id: 'u_123',
  })

  return c.text('ok')
})
```

🧠 `getLogger(route)` ensures all logs within that route carry a consistent `meta.route` value, without needing to repeat it manually.

> You can still override `route` explicitly in a single log call, but the default is injected automatically.

> This integration is optional and fully tree-shakeable — `hono` is an optional peer dependency.

🔗 See implementation details in [#4](https://github.com/gambonny/cflo/pull/4) – Add useLogger() middleware
<br />

## ⚠️ Console methods support in Cloudflare Workers

Only the following `console` methods are supported by the Workers runtime:

- `console.debug`
- `console.info`
- `console.log`
- `console.warn`
- `console.error`

Any unsupported method accessed via the logger (e.g. `logger.table()`) will emit a warning and do nothing.
