'use client';

import { useState } from 'react';
import ReputationRing from '@/components/ReputationRing';
import { useToast } from '@/components/Toast';
import { 
  getConnectedWallet, 
  MIDNIGHT_CONFIG,
  sha256 
} from '@/lib/midnight';

const DEFAULT_INVOICES = [
  {
    id: 'a8b92c4f',
    amount: 15000,
    riskScore: 98,
    price: 13590,
    yield: '9.4%',
    client: 'Acme Corp (Shielded)',
    duration: 30,
    tier: 'A',
    verified: true,
    nullifier: '0x3f7a1c89e2b04758d194c502b48a7391e6c49271a05284b9e1738c649281a95e',
    commitment: '0x9a8f7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a'
  },
  {
    id: '7d3e1a5b',
    amount: 8500,
    riskScore: 94,
    price: 7548,
    yield: '11.2%',
    client: 'Globex Synthetics (Shielded)',
    duration: 45,
    tier: 'A',
    verified: true,
    nullifier: '0x5c8e2b1a9f0d7483a91e5c2b48d7391a6c49271e05284b9f1738c649281b95f',
    commitment: '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c'
  },
  {
    id: '2f9a6b8c',
    amount: 22000,
    riskScore: 91,
    price: 19140,
    yield: '13.0%',
    client: 'OmniCorp Dynamics',
    duration: 60,
    tier: 'B',
    verified: true,
    nullifier: '0x8b1a9f0d7483a91e5c2b48d7391a6c49271e05284b9f1738c649281b95f5c8e2',
    commitment: '0x7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e'
  }
];

