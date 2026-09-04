'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

  const [invoiceDetails, setInvoiceDetails] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      const local = localStorage.getItem('invoiceflow_local_invoices');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          const found = parsed.find((inv: any) => inv.id === id || id.startsWith(inv.id));
          if (found) {
            setInvoiceDetails(found);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [id]);

  const exportInvoice = (format: 'json' | 'xml') => {
    const data = {
      invoiceHash: id,
      network: 'Stellar Testnet',
      riskTier: 'Low Risk',
      reputationScore: 98,
      timestamp: new Date().toISOString()
    };
    
    let content = '';
    let filename = `invoice-${id.substring(0, 8)}`;
    
    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      filename += '.json';
    } else {
      content = `<?xml version="1.0" encoding="UTF-8"?>
<StellarInvoice>
  <InvoiceHash>${data.invoiceHash}</InvoiceHash>
  <Network>${data.network}</Network>
  <RiskTier>${data.riskTier}</RiskTier>
  <ReputationScore>${data.reputationScore}</ReputationScore>
  <ExportedAt>${data.timestamp}</ExportedAt>
</StellarInvoice>`;
      filename += '.xml';
    }
    
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Invoice successfully exported as ${format.toUpperCase()}! 💾`, 'success');
  };

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!(await isConnected())) {
        throw new Error('Client: Please connect your Freighter wallet to confirm.');
      }
      
      const { address: pubKey } = await getAddress() as any;
      if (CONTRACTS.invoiceToken.includes('DUMMY')) {
        // Simulation mode fallback for demo/reviewing when contracts are not deployed
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Mark the local invoice as verified
        const localInvoices = JSON.parse(localStorage.getItem('invoiceflow_local_invoices') || '[]');
        const updated = localInvoices.map((inv: any) => {
          if (inv.id === id || id.startsWith(inv.id)) {
            return { ...inv, verified: true, tier: 'A' };
          }
          return inv;
        });
        localStorage.setItem('invoiceflow_local_invoices', JSON.stringify(updated));
        
        setSuccess(true);
        showToast('Invoice verified and RWA Token minted on Stellar (Simulation Mode)!', 'success');
        
        setTimeout(() => {
          window.location.href = '/marketplace';
        }, 3000);
      } else {
        const account = await loadAccount(pubKey);
        const contract = new Contract(CONTRACTS.invoiceToken);
        
        let hexHash = id;
        if (hexHash.length < 64) hexHash = hexHash.padEnd(64, '0');
        if (hexHash.length > 64) hexHash = hexHash.substring(0, 64);
        
        const args = [
          StellarSdk.nativeToScVal(pubKey, { type: 'address' }),
          StellarSdk.nativeToScVal(Buffer.from(hexHash, 'hex')),
          StellarSdk.nativeToScVal(98, { type: 'u32' }),
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
        
        setTimeout(() => {
          window.location.href = '/marketplace';
        }, 3000);
      }
      
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
            {invoiceDetails && (
              <>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}><strong>Client Name:</strong> {invoiceDetails.client}</div>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}><strong>Invoice Amount:</strong> ${invoiceDetails.amount} USDC</div>
              </>
            )}
            <div style={{ marginBottom: '0.5rem', color: 'var(--primary-cyan)', fontSize: '0.9rem' }}><strong>Network:</strong> Stellar Testnet</div>
            <div style={{ color: 'var(--glowing-gold)', fontSize: '0.9rem' }}><strong>Simulated Risk Tier:</strong> Low Risk</div>
          </div>
          <div style={{ textAlign: 'center', marginLeft: '1rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Reputation Score</div>
            <ReputationRing score={98} size={65} />
          </div>
        </div>

        {/* Export Utility */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <button 
            type="button" 
            onClick={() => exportInvoice('json')} 
            className="btn btn-outline" 
            style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', flex: 1, borderRadius: '0.5rem', borderColor: 'var(--primary-cyan)', color: 'var(--primary-cyan)' }}
          >
            Export JSON
          </button>
          <button 
            type="button" 
            onClick={() => exportInvoice('xml')} 
            className="btn btn-outline" 
            style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', flex: 1, borderRadius: '0.5rem', borderColor: 'var(--primary-cyan)', color: 'var(--primary-cyan)' }}
          >
            Export XML
          </button>
        </div>

        <button onClick={handleVerify} className="btn btn-cyan" style={{ width: '100%', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? 'Minting Trust Token...' : 'Confirm & Verify Authenticity'}
        </button>
      </div>
    </div>
  );
}
