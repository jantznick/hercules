/**
 * Run `prisma generate` when the CLI is available.
 * Frontend-only hosts (e.g. Render static with omit=dev) may skip prisma;
 * skip cleanly instead of failing install.
 */
import { accessSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const bin = join(process.cwd(), 'node_modules', '.bin', 'prisma')

try {
  accessSync(bin)
} catch {
  console.warn(
    '[postinstall] prisma CLI not found; skipping generate (ok for frontend-only installs)',
  )
  process.exit(0)
}

const result = spawnSync(
  bin,
  ['generate', '--schema=prisma/schema.prisma'],
  { stdio: 'inherit', shell: process.platform === 'win32' },
)

process.exit(result.status ?? 1)
