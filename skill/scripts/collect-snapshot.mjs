#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const DEFAULT_RPC = 'https://api.mainnet-beta.solana.com'

export function parseArgs(argv) {
  const options = { rpcUrl: DEFAULT_RPC, execute: false, includeToken: false, output: '' }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--execute') options.execute = true
    else if (arg === '--include-token') options.includeToken = true
    else if (arg === '--address') options.address = argv[++index]
    else if (arg === '--rpc-url') options.rpcUrl = argv[++index]
    else if (arg === '--output') options.output = argv[++index]
    else if (arg === '--help' || arg === '-h') options.help = true
    else throw new Error(`Unknown argument: ${arg}`)
  }
  return options
}

export function redactRpcUrl(value) {
  try {
    const url = new URL(value)
    if (url.username) url.username = 'redacted'
    if (url.password) url.password = 'redacted'
    for (const key of [...url.searchParams.keys()]) url.searchParams.set(key, 'redacted')
    return url.toString()
  } catch {
    return '[redacted invalid RPC URL]'
  }
}

export function buildPlan({ address, includeToken = false }) {
  const plan = [
    ['getAccountInfo', [address, { encoding: 'base64', commitment: 'finalized' }]],
    ['getSignaturesForAddress', [address, { limit: 20, commitment: 'finalized' }]]
  ]
  if (includeToken) {
    plan.push(['getTokenSupply', [address, { commitment: 'finalized' }]])
    plan.push(['getTokenLargestAccounts', [address, { commitment: 'finalized' }]])
  }
  return plan
}

function validate(options) {
  if (!options.address || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(options.address)) {
    throw new Error('Provide a base58 Solana address with --address')
  }
  const protocol = new URL(options.rpcUrl).protocol
  if (!['http:', 'https:'].includes(protocol)) throw new Error('RPC URL must use HTTP or HTTPS')
}

async function rpc(rpcUrl, method, params, id) {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params })
  })
  const body = await response.json().catch(() => ({ parseError: true }))
  return { method, httpStatus: response.status, body }
}

export async function collect(options) {
  validate(options)
  const plan = buildPlan(options)
  const results = []
  for (let index = 0; index < plan.length; index += 1) {
    const [method, params] = plan[index]
    results.push(await rpc(options.rpcUrl, method, params, index + 1))
  }
  const signatures = results.find((item) => item.method === 'getSignaturesForAddress')?.body?.result ?? []
  for (const [index, signature] of signatures.slice(0, 5).entries()) {
    results.push(await rpc(options.rpcUrl, 'getTransaction', [signature.signature, {
      commitment: 'finalized', encoding: 'jsonParsed', maxSupportedTransactionVersion: 0
    }], plan.length + index + 1))
  }
  return {
    schemaVersion: 1,
    collectedAt: new Date().toISOString(),
    address: options.address,
    rpcUrl: redactRpcUrl(options.rpcUrl),
    plan,
    results
  }
}

function usage() {
  return `Usage: node collect-snapshot.mjs --address <PUBLIC_KEY> [options]\n\n` +
    `Default is dry-run. Options:\n` +
    `  --rpc-url <URL>       RPC endpoint (credentials are redacted)\n` +
    `  --include-token       Add read-only mint queries\n` +
    `  --output <FILE>       Evidence JSON output path\n` +
    `  --execute             Run the displayed read-only RPC plan\n`
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) return console.log(usage())
  validate(options)
  const plan = buildPlan(options)
  if (!options.execute) {
    console.log(JSON.stringify({ mode: 'dry-run', rpcUrl: redactRpcUrl(options.rpcUrl), plan }, null, 2))
    console.log('No RPC requests were sent. Add --execute to collect public on-chain evidence.')
    return
  }
  const snapshot = await collect(options)
  const output = resolve(options.output || `solana-snapshot-${Date.now()}.json`)
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify(snapshot, null, 2)}\n`, { flag: 'wx' })
  console.log(`Wrote evidence snapshot: ${output}`)
}

const isDirect = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirect) main().catch((error) => { console.error(error.message); process.exitCode = 1 })
