# Solana Incident Response Skill

A read-only-first incident response skill for Solana operators, developers, security teams, and AI agents. It turns ambiguous reports into a timestamped evidence trail, ranked hypotheses, and an explicit approval gate before on-chain containment.

## Coverage

- Signer and authority-key compromise
- Program upgrades, exploits, and deployed-code mismatches
- Mint, freeze, close, and Token-2022 authority anomalies
- RPC outages and provider inconsistencies
- Evidence manifests, updates, and coordinated disclosure

The snapshot collector uses only public JSON-RPC reads. It has no dependencies, redacts RPC URL credentials in saved metadata, and defaults to dry-run.

## Install

```bash
git clone https://github.com/SKYJAMES777/solana-incident-response-skill.git
node solana-incident-response-skill/install.mjs --target codex
# or: node solana-incident-response-skill/install.mjs --target claude
```

Add `--project` for a project-local install. The installer refuses to overwrite an existing skill unless `--force` is supplied.

## Use

Ask an agent to use `$solana-incident-response`, or run:

```bash
# Displays the plan; sends nothing
node skill/scripts/collect-snapshot.mjs --address <PUBLIC_KEY>

# Collect public finalized state and recent transactions
node skill/scripts/collect-snapshot.mjs --address <PUBLIC_KEY> --execute --output evidence/snapshot.json
```

Never provide seed phrases, private keys, keypair files, session tokens, or wallet approvals.

## Tests

```bash
node --test --test-isolation=none tests/repository.test.mjs tests/snapshot.test.mjs
uv run --python 3.12 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py skill
```

## Design

Observation and containment are separate. Mainnet is observation-only; exploit reproduction belongs on localnet, devnet, or an authorized fork. Every state change needs a transaction-level explanation and explicit confirmation. Explorer pages are convenience views; raw RPC responses, slots, signatures, timestamps, and hashes form the evidence record.

## Primary references

- [Deploying Programs](https://solana.com/docs/programs/deploying)
- [Set Authority](https://solana.com/docs/tokens/basics/set-authority)
- [getAccountInfo](https://solana.com/docs/rpc/http/getaccountinfo)
- [getSignaturesForAddress](https://solana.com/docs/rpc/http/getsignaturesforaddress)
- [getTransaction](https://solana.com/docs/rpc/http/gettransaction)
- [getTokenSupply](https://solana.com/docs/rpc/http/gettokensupply)

MIT licensed.