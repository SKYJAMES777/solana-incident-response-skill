# RPC outage and inconsistency runbook

Use for timeouts, stale blockhashes, missing signatures, differing account state, rate limits, WebSocket gaps, or regional/provider failures.

## Distinguish chain state from provider state

1. Record endpoint with credentials redacted, region, transport, method, commitment, latency, HTTP status, JSON-RPC error, context slot, and client version.
2. Compare an independent provider.
3. Query `getSlot`, `getBlockHeight`, and the disputed account/signature at the same commitment.
4. Compare HTTP polling with WebSocket subscriptions.
5. Check rate limits, request size, transaction-version support, archival retention, and minimum context slot.

Different processed state with matching finalized state can be normal propagation. `Blockhash not found` may reflect expiry or a lagging endpoint. Missing old transactions may reflect non-archival retention. HTTP 429 is throttling, not necessarily chain congestion.

Prefer health-based failover, bounded retry with jitter, explicit commitments, and minimum context slots. Avoid retry storms and duplicate sends. Do not resend until signature and blockhash status are reconciled. Present endpoint policy, credential handling, failback, and monitoring before changing production configuration.