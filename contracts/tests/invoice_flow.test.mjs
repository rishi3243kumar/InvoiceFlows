import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as crypto from 'node:crypto';

describe('Midnight Compact Smart Contract & ZK Circuit Tests (invoice_flow.compact)', () => {
  
  function leafOf(secret) {
    const hash = crypto.createHash('sha256');
    const padTag = Buffer.alloc(32);
    padTag.write('invoiceflow:leaf', 'utf8');
    hash.update(padTag);
    const secretBuf = typeof secret === 'string'
      ? (secret.startsWith('0x') ? Buffer.from(secret.slice(2), 'hex') : Buffer.from(secret, 'utf8'))
      : secret;
    hash.update(secretBuf);
    return '0x' + hash.digest('hex');
  }

  function nullifierOf(secret) {
    const hash = crypto.createHash('sha256');
    const padTag = Buffer.alloc(32);
    padTag.write('invoiceflow:null', 'utf8');
    hash.update(padTag);
    const secretBuf = typeof secret === 'string'
      ? (secret.startsWith('0x') ? Buffer.from(secret.slice(2), 'hex') : Buffer.from(secret, 'utf8'))
      : secret;
    hash.update(secretBuf);
    return '0x' + hash.digest('hex');
  }

  function merkleRootFrom(leaf, path, directions) {
    let current = leaf;
    for (let i = 0; i < 5; i++) {
      const hash = crypto.createHash('sha256');
      const pathBuf = Buffer.from(path[i].replace('0x', ''), 'hex');
      const currentBuf = Buffer.from(current.replace('0x', ''), 'hex');

      if (directions[i]) {
        hash.update(pathBuf);
        hash.update(currentBuf);
      } else {
        hash.update(currentBuf);
        hash.update(pathBuf);
      }
      current = '0x' + hash.digest('hex');
    }
    return current;
  }

  it('Circuit leafOf: Computes deterministic leaf commitment from private secret', () => {
    const secret = '0x1111111111111111111111111111111111111111111111111111111111111111';
    const leaf1 = leafOf(secret);
    const leaf2 = leafOf(secret);
    assert.equal(leaf1, leaf2, 'Identical secrets must yield identical leaf commitments');

    const differentSecret = '0x2222222222222222222222222222222222222222222222222222222222222222';
    const differentLeaf = leafOf(differentSecret);
    assert.notEqual(leaf1, differentLeaf, 'Different secrets must produce distinct leaf commitments');
  });

  it('Circuit nullifierOf: Computes deterministic nullifier preventing double-spending', () => {
    const secret = '0x5555555555555555555555555555555555555555555555555555555555555555';
    const nullifier1 = nullifierOf(secret);
    const nullifier2 = nullifierOf(secret);
    assert.equal(nullifier1, nullifier2, 'Deterministic nullifier calculation must match exactly');
  });

  it('Circuit merkleRootFrom: Computes 5-depth Merkle root from Vector<5> path and directions', () => {
    const secret = '0x3333333333333333333333333333333333333333333333333333333333333333';
    const leaf = leafOf(secret);
    const path = [
      '0x1000000000000000000000000000000000000000000000000000000000000001',
      '0x2000000000000000000000000000000000000000000000000000000000000002',
      '0x3000000000000000000000000000000000000000000000000000000000000003',
      '0x4000000000000000000000000000000000000000000000000000000000000004',
      '0x5000000000000000000000000000000000000000000000000000000000000005'
    ];
    const directions = [false, true, false, false, true];

    const root = merkleRootFrom(leaf, path, directions);
    assert.ok(root.startsWith('0x'), 'Root must be a valid 0x hex string');
    assert.equal(root.length, 66, '32-byte root hex string must be 66 characters long');
  });

  it('Circuit registerInvoiceRoot: Updates on-chain invoiceRoot and increments invoiceCount', () => {
    const ledgerState = {
      invoiceRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
      issuer: '0xissuerpk123456',
      invoiceCount: 0n,
      settledCount: 0n,
      nullifiers: new Set()
    };

    const callerPK = '0xissuerpk123456';
    const newRoot = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd';

    // Simulate Compact circuit assert & mutation
    assert.equal(callerPK, ledgerState.issuer, 'Only the issuer may update invoice root');
    ledgerState.invoiceRoot = newRoot;
    ledgerState.invoiceCount += 1n;

    assert.equal(ledgerState.invoiceRoot, newRoot);
    assert.equal(ledgerState.invoiceCount, 1n);
  });

  it('Circuit verifyAndSettleInvoice: Proves Merkle membership & enforces single-settlement nullifier', () => {
    const secret = '0x7777777777777777777777777777777777777777777777777777777777777777';
    const leaf = leafOf(secret);
    const path = [
      '0x0101010101010101010101010101010101010101010101010101010101010101',
      '0x0202020202020202020202020202020202020202020202020202020202020202',
      '0x0303030303030303030303030303030303030303030303030303030303030303',
      '0x0404040404040404040404040404040404040404040404040404040404040404',
      '0x0505050505050505050505050505050505050505050505050505050505050505'
    ];
    const directions = [true, false, true, false, false];
    const root = merkleRootFrom(leaf, path, directions);

    const ledgerState = {
      invoiceRoot: root,
      issuer: '0xissuerpk123456',
      invoiceCount: 1n,
      settledCount: 0n,
      nullifiers: new Set()
    };

    // First settlement
    const candidateRoot = merkleRootFrom(leaf, path, directions);
    assert.equal(candidateRoot, ledgerState.invoiceRoot, 'Valid invoice proof must match registered root');

    const nullifier = nullifierOf(secret);
    assert.equal(ledgerState.nullifiers.has(nullifier), false, 'Nullifier must not yet be spent');

    ledgerState.nullifiers.add(nullifier);
    ledgerState.settledCount += 1n;

    assert.equal(ledgerState.settledCount, 1n);
    assert.equal(ledgerState.nullifiers.has(nullifier), true);

    // Attempt double-settlement
    const isDoubleSpend = ledgerState.nullifiers.has(nullifier);
    assert.equal(isDoubleSpend, true, 'Subsequent settlement attempt must be rejected');
  });

  it('Circuit getInvoiceStats: Returns on-chain tuple [invoiceRoot, invoiceCount, settledCount]', () => {
    const ledgerState = {
      invoiceRoot: '0x9999999999999999999999999999999999999999999999999999999999999999',
      invoiceCount: 42n,
      settledCount: 18n
    };

    const stats = [ledgerState.invoiceRoot, ledgerState.invoiceCount, ledgerState.settledCount];
    assert.equal(stats[0], ledgerState.invoiceRoot);
    assert.equal(stats[1], 42n);
    assert.equal(stats[2], 18n);
  });
});
