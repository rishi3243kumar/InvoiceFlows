# 🔒 InvoiceFlow: Security Invariants & Verification Guarantees

## 1. Security Architecture Principles

1. **Zero Financial Leakage:** No balance, currency symbol, client identity, or trade margin is ever written to the public ledger.
2. **Deterministic Anti-Replay Protection:** Every invoice possesses exactly one valid nullifier derived mathematically from its private secret.
3. **Soundness of Proofs:** Only mathematical inclusion in the deployed `invoiceRoot` can trigger settlement execution.
4. **Non-Custodial Escrow:** All funds flow directly between verified participants and liquidity providers using shielded Midnight tokens.

---

## 2. Core Cryptographic Invariants

### Invariant 1: Merkle Proof Soundness
$$\forall \text{ candidateLeaf } L, \quad \text{merkleRootFrom}(L, \text{path}, \text{directions}) = \text{invoiceRoot} \iff L \in \text{MerkleTree}$$
A prover cannot settle an invoice unless its commitment leaf was previously registered in the on-chain Merkle root.

### Invariant 2: Nullifier Uniqueness (Double-Financing Prevention)
$$\forall \text{ secrets } S_1, S_2, \quad S_1 = S_2 \implies \text{nullifierOf}(S_1) = \text{nullifierOf}(S_2)$$
$$\text{nullifiers.member}(\text{nullifier}) = \text{false} \implies \text{First Settlement}$$
$$\text{nullifiers.member}(\text{nullifier}) = \text{true} \implies \text{Circuit Assert Failure (Double-Spend Blocked)}$$

### Invariant 3: Issuer Authentication for Root Updates
$$\text{assert}(\text{ownPublicKey}() == \text{issuer}, \text{"only the issuer may update invoice root"})$$
Only the authenticated contract deployer / issuer can register new Merkle batch roots.

---

## 3. Cryptographic Assertions in Compact

```compact
// 1. Enforce issuer permission
assert(ownPublicKey() == issuer, "only the issuer may update invoice root");

// 2. Enforce Merkle membership
assert(candidateRoot == invoiceRoot, "invalid invoice proof or not part of registered root");

// 3. Enforce single-settlement guarantee
assert(!nullifiers.member(disclose(nullifier)), "invoice already settled or double-financing prevented");
```
