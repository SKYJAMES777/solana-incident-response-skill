---
name: solana-incident-response
description: Triage Solana security and operations incidents with evidence preservation and read-only diagnostics. Use for suspected key compromise, unexpected program upgrade or authority changes, token mint/freeze authority anomalies, program exploits, suspicious transactions, or RPC outages.
---

# Solana Incident Response

Treat every report as an evidence-preservation and risk-reduction task. Be decisive about urgency but explicit about uncertainty.

## Non-negotiable safety rules

- Never request a seed phrase, private key, keypair JSON, hardware-wallet approval, session token, or RPC API key.
- Work read-only first. Collect public facts before proposing containment.
- Require explicit confirmation immediately before any state-changing transaction, authority change, deployment, freeze, close, transfer, or public disclosure.
- Do not test on mainnet. Reproduce only on localnet, devnet, or an authorized fork with non-production keys.
- Never promise recovery, attribution, or fund return. Distinguish observed facts, hypotheses, and recommendations.
- Do not publish exploit details that increase harm before the owner has a disclosure plan.

## Workflow

1. Establish authorization, cluster, addresses, first-known-good/bad times, and current impact.
2. Follow [triage.md](references/triage.md) to assign severity, build a timeline, and preserve public evidence.
3. Select the runbook:
   - Signer, wallet, deployer, or authority exposure: [key-compromise.md](references/key-compromise.md)
   - Program upgrade, exploit, or verification mismatch: [program-incident.md](references/program-incident.md)
   - Mint, freeze, close, or Token-2022 authority anomaly: [token-authority.md](references/token-authority.md)
   - Stale data, failed requests, or provider degradation: [rpc-outage.md](references/rpc-outage.md)
4. Use [collect-snapshot.mjs](scripts/collect-snapshot.mjs) for a dependency-free, dry-run-by-default public RPC evidence plan.
5. Present containment transaction by transaction. Explain signer, effect, irreversibility, simulation, and rollback before asking for explicit confirmation.
6. Use [communications.md](references/communications.md) for updates, disclosure, and closure.

## Required response

Return: status and confidence; timestamped observed evidence; ranked hypotheses; immediate read-only actions; proposed containment clearly marked as requiring explicit confirmation; open questions; and an evidence manifest.

If evidence is insufficient, collect the next highest-value public fact. Never invent chain data.