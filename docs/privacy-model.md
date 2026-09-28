# 🛡️ InvoiceFlow: Midnight Privacy Model Specification

## 1. Overview of Midnight's Privacy Paradigm

The Midnight blockchain operates on a **dual-state architecture**:
1. **Public Ledger State:** Open, globally verifiable consensus state stored on-chain.
2. **Private Client State:** Confidential data, witnesses, cryptographic secrets, and private balances stored strictly off-chain within the user's browser or local node.

**InvoiceFlow** utilizes this architecture to guarantee **commercial confidentiality** for businesses and freelancers while maintaining mathematical proof of invoice validity and non-double-financing.

---

## 2. Information Disclosure Matrix

| Category | ☀️ Public On-Chain (Disclosed) | 🌑 Private Off-Chain (Confidential) |
|:---|:---|:---|
| **Invoice Metadata** | Cryptographic 32-byte Merkle Root (`Bytes<32>`) | Invoice items, description, client name, contact email, due dates |
| **Financial Values** | Shielded fee units (~0.0125 tDUST gas) | Exact invoice amount, discount price, APY return, financing margin |
| **Participant Identity** | Issuer ZK public key (`issuer: ZswapCoinPublicKey`) | Real-world identities, tax IDs, banking details, physical addresses |
| **Settlement Status** | Spent Nullifier Hash (`Set<Bytes<32>>`) | Secret salt $R$, invoice private witness $S$, Merkle witness path |
| **Reputation Metrics** | Aggregated settled counter (`settledCount: Counter`) | Individual repayment history or private commercial disputes |

---

## 3. Cryptographic Primitives & Circuit Proofs

### 3.1 Confidential Leaf Commitment
When an invoice is issued, the borrower's client software generates a 256-bit entropy secret $S$ and calculates a persistent hash commitment:
$$\text{Leaf} = \text{persistentHash}([\text{pad}(32, \text{"invoiceflow:leaf"}), S])$$

Neither the secret $S$ nor any financial data is broadcasted to the chain. Only the leaf is inserted into the local client Merkle tree.

### 3.2 5-Level Merkle Tree Inclusion Proof
The circuit verifies that the leaf is an authentic member of the registered `invoiceRoot`:
$$\text{merkleRootFrom}(\text{leaf}, \text{merklePath}, \text{pathDirections}) \equiv \text{invoiceRoot}$$

Here, `merklePath: Vector<5, Bytes<32>>` and `pathDirections: Vector<5, Boolean>` remain private witness inputs known only to the prover.

### 3.3 Deterministic Nullifier & Anti-Double-Financing
To prevent an invoice from being pledged or settled twice, the circuit derives a deterministic nullifier:
$$\text{Nullifier} = \text{persistentHash}([\text{pad}(32, \text{"invoiceflow:null"}), S])$$

The contract checks:
```compact
assert(!nullifiers.member(disclose(nullifier)), "invoice already settled or double-financing prevented");
nullifiers.insert(disclose(nullifier));
settledCount.increment(1);
```

- **Uniqueness Guarantee:** Because $S$ is uniquely bound to the invoice, the nullifier is deterministic. If the same invoice is submitted again, the transaction is rejected on-chain.
- **Unlinkability:** The nullifier cannot be mathematically reversed to uncover the secret $S$, the invoice leaf, or the counterparty.
