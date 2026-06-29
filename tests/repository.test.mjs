import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import test from 'node:test'

const root = new URL('../', import.meta.url)

test('required repository files exist', async () => {
  const required = [
    'README.md', 'LICENSE', 'skill/SKILL.md',
    'skill/references/triage.md', 'skill/references/key-compromise.md',
    'skill/references/program-incident.md', 'skill/references/token-authority.md',
    'skill/references/rpc-outage.md', 'skill/references/communications.md',
    'skill/scripts/collect-snapshot.mjs'
  ]
  const missing = []
  for (const path of required) {
    try { assert.equal((await stat(new URL(path, root))).isFile(), true) } catch { missing.push(path) }
  }
  assert.deepEqual(missing, [])
})

test('SKILL.md routes every supported incident', async () => {
  const skill = await readFile(new URL('skill/SKILL.md', root), 'utf8')
  for (const route of ['key-compromise.md', 'program-incident.md', 'token-authority.md', 'rpc-outage.md', 'communications.md']) {
    assert.equal(skill.includes(route), true)
  }
})

test('SKILL.md contains non-negotiable safety guards', async () => {
  const skill = (await readFile(new URL('skill/SKILL.md', root), 'utf8')).toLowerCase()
  for (const phrase of ['never request a seed phrase', 'read-only first', 'explicit confirmation', 'do not test on mainnet']) {
    assert.equal(skill.includes(phrase), true)
  }
})

test('repository is MIT licensed', async () => {
  assert.match(await readFile(new URL('LICENSE', root), 'utf8'), /MIT License/)
})
