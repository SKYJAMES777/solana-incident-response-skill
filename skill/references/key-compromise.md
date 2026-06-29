# Key compromise runbook

Use when a signer, treasury, upgrade authority, mint/freeze authority, deployer, or automation key may be exposed.

## Confirm and scope

- Identify only the public key. Never ask for secret material.
- Inventory every role: program upgrade, mint/freeze, token owner/close, treasury, governance, CI/CD, RPC billing, and administration.
- Compare recent signatures with the operations calendar.
- Identify nonce workflows, multisigs, delegates, and unattended bots.

## Safe collection

Preserve recent signatures and parsed transactions from independent RPC providers. Record balances and account owners at finalized commitment. For programs, preserve ProgramData metadata and upgrade authority. For tokens, preserve authorities and extensions. Inventory secret-manager and CI access logs without copying secrets into the case file.

## Containment proposal

Prepare, but do not sign, a minimal sequence moving privileges to a freshly secured multisig or revoking them if the owner explicitly chooses irreversibility. Explain transaction ordering and the race window.

Transfers, authority changes, freezes, upgrades, and revocations require explicit confirmation. Simulate in an authorized non-mainnet environment. Do not use the suspected device to generate the replacement key.

Rotate off-chain credentials and sessions, verify the old key has no privileged roles, monitor both public keys, and state root-cause confidence.