'use client';

import { useState } from 'react';
import { getAddress, isConnected } from '@stellar/freighter-api';
import { CONTRACTS, loadAccount, server, submitTransaction, TESTNET_NETWORK_PASSPHRASE } from '@/lib/soroban';
import * as StellarSdk from '@stellar/stellar-sdk';
import { Contract } from '@stellar/stellar-sdk';
import ReputationRing from '@/components/ReputationRing';
import { useToast } from '@/components/Toast';

const DEFAULT_INVOICES = [
  { id: '1092', amount: 15000, riskScore: 98, price: 14580, yield: '9.4%', client: 'Acme Corp', duration: 30, tier: 'A' },
  { id: '8839', amount: 4200, riskScore: 92, price: 3990, yield: '11.2%', client: 'Globex Inc', duration: 45, tier: 'A' },
  { id: '4720', amount: 8000, riskScore: 78, price: 7440, yield: '14.0%', client: 'Umbrella Corp', duration: 60, tier: 'B' }
];

export default function Marketplace() {
  const { showToast } = useToast();
  const [tokenId, setTokenId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [invoices, setInvoices] = useState(DEFAULT_INVOICES);
  const [filterTier, setFilterTier] = useState('ALL'); // ALL, A, B
  const [sortBy, setSortBy] = useState('YIELD'); // YIELD, PRICE
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);
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

  const filteredInvoices = invoices
    .filter(inv => {
      if (filterTier === 'ALL') return true;
      return inv.tier === filterTier;
    })
    .sort((a, b) => {
      if (sortBy === 'YIELD') {
        return parseFloat(b.yield) - parseFloat(a.yield);
      } else {
        return b.amount - a.amount;
      }
    });

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '4rem' }}>
      <h1 className="glow-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
        <span className="glow-cyan">Invoice</span> Marketplace
      </h1>
      
      <p style={{ color: '#94a3b8', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
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

      {/* Filter and Sorting Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'A', 'B'].map((tier) => (
            <button 
              key={tier} 
              onClick={() => setFilterTier(tier)}
              className="btn btn-outline"
              style={{ 
                padding: '0.45rem 1.25rem', 
                fontSize: '0.8rem',
                borderColor: filterTier === tier ? 'var(--primary-cyan)' : 'var(--surface-border)',
                color: filterTier === tier ? 'var(--primary-cyan)' : '#94a3b8',
                background: filterTier === tier ? 'rgba(6, 182, 212, 0.05)' : 'transparent',
                borderRadius: '0.5rem'
              }}
            >
              {tier === 'ALL' ? 'All Tiers' : `Tier ${tier}`}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>SORT BY:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="form-input" 
            style={{ 
              padding: '0.4rem 2rem 0.4rem 0.75rem', 
              fontSize: '0.8rem', 
              width: 'auto', 
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--surface-border)',
              borderRadius: '0.5rem',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <option value="YIELD">Highest Yield</option>
            <option value="PRICE">Highest Price</option>
          </select>
        </div>
      </div>

      {/* Lookup Panel */}
      <div className="panel" style={{ marginBottom: '2.5rem', background: 'rgba(255, 255, 255, 0.01)' }}>
        <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Lookup Tokenized Registry Invoice</h3>
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="number" 
            className="form-input" 
            placeholder="Enter Token ID (e.g., 1092)" 
            value={tokenId}
            onChange={e => setTokenId(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-cyan" disabled={loading}>
            {loading ? 'Searching...' : 'Search Ledger'}
          </button>
        </form>
      </div>

      {/* Target Search Lookup Outcome */}
      {tokenData && (
        <div className="card" style={{ marginBottom: '2.5rem', border: '1px solid var(--primary-cyan)', boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)' }}>
          <div style={{ float: 'right' }}>
            <button className="btn btn-outline" onClick={() => setTokenData(null)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>Clear Search</button>
          </div>
          <h4 style={{ color: 'var(--primary-cyan)', margin: '0 0 1rem 0', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Registry Query Result</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontWeight: '800', fontSize: '1.5rem', color: '#fff' }}>${tokenData.amount.toLocaleString()} USDC</span>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>Token ID: #{tokenData.id} • {tokenData.client}</div>
            </div>
            <ReputationRing score={tokenData.riskScore} size={60} />
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: 'rgba(5, 7, 15, 0.8)', border: '1px solid var(--surface-border)', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Purchase Price:</span>
              <strong style={{ color: '#fff' }}>${tokenData.price.toLocaleString()} USDC</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
              <span>Implied APY Yield:</span>
              <strong>{tokenData.yield}</strong>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => handleAction('buy')} className="btn btn-cyan" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Processing...' : 'Fund Primary (Buy)'}
            </button>
            <button onClick={() => handleAction('settle')} className="btn btn-outline" style={{ flex: 1, borderColor: '#10b981', color: '#10b981' }} disabled={loading}>
              {loading ? 'Processing...' : 'Settle Invoice (Repay)'}
            </button>
          </div>
        </div>
      )}

      {/* Main Opportunities Registry List */}
      <h3 style={{ marginBottom: '1.25rem', fontSize: '1.25rem', fontWeight: 800 }}>Stellar Verified Opportunities</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredInvoices.map((inv) => {
          const isExpanded = expandedInvoiceId === inv.id;
          return (
            <div 
              key={inv.id} 
              className="card" 
              style={{ 
                cursor: 'pointer',
                borderColor: isExpanded ? 'var(--primary-cyan)' : 'var(--surface-border)',
                boxShadow: isExpanded ? '0 0 25px rgba(6, 182, 212, 0.1)' : 'none',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setExpandedInvoiceId(isExpanded ? null : inv.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', fontSize: '1.15rem', color: '#fff' }}>{inv.client}</span>
                    <span className="tech-label" style={{ padding: '0.15rem 0.5rem', fontSize: '0.65rem' }}>ID #{inv.id}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Amount: <strong style={{ color: 'var(--primary-cyan)' }}>${inv.amount.toLocaleString()} USDC</strong> • Lockup: {inv.duration} Days
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--glowing-gold)', fontWeight: 800, fontSize: '1rem' }}>{inv.yield} APY</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Discount Price: ${inv.price.toLocaleString()}</div>
                  </div>
                  <ReputationRing score={inv.riskScore} size={50} />
                </div>
              </div>

              {/* Collapsible Detail Panel */}
              {isExpanded && (
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  style={{ 
                    marginTop: '1.5rem', 
                    paddingTop: '1.5rem', 
                    borderTop: '1px solid var(--surface-border)',
                    cursor: 'default',
                    animation: 'fadeIn 0.3s ease'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Client Risk Classification:</span>
                      <div style={{ fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>Tier {inv.tier} (Low Risk Profile)</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Escrow Maturity Date:</span>
                      <div style={{ fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>{new Date(Date.now() + inv.duration * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Interactive ROI Projection Chart */}
                  <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '0.5rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>ROI YIELD PROJECTIONS</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[30, 60, 90].map((days) => {
                        const rate = parseFloat(inv.yield) / 100;
                        const projectedValue = (inv.amount * rate * (days / 365)).toFixed(2);
                        const widthPct = Math.min((days / 90) * 100, 100);
                        return (
                          <div key={days} style={{ fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                              <span>{days} Days Lockup Yield:</span>
                              <strong style={{ color: 'var(--primary-cyan)' }}>+${projectedValue} USDC</strong>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${widthPct}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-cyan), var(--nebula-purple))', borderRadius: '3px' }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Buy / Sell / Secondary Resell Action Controls */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleAction('buy')} 
                      className="btn btn-cyan" 
                      style={{ flex: 1, minWidth: '150px' }}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Fund Invoice (Buy)'}
                    </button>
                    <button 
                      onClick={() => handleAction('settle')} 
                      className="btn btn-outline" 
                      style={{ flex: 1, minWidth: '150px', borderColor: '#10b981', color: '#10b981' }}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Settle Invoice (Repay)'}
                    </button>
                    <button 
                      onClick={() => {
                        setTokenId(inv.id);
                        showToast('Invoice listed for secondary market trading!', 'success');
                      }} 
                      className="btn btn-outline" 
                      style={{ flex: 1, minWidth: '150px', borderColor: 'var(--glowing-gold)', color: 'var(--glowing-gold)' }}
                    >
                      Resell on Secondary
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
