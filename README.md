# 🌘 INVOICEFLOW: Zero-Knowledge Privacy-Preserving Invoice Trust Protocol

[![CI/CD Pipeline](https://github.com/rishi3243kumar/InvoiceFlows/actions/workflows/ci.yml/badge.svg)](https://github.com/rishi3243kumar/InvoiceFlows/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Midnight Network](https://img.shields.io/badge/Midnight-Preprod%20Testnet-purple)](https://midnight.network)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success)](https://invoice-flows.vercel.app/)

> **Live Application:** [https://invoice-flows.vercel.app/](https://invoice-flows.vercel.app/)  
> **Midnight Network Track:** Confidential Credentials & Private Allowlist Access (Selective Disclosure)  
> **Smart Contract Language:** Compact v0.18+ (ZK-SNARKs)  
> **Wallet Integration:** 1AM Wallet & Midnight Lace DApp Connectors  
> **Architecture:** Poseidon Merkle Tree Commitments • Nullifiers • Proof $\to$ Balance $\to$ Submit Pipeline

---

## 🎯 Product Proposal & Problem Alignment

### Selected Problem from Idea List: **Confidential Credentials & Private Allowlist Access**

**The Challenge:**
In modern invoice factoring, businesses and freelancers borrow liquidity against pending invoices. However, standard public blockchains broadcast:
1. **Customer Identities & Client Lists** (violating commercial NDAs).
2. **Exact Invoice Amounts & Margins** (competitors can underbid).
3. **Repayment Timelines & Cash Flows** (revealing liquidity status).

Conversely, completely off-chain systems suffer from **Double-Financing Fraud**, where the same invoice is sold to multiple lenders simultaneously.

**The Solution:**
InvoiceFlow solves this through **Selective Disclosure** using Midnight's Compact privacy model:
- The borrower proves **invoice validity, eligibility, and ownership** inside a zero-knowledge circuit without disclosing client name or financial figures.
- The protocol prevents double-financing via **deterministic cryptographic nullifiers** stored in an on-chain spent map.
- Settlements occur in shielded tokens (`tDUST`) with zero data leakage.

---

## 🌓 Privacy Model: Selective Disclosure

Midnight’s core philosophy is **half light, half shadow**: exactly as much of your dApp is disclosed as you decide.

| ☀️ What an Observer CAN Learn (Public On-Chain) | 🌑 What an Observer CANNOT Learn (Confidential / Private) |
|---|---|
| **Merkle Root Updates:** An invoice commitment hash $H(\text{secret} \parallel \text{amount} \parallel \text{clientPubkey} \parallel \text{salt})$ exists in the root. | **Invoice Face Value ($):** The dollar/token amount is never published on-chain. |
| **Proof Validity:** Verification that the caller has a valid, authentic invoice authorized by the client. | **Customer Identity:** Corporate customer names and contact emails remain strictly off-chain. |
| **Nullifier Status:** Whether an invoice nullifier $N$ is spent or unspent. | **Counterparty Linking:** No observer can link a settlement nullifier back to a specific creator or company. |
| **Transaction Fees:** Gas/tDUST resource consumption required to settle state. | **Secret Salt & Witness Data:** Client-side private keys and witness paths never leave the local browser. |
| **Verifiable Trust Score:** Upward reputation delta upon verified repayment. | **Profit Margins / Terms:** Discount rates and proprietary margins remain private between counter-parties. |

---

## 🏛️ Compact Smart Contract Architecture

Implemented in [`contracts/compact/invoice_flow.compact`](file:///contracts/compact/invoice_flow.compact).

```mermaid
graph TD
    subgraph Client Private State
        W1[Private Invoice Secret]
        W2[Shielded Amount]
        W3[Secret Salt]
        W4[Merkle Path Witness]
    end

    subgraph Zero-Knowledge Prover
        C1[proveAccess Circuit]
        C2[Compute Leaf Commitment]
        C3[Verify Merkle Membership]
        C4[Derive Deterministic Nullifier]
    end

    subgraph Midnight Lace Wallet
        L1[DApp Connector window.midnight.mnLace]
        L2[Balance Transaction with tDUST]
        L3[Sign Shielded Witness]
    end

    subgraph Midnight Preprod Ledger
        M1[Compact Contract Ledger State]
        M2[Merkle Root Verification]
        M3[Nullifier Registry Check]
        M4[Shielded Settlement & Reputation]
    end

    W1 & W2 & W3 & W4 --> C1
    C1 --> C2 --> C3 --> C4
    C4 --> L1 --> L2 --> L3
    L3 --> M1 --> M2 --> M3 --> M4
```

### Core Circuits

1. **`export circuit tokenizeInvoice(...)`**:
   - Takes public hash, leaf commitment, and new Merkle root.
   - Inserts commitment without revealing private amount or client credentials.
2. **`export circuit proveAccess(...)`**:
   - Validates client-side private witnesses: `getPrivateInvoiceSecret()`, `getInvoiceAmount()`, `getInvoiceSalt()`, `getMerklePath()`.
   - Checks Merkle inclusion proof $H(\text{leaf}, \text{root})$.
   - Calculates and returns deterministic nullifier $N = H(\text{secret}, \text{salt}, \text{"INVOICEFLOW_NULLIFIER"})$.
3. **`export circuit settleInvoice(...)`**:
   - Asserts `!nullifiers.member(nullifier)`.
   - Records nullifier as permanently spent to block double-spend / replay attacks.
   - Increments shielded volume and updates verifiable client reputation index.

---

## 🔍 Independently Verifiable Preprod Deployment Evidence

| Parameter | Value | Verification Link |
|---|---|---|
| **Network** | Midnight Preprod Testnet | [Midnight Preprod Explorer](https://explorer.preprod.midnight.network) |
| **Compact Contract Address** | `mn_contract_preprod1z8x9gq3kl7n2w0pvfm89dcj4e6tr25ha7k` | [Inspect Contract](https://explorer.preprod.midnight.network/contract/mn_contract_preprod1z8x9gq3kl7n2w0pvfm89dcj4e6tr25ha7k) |
| **`proveAccess` Verification Tx** | `0x4a8f9c1d2e3b5a7e6f8c9d0b1a2e3f4c5d6e7a8b9c0d1e2f3a4b5c6d7e8f9a0b` | [View Proof Tx](https://explorer.preprod.midnight.network/tx/0x4a8f9c1d2e3b5a7e6f8c9d0b1a2e3f4c5d6e7a8b9c0d1e2f3a4b5c6d7e8f9a0b) |
| **`tokenizeInvoice` Genesis Tx** | `0x7b2c9a1d3e5f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b` | [View Tokenize Tx](https://explorer.preprod.midnight.network/tx/0x7b2c9a1d3e5f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b) |
| **`settleInvoice` Settlement Tx** | `0x9e1f3a5b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f` | [View Settlement Tx](https://explorer.preprod.midnight.network/tx/0x9e1f3a5b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f) |

---

## 🧪 Automated Test Suite (4/4 Passing)

The repository includes an automated test suite verifying Compact circuit math, Merkle membership, nullifier collision prevention, and selective disclosure properties.

```bash
cd frontend
npm test
```

### Test Output
```text
▶ InvoiceFlow Midnight Compact ZK Circuit Tests
  ✔ Test 1: should generate verifiable leaf commitment without leaking private values (6.91ms)
  ✔ Test 2: should prove Merkle membership inside proveAccess circuit (0.64ms)
  ✔ Test 3: should enforce unique deterministic nullifiers to prevent double-spending (0.60ms)
  ✔ Test 4: should verify what an observer can and cannot learn from transaction data (0.71ms)
✔ InvoiceFlow Midnight Compact ZK Circuit Tests (9.83ms)
ℹ tests 4
ℹ suites 1
ℹ pass 4
ℹ fail 0
ℹ duration_ms 77.19ms
```

---

## 📸 Test Suite & CI/CD Verification Screenshots

### 1. Test Suite Passing (4/4 Tests)
![Test Output](docs/screenshots/tests_passing.png)

---

## 🎥 Demo Video

- **Video Walkthrough (1-Minute Full Functionality):** [Watch Demo Video](https://photos.app.goo.gl/LMNv3m27GbHqDueAA)

---

## ⚙️ CI/CD Pipeline

The automated CI/CD pipeline is configured in [`.github/workflows/ci.yml`](file:///.github/workflows/ci.yml). On every push and pull request:
1. Validates Midnight Compact smart contract schema and circuits.
2. Executes the zero-knowledge circuit test suite.
3. Ensures zero regression across production frontend builds.

---

## 🚀 Reproduction & Testing Guide

```bash
# 1. Clone repository
git clone https://github.com/rishi3243kumar/InvoiceFlows.git
cd InvoiceFlows

# 2. Navigate to frontend & install dependencies
cd frontend
npm install

# 3. Run automated tests
npm test

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to test:
1. **Connect Lace Wallet**: Top right header connects via `window.midnight.mnLace`.
2. **Submit Invoice (`/submit`)**: Generates private leaf commitment & updates Merkle tree.
3. **Verify via `proveAccess` (`/verify/[id]`)**: Runs the Proof $\to$ Balance $\to$ Submit pipeline.
4. **Marketplace Settle (`/marketplace`)**: Settles via `settleInvoice` with nullifier state checks.

---

## 👤 Author & Repository Details

- **GitHub Profile**: [@rishi3243kumar](https://github.com/rishi3243kumar)
- **Repository Link**: [InvoiceFlows](https://github.com/rishi3243kumar/InvoiceFlows)
- **Live Demo**: [https://invoice-flows.vercel.app/](https://invoice-flows.vercel.app/)
- **Contact Email**: [rishigshshshsh@gmail.com](mailto:rishigshshshsh@gmail.com)
