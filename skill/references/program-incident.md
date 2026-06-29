# Program incident runbook

Use for unexpected upgrades, exploits, behavior changes, instruction failures, or deployed-code mismatch.

## Establish state

1. Record program ID, loader owner, executable flag, ProgramData address, upgrade authority, last deployed slot, and data length.
2. Preserve the deployment/upgrade transaction and identify signers without inferring real-world identity.
3. Dump deployed bytecode for hashing; compare with an independently reproduced build when supported.
4. Preserve successful and failing signatures, logs, account keys, inner instructions, return data, and pre/post balances.
5. Repeat disputed reads against another RPC.

## Analyze safely

Reproduce only on localnet, devnet, or an authorized fork using synthetic accounts and non-production keys. Do not send exploit probes to mainnet. Review signer and owner checks, PDA seeds, duplicate mutable accounts, arithmetic, CPI targets, remaining accounts, token extensions, and upgrade authority. Separate program bugs from stale IDLs, client serialization, RPC lag, and indexer lag.

## Containment

Possible actions include an existing pause mechanism, upgrade, authority rotation, client disablement, or integrator coordination. Present the smallest effective action with accounts, signers, simulation, user impact, and rollback. Never deploy, close, or change authority without explicit confirmation.

Immutability is permanent. Program closure is destructive and the documented loader does not permit reusing the program address.