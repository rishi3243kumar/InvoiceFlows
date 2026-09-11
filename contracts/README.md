# 🌘 Midnight Compact Smart Contracts: InvoiceFlow

This package contains the **Compact smart contracts**, zero-knowledge circuits, client-side witness generators, and deployment infrastructure for **InvoiceFlow** on the **Midnight Network**.

---

## 🏛️ Architecture Overview

```mermaid
graph TD
    subgraph Client-Side Private Witness
        S[Invoice Secret]
        A[Private Amount]
        K[Client Public Key]
        R[Secret Salt]
        P[Merkle Path Witness]
    end

    subgraph Midnight Compact ZK Engine
        C1[tokenizeInvoice Circuit]
        C2[proveAccess Circuit]
        C3[settleInvoice Circuit]
    end

    subgraph Midnight Preprod Ledger
        L1[merkleRoot: Bytes<32>]
        L2[nullifiers: Map<Bytes<32>, Boolean>]
        L3[totalSettledVolume: Counter]
        L4[clientReputations: Map<Bytes<32>, Uint<16>>]
    end

    S & A & K & R --> C1
    C1 --> L1
    S & A & R & P --> C2
    C2 --> C3
    C3 --> L2 & L3 & L4
```

---

## 📄 Compact Contract: `compact/invoice_flow.compact`

The core contract is written in **Compact (Midnight Network v0.18+)** and provides:

1. **`initialize(initialRoot: Bytes<32>)`**: Sets genesis Merkle tree state.
2. **`tokenizeInvoice(invoiceIdHash, commitment, newMerkleRoot, dueTimestamp, riskTier)`**: Inserts a blinded invoice leaf commitment without exposing underlying financial values or client credentials.
3. **`proveAccess(clientPubkey, claimedInvoiceId)`**: Verifies private witnesses and Merkle inclusion inside zero-knowledge proof, returning a deterministic nullifier.
4. **`settleInvoice(invoiceIdHash, nullifier, settledAmount, clientHash)`**: Atomically marks the nullifier as spent on-chain to permanently eliminate double-financing, and boosts the borrower's on-chain trust score.

---

## 🧪 Testing

To run the automated Compact circuit test suite:

```bash
npm test
```

## 🚀 Deployment

To deploy and initialize the Compact contract to Midnight Preprod:

```bash
npm run deploy:preprod
```
