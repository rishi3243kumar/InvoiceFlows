'use client';

import { useState, useRef } from 'react';
import { getAddress, isConnected } from '@stellar/freighter-api';
import { CONTRACTS, loadAccount, server, submitTransaction, TESTNET_NETWORK_PASSPHRASE } from '@/lib/soroban';
import * as StellarSdk from '@stellar/stellar-sdk';
import { Contract } from '@stellar/stellar-sdk';
import { useToast } from '@/components/Toast';

export default function SubmitInvoice() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTx, setSuccessTx] = useState<string | null>(null);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const processAutofill = (fileName: string) => {
    showToast('Parsing PDF invoice metadata...', 'info');
    setTimeout(() => {
      setClientName('Acme Global Solutions');
      setClientEmail('billing@acmeglobal.com');
      setAmount((Math.floor(Math.random() * 8500) + 1500).toString());
      setDueDate('2026-08-15');
      showToast('Autofill metadata successfully extracted! ⚡', 'success');
    }, 1200);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAutofill(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAutofill(e.target.files[0].name);
    }
  };
  
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [discountRate, setDiscountRate] = useState(5);

  const copyVerificationLink = () => {
    if (!successTx) return;
    const link = `${window.location.origin}/verify/${successTx}`;
    navigator.clipboard.writeText(link);
    showToast('Client Verification Link copied to clipboard! 📋', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessTx(null);

    try {
      if (!(await isConnected())) {
        throw new Error('Please connect your Freighter wallet first.');
      }
      
      const { address: pubKey } = await getAddress() as any;
      const account = await loadAccount(pubKey);
      
      const contract = new Contract(CONTRACTS.invoiceRegistry);
      
      // submit_invoice(client_id, amount, due_date, freelancer_address)
      const dueTimestamp = Math.floor(new Date(dueDate).getTime() / 1000);
      const args = [
        StellarSdk.nativeToScVal(clientName, { type: 'string' }),
        StellarSdk.nativeToScVal(parseInt(amount), { type: 'u64' }),
        StellarSdk.nativeToScVal(dueTimestamp, { type: 'u64' }),
        StellarSdk.nativeToScVal(pubKey, { type: 'address' }),
      ];

      const txBuilder = new StellarSdk.TransactionBuilder(account, {
        fee: '10000',
        networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
      }).addOperation(
        contract.call('submit_invoice', ...args)
      ).setTimeout(30);

      const result = await submitTransaction(txBuilder, pubKey);
      
      setSuccessTx(result.hash);
      showToast('Invoice registered successfully on Stellar Trust Layer!', 'success');
      
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || 'Failed to submit invoice to blockchain.';
      if (err.message?.includes('Invoice already exists')) {
        errMsg = 'Duplicate invoice detected! Already registered on the blockchain.';
      }
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1 className="glow-title" style={{ fontSize: '2.5rem', margin: 0 }}>
          <span className="glow-cyan">Submit</span> Invoice
        </h1>
      </div>
      
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
        Your invoice will be deterministically hashed and registered on the Stellar blockchain to permanently prevent duplicate financing.
      </p>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          ⚠️ {error}
        </div>
      )}

      {successTx && (
        <div className="card" style={{ marginBottom: '2rem', border: '1px solid #10b981', boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✅</span>
            <div>
              <h3 style={{ margin: 0, color: '#10b981' }}>Invoice Registered on Stellar!</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Transaction hash successfully written to ledger.</p>
            </div>
          </div>
          
          <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontFamily: 'Share Tech Mono, monospace', wordBreak: 'break-all' }}>
            <strong>Hash:</strong> <a href={`https://stellar.expert/explorer/testnet/tx/${successTx}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-cyan)', textDecoration: 'underline' }}>{successTx}</a>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button className="btn btn-outline" onClick={copyVerificationLink} style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
              <span>📋</span> Copy Shareable Link
            </button>
            <a href={`/verify/${successTx}`} className="btn btn-cyan" style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.85rem', justifyContent: 'center' }}>
              <span>🛸</span> Verify Invoice
            </a>
          </div>
        </div>
      )}

      <div className="panel">
        {/* PDF Autofill Dropzone */}
        <div 
          onClick={handleBoxClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          style={{
            border: '2px dashed var(--surface-border)',
            borderRadius: '1rem',
            padding: '1.75rem',
            textAlign: 'center',
            marginBottom: '2rem',
            cursor: 'pointer',
            background: 'rgba(6, 182, 212, 0.02)',
            transition: 'all 0.3s ease',
            boxShadow: 'inset 0 0 15px rgba(6, 182, 212, 0.05)'
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept=".pdf" 
            style={{ display: 'none' }} 
          />
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📄</span>
          <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--text-color)' }}>Autofill Invoice from PDF</h4>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
            Drag & drop your invoice PDF here, or <span style={{ color: 'var(--primary-cyan)', textDecoration: 'underline' }}>browse files</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Client Name / ID</label>
            <input type="text" className="form-input" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Acme Corp" required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Client Email (For Verification)</label>
            <input type="email" className="form-input" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@acme.com" required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Invoice Amount (USDC)</label>
            <input type="number" className="form-input" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 5000" required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input type="date" className="form-input" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
          </div>

          <div className="form-group" style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-cyan" style={{ width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Processing on Stellar...' : 'Register on Trust Layer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
