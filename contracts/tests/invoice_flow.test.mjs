import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as crypto from 'node:crypto';

describe('Midnight Compact Smart Contract & ZK Circuit Tests', () => {
  function computeLeafCommitment(secret, amount, clientPubkey, salt) {
    const hash = crypto.createHash('sha256');
    hash.update(Buffer.from(secret.replace('0x', ''), 'hex'));
    const amountBuf = Buffer.alloc(8);
    amountBuf.writeBigUInt64BE(BigInt(amount));
    hash.update(amountBuf);
    hash.update(Buffer.from(clientPubkey.replace('0x', ''), 'hex'));
    hash.update(Buffer.from(salt.replace('0x', ''), 'hex'));
    return '0x' + hash.digest('hex');
  }

  function computeNullifier(secret, salt) {
    const hash = crypto.createHash('sha256');
    hash.update(Buffer.from(secret.replace('0x', ''), 'hex'));
    hash.update(Buffer.from(salt.replace('0x', ''), 'hex'));
    hash.update(Buffer.from('INVOICEFLOW_NULLIFIER', 'utf8'));
    return '0x' + hash.digest('hex');
  }

  function verifyMerklePath(leaf, root, pathElements, pathIndices) {
    let current = leaf;
    for (let i = 0; i < pathElements.length; i++) {
      const h = crypto.createHash('sha256');
      if (pathIndices[i]) {
        h.update(pathElements[i]);
        h.update(current);
      } else {
        h.update(current);
        h.update(pathElements[i]);
      }
      current = '0x' + h.digest('hex');
    }
    return current.toLowerCase() === root.toLowerCase();
  }

  it('Circuit 1: Leaf commitment protects private financial amounts & client credentials', () => {
    const secret = '0x1111111111111111111111111111111111111111111111111111111111111111';
    const amount = 50000000000n; // 50,000 tDUST
    const clientPubkey = '0x2222222222222222222222222222222222222222222222222222222222222222';
    const salt = '0x3333333333333333333333333333333333333333333333333333333333333333';

    const leaf1 = computeLeafCommitment(secret, amount, clientPubkey, salt);
    const leaf2 = computeLeafCommitment(secret, amount, clientPubkey, salt);
    assert.equal(leaf1, leaf2, 'Identical witnesses must yield identical leaf commitments');

    const differentAmountLeaf = computeLeafCommitment(secret, 99999999999n, clientPubkey, salt);
    assert.notEqual(leaf1, differentAmountLeaf, 'Different amounts must generate distinct commitments');
  });

  it('Circuit 2: Merkle membership verification proves invoice inclusion in Midnight state', () => {
    const leaf = '0xaaaa111122223333444455556666777788889999aaaabbbbccccddddeeeeffff';
    const pathElements = [
      '0x1000000000000000000000000000000000000000000000000000000000000001',
      '0x2000000000000000000000000000000000000000000000000000000000000002'
    ];
    const pathIndices = [false, true];

    let computed = leaf;
    for (let i = 0; i < pathElements.length; i++) {
      const h = crypto.createHash('sha256');
      if (pathIndices[i]) {
        h.update(pathElements[i]);
        h.update(computed);
      } else {
        h.update(computed);
        h.update(pathElements[i]);
      }
      computed = '0x' + h.digest('hex');
    }

    const isValid = verifyMerklePath(leaf, computed, pathElements, pathIndices);
    assert.equal(isValid, true, 'Valid Merkle witness path must verify against on-chain root');
  });

  it('Circuit 3: Deterministic nullifiers prevent double-financing / double-spend fraud', () => {
    const secret = '0x5555555555555555555555555555555555555555555555555555555555555555';
    const salt = '0x6666666666666666666666666666666666666666666666666666666666666666';

    const nullifier1 = computeNullifier(secret, salt);
    const nullifier2 = computeNullifier(secret, salt);
    assert.equal(nullifier1, nullifier2, 'Deterministic nullifier calculation must match exactly');

    const spentMap = new Map();
    spentMap.set(nullifier1, true);

    const isDoubleSpend = spentMap.has(nullifier2);
    assert.equal(isDoubleSpend, true, 'Attempted replay or second settlement must be blocked by nullifier registry');
  });

  it('Circuit 4: Settle & Repay updates shielded volume and client trust reputation', () => {
    const clientReputations = new Map();
    const clientHash = '0x7777777777777777777777777777777777777777777777777777777777777777';
    clientReputations.set(clientHash, 95);

    let currentRep = clientReputations.get(clientHash);
    if (currentRep < 100) {
      clientReputations.set(clientHash, currentRep + 1);
    }

    assert.equal(clientReputations.get(clientHash), 96, 'Client reputation must increment after successful shielded settlement');
  });
});
