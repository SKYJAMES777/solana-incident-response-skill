# Token authority incident runbook

Use for unexpected minting, freezing, thawing, ownership or close-authority changes, metadata changes, or Token-2022 extension concerns.

## Inventory the authority surface

- Confirm original Token Program versus Token Extensions Program.
- Record mint and freeze authorities.
- For token accounts, record owner, delegate, delegated amount, close authority, and state.
- Inspect relevant Token-2022 extensions such as permanent delegate, transfer hook, transfer fee, confidential transfer, and metadata/group pointers.
- Record supply, decimals, largest accounts, and recent finalized signatures.

An authority set to `None` is permanently revoked for that role. A frozen account is not a seized balance. Metadata and mint authorities are distinct. Extensions may add control paths absent from legacy-token checklists.

## Safe response

Preserve mint and token-account state from two providers. Link supply or state changes to exact transactions and instructions. Check expected governance, vesting, bridge, market-maker, and operations activity. Propose rotation, revocation, freeze/thaw, or client warnings only after scope is known.

Every authority mutation and freeze/thaw action changes state. Show the role, current and proposed authorities, signer, affected accounts, irreversibility, and simulation before requesting explicit confirmation.