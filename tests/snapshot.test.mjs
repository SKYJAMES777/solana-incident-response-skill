import assert from 'node:assert/strict'
import test from 'node:test'

const moduleUrl = new URL('../skill/scripts/collect-snapshot.mjs', import.meta.url)

test('default mode is dry-run', async () => {
  const { parseArgs } = await import(moduleUrl)
  assert.equal(parseArgs(['--address', '11111111111111111111111111111111']).execute, false)
})

test('plan contains only read-only commands', async () => {
  const { buildPlan } = await import(moduleUrl)
  const rendered = buildPlan({
    address: '11111111111111111111111111111111',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    includeToken: false
  }).flat().join(' ').toLowerCase()
  for (const forbidden of ['transfer', 'set-authority', 'program deploy', 'program close']) {
    assert.equal(rendered.includes(forbidden), false)
  }
})

test('RPC URL secrets are redacted in saved metadata', async () => {
  const { redactRpcUrl } = await import(moduleUrl)
  const redacted = redactRpcUrl('https://rpc.example.test/?api-key=super-secret-value')
  assert.equal(redacted.includes('super-secret-value'), false)
  assert.match(redacted, /redacted/i)
})
