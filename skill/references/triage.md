# Triage and evidence preservation

## Severity

| Level | Condition | Initial objective |
|---|---|---|
| SEV-1 | Active unauthorized signing, upgrade, minting, draining, or broad loss | Limit harm; preserve volatile evidence |
| SEV-2 | Credible compromise without confirmed loss, contained exploit, major degradation | Confirm scope; prepare containment |
| SEV-3 | Suspicious anomaly, isolated failure, partial RPC inconsistency | Establish cause; monitor |
| SEV-4 | False positive, testnet-only, informational | Document; close |

Raise severity for privileged signers, unknown blast radius, continuing loss, or corroborated unauthorized changes.

## First 15 minutes

1. Record UTC time, reporter, cluster, addresses, program/mint IDs, signatures, and last known-good observation.
2. Create an append-only timeline. Preserve raw responses; add corrections separately.
3. Query at least two independent RPC providers for disputed state. Record redacted endpoint, commitment, slot, latency, and error.
4. Capture `getAccountInfo`, `getSignaturesForAddress`, and relevant `getTransaction` responses.
5. Hash saved files with SHA-256. Analyze copies, not originals.
6. Separate facts from hypotheses. Transaction participation does not prove real-world attribution.

## Scope and evidence

Determine whether each address is a signer, upgrade authority, ProgramData account, mint, token account, multisig, treasury, or service. Check expected deployments, governance, token operations, and key rotations.

For every artifact record collection time, collector, source, method, commitment, response slot, SHA-256, and notes. Redact URL credentials and usernames. Never store secrets in the incident folder.

## Decision gate

Before containment, provide the exact instruction, fee payer, required signers, expected account changes, simulation result, and reversibility. Obtain explicit confirmation for every state-changing batch.