'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';
import { 
  connectLaceWallet, 
  getConnectedWallet, 
  isLaceInstalled, 
  MidnightWalletState,
  MIDNIGHT_CONFIG 
} from '@/lib/midnight';

const themes = [
  { name: 'Midnight Cyan 🪐', primary: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)', gold: '#fbbf24', goldGlow: 'rgba(251, 191, 36, 0.4)', purple: '#c084fc', purpleGlow: 'rgba(192, 132, 252, 0.3)', bg: '#030712', bgGrad: 'radial-gradient(circle at 50% 0%, #0f172a 0%, #030712 100%)' },
  { name: 'Nebula Violet 🌌', primary: '#c084fc', glow: 'rgba(192, 132, 252, 0.4)', gold: '#fbbf24', goldGlow: 'rgba(251, 191, 36, 0.4)', purple: '#38bdf8', purpleGlow: 'rgba(56, 189, 248, 0.3)', bg: '#090514', bgGrad: 'radial-gradient(circle at 50% 0%, #1e1035 0%, #090514 100%)' },
  { name: 'Shielded Amber 💥', primary: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)', gold: '#f59e0b', goldGlow: 'rgba(245, 158, 11, 0.4)', purple: '#f87171', purpleGlow: 'rgba(248, 113, 113, 0.3)', bg: '#0c0704', bgGrad: 'radial-gradient(circle at 50% 0%, #291405 0%, #0c0704 100%)' },
  { name: 'Compact Emerald 🌲', primary: '#34d399', glow: 'rgba(52, 211, 153, 0.4)', gold: '#a3e635', goldGlow: 'rgba(163, 230, 53, 0.4)', purple: '#38bdf8', purpleGlow: 'rgba(56, 189, 248, 0.3)', bg: '#030c08', bgGrad: 'radial-gradient(circle at 50% 0%, #082d1c 0%, #030c08 100%)' },
];

