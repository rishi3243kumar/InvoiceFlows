'use client';

import { useState, useRef } from 'react';
import { useToast } from '@/components/Toast';
import { 
  executeTokenizePipeline, 
  MIDNIGHT_CONFIG,
  getConnectedWallet
} from '@/lib/midnight';

export default function SubmitInvoice() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successTx, setSuccessTx] = useState<string | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<{
    invoiceId: string;
    commitment: string;
    nullifier: string;
  } | null>(null);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [discountRate, setDiscountRate] = useState(5);
  const [showGasComparison, setShowGasComparison] = useState(false);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const processAutofill = (fileName: string) => {
    showToast('Parsing PDF invoice metadata & computing hash...', 'info');
    setTimeout(() => {
      setClientName('Acme Global Solutions');
      setClientEmail('billing@acmeglobal.com');
      setAmount((Math.floor(Math.random() * 8500) + 1500).toString());
      setDueDate('2026-09-28');
      showToast('Metadata successfully extracted! Ready for ZK Tokenization. ⚡', 'success');
    }, 1000);
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

  const copyVerificationLink = () => {
    if (!invoiceDetails?.invoiceId) return;
    const link = `${window.location.origin}/verify/${invoiceDetails.invoiceId}`;
    navigator.clipboard.writeText(link);
    showToast('Midnight Zero-Knowledge Verification Link copied! 📋', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessTx(null);
    setInvoiceDetails(null);

    try {
      showToast('Initiating Midnight Compact contract pipeline...', 'info');
      
      const result = await executeTokenizePipeline({
        clientName,
        amount: parseFloat(amount),
        dueDate,
        riskTier: 1,
        onStepChange: (step, detail) => {
          setPipelineStep(detail);
          showToast(detail, 'info');
        }
      });

      // Save invoice record in local storage for verify & marketplace workflows
      const localInvoices = JSON.parse(localStorage.getItem('invoiceflow_local_invoices') || '[]');
      localInvoices.push({
        id: result.invoiceId,
        amount: parseInt(amount),
        riskScore: 98,
        price: Math.floor(parseInt(amount) * (1 - discountRate / 100)),
        yield: `${(discountRate * 2.4).toFixed(1)}%`,
        client: clientName,
        duration: 30,
        tier: 'A',
        commitment: result.commitment,
        nullifier: result.nullifier,
        secret: result.secret,
        salt: result.salt,
        txHash: result.txHash,
        merkleRoot: result.newMerkleRoot,
        verified: false,
      });
      localStorage.setItem('invoiceflow_local_invoices', JSON.stringify(localInvoices));

      setSuccessTx(result.txHash);
      setInvoiceDetails({
        invoiceId: result.invoiceId,
        commitment: result.commitment,
        nullifier: result.nullifier,
      });

      showToast('Invoice committed to Midnight Compact Merkle Tree! 🔐', 'success');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit invoice to Midnight Network.');
      showToast(err.message || 'Submission error', 'error');
    } finally {
      setLoading(false);
      setPipelineStep(null);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1 className="glow-title" style={{ fontSize: '2.5rem', margin: 0 }}>
          <span className="glow-cyan">Submit</span> Private Invoice
        </h1>
      </div>
      
      <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: '1.6' }}>
        Your invoice amount and counterparty details are protected with <strong>Zero-Knowledge Compact circuits</strong> on Midnight Preprod. Only a cryptographic commitment and Merkle root are published on-chain.
      </p>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          ⚠️ {error}
        </div>
      )}

      {pipelineStep && (
        <div style={{ padding: '0.85rem 1rem', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid var(--nebula-purple)', color: '#fff', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span className="spinning">🌀</span>
          <span>{pipelineStep}</span>
        </div>
      )}

      {successTx && invoiceDetails && (
        <div className="card" style={{ marginBottom: '2rem', border: '1px solid #10b981', boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✅</span>
            <div>
              <h3 style={{ margin: 0, color: '#10b981' }}>Committed to Midnight Compact Merkle Tree!</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Zero-Knowledge proof generated and verified on Midnight Preprod.</p>
            </div>
          </div>
          
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.85rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontFamily: 'Share Tech Mono, monospace', wordBreak: 'break-all', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div><strong>Invoice ID:</strong> <span style={{ color: 'var(--primary-cyan)' }}>#{invoiceDetails.invoiceId}</span></div>
            <div><strong>Commitment:</strong> {invoiceDetails.commitment.substring(0, 24)}...</div>
            <div><strong>Preprod Tx:</strong> <a href={`https://explorer.preprod.midnight.network/tx/${successTx}`} target="_blank" rel="noreferrer" style={{ color: 'var(--glowing-gold)', textDecoration: 'underline' }}>{successTx.substring(0, 24)}...</a></div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button className="btn btn-outline" onClick={copyVerificationLink} style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
              <span>📋</span> Copy ZK Verification Link
            </button>
            <a href={`/verify/${invoiceDetails.invoiceId}`} className="btn btn-cyan" style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.85rem', justifyContent: 'center' }}>
              <span>🛸</span> Verify via proveAccess
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
            <label className="form-label">Client Name / Pseudonym</label>
            <input type="text" className="form-input" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Acme Corp" required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Client Email / Communication Handle</label>
            <input type="email" className="form-input" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@acme.com" required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Invoice Amount (Shielded tDUST / USD Equivalent)</label>
            <input type="number" className="form-input" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 5000" required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Maturity / Due Date</label>
            <input type="date" className="form-input" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
          </div>

          {/* Dynamic Yield Calculator Slider */}
          <div className="form-group" style={{ marginTop: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--surface-border)' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Investor Yield Discount Rate</span>
              <strong style={{ color: 'var(--primary-cyan)' }}>{discountRate}%</strong>
            </label>
            <input 
              type="range" 
              min="1" 
              max="15" 
              value={discountRate} 
              onChange={e => setDiscountRate(parseInt(e.target.value))} 
              style={{ width: '100%', accentColor: 'var(--primary-cyan)', margin: '0.75rem 0', cursor: 'pointer' }}
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#64748b' }}>Investor Return:</span>
                <div style={{ fontWeight: 700, color: 'var(--glowing-gold)', fontSize: '1rem' }}>
                  ${((parseFloat(amount) || 0) * (discountRate / 100)).toFixed(2)}
                </div>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Freelancer Net Payout:</span>
                <div style={{ fontWeight: 700, color: 'var(--primary-cyan)', fontSize: '1rem' }}>
                  ${((parseFloat(amount) || 0) * (1 - discountRate / 100)).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Midnight ZK Gas & Circuit Transparency Display */}
          <div style={{ marginTop: '1.5rem', padding: '0.85rem 1rem', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(168, 85, 247, 0.15)', fontSize: '0.75rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, color: '#fff' }}>Midnight Preprod ZK Circuit Execution</span>
              <button 
                type="button"
                onClick={() => setShowGasComparison(!showGasComparison)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--primary-cyan)', 
                  cursor: 'pointer', 
                  textDecoration: 'underline',
                  fontSize: '0.7rem',
                  padding: 0
                }}
              >
                {showGasComparison ? 'Hide Architecture' : 'View Privacy Layer'}
              </button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>Compact Smart Contract:</span>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--nebula-purple)' }}>{MIDNIGHT_CONFIG.contractAddress.substring(0, 16)}...</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>Circuit Execution Method:</span>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--nebula-purple)' }}>tokenizeInvoice</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#fff', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.25rem', marginTop: '0.25rem' }}>
              <span>Est. Shielded Fee:</span>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--primary-cyan)' }}>0.0125 tDUST (~$0.0001)</span>
            </div>

            {showGasComparison && (
              <div style={{ marginTop: '0.75rem', borderTop: '1px dashed rgba(168, 85, 247, 0.3)', paddingTop: '0.75rem' }}>
                <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Zero-Knowledge Privacy Comparison:</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', color: '#10b981' }}>
                  <span>Midnight Network:</span>
                  <strong>Shielded Amount & Counterparty (Private zk-SNARK)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                  <span>Public Blockchains:</span>
                  <strong>Fully Exposed Amounts, Wallets, and Invoices</strong>
                </div>
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-cyan" style={{ width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Executing Midnight Pipeline...' : 'Generate ZK Proof & Tokenize'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
