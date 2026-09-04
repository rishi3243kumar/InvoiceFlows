'use client';
import { useState, useEffect } from 'react';
import { isConnected, requestAccess, getAddress } from '@stellar/freighter-api';
import { useToast } from '@/components/Toast';

const themes = [
  { name: 'Cosmic Cyan 🪐', primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)', gold: '#f59e0b', goldGlow: 'rgba(245, 158, 11, 0.4)', purple: '#a855f7', purpleGlow: 'rgba(168, 85, 247, 0.3)', bg: '#03050c', bgGrad: 'radial-gradient(circle at 50% 50%, #080f26 0%, #03050c 100%)' },
  { name: 'Nebula Pink 🌌', primary: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)', gold: '#f59e0b', goldGlow: 'rgba(245, 158, 11, 0.4)', purple: '#3b82f6', purpleGlow: 'rgba(59, 130, 246, 0.3)', bg: '#09050f', bgGrad: 'radial-gradient(circle at 50% 50%, #250b3e 0%, #09050f 100%)' },
  { name: 'Supernova Orange 💥', primary: '#f97316', glow: 'rgba(249, 115, 22, 0.4)', gold: '#facc15', goldGlow: 'rgba(250, 204, 21, 0.4)', purple: '#ef4444', purpleGlow: 'rgba(239, 68, 68, 0.3)', bg: '#0c0503', bgGrad: 'radial-gradient(circle at 50% 50%, #301108 0%, #0c0503 100%)' },
  { name: 'Stellar Emerald 🌲', primary: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', gold: '#a3e635', goldGlow: 'rgba(163, 230, 53, 0.4)', purple: '#06b6d4', purpleGlow: 'rgba(6, 182, 212, 0.3)', bg: '#030c08', bgGrad: 'radial-gradient(circle at 50% 50%, #082d1c 0%, #030c08 100%)' },
  { name: 'Solar Flare Red ☀️', primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)', gold: '#f59e0b', goldGlow: 'rgba(245, 158, 11, 0.4)', purple: '#b91c1c', purpleGlow: 'rgba(185, 28, 28, 0.3)', bg: '#0d0303', bgGrad: 'radial-gradient(circle at 50% 50%, #3a0d0d 0%, #0d0303 100%)' },
  { name: 'Deep Void Silver 👽', primary: '#94a3b8', glow: 'rgba(148, 163, 184, 0.4)', gold: '#e2e8f0', goldGlow: 'rgba(226, 232, 240, 0.4)', purple: '#475569', purpleGlow: 'rgba(71, 85, 105, 0.3)', bg: '#0b0f19', bgGrad: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0b0f19 100%)' },
  { name: 'Aurora Green 🧪', primary: '#84cc16', glow: 'rgba(132, 204, 22, 0.4)', gold: '#06b6d4', goldGlow: 'rgba(6, 182, 212, 0.4)', purple: '#6366f1', purpleGlow: 'rgba(99, 102, 241, 0.3)', bg: '#030c0c', bgGrad: 'radial-gradient(circle at 50% 50%, #082f30 0%, #030c0c 100%)' }
];

export default function Header() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState(0);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [funding, setFunding] = useState(false);
  const { showToast } = useToast();

  const fetchBalance = async (pk: string) => {
    try {
      const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${pk}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const native = data.balances.find((b: any) => b.asset_type === 'native');
      if (native) {
        setBalance(parseFloat(native.balance).toFixed(2));
      }
    } catch {
      setBalance('0.00');
    }
  };

  const claimFaucet = async () => {
    if (!address) return;
    setFunding(true);
    showToast('Requesting Friendbot XLM funding...', 'info');
    try {
      const res = await fetch(`https://friendbot.stellar.org/?addr=${address}`);
      if (res.ok) {
        showToast('Successfully funded wallet with 10,000 XLM! 🚀', 'success');
        fetchBalance(address);
      } else {
        throw new Error();
      }
    } catch {
      showToast('Failed to claim Testnet XLM. Wallet may already be funded.', 'error');
    } finally {
      setFunding(false);
    }
  };

  useEffect(() => {
    checkConnection();
    // Load saved theme
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
    if (await isConnected()) {
      const { address: pk } = await getAddress() as any;
      setAddress(pk);
      fetchBalance(pk);
    }
  };

  const connectWallet = async () => {
    try {
      if (await isConnected()) {
        const { address: pk } = await requestAccess() as any;
        if (pk) {
          setAddress(pk);
          fetchBalance(pk);
          showToast('Wallet Connected Successfully!', 'success');
        }
      } else {
        setShowInstallModal(true);
      }
    } catch (e: any) {
      console.error(e);
      showToast(e.message || 'Failed to connect wallet', 'error');
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(null);
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
      <div className="logo">INVOICEFLOW</div>
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
        <a href="#about" className="nav-link">
          <span>🌌</span> ABOUT
        </a>
        <button 
          onClick={() => setShowGuideModal(true)} 
          className="nav-link" 
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <span>💡</span> GUIDE
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Theme Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: themes[activeTheme]?.primary, transition: 'all 0.3s', boxShadow: `0 0 8px ${themes[activeTheme]?.primary}` }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: themes[activeTheme]?.gold, transition: 'all 0.3s', boxShadow: `0 0 8px ${themes[activeTheme]?.gold}` }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: themes[activeTheme]?.purple, transition: 'all 0.3s', boxShadow: `0 0 8px ${themes[activeTheme]?.purple}` }}></span>
          </div>
          <div style={{ position: 'relative' }}>
            <select 
              value={activeTheme} 
              onChange={handleThemeChange} 
              className="form-input" 
              style={{ 
                padding: '0.4rem 1.5rem 0.4rem 0.6rem', 
                fontSize: '0.8rem', 
                width: 'auto', 
                background: 'rgba(13, 22, 54, 0.4)', 
                borderColor: 'var(--surface-border)', 
                borderRadius: '0.6rem',
                color: 'var(--text-color)',
                cursor: 'pointer',
                outline: 'none',
                fontFamily: 'inherit',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              {themes.map((theme, i) => (
                <option key={i} value={i} style={{ background: '#03050c', color: '#fff' }}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Wallet controls */}
        {address ? (
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            {balance !== null && (
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 700, 
                  color: 'var(--primary-cyan)', 
                  background: 'rgba(6, 182, 212, 0.1)', 
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '0.5rem',
                  fontFamily: 'Share Tech Mono, monospace',
                  boxShadow: '0 0 10px rgba(6, 182, 212, 0.1)'
                }}>
                  {balance} XLM
                </span>
                <button 
                  onClick={claimFaucet} 
                  disabled={funding}
                  className="btn btn-outline" 
                  style={{ 
                    padding: '0.4rem 0.6rem', 
                    fontSize: '0.7rem', 
                    color: 'var(--glowing-gold)',
                    borderColor: 'var(--gold-glow)',
                    background: 'rgba(245, 158, 11, 0.05)',
                    height: 'auto',
                    borderRadius: '0.5rem'
                  }}
                >
                  {funding ? 'Funding...' : 'Claim 🚰'}
                </button>
              </div>
            )}
            <button className="btn btn-cyan" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', pointerEvents: 'none', borderRadius: '0.5rem' }}>
              <span>🔑</span> {`${address.substring(0, 5)}...${address.substring(address.length - 4)}`}
            </button>
            <button className="btn btn-outline" onClick={disconnectWallet} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.5rem' }}>
              Disconnect
            </button>
          </div>
        ) : (
          <button className="btn btn-cyan" onClick={connectWallet} style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}>
            <span>🔑</span> CONNECT WALLET
          </button>
        )}
      </div>

      {/* Freighter Wallet Install Prompt Modal */}
      {showInstallModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(3, 5, 12, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="card" style={{
            maxWidth: '450px',
            width: '90%',
            textAlign: 'center',
            border: '1px solid var(--surface-border)',
            boxShadow: '0 0 40px var(--purple-glow)',
            animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🛸</span>
            <h2 style={{ marginBottom: '0.75rem', fontWeight: 800 }}>Freighter Wallet Required</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              InvoiceFlow requires the Freighter browser extension to securely sign transactions on the Stellar Network.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a 
                href="https://www.freighter.app/" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-cyan" 
                style={{ justifyContent: 'center' }}
              >
                📥 Get Freighter Extension
              </a>
              <button 
                onClick={() => setShowInstallModal(false)} 
                className="btn btn-outline" 
                style={{ justifyContent: 'center' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Cosmic Guide Modal */}
      {showGuideModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(3, 5, 12, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="card" style={{
            maxWidth: '550px',
            width: '90%',
            border: '1px solid var(--surface-border)',
            boxShadow: '0 0 40px var(--cyan-glow)',
            animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <h2 style={{ marginBottom: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
              <span>🚀</span> Cosmic Guide: How InvoiceFlow Works
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
              <div>
                <strong style={{ color: 'var(--primary-cyan)' }}>1. Submit Invoice</strong>
                <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0' }}>Upload your invoice PDF. Our intelligent extractor parses the metadata automatically.</p>
              </div>
              <div>
                <strong style={{ color: 'var(--glowing-gold)' }}>2. Yield Calibration</strong>
                <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0' }}>Adjust the discount rate to calibrate your investor return based on the client reputation ring score.</p>
              </div>
              <div>
                <strong style={{ color: 'var(--nebula-purple)' }}>3. Tokenize & Mint</strong>
                <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0' }}>Sign with Freighter wallet to mint your invoice as a secure, unique token on the Stellar trust registry.</p>
              </div>
              <div>
                <strong style={{ color: '#10b981' }}>4. Liquidity & Repayment</strong>
                <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0' }}>Investors buy the invoice at a discount in the marketplace, and the client repays to settle on-chain.</p>
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
