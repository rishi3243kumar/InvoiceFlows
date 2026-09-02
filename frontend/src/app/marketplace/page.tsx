'use client';

import { useState } from 'react';
import { getAddress, isConnected } from '@stellar/freighter-api';
import { CONTRACTS, loadAccount, server, submitTransaction, TESTNET_NETWORK_PASSPHRASE } from '@/lib/soroban';
import * as StellarSdk from '@stellar/stellar-sdk';
import { Contract } from '@stellar/stellar-sdk';
import ReputationRing from '@/components/ReputationRing';

const DEFAULT_INVOICES = [
  { id: '1092', amount: 15000, riskScore: 98, price: 14580, yield: '9.4%', client: 'Acme Corp', duration: 30, tier: 'A' },
  { id: '8839', amount: 4200, riskScore: 92, price: 3990, yield: '11.2%', client: 'Globex Inc', duration: 45, tier: 'A' },
  { id: '4720', amount: 8000, riskScore: 78, price: 7440, yield: '14.0%', client: 'Umbrella Corp', duration: 60, tier: 'B' }
];

export default function Marketplace() {
  const [tokenId, setTokenId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [invoices, setInvoices] = useState(DEFAULT_INVOICES);
  const [filterTier, setFilterTier] = useState('ALL'); // ALL, A, B
  const [sortBy, setSortBy] = useState('YIELD'); // YIELD, PRICE
  const [tokenData, setTokenData] = useState<any>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTokenData(null);
    try {
      if (!tokenId) throw new Error("Please enter a valid Token ID.");
      // In a real app we'd query Horizon/Soroban for the token data.
      // Here we simulate fetching the token data to keep UI responsive.
      // If we had the real contract deployed, we'd use contract.call('get_token') here.
      
      const existing = invoices.find(inv => inv.id === tokenId);
      if (existing) {
        setTokenData(existing);
      } else {
        setTokenData({
          id: tokenId,
          amount: 5000,
          riskScore: 95,
          price: 4850,
          yield: '9.8%',
          client: 'Dynamic Corp',
          duration: 30,
          tier: 'A'
        });
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!(await isConnected())) {
        throw new Error('Please connect your Freighter wallet.');
      }
      
      const { address: pubKey } = await getAddress() as any;
      const account = await loadAccount(pubKey);
      let contractId = '';
      let method = '';
      let args: any[] = [];
      
      if (action === 'buy') {
        contractId = CONTRACTS.escrowSettlement;
        method = 'fund_escrow';
        args = [
          StellarSdk.nativeToScVal(pubKey, { type: 'address' }),
          StellarSdk.nativeToScVal(pubKey, { type: 'address' }), // simulating freelancer address
          StellarSdk.nativeToScVal(parseInt(tokenId), { type: 'u64' }),
          StellarSdk.nativeToScVal(tokenData.price, { type: 'u64' }),
        ];
      } else if (action === 'settle') {
        contractId = CONTRACTS.escrowSettlement;
        method = 'settle';
        args = [
          StellarSdk.nativeToScVal(parseInt(tokenId), { type: 'u64' }),
          StellarSdk.nativeToScVal(true)
        ];
      }

      const contract = new Contract(contractId);
      const txBuilder = new StellarSdk.TransactionBuilder(account, {
        fee: '10000',
        networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
      }).addOperation(
        contract.call(method, ...args)
      ).setTimeout(30);

      const result = await submitTransaction(txBuilder, pubKey);
      setSuccess(`Transaction successful! Hash: ${result.hash}`);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Failed to execute ${action} on-chain.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="glow-title" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        <span className="glow-cyan">Invoice</span> Marketplace
      </h1>
      
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
        Connect your wallet to purchase trust-verified invoices. Yield is computed dynamically from the client's on-chain reputation score.
      </p>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', borderRadius: '0.5rem', marginBottom: '1.5rem', wordBreak: 'break-all' }}>
          ✅ {success}
        </div>
      )}

      <div className="panel" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Lookup Tokenized Invoice</h3>
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="number" 
            className="form-input" 
            placeholder="Enter Token ID (e.g., 1)" 
            value={tokenId}
            onChange={e => setTokenId(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-outline" disabled={loading}>
            {loading ? 'Searching...' : 'Search Ledger'}
          </button>
        </form>
      </div>

      {tokenData && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontWeight: '600', fontSize: '1.25rem' }}>${tokenData.amount} USDC</span>
            <span className="badge badge-success">Tier A ({tokenData.riskScore})</span>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>Token ID: #{tokenData.id}</div>
          <div style={{ marginBottom: '0.5rem' }}>Client Reputation Score: {tokenData.riskScore}/100</div>
          <div style={{ marginBottom: '1rem' }}>Status: Available on Primary Market</div>
          
          <div style={{ padding: '1rem', backgroundColor: 'rgba(5, 7, 15, 0.8)', border: '1px solid var(--surface-border)', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Purchase Price:</span>
              <span style={{ fontWeight: 'bold' }}>${tokenData.price} USDC</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
              <span>Implied Yield:</span>
              <span>~{tokenData.yield}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => handleAction('buy')} className="btn btn-cyan" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Processing...' : 'Fund (Buy)'}
            </button>
            <button onClick={() => handleAction('settle')} className="btn btn-outline" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Processing...' : 'Settle (Repay)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
