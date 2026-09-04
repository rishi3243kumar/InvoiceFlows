// ==============================================================================
// Compiled Compact Contract Bindings for InvoiceFlow on Midnight Network
// Target: Midnight Preprod (Standard Compact ABI v0.18+)
// ==============================================================================

export interface InvoicePublicMetadata {
  dueTimestamp: bigint;
  riskTier: number;
  isSettled: boolean;
  registeredAt: bigint;
}

export interface MerklePath {
  leafIndex: number;
  pathElements: string[]; // 32-byte hex strings
  pathIndices: boolean[];
}

export interface InvoicePrivateWitnesses {
  getPrivateInvoiceSecret: () => string;
  getInvoiceAmount: () => bigint;
  getInvoiceSalt: () => string;
  getMerklePath: () => MerklePath;
}

export interface InvoiceFlowLedgerState {
  merkleRoot: string;
  nullifiers: Record<string, boolean>;
  invoiceCount: number;
  totalSettledVolume: bigint;
  invoiceRegistrations: Record<string, InvoicePublicMetadata>;
  clientReputations: Record<string, number>;
}

export interface ContractDeploymentResult {
  contractAddress: string;
  deployTxHash: string;
  blockHeight: number;
  initialMerkleRoot: string;
}

// Compact Compiled Contract Descriptor
export const InvoiceFlowContract = {
  name: 'InvoiceFlow',
  version: '0.18.2',
  circuits: {
    initialize: {
      params: ['initialRoot: Bytes<32>'],
      returnType: 'Void',
    },
    tokenizeInvoice: {
      params: [
        'invoiceIdHash: Bytes<32>',
        'commitment: Bytes<32>',
        'newMerkleRoot: Bytes<32>',
        'dueTimestamp: Uint<64>',
        'riskTier: Uint<8>'
      ],
      returnType: 'Void',
    },
    proveAccess: {
      params: [
        'clientPubkey: Bytes<32>',
        'claimedInvoiceId: Bytes<32>'
      ],
      returnType: 'Bytes<32>', // Returns nullifier hash
    },
    settleInvoice: {
      params: [
        'invoiceIdHash: Bytes<32>',
        'nullifier: Bytes<32>',
        'settledAmount: Uint<64>',
        'clientHash: Bytes<32>'
      ],
      returnType: 'Void',
    }
  }
};
