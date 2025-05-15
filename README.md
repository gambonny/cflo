# cflo

> Minimal, typed logger for Cloudflare Workers

<br />

Cloudflare Workers **do not offer built-in log level filtering** —  every `console.log`, `debug`, or `info` prints to the log stream unconditionally. This can quickly flood your logs and make it hard to focus on meaningful signals.

`cflo` solves this by introducing a **typed, runtime-configurable logger** that lets you:
- Filter logs by severity
- Choose between `pretty` or `json` output
- Enforce safe logging behavior in edge environments

<br />

## Features

- ✅ Fully typed: `debug()`, `info()`, `log()`, `warn()`, `error()`
- ✅ Runtime log level filtering
- ✅ `pretty` or `json` output
- ✅ Zero dependencies
- ✅ Designed for Cloudflare Workers

<br />

## Usage

```ts
import { createLogger } from '@gambonny/cflo'

const logger = createLogger({
  level: 'info',
  format: 'json',
  hostname: 'edge-prod',
})

logger.info('User registered', { email: 'user@example.com' })
logger.debug('This won’t print unless level is debug or lower')
```

<br />

## ⚠️ **Only the following console methods are supported in Cloudflare Workers**:
- `console.debug`
- `console.info`
- `console.log`
- `console.warn`
- `console.error`

Other methods like `table`, `count`, etc. will trigger a warning if accessed via the logger.
