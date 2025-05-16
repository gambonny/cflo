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

## Structured Logging
You can optionally enrich your logs with a structured meta object.

If you provide either event or scope, you must provide both. This helps ensure logs are meaningful, searchable, and system-aware.

Both `event` and `scope` must be lowercase dot-separated strings, like:

event: `user.signup.success`

scope: `auth.routes.signup`

You can also add any extra fields:

```ts
logger.info('User signed up', {
  event: 'user.signup.success',
  scope: 'auth.routes.signup',
  user_id: 'u_123',
  duration_ms: 142,
  outcome: 'success',
})
```

If only one of `event` or `scope` is provided, TypeScript will raise an error.

🔗 See implementation details in [#1](https://github.com/gambonny/cflo/pull/1) – Enforce structured meta in logger

<br />

## Usage

```ts
import { createLogger } from '@gambonny/cflo'

const logger = createLogger({
  level: 'info',
  format: 'json',
})

logger.info('User registered', { email: 'user@example.com' })
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
- Fallback to `level: "debug"` and `format: "pretty"`

<br />

## ⚠️ Console methods support in Cloudflare Workers

Only the following `console` methods are supported by the Workers runtime:

- `console.debug`
- `console.info`
- `console.log`
- `console.warn`
- `console.error`

Any unsupported method accessed via the logger (e.g. `logger.table()`) will emit a warning and do nothing.
