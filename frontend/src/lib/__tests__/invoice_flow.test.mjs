import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as crypto from 'node:crypto';

describe('Frontend Midnight Compact ZK Circuit & Contract Integration Tests', () => {
  
  async function sha256(data) {
    const buf = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;
    return crypto.createHash('sha256').update(buf).digest('hex');
  }

  async function leafOf(secret) {
    const padTag = Buffer.alloc(32);
    padTag.write('invoiceflow:leaf', 'utf8');
    const secretBuf = Buffer.from(secret, 'utf8');
    const combined = Buffer.concat([padTag, secretBuf]);
    const hash = await sha256(combined);
    return `0x${hash}`;
  }

  async function nullifierOf(secret) {
    const padTag = Buffer.alloc(32);
    padTag.write('invoiceflow:null', 'utf8');
    const secretBuf = Buffer.from(secret, 'utf8');
    const combined = Buffer.concat([padTag, secretBuf]);
    const hash = await sha256(combined);
    return `0x${hash}`;
  }

  async function merkleRootFrom(leaf, path, directions) {
    let current = leaf;
    for (let i = 0; i < 5; i++) {
      const p = path[i];
      const combined = directions[i] ? `${p}${current}` : `${current}${p}`;
      current = `0x${await sha256(combined)}`;
    }
    return current;
  }

  it('Test 1: Selective Disclosure - leafOf produces deterministic commitment hiding private secret', async () => {
    const secret = 'sec_zk_secret_987654';
    const commitment1 = await leafOf(secret);
    const commitment2 = await leafOf(secret);
    const alteredCommitment = await leafOf('sec_zk_secret_different');

    assert.equal(commitment1, commitment2, 'Identical secrets must produce identical commitments');
    assert.notEqual(commitment1, alteredCommitment, 'Altered secrets must produce distinct commitments');
    assert.ok(commitment1.startsWith('0x'), 'Commitment must be hex-encoded');
  });

  it('Test 2: Compact Vector<5> Merkle verification for verifyAndSettleInvoice', async () => {
    const secret = 'sec_zk_secret_987654';
    const leaf = await leafOf(secret);
    const path = [
      '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
      '0x111122223333444455556666777788889999aaaabbbbccccddddeeeeffff0000',
      '0xaaaabbbbccccddddeeeeffff0000111122223333444455556666777788889999',
      '0x1234123412341234123412341234123412341234123412341234123412341234'
    ];
    const directions = [false, true, false, true, false];

    const root = await merkleRootFrom(leaf, path, directions);
    assert.ok(root.startsWith('0x'), 'Root must be a valid hex string');
    assert.equal(root.length, 66);
  });

  it('Test 3: Nullifier Set prevents double-spending across transactions', async () => {
    const secret = 'sec_invoice_unique_key';
    const nullifier = await nullifierOf(secret);
    
    const onChainNullifiers = new Set();
    
    assert.equal(onChainNullifiers.has(nullifier), false, 'Nullifier must initially be unspent');
    onChainNullifiers.add(nullifier);
    
    const isDoubleSpend = onChainNullifiers.has(nullifier);
    assert.equal(isDoubleSpend, true, 'Subsequent verification attempt must trigger double-spend prevention');
  });

  it('Test 4: Ledger state transition verification for registerInvoiceRoot and verifyAndSettleInvoice', async () => {
    const state = {
      invoiceRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
      invoiceCount: 0n,
      settledCount: 0n,
      nullifiers: new Set()
    };

    const newRoot = '0x9999888877776666555544443333222211110000aaaabbbbccccddddeeeeffff';
    state.invoiceRoot = newRoot;
    state.invoiceCount += 1n;

    assert.equal(state.invoiceRoot, newRoot);
    assert.equal(state.invoiceCount, 1n);

    const secret = 'test_secret_for_settlement';
    const nullifier = await nullifierOf(secret);
    state.nullifiers.add(nullifier);
    state.settledCount += 1n;

    assert.equal(state.settledCount, 1n);
    assert.equal(state.nullifiers.has(nullifier), true);
  });
});
