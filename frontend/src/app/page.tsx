'use client';

import React from 'react';

export default function Home() {
  return (
    <div>
      {/* Top Split View: Main Hero & Invest Portal */}
      <section style={{ 
        display: 'flex', 
        alignItems: 'stretch', 
        justifyContent: 'space-between', 
        gap: '3rem',
        flexWrap: 'wrap',
        marginBottom: '4rem'
      }}>
        {/* Left: Main Hero */}
        <div style={{ flex: '1.2', minWidth: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ 
            display: 'inline-block', 
            padding: '0.4rem 1.2rem', 
            borderRadius: '9999px', 
            background: 'rgba(6, 182, 212, 0.1)', 
            border: '1px solid rgba(6, 182, 212, 0.25)',
            color: 'var(--primary-cyan)',
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: 'Share Tech Mono, monospace'
          }}>
            PROTOCOL V1.0.4 ACTIVE
          </div>
          
          <h1 className="glow-title">
            <span className="glow-cyan">INVOICEFLOW:</span> <br/>
            <span className="glow-gold">The Stellar Trust Layer</span> <br/>
            for Invoice Financing.
          </h1>
          
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#94a3b8', 
            marginBottom: '3rem',
            lineHeight: '1.6',
            maxWidth: '620px'
          }}>
            Built for Freelancers and Investors. Trust-Verified, Duplicate-Safe, Fast & Low-Fee.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="/submit" className="btn btn-cyan" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>
              <span>🚀</span> GET STARTED
            </a>
            <a href="/marketplace" className="btn btn-outline" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>
              <span>📡</span> VIEW REGISTRY
            </a>
          </div>
        </div>

        {/* Right: Invest Portal Dashboard */}
        <div style={{ flex: '1', minWidth: '380px' }}>
          <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span className="tech-label" style={{ float: 'right' }}>SYS_OK // 98.4%</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                🌌 INVEST PORTAL
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Live global verification streams</p>
            </div>

            {/* Cosmic Portfolio Summary */}
            <div style={{ background: 'rgba(5, 7, 15, 0.6)', border: '1px solid var(--surface-border)', borderRadius: '0.75rem', padding: '1rem' }}>
              <span className="tech-label" style={{ fontSize: '0.7rem' }}>COSMIC PORTFOLIO VALUE</span>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--glowing-gold)', margin: '0.25rem 0' }}>
                $412,850.50 USDC
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#10b981' }}>
                <span>▲ +14.2% APY</span>
                <span style={{ color: '#94a3b8' }}>Stellar Wallet Connected</span>
              </div>
            </div>

            {/* Live Opportunities list */}
            <div>
              <span className="tech-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>LIVE OPPORTUNITIES</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="opp-row">
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Acme Corp (Invoice #1092)</span>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Reputation Score: 98/100</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: '700', color: 'var(--primary-cyan)', fontSize: '0.9rem' }}>$15,000 USDC</span>
                    <div style={{ fontSize: '0.75rem', color: '#10b981' }}>9.4% APR (30d)</div>
                  </div>
                </div>
                <div className="opp-row">
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Globex Inc (Invoice #8839)</span>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Reputation Score: 92/100</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: '700', color: 'var(--primary-cyan)', fontSize: '0.9rem' }}>$4,200 USDC</span>
                    <div style={{ fontSize: '0.75rem', color: '#10b981' }}>11.2% APR (45d)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Complex Graph Widgets - Exoplanet Performance */}
            <div>
              <span className="tech-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>EXOPLANET PERFORMANCE INDICATOR</span>
              <div style={{ height: '70px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 300 70" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="cyan-glow-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary-cyan)" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="var(--primary-cyan)" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M 0 50 Q 50 20 100 45 T 200 15 T 300 35 L 300 70 L 0 70 Z" fill="url(#cyan-glow-grad)" />
                  <path d="M 0 50 Q 50 20 100 45 T 200 15 T 300 35" fill="none" stroke="var(--primary-cyan)" strokeWidth="2" />
                  {/* Grid lines */}
                  <line x1="0" y1="35" x2="300" y2="35" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                  <line x1="100" y1="0" x2="100" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                  <line x1="200" y1="0" x2="200" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Centerpiece: The interacting Trust Registry Model */}
      <section className="panel" style={{ position: 'relative', overflow: 'hidden', padding: '3rem 2rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', zIndex: '3', position: 'relative' }}>
          <span className="tech-label" style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>TRUST ENGINE LAYER</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginTop: '0.5rem' }}>TRUST REGISTRY GALAXY CORE</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Real-time duplicate financing prevention and trust checks visualizer.
          </p>
        </div>

        <div className="galaxy-centerpiece">
          {/* Core Core */}
          <div className="galaxy-core-glow"></div>

          {/* Inner Orbit (Stellar Payment Lane) */}
          <div className="orbit orbit-inner">
            <div className="node" style={{ top: '15px', left: '85px' }}></div>
            <div className="stellar-label" style={{ top: '10px', left: '110px' }}>STELLAR PAYMENT LANE</div>
          </div>

          {/* Middle Orbit (Duplicate Prevention Node) */}
          <div className="orbit orbit-middle">
            <div className="node node-gold" style={{ bottom: '30px', left: '60px' }}></div>
            <div className="stellar-label" style={{ bottom: '25px', left: '85px', color: 'var(--glowing-gold)' }}>DUPLICATE PREVENTION NODE</div>
          </div>

          {/* Outer Orbit (Reputation Clusters) */}
          <div className="orbit orbit-outer">
            <div className="node" style={{ top: '180px', right: '-8px', backgroundColor: 'var(--nebula-purple)', boxShadow: '0 0 12px var(--nebula-purple)' }}></div>
            <div className="stellar-label" style={{ top: '175px', right: '20px', color: 'var(--nebula-purple)' }}>REPUTATION CLUSTER [98.2%]</div>
            
            <div className="node" style={{ bottom: '150px', left: '-8px' }}></div>
            <div className="stellar-label" style={{ bottom: '145px', left: '20px' }}>INVOICE NODE #3849</div>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="tech-label">INSTRUMENTS</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.5rem' }}>ASTRONOMICAL GUIDES</h2>
        </div>

        <div className="guide-grid">
          {/* Guide 1 */}
          <div className="panel guide-card">
            <div className="guide-icon">🧭</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>Stellar Invoice Mapping</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Utilizing celestial coordinates and custom-hashed cryptographic values to map all corporate invoices securely on the Horizon registry.
            </p>
            {/* Compass & Globe Mini Chart */}
            <div className="mini-chart">
              <svg viewBox="0 0 300 60">
                <circle cx="150" cy="30" r="25" fill="none" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" />
                <line x1="150" y1="5" x2="150" y2="55" stroke="rgba(6, 182, 212, 0.2)" />
                <line x1="125" y1="30" x2="175" y2="30" stroke="rgba(6, 182, 212, 0.2)" />
                <path d="M 0 45 Q 75 10 150 30 T 300 20" fill="none" stroke="var(--primary-cyan)" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Guide 2 */}
          <div className="panel guide-card">
            <div className="guide-icon">🪐</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>On-Chain Reputation Index</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Orbital paths tracking business repayments. Dynamic feedback loops score trust profiles in real-time, matching orbital resonance with credit capability.
            </p>
            {/* Orbital Rings Mini Chart */}
            <div className="mini-chart">
              <svg viewBox="0 0 300 60">
                <ellipse cx="150" cy="30" rx="60" ry="12" fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1.5" />
                <ellipse cx="150" cy="30" rx="90" ry="18" fill="none" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1" />
                <circle cx="150" cy="30" r="8" fill="var(--glowing-gold)" />
                <path d="M 0 50 C 100 20, 200 45, 300 15" fill="none" stroke="var(--glowing-gold)" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Guide 3 */}
          <div className="panel guide-card">
            <div className="guide-icon">🔭</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>Secondary Market Discovery</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Advanced telescope metrics scanning the digital cosmos for un-matured invoice resale yield options. Dynamic pricing updates as scores fluctuate.
            </p>
            {/* Telescope Nebula Scan Mini Chart */}
            <div className="mini-chart">
              <svg viewBox="0 0 300 60">
                <path d="M 120 40 L 180 20" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
                <circle cx="180" cy="20" r="10" fill="none" stroke="rgba(168, 85, 247, 0.4)" />
                <circle cx="180" cy="20" r="2" fill="var(--nebula-purple)" />
                <path d="M 0 25 Q 75 45 150 15 T 300 35" fill="none" stroke="var(--nebula-purple)" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / About Section */}
      <footer id="about" style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid var(--surface-border)', textAlign: 'center', color: '#64748b' }}>
        <p style={{ fontSize: '0.9rem' }}>© 2026 InvoiceFlow. All Rights Reserved. Built on Stellar Testnet for Hackathon Validation.</p>
        <p style={{ fontSize: '0.75rem', fontFamily: 'Share Tech Mono, monospace', marginTop: '0.5rem', color: 'var(--primary-cyan)' }}>COSMIC CREDIT LAYER ACTIVE // SECURE CONNECTION</p>
      </footer>
    </div>
  );
}
