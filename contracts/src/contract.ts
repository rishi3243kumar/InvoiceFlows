// ==============================================================================
// Midnight Compact Contract Types & Interface Definition
// Target: Midnight Preprod (Compact Smart Contract v0.18+)
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

export interface ContractDeploymentConfig {
  network: 'preprod' | 'testnet' | 'devnet' | 'local';
  indexerUrl: string;
  proofServerUrl: string;
  nodeUrl: string;
  contractAddress?: string;
}

export const PREPROD_CONFIG: ContractDeploymentConfig = {
  network: 'preprod',
  indexerUrl: 'https://indexer.preprod.midnight.network/api/v1/graphql',
  proofServerUrl: 'https://proof.preprod.midnight.network',
  nodeUrl: 'https://rpc.preprod.midnight.network',
  contractAddress: '00646ed78c2a6ac9fcc28cb5db6e6349567995e272ab91486dd9bbc123ef0406'
};
