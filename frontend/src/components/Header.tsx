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
  const [activeTheme, setActiveTheme] = useState(0);
  const { showToast } = useToast();

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
    }
  };

  const connectWallet = async () => {
    try {
      if (await isConnected()) {
        const { address: pk } = await requestAccess() as any;
        if (pk) {
          setAddress(pk);
          showToast('Wallet Connected Successfully!', 'success');
        }
      } else {
        showToast('Please install Freighter Wallet', 'error');
      }
    } catch (e: any) {
      console.error(e);
      showToast(e.message || 'Failed to connect wallet', 'error');
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
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
          <span>🛸</span> SENDER PORTAL
        </a>
        <a href="/marketplace" className="nav-link">
          <span>💼</span> BUSINESS PAYMENTS
        </a>
        <a href="#about" className="nav-link">
          <span>🌌</span> ABOUT
        </a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Theme Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: themes[activeTheme]?.primary, transition: 'all 0.3s', boxShadow: `0 0 8px ${themes[activeTheme]?.primary}` }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: themes[activeTheme]?.gold, transition: 'all 0.3s', boxShadow: `0 0 8px ${themes[activeTheme]?.gold}` }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: themes[activeTheme]?.purple, transition: 'all 0.3s', boxShadow: `0 0 8px ${themes[activeTheme]?.purple}` }}></span>
          </div>
          <div style={{ position: 'relative' }}>
            <select 
              value={activeTheme} 
              onChange={handleThemeChange} 
              className="form-input" 
            style={{ 
              padding: '0.5rem 1.8rem 0.5rem 1rem', 
              fontSize: '0.85rem', 
              width: 'auto', 
              background: 'rgba(13, 22, 54, 0.4)', 
              borderColor: 'var(--surface-border)', 
              borderRadius: '0.75rem',
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
          <div style={{ 
            position: 'absolute', 
            right: '10px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            pointerEvents: 'none',
            fontSize: '0.7rem',
            color: '#64748b'
          }}>
            ▼
          </div>
        </div>

        {/* Wallet controls */}
        {address ? (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button className="btn btn-cyan" style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem', pointerEvents: 'none' }}>
              <span>🔑</span> {`${address.substring(0, 5)}...${address.substring(address.length - 4)}`}
            </button>
            <button className="btn btn-outline" onClick={disconnectWallet} style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' }}>
              Disconnect
            </button>
          </div>
        ) : (
          <button className="btn btn-cyan" onClick={connectWallet} style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}>
            <span>🔑</span> CONNECT WALLET
          </button>
        )}
      </div>
    </header>
  );
}
