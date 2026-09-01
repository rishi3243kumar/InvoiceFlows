'use client';

import { useState } from 'react';
import { getAddress, isConnected } from '@stellar/freighter-api';
import { CONTRACTS, loadAccount, server, submitTransaction, TESTNET_NETWORK_PASSPHRASE } from '@/lib/soroban';
import * as StellarSdk from '@stellar/stellar-sdk';
import { Contract } from '@stellar/stellar-sdk';
import { useToast } from '@/components/Toast';

export default function SubmitInvoice() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTx, setSuccessTx] = useState<string | null>(null);
  
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

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
        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          ✅ Success! Tx Hash: <a href={`https://stellar.expert/explorer/testnet/tx/${successTx}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>{successTx.substring(0, 10)}...</a>
          <br/>Redirecting to verification...
        </div>
      )}

      <div className="panel">
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
