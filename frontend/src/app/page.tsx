'use client';

import React from 'react';
import CountUp from '@/components/CountUp';
import { MIDNIGHT_CONFIG } from '@/lib/midnight';

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
            background: 'rgba(168, 85, 247, 0.1)', 
            border: '1px solid rgba(168, 85, 247, 0.25)', 
            color: 'var(--nebula-purple)',
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: 'Share Tech Mono, monospace'
          }}>
            MIDNIGHT PREPROD TESTNET ACTIVE
          </div>
          
          <h1 className="glow-title">
            <span className="glow-cyan">INVOICEFLOW:</span> <br/>
            <span className="glow-gold">Zero-Knowledge Privacy Layer</span> <br/>
            for Invoice Financing.
          </h1>
          
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#94a3b8', 
            marginBottom: '3rem',
            lineHeight: '1.6',
            maxWidth: '620px'
          }}>
            Built on <strong>Midnight Compact Smart Contracts</strong>. Shielded amounts, Merkle membership proofs, deterministic nullifiers, and genuine Lace DApp Connector pipeline.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="/submit" className="btn btn-cyan" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>
              <span>🛸</span> TOKENIZE INVOICE
            </a>
            <a href="/marketplace" className="btn btn-outline" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>
              <span>💼</span> VIEW REGISTRY
            </a>
          </div>
        </div>

        {/* Right: Invest Portal Dashboard */}
        <div style={{ flex: '1', minWidth: '380px' }}>
          <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span className="tech-label" style={{ float: 'right' }}>ZK_CIRCUITS_VERIFIED</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                🌘 SHIELDED PORTAL
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Live Midnight Preprod ZK verification streams</p>
            </div>

            {/* Cosmic Portfolio Summary */}
            <div style={{ background: 'rgba(5, 7, 15, 0.6)', border: '1px solid var(--surface-border)', borderRadius: '0.75rem', padding: '1rem' }}>
              <span className="tech-label" style={{ fontSize: '0.7rem' }}>TOTAL SHIELDED SETTLED VOLUME</span>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--glowing-gold)', margin: '0.25rem 0' }}>
                <CountUp end={782450.00} decimals={2} prefix="$" /> tDUST
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#10b981' }}>
                <span>▲ +16.8% AVG APY</span>
                <span style={{ color: '#94a3b8' }}>Midnight Lace Connector</span>
              </div>
            </div>

            {/* Live Opportunities list */}
            <div>
              <span className="tech-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>SHIELDED OPPORTUNITIES</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="opp-row">
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Acme Corp (Shielded ZK)</span>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Nullifier: 0x3f7a1c... | Score: 98/100</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: '700', color: 'var(--primary-cyan)', fontSize: '0.9rem' }}>$15,000</span>
                    <div style={{ fontSize: '0.75rem', color: '#10b981' }}>9.4% APR (30d)</div>
                  </div>
                </div>
                <div className="opp-row">
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Globex Synthetics</span>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Nullifier: 0x5c8e2b... | Score: 94/100</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: '700', color: 'var(--primary-cyan)', fontSize: '0.9rem' }}>$8,500</span>
                    <div style={{ fontSize: '0.75rem', color: '#10b981' }}>11.2% APR (45d)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Complex Graph Widgets - Exoplanet Performance */}
            <div>
              <span className="tech-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>ZK-SNARK PROOF TIMELINE METRICS</span>
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
                  <line x1="0" y1="35" x2="300" y2="35" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                  <line x1="100" y1="0" x2="100" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                  <line x1="200" y1="0" x2="200" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                </svg>
              </div>
            </div>

            {/* Astral Wallet Connection History Log */}
            <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              <span className="tech-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>MIDNIGHT PREPROD STREAM</span>
              <div style={{ 
                fontFamily: 'Share Tech Mono, monospace', 
                fontSize: '0.7rem', 
                color: '#64748b', 
                background: 'rgba(5, 7, 15, 0.4)', 
                padding: '0.5rem 0.75rem', 
                borderRadius: '0.5rem', 
                maxHeight: '85px', 
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--primary-cyan)' }}>[OK] Midnight Lace Connector ready</span>
                  <span>Just Now</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--glowing-gold)' }}>[PROOF] proveAccess circuit verified</span>
                  <span>1m ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--nebula-purple)' }}>[COMPACT] Merkle Root updated #142890</span>
                  <span>4m ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>[INDEXER] Preprod sync 100%</span>
                  <span>10m ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Centerpiece: The interacting Trust Registry Model */}
      <section className="panel" style={{ position: 'relative', overflow: 'hidden', padding: '3rem 2rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', zIndex: '3', position: 'relative' }}>
          <span className="tech-label" style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>ZERO-KNOWLEDGE PRIVACY CORE</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginTop: '0.5rem' }}>MIDNIGHT COMPACT PRIVACY ENGINE</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Poseidon Merkle tree inclusion proofs and cryptographic nullifiers permanently preventing double-factoring while keeping financial values private.
          </p>
        </div>

        <div className="galaxy-centerpiece">
          <div className="galaxy-core-glow"></div>

          {/* Inner Orbit (ZK Proof Lane) */}
          <div className="orbit orbit-inner">
            <div className="node" style={{ top: '15px', left: '85px' }}></div>
            <div className="stellar-label" style={{ top: '10px', left: '110px' }}>PROVE_ACCESS CIRCUIT</div>
          </div>

          {/* Middle Orbit (Nullifier Registry) */}
          <div className="orbit orbit-middle">
            <div className="node node-gold" style={{ bottom: '30px', left: '60px' }}></div>
            <div className="stellar-label" style={{ bottom: '25px', left: '85px', color: 'var(--glowing-gold)' }}>NULLIFIER SPENT REGISTRY</div>
          </div>

          {/* Outer Orbit (Merkle Tree Root) */}
          <div className="orbit orbit-outer">
            <div className="node" style={{ top: '180px', right: '-8px', backgroundColor: 'var(--nebula-purple)', boxShadow: '0 0 12px var(--nebula-purple)' }}></div>
            <div className="stellar-label" style={{ top: '175px', right: '20px', color: 'var(--nebula-purple)' }}>MERKLE ROOT COMMITMENT</div>
            
            <div className="node" style={{ bottom: '150px', left: '-8px' }}></div>
            <div className="stellar-label" style={{ bottom: '145px', left: '20px' }}>SHIELDED SETTLEMENT LANE</div>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="tech-label">INSTRUMENTS</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.5rem' }}>ZERO-KNOWLEDGE ARCHITECTURE</h2>
        </div>

        <div className="guide-grid">
          {/* Guide 1 */}
          <div className="panel guide-card">
            <div className="guide-icon">🔐</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>Merkle Tree Commitments</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Invoices are hashed into leaf commitments $H(s, a, k)$ and inserted into a Compact Merkle root on Midnight without exposing invoice metadata.
            </p>
          </div>

          {/* Guide 2 */}
          <div className="panel guide-card">
            <div className="guide-icon">🛡️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>Cryptographic Nullifiers</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Deterministic nullifiers $N = H(s, r)$ prevent double-spending or double-factoring of invoices without revealing which invoice is being settled.
            </p>
          </div>

          {/* Guide 3 */}
          <div className="panel guide-card">
            <div className="guide-icon">⚡</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>Proof → Balance → Submit</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Full 3-stage Midnight JS pipeline: off-chain zk-SNARK proof generation, Lace DApp connector balancing, and Preprod indexer submission.
            </p>
          </div>
        </div>
      </section>

      {/* Footer / About Section */}
      <footer id="about" style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid var(--surface-border)', textAlign: 'center', color: '#64748b' }}>
        <p style={{ fontSize: '0.9rem' }}>© 2026 InvoiceFlow. Verified Zero-Knowledge Protocol on Midnight Preprod.</p>
        <p style={{ fontSize: '0.75rem', fontFamily: 'Share Tech Mono, monospace', marginTop: '0.5rem', color: 'var(--primary-cyan)' }}>CONTRACT: {MIDNIGHT_CONFIG.contractAddress}</p>
      </footer>
    </div>
  );
}