export default function Header() {
  const [wallet, setWallet] = useState<MidnightWalletState | null>(null);
  const [activeTheme, setActiveTheme] = useState(0);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    checkConnection();
    const savedTheme = localStorage.getItem('invoiceflow-theme');
    if (savedTheme !== null) {
      const index = parseInt(savedTheme);
      if (index >= 0 && index < themes.length) {
        setActiveTheme(index);
        applyTheme(themes[index]);
      }
    }
  }, []);

  const checkConnection = async () => {
    const active = await getConnectedWallet();
    if (active) {
      setWallet(active);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const installed = await isLaceInstalled();
      if (!installed) {
        setShowInstallModal(true);
        setConnecting(false);
        return;
      }
      
      showToast('Connecting to Midnight Lace DApp Connector...', 'info');
      const w = await connectLaceWallet();
      setWallet(w);
      showToast('Midnight Lace Wallet Connected Successfully! 🔐', 'success');
    } catch (e: any) {
      console.error(e);
      showToast(e.message || 'Lace DApp Connector initialized.', 'info');
      setShowInstallModal(true);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('midnight_wallet_address');
    }
    showToast('Wallet disconnected', 'info');
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value);
    setActiveTheme(index);
    applyTheme(themes[index]);
    localStorage.setItem('invoiceflow-theme', e.target.value);
  };

  const applyTheme = (theme: typeof themes[0]) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-cyan', theme.primary);
    root.style.setProperty('--cyan-glow', theme.glow);
    root.style.setProperty('--glowing-gold', theme.gold);
    root.style.setProperty('--gold-glow', theme.goldGlow);
    root.style.setProperty('--nebula-purple', theme.purple);
    root.style.setProperty('--purple-glow', theme.purpleGlow);
    root.style.setProperty('--bg-color', theme.bg);
    root.style.setProperty('--bg-gradient', theme.bgGrad);
  };

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <a href="/" className="logo">
          <span>🌘</span> INVOICEFLOW
        </a>
        <span style={{ 
          fontSize: '0.65rem', 
          fontWeight: 700,
          padding: '0.2rem 0.5rem', 
          background: 'rgba(192, 132, 252, 0.15)', 
          border: '1px solid rgba(192, 132, 252, 0.35)', 
          borderRadius: '0.35rem', 
          color: '#c084fc',
          fontFamily: 'Share Tech Mono, monospace'
        }}>
          PREPROD
        </span>
      </div>

      <nav className="nav-links">
        <a href="/" className="nav-link">
          <span>🪐</span> HOME
        </a>
        <a href="/submit" className="nav-link">
          <span>🛸</span> SUBMIT
        </a>
        <a href="/marketplace" className="nav-link">
          <span>💼</span> MARKETPLACE
        </a>
        <button 
          onClick={() => setShowGuideModal(true)} 
          className="nav-link" 
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <span>💡</span> GUIDE
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Theme Selector */}
        <div style={{ position: 'relative' }}>
          <select 
            value={activeTheme} 
            onChange={handleThemeChange} 
            style={{ 
              padding: '0.45rem 1rem', 
              fontSize: '0.75rem', 
              fontWeight: 600,
              background: 'rgba(15, 23, 42, 0.95)', 
              border: '1px solid var(--surface-border)', 
              borderRadius: '0.5rem',
              color: '#f8fafc',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          >
            {themes.map((theme, i) => (
              <option key={i} value={i} style={{ background: '#030712', color: '#fff' }}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>

        {/* Wallet controls */}
        {wallet ? (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              color: '#38bdf8', 
              background: 'rgba(56, 189, 248, 0.1)', 
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '0.4rem 0.65rem',
              borderRadius: '0.5rem',
              fontFamily: 'Share Tech Mono, monospace'
            }}>
              {wallet.shieldedDustBalance}
            </span>
            
            <button className="btn btn-cyan" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', pointerEvents: 'none', borderRadius: '0.5rem' }}>
              <span>🔐</span> {`${wallet.address.substring(0, 7)}...${wallet.address.substring(wallet.address.length - 4)}`}
            </button>
            
            <button className="btn btn-outline" onClick={disconnectWallet} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '0.5rem' }}>
              Disconnect
            </button>
          </div>
        ) : (
          <button className="btn btn-cyan" onClick={handleConnect} disabled={connecting} style={{ padding: '0.55rem 1.25rem', fontSize: '0.82rem' }}>
            <span>🔐</span> {connecting ? 'CONNECTING...' : 'CONNECT LACE WALLET'}
          </button>
        )}
      </div>

      {/* Midnight Lace Wallet Modal */}
      {showInstallModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999
        }}>
          <div className="panel" style={{
            maxWidth: '480px',
            width: '90%',
            textAlign: 'center',
            background: '#0f172a',
            border: '1px solid rgba(192, 132, 252, 0.4)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(192, 132, 252, 0.25)',
            animation: 'slideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <span style={{ fontSize: '2.75rem', display: 'block', marginBottom: '0.75rem' }}>🌘</span>
            <h2 style={{ marginBottom: '0.5rem', fontWeight: 800, color: '#ffffff' }}>Midnight Lace Wallet</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              InvoiceFlow utilizes Midnight Network's Zero-Knowledge Compact contracts. Connect your <strong>Midnight Lace Wallet</strong> to generate proofs and sign shielded transactions on Preprod.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a 
                href="https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhgahdcakkhabbp" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-cyan" 
                style={{ justifyContent: 'center' }}
              >
                📥 Get Midnight Lace Extension
              </a>
              <button 
                onClick={() => {
                  setWallet({
                    address: 'mn1q8z9x2u3kvfm89dcj4e6tr25ha7kp92k',
                    dustAddress: 'dust1q9pvfm89dcj4e6tr25ha7k8w82j',
                    unshieldedBalance: '2500.00 NIGHT',
                    shieldedDustBalance: '48.5000 tDUST',
                    networkId: 'preprod',
                    connected: true
                  });
                  setShowInstallModal(false);
                  showToast('Connected with Midnight Lace (Preprod Testnet)! 🔐', 'success');
                }} 
                className="btn btn-outline" 
                style={{ justifyContent: 'center', borderColor: '#38bdf8', color: '#38bdf8' }}
              >
                ⚡ Connect Demo Preprod Wallet
              </button>
              <button 
                onClick={() => setShowInstallModal(false)} 
                className="btn btn-outline" 
                style={{ justifyContent: 'center', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Guide Modal */}
      {showGuideModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999
        }}>
          <div className="panel" style={{
            maxWidth: '540px',
            width: '90%',
            background: '#0f172a',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.2)',
            animation: 'slideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <h2 style={{ marginBottom: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
              <span>🌘</span> Midnight Protocol Architecture
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.85rem', lineHeight: 1.5 }}>
              <div>
                <strong style={{ color: '#38bdf8' }}>1. Compact Smart Contract (Zero-Knowledge)</strong>
                <p style={{ color: '#94a3b8', margin: '0.15rem 0 0 0' }}>Written in Compact. Financial amounts and client identity remain completely private off-chain.</p>
              </div>
              <div>
                <strong style={{ color: '#fbbf24' }}>2. Merkle Tree Commitments & Nullifiers</strong>
                <p style={{ color: '#94a3b8', margin: '0.15rem 0 0 0' }}>Invoices are committed as Merkle leaves. Nullifiers prevent double-financing without revealing invoice data.</p>
              </div>
              <div>
                <strong style={{ color: '#c084fc' }}>3. Proof → Balance → Submit Pipeline</strong>
                <p style={{ color: '#94a3b8', margin: '0.15rem 0 0 0' }}>Executes the <code>proveAccess</code> circuit, balances with tDUST, and submits to Preprod.</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowGuideModal(false)} 
              className="btn btn-cyan" 
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Start Exploring!
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
