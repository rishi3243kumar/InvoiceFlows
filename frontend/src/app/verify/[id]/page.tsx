'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { getAddress, isConnected } from '@stellar/freighter-api';
import { CONTRACTS, loadAccount, server, submitTransaction, TESTNET_NETWORK_PASSPHRASE } from '@/lib/soroban';
import * as StellarSdk from '@stellar/stellar-sdk';
import { Contract } from '@stellar/stellar-sdk';
import ReputationRing from '@/components/ReputationRing';
import { useToast } from '@/components/Toast';

export default function VerifyInvoice() {
  const { showToast } = useToast();
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
      showToast('Invoice verified and RWA Token minted on Stellar!', 'success');
      
      // Redirect to marketplace
      setTimeout(() => {
        window.location.href = '/marketplace';
      }, 3000);
      
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || 'Failed to mint token on-chain.';
      setError(errMsg);
      showToast(errMsg, 'error');
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

        {/* Invoice Status Stepper Timeline */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', position: 'relative', padding: '0 1rem' }}>
          <div style={{ position: 'absolute', top: '15px', left: '2rem', right: '2rem', height: '2px', background: 'var(--surface-border)', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', top: '15px', left: '2rem', width: success ? '66%' : '0%', height: '2px', background: 'var(--primary-cyan)', transition: 'all 0.5s ease', zIndex: 0 }}></div>

          {[
            { label: 'Registered', done: true },
            { label: 'Verified', done: success },
            { label: 'Tokenized', done: success },
            { label: 'Settled', done: false }
          ].map((step, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step.done ? 'var(--primary-cyan)' : '#0f172a',
                border: `2px solid ${step.done ? 'var(--primary-cyan)' : 'var(--surface-border)'}`,
                boxShadow: step.done ? 'var(--cyan-glow)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                color: step.done ? '#03050c' : '#64748b',
                fontWeight: 700,
                transition: 'all 0.3s'
              }}>
                {step.done ? '✓' : idx + 1}
              </div>
              <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 600, color: step.done ? '#fff' : '#64748b' }}>{step.label}</span>
            </div>
          ))}
        </div>
        
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

        <div style={{ backgroundColor: 'rgba(5, 7, 15, 0.8)', border: '1px solid var(--surface-border)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ marginBottom: '0.5rem', wordBreak: 'break-all', fontSize: '0.9rem' }}><strong>Invoice Hash:</strong> {id}</div>
            <div style={{ marginBottom: '0.5rem', color: 'var(--primary-cyan)', fontSize: '0.9rem' }}><strong>Network:</strong> Stellar Testnet</div>
            <div style={{ color: 'var(--glowing-gold)', fontSize: '0.9rem' }}><strong>Simulated Risk Tier:</strong> Low Risk</div>
          </div>
          <div style={{ textAlign: 'center', marginLeft: '1rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Reputation Score</div>
            <ReputationRing score={98} size={65} />
          </div>
        </div>

        <button onClick={handleVerify} className="btn btn-cyan" style={{ width: '100%', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? 'Minting Trust Token...' : 'Confirm & Verify Authenticity'}
        </button>
      </div>
    </div>
  );
}
