# 📖 InvoiceFlow: Complete User Guide & Step-by-Step Walkthrough

## 1. Prerequisites & Wallet Setup

1. Install the **Midnight Lace Wallet** or **1AM Wallet** extension in Google Chrome / Brave.
2. Switch network to **Midnight Preprod**.
3. Obtain testnet `tNIGHT` and `tDUST` from the official Midnight Preprod faucet.
4. Navigate to the live application: [https://invoice-flows.vercel.app/](https://invoice-flows.vercel.app/)

---

## 2. Freelancer / Borrower Flow: Submit & Tokenize Invoice

1. **Connect Wallet:** Click **Connect Wallet** in the top navigation bar to pair your Midnight Lace / 1AM account.
2. **Navigate to Submit:** Click **Submit Invoice** in the menu or on the homepage hero.
3. **Autofill from PDF (Optional):** Drag & drop your PDF invoice or click to browse files. InvoiceFlow extracts client metadata, amount, and due date locally in the browser.
4. **Configure Financing Terms:**
   - Client Name / Pseudonym (e.g., `Acme Corp`).
   - Invoice Amount (in USD / Shielded `tDUST`).
   - Due Date.
   - Investor Discount Yield (1% - 15%).
5. **Generate ZK Proof & Tokenize:** Click **Generate ZK Proof & Tokenize**.
   - Step 1: Proof generation via Midnight Proof Server.
   - Step 2: Unbound transaction balancing with `tDUST`.
   - Step 3: Submission to Midnight Preprod RPC.
   - Step 4: On-chain confirmation and receipt of the unique ZK Verification Link.

---

## 3. Verification Flow: `verifyAndSettleInvoice` Circuit Execution

1. Open the verification link: `/verify/[id]`.
2. Inspect the confidential metadata (Invoice ID Hash, shielded verification score).
3. Click **Execute proveAccess Circuit Pipeline**.
4. The client software builds private witnesses (`invoiceSecret`, `merklePath`, `pathDirections`), proves inclusion against the on-chain Merkle root, and generates the deterministic nullifier.
5. Export the cryptographic proof certificate as **JSON** or **XML** for your records.

---

## 4. Investor Flow: Shielded Marketplace & Funding

1. Navigate to the **Marketplace** tab (`/marketplace`).
2. Filter available opportunities by **Risk Tier (Tier A, Tier B)** or **Minimum Yield APY**.
3. Expand an invoice card to view the interactive ZK Yield Projection (30, 60, 90 days).
4. Click **Fund Invoice (Shielded Buy)** to provide liquidity.
5. Once the invoice matures, click **Settle via settleInvoice** to burn the nullifier on-chain and receive the full principal plus yield in shielded tokens.
