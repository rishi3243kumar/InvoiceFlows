'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { getAddress, isConnected } from '@stellar/freighter-api';
import { CONTRACTS, loadAccount, server, submitTransaction, TESTNET_NETWORK_PASSPHRASE } from '@/lib/soroban';
import * as StellarSdk from '@stellar/stellar-sdk';
import { Contract } from '@stellar/stellar-sdk';

export default function VerifyInvoice() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!(await isConnected())) {
        throw new Error('Client: Please connect your Freighter wallet to confirm.');
      }
      
      const { address: pubKey } = await getAddress() as any;
      const account = await loadAccount(pubKey);
      
      // We will mint the token on-chain as proof of verification
      const contract = new Contract(CONTRACTS.invoiceToken);
      
      // mint_token(caller: Address, invoice_hash: BytesN<32>, risk_score: u32)
      // Hash should be 32 bytes. We take the transaction hash (which is 32 bytes) or pad it.
      let hexHash = id;
      if (hexHash.length < 64) hexHash = hexHash.padEnd(64, '0');
      if (hexHash.length > 64) hexHash = hexHash.substring(0, 64);
      
      const args = [
        StellarSdk.nativeToScVal(pubKey, { type: 'address' }),
        StellarSdk.nativeToScVal(Buffer.from(hexHash, 'hex')), // BytesN<32>
        StellarSdk.nativeToScVal(98, { type: 'u32' }), // Hardcoding excellent risk score for MVP flow
      ];

      const txBuilder = new StellarSdk.TransactionBuilder(account, {
        fee: '10000',
        networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
      }).addOperation(
        contract.call('mint_token', ...args)
      ).setTimeout(30);

      const result = await submitTransaction(txBuilder, pubKey);
      
      setSuccess(true);
      
      // Redirect to marketplace
      setTimeout(() => {
        window.location.href = '/marketplace';
      }, 3000);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to mint token on-chain.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
      <div className="panel">
        <h1 style={{ marginBottom: '1rem', color: '#10b981' }}>Verify Invoice</h1>
        <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: '#94a3b8' }}>
          You have been asked to verify invoice hash <strong>{id?.substring(0, 16)}...</strong>. 
          By confirming this, you acknowledge the invoice is authentic and you intend to pay it on the due date.
        </p>
        
        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            ✅ Invoice Verified & Tokenized Successfully! Redirecting to marketplace...
          </div>
        )}

        <div style={{ backgroundColor: 'rgba(5, 7, 15, 0.8)', border: '1px solid var(--surface-border)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ marginBottom: '0.5rem' }}><strong>Invoice Hash:</strong> {id}</div>
          <div style={{ marginBottom: '0.5rem', color: 'var(--primary-cyan)' }}><strong>Network:</strong> Stellar Testnet</div>
        </div>

        <button onClick={handleVerify} className="btn btn-cyan" style={{ width: '100%', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? 'Minting Trust Token...' : 'Confirm & Verify Authenticity'}
        </button>
      </div>
    </div>
  );
}
