// ==============================================================================
// Compiled Compact Contract Bindings for InvoiceFlow on Midnight Network
// Target: Midnight Preprod (Compact Smart Contract Standard v0.15+)
// Source: contracts/compact/invoice_flow.compact
// ==============================================================================

export type HexString = string;
export type Bytes32 = Uint8Array | string;

export interface InvoiceWitnesses {
  invoiceSecret: () => Bytes32;
  secretKey: () => Bytes32;
  merklePath: () => Bytes32[]; // Vector<5, Bytes<32>>
  pathDirections: () => boolean[]; // Vector<5, Boolean>
}

export interface InvoiceFlowPrivateState {
  readonly secret: Bytes32;
  readonly secretKey: Bytes32;
  readonly merklePath: Bytes32[];
  readonly pathDirections: boolean[];
}

export interface InvoiceFlowLedgerState {
  invoiceRoot: string;
  issuer: string;
  invoiceCount: bigint;
  settledCount: bigint;
  nullifiers: Set<string>;
}

export interface ContractDeploymentResult {
  contractAddress: string;
  deployTxHash: string;
  blockHeight: number;
  initialRoot: string;
}

// Compact Compiled Contract Descriptor matching invoice_flow.compact
export const InvoiceFlowContract = {
  name: 'InvoiceFlow',
  version: '0.15.0',
  circuits: {
    registerInvoiceRoot: {
      params: ['newRoot: Bytes<32>'],
      returnType: 'Void',
    },
    verifyAndSettleInvoice: {
      params: [],
      returnType: 'Void',
    },
    getInvoiceStats: {
      params: [],
      returnType: '[Bytes<32>, Uint<64>, Uint<64>]',
    }
  },
  witnesses: [
    'invoiceSecret(): Bytes<32>',
    'secretKey(): Bytes<32>',
    'merklePath(): Vector<5, Bytes<32>>',
    'pathDirections(): Vector<5, Boolean>'
  ],
  ledger: {
    invoiceRoot: 'Bytes<32>',
    issuer: 'ZswapCoinPublicKey',
    invoiceCount: 'Counter',
    settledCount: 'Counter',
    nullifiers: 'Set<Bytes<32>>'
  }
};

