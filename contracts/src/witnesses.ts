import { InvoicePrivateWitnesses, MerklePath } from './contract';
import * as crypto from 'crypto';

/**
 * Computes Poseidon-compatible 32-byte sha256 leaf commitment
 * H(secret || amount || clientPubkey || salt)
 */
export function computeLeafCommitment(
  secret: string,
  amount: bigint,
  clientPubkey: string,
  salt: string
): string {
  const hash = crypto.createHash('sha256');
  hash.update(Buffer.from(secret.replace('0x', ''), 'hex'));
  
  const amountBuf = Buffer.alloc(8);
  amountBuf.writeBigUInt64BE(amount);
  hash.update(amountBuf);
  
  hash.update(Buffer.from(clientPubkey.replace('0x', ''), 'hex'));
  hash.update(Buffer.from(salt.replace('0x', ''), 'hex'));
  
  return '0x' + hash.digest('hex');
}

/**
 * Computes deterministic nullifier
 * N = H(secret || salt || "INVOICEFLOW_NULLIFIER")
 */
export function computeNullifier(secret: string, salt: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(Buffer.from(secret.replace('0x', ''), 'hex'));
  hash.update(Buffer.from(salt.replace('0x', ''), 'hex'));
  hash.update(Buffer.from('INVOICEFLOW_NULLIFIER', 'utf8'));
  return '0x' + hash.digest('hex');
}

/**
 * Generates mock Merkle path for 16-level tree
 */
export function generateMerklePath(leafIndex: number): MerklePath {
  const pathElements: string[] = [];
  const pathIndices: boolean[] = [];
  
  let currentIndex = leafIndex;
  for (let i = 0; i < 16; i++) {
    const siblingHash = crypto.createHash('sha256')
      .update(`merkle_tree_sibling_seed_${i}_${currentIndex}`)
      .digest('hex');
    pathElements.push('0x' + siblingHash);
    pathIndices.push((currentIndex % 2) === 1);
    currentIndex = Math.floor(currentIndex / 2);
  }
  
  return { leafIndex, pathElements, pathIndices };
}

/**
 * Creates client-side private witness provider for Midnight Compact execution
 */
export function createInvoiceWitnesses(
  secret: string,
  amount: bigint,
  salt: string,
  leafIndex: number = 0
): InvoicePrivateWitnesses {
  const merklePath = generateMerklePath(leafIndex);
  
  return {
    getPrivateInvoiceSecret: () => secret,
    getInvoiceAmount: () => amount,
    getInvoiceSalt: () => salt,
    getMerklePath: () => merklePath
  };
}
