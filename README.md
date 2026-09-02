# InvoiceFlow: Trust-Verified Invoice Financing

InvoiceFlow is a trust-verified invoice financing protocol for freelancers and small businesses, built on Stellar. By combining deterministic invoice hashing for double-financing prevention with dynamic on-chain credit reputation tracking, InvoiceFlow creates a secure, risk-transparent ecosystem for real-world asset (RWA) invoice tokenization.

### Live Deployment Info
- **Network**: Stellar Testnet
- **Status**: Live Contract Integrations & Frontend Wallet Hooked

---

## Why Stellar Specifically?

Stellar is the only blockchain with the native primitives required to make cross-border invoice tokenization both secure and economically viable. 

First, InvoiceFlow leverages **Soroban smart contracts** to achieve protocol-level duplicate-financing prevention. By hashing invoice details (freelancer, client, amount, and due date) and storing them natively in persistent storage, we guarantee that no invoice can be financed twice. This prevents the primary risk vector in invoice factoring.

Second, Stellar's native features, specifically **Path Payments** and integrated **Fiat Anchors (SEP-24/SEP-6)**, allow cross-border freelancers to receive payouts directly in local currency, while investors fund the pool in USD-backed stablecoins (USDC) with zero manual conversion friction. The low-fee transaction model on Stellar means that recording micro-payments and updating granular credit histories does not dilute investor yield, which would be unprofitable on high-fee networks like Ethereum.

---

## Problem Statement

Freelancers and small businesses face significant cash flow gaps because clients often negotiate 30-to-90-day payment terms. While invoice tokenization (selling future invoice payouts to DeFi yield-seekers) offers a solution, current implementations on generic EVM chains fail due to:
1. **Duplicate Financing Risk**: Bad actors can submit the same invoice to multiple platforms since there is no centralized or cheap global ledger check.
2. **Identity & Credit Risk Opacity**: Investors have no reliable, tamper-proof registry to check the historical repayment rate of either the freelancer or the client before committing capital.
3. **High Gas and Conversion Friction**: Conducting global micro-remittances with high gas fees makes financing invoices under $1,000 financially unviable.

---

## Solution

InvoiceFlow solves these gaps by building a trust and reputation layer directly on Stellar:
- **`InvoiceRegistry` Smart Contract**: Acts as a global single-source-of-truth. Every invoice's unique parameters are cryptographically hashed and verified. Duplicates are rejected at the smart contract transaction validation level.
- **`ReputationScore` Contract**: Tracks on-chain payment histories for clients and freelancers. Every successful settlement increases credit score; defaults immediately slash it.
- **Dynamic Pricing Escrows**: Integrates reputation scores into the discount rate of the invoice. High-trust clients receive lower interest financing, while riskier invoices pay a premium, auto-adjusting in real-time.
- **Freighter Wallet Integration**: Seamless signature check by all participants (freelancers, clients, and investors).

---

## Stellar Differentiator

Unlike generic payment or tokenization applications on Ethereum (where transaction fees of $5-$50 make small invoice financing impossible), InvoiceFlow is built around Stellar's micro-transaction rails. On-chain reputation updates on Ethereum would cost more than the interest yield itself.

Additionally, Stellar's built-in **Asset Anchors** allow direct integration into banking rails (e.g. converting USDC directly to Brazilian Real or Euro payouts), removing the need for users to interact with complex third-party exchanges. Stellar's deterministic state model and Soroban's native storage systems allow us to run duplicate checks with gas costs under $0.0001 per invoice, making trust-verification affordable at any scale.

---

## Architecture

1. **Frontend**: React + Next.js with Freighter wallet integration.
2. **Smart Contracts (Soroban)**:
   - `InvoiceRegistry`: Hashes each invoice and rejects duplicates to prevent double financing.
   - `ReputationScore`: Tracks on-chain history of repayments vs defaults.
   - `InvoiceToken`: Mints the invoice as a token after verification, tagged with risk score.
   - `EscrowSettlement`: Holds investor funds, releases payouts, and handles settlement.
   - `SecondaryMarket`: Allows investors to resell invoice tokens before maturity.

---

## Demo Flow (Testnet)

1. **Submit**: Freelancer submits an invoice via the UI.
2. **Verify**: A client-confirmation link is generated and clicked to verify the invoice authenticity.
3. **Registry Check**: `InvoiceRegistry` checks for duplicates and ensures the invoice hasn't been financed before.
4. **Minting**: `InvoiceToken` mints the invoice with a risk score pulled from `ReputationScore`.
5. **Listing**: The token is listed on the marketplace with dynamic pricing.
6. **Funding**: An investor buys the token via the `EscrowSettlement` contract.
7. **Payout**: Freelancer receives instant working capital.
8. **Settlement**: On the due date, client payment is confirmed and reputation scores update.

---

## Local Setup

1. **Contracts**: `cd contracts && cargo build --target wasm32-unknown-unknown --release`
2. **Frontend**: `cd frontend && npm install && npm run dev`

---

## Implemented Enhancements

1. **Interactive Starfield Background**: An immersive custom particle canvas component generating 120 dynamic stellar particles that react smoothly to pointer movements.
2. **Custom Cosmic Toast Notifications**: Animated glassmorphic alert popups displaying contextual success, error, and info updates during transaction routines.
3. **Glassmorphic Glow Cards**: Premium design layout styling with translucent backgrounds, neon borders, and smooth zoom-glow hover transformations.
4. **Theme Preset Preview Color Dots**: Color indicators in the theme selector demonstrating the primary color configurations of the selectable cosmic themes.

