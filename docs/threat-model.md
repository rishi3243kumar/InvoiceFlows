# 🎯 InvoiceFlow: Threat Model & Attack Vector Analysis

## 1. Threat Matrix

| Threat ID | Threat Vector | Potential Impact | Likelihood | Mitigation Strategy |
|:---|:---|:---|:---:|:---|
| **T-01** | **Double-Financing Attack** | A borrower attempts to pledge or settle the same invoice across multiple lenders. | High | **Cryptographic Nullifiers:** The contract checks `nullifiers.member(nullifier)` and permanently burns the nullifier upon first settlement. |
| **T-02** | **Front-Running / MEV Extraction** | A malicious observer intercepts a transaction in the mempool to steal funds or front-run the settlement. | Medium | **Zero-Knowledge Witness Obfuscation:** The transaction contains only a zero-knowledge SNARK proof and a blinded nullifier, with no secret keys or redeemable cleartext tokens. |
| **T-03** | **Unauthorized Root Overwrite** | An unauthorized actor attempts to overwrite the ledger `invoiceRoot` with arbitrary fake commitments. | Low | **`ownPublicKey() == issuer` Circuit Assertion:** The `registerInvoiceRoot` circuit enforces strict cryptographic identity authorization. |
| **T-04** | **Commercial De-anonymization** | Competitors attempt to correlate transaction gas fees or timestamps with real-world companies. | Medium | **Constant-Fee Circuits & Shielded Balances:** Midnight consumes standardized gas amounts (~0.0125 tDUST) regardless of the confidential invoice size. |
| **T-05** | **Fake Invoice Minting** | A bad actor attempts to generate a proof for a non-existent invoice. | Low | **Merkle Path Verification:** The circuit verifies mathematical consistency against the registered on-chain root over 5 tree levels. |

---

## 2. Attack Simulation & Test Verification

All mitigations are tested and validated in automated test suites:
- `contracts/tests/invoice_flow.test.mjs`: Tests T-01, T-03, T-05.
- `frontend/src/lib/__tests__/invoice_flow.test.mjs`: Tests T-02, T-04.
