import { InvoiceWitnesses, Bytes32 } from './contract';
import * as crypto from 'crypto';

/**
 * Computes leaf commitment matching invoice_flow.compact:
 * persistentHash([pad(32, "invoiceflow:leaf"), secret])
 */
export function leafOf(secret: string | Buffer): string {
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

/**
 * Computes deterministic nullifier matching invoice_flow.compact:
 * persistentHash([pad(32, "invoiceflow:null"), secret])
 */
export function nullifierOf(secret: string | Buffer): string {
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

/**
 * Computes Merkle root from leaf, 5-element path, and directions matching invoice_flow.compact:
 * merkleRootFrom(leaf, path, directions)
 */
export function merkleRootFrom(
  leaf: string,
  path: string[],
  directions: boolean[]
): string {
  if (path.length !== 5 || directions.length !== 5) {
    throw new Error('Merkle path and directions must have exactly 5 elements for Vector<5>');
  }

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

/**
 * Generates a valid 5-level Merkle tree, path, and root for a given invoice secret
 */
export function generateMerkleTreeAndWitness(
  secret: string,
  leafIndex: number = 0
): {
  leaf: string;
  nullifier: string;
  root: string;
  path: string[];
  directions: boolean[];
} {
  const leaf = leafOf(secret);
  const nullifier = nullifierOf(secret);
  const path: string[] = [];
  const directions: boolean[] = [];

  let currentIndex = leafIndex;
  for (let i = 0; i < 5; i++) {
    const siblingHash = crypto.createHash('sha256')
      .update(`invoiceflow_tree_level_${i}_sibling_${currentIndex}`)
      .digest('hex');
    path.push('0x' + siblingHash);
    directions.push((currentIndex % 2) === 1);
    currentIndex = Math.floor(currentIndex / 2);
  }

  const root = merkleRootFrom(leaf, path, directions);

  return {
    leaf,
    nullifier,
    root,
    path,
    directions
  };
}

/**
 * Constructs witness provider object for Midnight Compact execution
 */
export function createInvoiceWitnesses(
  secret: string,
  secretKey: string,
  path: string[],
  directions: boolean[]
): InvoiceWitnesses {
  return {
    invoiceSecret: () => secret,
    secretKey: () => secretKey,
    merklePath: () => path,
    pathDirections: () => directions
  };
}

