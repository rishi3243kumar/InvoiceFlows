'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReputationRing from '@/components/ReputationRing';
import { useToast } from '@/components/Toast';
import { 
  executeProveAccessPipeline, 
  getConnectedWallet, 
  MIDNIGHT_CONFIG 
} from '@/lib/midnight';

export default function VerifyInvoice() {
  const { showToast } = useToast();
  const params = useParams();
  const id = params?.id as string;
  
  const [loading, setLoading] = useState(false);
  const [pipelineDetail, setPipelineDetail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [nullifier, setNullifier] = useState<string | null>(null);

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
          } else {
            // Default placeholder representation for direct links
            setInvoiceDetails({
              id,
              client: 'Acme Global Solutions',
              amount: 5000,
              riskScore: 98,
              secret: 'sec_0987654321',
              salt: 'salt_1725350400',
              tier: 'A'
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [id]);

  const exportInvoice = (format: 'json' | 'xml') => {
    const data = {
      invoiceId: id,
      network: 'Midnight Preprod (Zero-Knowledge)',
      contractAddress: MIDNIGHT_CONFIG.contractAddress,
      circuit: 'proveAccess',
      nullifier: nullifier || '0x4f8e9a2b1c...',
      reputationScore: 98,
      timestamp: new Date().toISOString()
    };
    
    let content = '';
    let filename = `midnight-invoice-${id.substring(0, 8)}`;
    
    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      filename += '.json';
    } else {
      content = `<?xml version="1.0" encoding="UTF-8"?>
<MidnightInvoice>
  <InvoiceId>${data.invoiceId}</InvoiceId>
  <Network>${data.network}</Network>
  <ContractAddress>${data.contractAddress}</ContractAddress>
  <Circuit>${data.circuit}</Circuit>
  <Nullifier>${data.nullifier}</Nullifier>
  <ReputationScore>${data.reputationScore}</ReputationScore>
  <ExportedAt>${data.timestamp}</ExportedAt>
</MidnightInvoice>`;
      filename += '.xml';
    }
    
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Invoice proof exported as ${format.toUpperCase()}! 💾`, 'success');
  };

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      showToast('Starting proveAccess Zero-Knowledge pipeline...', 'info');

      const result = await executeProveAccessPipeline({
        invoiceId: id,
        clientPubkey: 'mn1q8u3kvfm89dcj4e6tr25ha7kp92k',
        secret: invoiceDetails?.secret || 'sec_default_secret',
        amount: invoiceDetails?.amount || 5000,
        salt: invoiceDetails?.salt || 'salt_default',
        onStepChange: (step, detail) => {
          setPipelineDetail(detail);
          showToast(detail, 'info');
        }
      });

      setTxHash(result.txHash || null);
      setNullifier(result.nullifier || null);

      // Mark the local invoice as verified on-chain
      const localInvoices = JSON.parse(localStorage.getItem('invoiceflow_local_invoices') || '[]');
      const updated = localInvoices.map((inv: any) => {
        if (inv.id === id || id.startsWith(inv.id)) {
          return { ...inv, verified: true, tier: 'A', nullifier: result.nullifier };
        }
        return inv;
      });
      localStorage.setItem('invoiceflow_local_invoices', JSON.stringify(updated));

      setSuccess(true);
      showToast('proveAccess circuit verified! Invoice tokenized on Midnight Preprod.', 'success');
      
      setTimeout(() => {
        window.location.href = '/marketplace';
      }, 3500);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || 'Failed to execute proveAccess circuit on Midnight.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
      setPipelineDetail(null);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '3rem auto', textAlign: 'center', paddingBottom: '4rem' }}>
      <div className="panel">
        <h1 style={{ marginBottom: '1rem', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <span>🔐</span> Verify via proveAccess Circuit
        </h1>
        <p style={{ marginBottom: '2rem', fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6 }}>
          You are verifying invoice commitment ID <strong>{id?.substring(0, 16)}...</strong>. 
          Executing this circuit proves ownership and membership in the Merkle Root on <strong>Midnight Preprod</strong> without exposing financial balances.
        </p>

        {/* Invoice Status Stepper Timeline */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', position: 'relative', padding: '0 1rem' }}>
          <div style={{ position: 'absolute', top: '15px', left: '2rem', right: '2rem', height: '2px', background: 'var(--surface-border)', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', top: '15px', left: '2rem', width: success ? '66%' : '0%', height: '2px', background: 'var(--primary-cyan)', transition: 'all 0.5s ease', zIndex: 0 }}></div>

          {[
            { label: 'Committed', done: true },
            { label: 'proveAccess', done: success },
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
        
        {pipelineDetail && (
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid var(--nebula-purple)', color: '#fff', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', textAlign: 'left' }}>
            <span className="spinning">🌀</span>
            <span>{pipelineDetail}</span>
          </div>
        )}

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>✅ proveAccess Circuit Executed & Verified!</div>
            <div style={{ fontSize: '0.8rem', color: '#e2e8f0', fontFamily: 'Share Tech Mono, monospace', wordBreak: 'break-all', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div><strong>Preprod Tx:</strong> <a href={`https://explorer.preprod.midnight.network/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-cyan)', textDecoration: 'underline' }}>{txHash}</a></div>
              <div><strong>Generated Nullifier:</strong> {nullifier?.substring(0, 28)}...</div>
            </div>
          </div>
        )}

        <div style={{ backgroundColor: 'rgba(5, 7, 15, 0.8)', border: '1px solid var(--surface-border)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ marginBottom: '0.5rem', wordBreak: 'break-all', fontSize: '0.85rem' }}><strong>Invoice ID Hash:</strong> #{id}</div>
            {invoiceDetails && (
              <>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}><strong>Client Name:</strong> {invoiceDetails.client}</div>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}><strong>Shielded Amount:</strong> ${invoiceDetails.amount} (Private)</div>
              </>
            )}
            <div style={{ marginBottom: '0.5rem', color: 'var(--primary-cyan)', fontSize: '0.85rem' }}><strong>Network:</strong> Midnight Preprod (ZK-SNARK)</div>
            <div style={{ color: 'var(--glowing-gold)', fontSize: '0.85rem' }}><strong>Contract:</strong> {MIDNIGHT_CONFIG.contractAddress.substring(0, 20)}...</div>
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
            Export Proof (JSON)
          </button>
          <button 
            type="button" 
            onClick={() => exportInvoice('xml')} 
            className="btn btn-outline" 
            style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', flex: 1, borderRadius: '0.5rem', borderColor: 'var(--primary-cyan)', color: 'var(--primary-cyan)' }}
          >
            Export Proof (XML)
          </button>
        </div>

        <button onClick={handleVerify} className="btn btn-cyan" style={{ width: '100%', fontSize: '1.05rem', opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? 'Executing Proof → Balance → Submit...' : 'Execute proveAccess Circuit Pipeline'}
        </button>
      </div>
    </div>
  );
}
