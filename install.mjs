#!/usr/bin/env node

import { cp, mkdir, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { resolve } from 'node:path'

const values = process.argv.slice(2)
const args = new Set(values)
const targetIndex = values.indexOf('--target')
const targetName = targetIndex >= 0 ? values[targetIndex + 1] : 'codex'
if (!['codex', 'claude'].includes(targetName)) throw new Error('--target must be codex or claude')

const base = args.has('--project')
  ? resolve(targetName === 'codex' ? '.codex/skills' : '.claude/skills')
  : resolve(homedir(), targetName === 'codex' ? '.codex/skills' : '.claude/skills')
const destination = resolve(base, 'solana-incident-response')

try {
  await stat(destination)
  if (!args.has('--force')) throw new Error(`${destination} already exists; pass --force to replace it`)
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

await mkdir(base, { recursive: true })
await cp(new URL('./skill/', import.meta.url), destination, { recursive: true, force: args.has('--force') })
console.log(`Installed solana-incident-response to ${destination}`)
