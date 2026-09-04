'use client';

import React from 'react';
import CountUp from '@/components/CountUp';
import { MIDNIGHT_CONFIG } from '@/lib/midnight';

export default function Home() {
  return (
    <div>
      {/* Top Split View: Main Hero & Invest Portal */}
      <section className="hero-grid">
        {/* Left: Main Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.9rem', 
            borderRadius: '9999px', 
            background: 'rgba(192, 132, 252, 0.12)', 
            border: '1px solid rgba(192, 132, 252, 0.3)', 
            color: '#c084fc',
            fontSize: '0.75rem',
            fontWeight: '700',
            marginBottom: '1.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontFamily: 'Share Tech Mono, monospace',
            width: 'fit-content'
          }}>
            <span>●</span> MIDNIGHT PREPROD TESTNET ACTIVE
          </div>
          
          <h1 className="glow-title">
            <span className="glow-cyan">INVOICEFLOW:</span> <br/>
            <span className="glow-gold">Zero-Knowledge Privacy Layer</span> <br/>
            for Invoice Financing.
          </h1>
          
          <p className="hero-subtitle">
            Built on <strong>Midnight Compact Smart Contracts</strong>. Shielded invoice amounts, cryptographic Merkle membership proofs, deterministic nullifiers to stop double-financing, and genuine Lace DApp Connector pipeline.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/submit" className="btn btn-cyan">
              <span>🛸</span> TOKENIZE INVOICE
            </a>
            <a href="/marketplace" className="btn btn-outline">
              <span>💼</span> VIEW REGISTRY
            </a>
          </div>
        </div>

        {/* Right: Invest Portal Dashboard */}
        <div>
          <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ffffff' }}>
                  <span>🌘</span> SHIELDED PORTAL
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Live Midnight Preprod ZK streams</p>
              </div>
              <span className="tech-label" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '0.35rem', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                ZK_VERIFIED
              </span>
            </div>

            {/* Cosmic Portfolio Summary */}
            <div style={{ background: 'rgba(3, 7, 18, 0.6)', border: '1px solid var(--surface-border)', borderRadius: '0.75rem', padding: '1rem' }}>
              <span className="tech-label" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>TOTAL SHIELDED SETTLED VOLUME</span>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#fbbf24', margin: '0.25rem 0' }}>
                <CountUp end={782450.00} decimals={2} prefix="$" /> tDUST
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#34d399' }}>
                <span>▲ +16.8% AVG APY</span>
                <span style={{ color: '#94a3b8' }}>Midnight Lace Connector</span>
              </div>
            </div>

            {/* Live Opportunities list */}
            <div>
              <span className="tech-label" style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.4rem', color: '#94a3b8' }}>SHIELDED OPPORTUNITIES</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="opp-row">
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#ffffff' }}>Acme Corp (Shielded ZK)</span>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Nullifier: 0x3f7a1c... | Score: 98/100</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: '700', color: '#38bdf8', fontSize: '0.85rem' }}>$15,000</span>
                    <div style={{ fontSize: '0.7rem', color: '#34d399' }}>9.4% APR (30d)</div>
                  </div>
                </div>
                <div className="opp-row">
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#ffffff' }}>Globex Synthetics</span>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Nullifier: 0x5c8e2b... | Score: 94/100</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: '700', color: '#38bdf8', fontSize: '0.85rem' }}>$8,500</span>
                    <div style={{ fontSize: '0.7rem', color: '#34d399' }}>11.2% APR (45d)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Complex Graph Widgets - Exoplanet Performance */}
            <div>
              <span className="tech-label" style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.4rem', color: '#94a3b8' }}>ZK-SNARK PROOF TIMELINE METRICS</span>
              <div style={{ height: '60px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 300 60" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="cyan-glow-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35"/>
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M 0 45 Q 50 15 100 40 T 200 10 T 300 30 L 300 60 L 0 60 Z" fill="url(#cyan-glow-grad)" />
                  <path d="M 0 45 Q 50 15 100 40 T 200 10 T 300 30" fill="none" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                  <line x1="100" y1="0" x2="100" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                  <line x1="200" y1="0" x2="200" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                </svg>
              </div>
            </div>

            {/* Astral Wallet Connection History Log */}
            <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '0.85rem' }}>
              <span className="tech-label" style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.4rem', color: '#94a3b8' }}>MIDNIGHT PREPROD STREAM</span>
              <div style={{ 
                fontFamily: 'Share Tech Mono, monospace', 
                fontSize: '0.68rem', 
                color: '#94a3b8', 
                background: 'rgba(3, 7, 18, 0.6)', 
                padding: '0.5rem 0.75rem', 
                borderRadius: '0.5rem', 
                maxHeight: '75px', 
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#38bdf8' }}>[OK] Midnight Lace ready</span>
                  <span>Just Now</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fbbf24' }}>[PROOF] proveAccess verified</span>
                  <span>1m ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#c084fc' }}>[COMPACT] Merkle Root #142890</span>
                  <span>4m ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Centerpiece: The interacting Trust Registry Model */}
      <section className="panel" style={{ position: 'relative', overflow: 'hidden', padding: '2.5rem 2rem', marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', zIndex: '3', position: 'relative' }}>
          <span className="tech-label" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>ZERO-KNOWLEDGE PRIVACY CORE</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginTop: '0.35rem', color: '#ffffff' }}>MIDNIGHT COMPACT PRIVACY ENGINE</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '600px', margin: '0.35rem auto 0' }}>
            Poseidon Merkle tree inclusion proofs and cryptographic nullifiers permanently preventing double-factoring while keeping financial values private.
          </p>
        </div>

        <div className="galaxy-centerpiece">
          <div className="galaxy-core-glow"></div>

          {/* Inner Orbit (ZK Proof Lane) */}
          <div className="orbit orbit-inner">
            <div className="node" style={{ top: '15px', left: '75px' }}></div>
            <div className="stellar-label" style={{ top: '10px', left: '95px' }}>PROVE_ACCESS CIRCUIT</div>
          </div>

          {/* Middle Orbit (Nullifier Registry) */}
          <div className="orbit orbit-middle">
            <div className="node node-gold" style={{ bottom: '25px', left: '50px' }}></div>
            <div className="stellar-label" style={{ bottom: '20px', left: '70px', color: '#fbbf24' }}>NULLIFIER SPENT REGISTRY</div>
          </div>

          {/* Outer Orbit (Merkle Tree Root) */}
          <div className="orbit orbit-outer">
            <div className="node" style={{ top: '160px', right: '-6px', backgroundColor: '#c084fc', boxShadow: '0 0 10px #c084fc' }}></div>
            <div className="stellar-label" style={{ top: '155px', right: '15px', color: '#c084fc' }}>MERKLE ROOT COMMITMENT</div>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="tech-label">INSTRUMENTS</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.35rem', color: '#ffffff' }}>ZERO-KNOWLEDGE ARCHITECTURE</h2>
        </div>

        <div className="guide-grid">
          {/* Guide 1 */}
          <div className="panel">
            <div className="guide-icon">🔐</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.5rem', color: '#ffffff' }}>Merkle Tree Commitments</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Invoices are hashed into leaf commitments $H(s, a, k)$ and inserted into a Compact Merkle root on Midnight without exposing invoice metadata.
            </p>
          </div>

          {/* Guide 2 */}
          <div className="panel">
            <div className="guide-icon">🛡️</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.5rem', color: '#ffffff' }}>Cryptographic Nullifiers</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Deterministic nullifiers $N = H(s, r)$ prevent double-spending or double-factoring of invoices without revealing which invoice is being settled.
            </p>
          </div>

          {/* Guide 3 */}
          <div className="panel">
            <div className="guide-icon">⚡</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.5rem', color: '#ffffff' }}>Proof → Balance → Submit</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Full 3-stage Midnight JS pipeline: off-chain zk-SNARK proof generation, Lace DApp connector balancing, and Preprod indexer submission.
            </p>
          </div>
        </div>
      </section>

      {/* Footer / About Section */}
      <footer id="about" style={{ marginTop: '5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--surface-border)', textAlign: 'center', color: '#64748b' }}>
        <p style={{ fontSize: '0.85rem' }}>© 2026 InvoiceFlow. Verified Zero-Knowledge Protocol on Midnight Preprod.</p>
        <p style={{ fontSize: '0.75rem', fontFamily: 'Share Tech Mono, monospace', marginTop: '0.4rem', color: '#38bdf8' }}>CONTRACT: {MIDNIGHT_CONFIG.contractAddress}</p>
      </footer>
    </div>
  );
}
