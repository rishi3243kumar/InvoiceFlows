// ==============================================================================
// Midnight Compact Contract Types & Interface Definition
// Target: Midnight Preprod (Compact Smart Contract v0.15+)
// Source: contracts/compact/invoice_flow.compact
// ==============================================================================

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

export interface ContractDeploymentConfig {
  network: 'preprod' | 'testnet' | 'devnet' | 'local';
  indexerUrl: string;
  proofServerUrl: string;
  nodeUrl: string;
  contractAddress?: string;
}

export const PREPROD_CONFIG: ContractDeploymentConfig = {
  network: 'preprod',
  indexerUrl: 'https://indexer.preprod.midnight.network/api/v4/graphql',
  proofServerUrl: 'https://proof.preprod.midnight.network',
  nodeUrl: 'https://rpc.preprod.midnight.network',
  contractAddress: '00646ed78c2a6ac9fcc28cb5db6e6349567995e272ab91486dd9bbc123ef0406'
};