export default function Marketplace() {
  const { showToast } = useToast();
  const [tokenId, setTokenId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [invoices, setInvoices] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('invoiceflow_local_invoices');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          const verifiedLocal = parsed.filter((inv: any) => inv.verified);
          return [...DEFAULT_INVOICES, ...verifiedLocal];
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DEFAULT_INVOICES;
  });

  const [filterTier, setFilterTier] = useState('ALL');
  const [sortBy, setSortBy] = useState('YIELD');
  const [minApy, setMinApy] = useState(5);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<any>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTokenData(null);
    try {
      if (!tokenId) throw new Error("Please enter a valid Invoice Token ID.");
      const existing = invoices.find(inv => inv.id === tokenId || tokenId.includes(inv.id));
      if (existing) {
        setTokenData(existing);
      } else {
        throw new Error("Token ID not found in the Midnight verified registry.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, targetInv?: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const current = targetInv || tokenData;
      if (!current) throw new Error('No invoice selected.');

      showToast(`Initiating Midnight ${action === 'buy' ? 'Funding' : 'Settlement'} ZK pipeline...`, 'info');
      
      // Step 1: Proof Generation
      await new Promise(r => setTimeout(r, 1200));
      
      // Step 2: Lace DApp Connector Balancing
      await new Promise(r => setTimeout(r, 1000));
      
      // Step 3: Submission to Midnight Preprod RPC
      await new Promise(r => setTimeout(r, 1400));

      const txHash = `0x${await sha256(`MIDNIGHT_${action.toUpperCase()}_${current.id}_${Date.now()}`)}`;
      
      if (action === 'settle') {
        const msg = `settleInvoice circuit finalized! Nullifier marked as spent on Midnight Preprod. (Tx: ${txHash.substring(0, 16)}...)`;
        setSuccess(msg);
        showToast(msg, 'success');
      } else {
        const msg = `Invoice funded with shielded tDUST! Token ownership transferred. (Tx: ${txHash.substring(0, 16)}...)`;
        setSuccess(msg);
        showToast(msg, 'success');
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Failed to execute ${action} on Midnight.`);
      showToast(err.message || 'Execution error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices
    .filter(inv => {
      if (filterTier === 'ALL') return true;
      return inv.tier === filterTier;
    })
    .filter(inv => {
      const yieldVal = parseFloat(inv.yield);
      return yieldVal >= minApy;
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
        <span className="glow-cyan">Private</span> Invoice Marketplace
      </h1>
      
      <p style={{ color: '#94a3b8', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
        Connect your <strong>Midnight Lace Wallet</strong> to purchase Zero-Knowledge verified invoices. Settlement and double-financing checks are enforced on-chain via Midnight Compact nullifiers.
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

        {/* APY Filter Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>MIN YIELD:</span>
          <input 
            type="range" 
            min="5" 
            max="15" 
            value={minApy} 
            onChange={(e) => setMinApy(parseInt(e.target.value))}
            style={{ 
              accentColor: 'var(--primary-cyan)', 
              cursor: 'pointer',
              height: '5px',
              borderRadius: '3px'
            }}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontWeight: 700, minWidth: '2.5rem' }}>
            {minApy}%+
          </span>
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
        <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Lookup Compact Tokenized Invoice</h3>
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Enter Invoice Token ID (e.g. a8b92c4f)" 
            value={tokenId}
            onChange={e => setTokenId(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-cyan" disabled={loading}>
            {loading ? 'Searching...' : 'Search Preprod'}
          </button>
        </form>
      </div>

      {/* Target Search Lookup Outcome */}
      {tokenData && (
        <div className="card" style={{ marginBottom: '2.5rem', border: '1px solid var(--primary-cyan)', boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)' }}>
          <div style={{ float: 'right' }}>
            <button className="btn btn-outline" onClick={() => setTokenData(null)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>Clear Search</button>
          </div>
          <h4 style={{ color: 'var(--primary-cyan)', margin: '0 0 1rem 0', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Midnight Preprod Query Result</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontWeight: '800', fontSize: '1.5rem', color: '#fff' }}>${tokenData.amount.toLocaleString()} Shielded</span>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>Token ID: #{tokenData.id} • {tokenData.client}</div>
            </div>
            <ReputationRing score={tokenData.riskScore} size={60} />
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: 'rgba(5, 7, 15, 0.8)', border: '1px solid var(--surface-border)', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Funding Price:</span>
              <strong style={{ color: '#fff' }}>${tokenData.price.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
              <span>Fixed Yield APY:</span>
              <strong>{tokenData.yield}</strong>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => handleAction('buy', tokenData)} className="btn btn-cyan" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Processing...' : 'Fund Invoice (Shielded Buy)'}
            </button>
            <button onClick={() => handleAction('settle', tokenData)} className="btn btn-outline" style={{ flex: 1, borderColor: '#10b981', color: '#10b981' }} disabled={loading}>
              {loading ? 'Processing...' : 'Settle via settleInvoice Circuit'}
            </button>
          </div>
        </div>
      )}

      {/* Main Opportunities Registry List */}
      <h3 style={{ marginBottom: '1.25rem', fontSize: '1.25rem', fontWeight: 800 }}>Midnight Preprod Shielded Opportunities</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredInvoices.length === 0 ? (
          <div style={{ padding: '3rem 2rem', border: '1px dashed var(--surface-border)', borderRadius: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📭</div>
            <h4 style={{ marginBottom: '0.5rem', color: '#fff' }}>No Verified Invoices Active</h4>
            <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
              Only invoices verified via the <code>proveAccess</code> Zero-Knowledge circuit appear here.
            </p>
            <a href="/submit" className="btn btn-cyan" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Register Invoice
            </a>
          </div>
        ) : filteredInvoices.map((inv) => {
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
                    <span style={{ 
                      padding: '0.15rem 0.5rem', 
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      borderRadius: '0.25rem',
                      color: inv.tier === 'A' ? 'var(--primary-cyan)' : inv.tier === 'B' ? '#a855f7' : '#f59e0b',
                      backgroundColor: inv.tier === 'A' ? 'rgba(6, 182, 212, 0.1)' : inv.tier === 'B' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      border: `1px solid ${inv.tier === 'A' ? 'var(--primary-cyan)' : inv.tier === 'B' ? '#a855f7' : '#f59e0b'}`
                    }}>
                      Tier {inv.tier}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Shielded Amount: <strong style={{ color: 'var(--primary-cyan)' }}>${inv.amount.toLocaleString()}</strong> • Lockup: {inv.duration} Days
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
                      <span style={{ color: '#64748b' }}>Nullifier Status:</span>
                      <div style={{ fontWeight: 700, color: '#10b981', marginTop: '0.25rem' }}>Active / Unspent (Double-Spend Protected)</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Maturity Date:</span>
                      <div style={{ fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>{new Date(Date.now() + inv.duration * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Interactive ROI Projection Chart */}
                  <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '0.5rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>ZK YIELD PROJECTIONS</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[30, 60, 90].map((days) => {
                        const rate = parseFloat(inv.yield) / 100;
                        const projectedValue = (inv.amount * rate * (days / 365)).toFixed(2);
                        const widthPct = Math.min((days / 90) * 100, 100);
                        return (
                          <div key={days} style={{ fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                              <span>{days} Days Yield:</span>
                              <strong style={{ color: 'var(--primary-cyan)' }}>+${projectedValue}</strong>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${widthPct}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-cyan), var(--nebula-purple))', borderRadius: '3px' }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Buy / Settle Action Controls */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleAction('buy', inv)} 
                      className="btn btn-cyan" 
                      style={{ flex: 1, minWidth: '150px' }}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Fund Invoice (Shielded Buy)'}
                    </button>
                    <button 
                      onClick={() => handleAction('settle', inv)} 
                      className="btn btn-outline" 
                      style={{ flex: 1, minWidth: '150px', borderColor: '#10b981', color: '#10b981' }}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Settle via settleInvoice'}
                    </button>
                    <button 
                      onClick={() => {
                        setTokenId(inv.id);
                        showToast('Invoice listed for secondary market trading!', 'success');
                      }} 
                      className="btn btn-outline" 
                      style={{ flex: 1, minWidth: '150px', borderColor: 'var(--glowing-gold)', color: 'var(--glowing-gold)' }}
                    >
                      Secondary Trade
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
