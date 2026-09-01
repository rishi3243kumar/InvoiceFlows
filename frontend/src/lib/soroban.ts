import * as StellarSdk from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

export const TESTNET_NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
export const rpcUrl = 'https://soroban-testnet.stellar.org';
export const server = new StellarSdk.rpc.Server(rpcUrl);

// These will be updated after deployment
export const CONTRACTS = {
  invoiceRegistry: process.env.NEXT_PUBLIC_INVOICE_REGISTRY || 'CDUMMYREGISTRY1234567890',
  reputationScore: process.env.NEXT_PUBLIC_REPUTATION_SCORE || 'CDUMMYREP1234567890',
  invoiceToken: process.env.NEXT_PUBLIC_INVOICE_TOKEN || 'CDUMMYTOKEN1234567890',
  escrowSettlement: process.env.NEXT_PUBLIC_ESCROW_SETTLEMENT || 'CDUMMYESCROW1234567890',
  secondaryMarket: process.env.NEXT_PUBLIC_SECONDARY_MARKET || 'CDUMMYMARKET1234567890',
};

export async function submitTransaction(
  txBuilder: StellarSdk.TransactionBuilder,
  signerPublicKey: string
) {
  const transaction = txBuilder.build();
  
  // Prepare for Soroban (simulates and adds resources)
  const preparedTransaction = await server.prepareTransaction(transaction);
  
  // Sign with Freighter
  const xdr = preparedTransaction.toXDR();
  const signedXdr = await signTransaction(xdr, {
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
    address: signerPublicKey,
  });

  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr.signedTxXdr,
    TESTNET_NETWORK_PASSPHRASE
  ) as StellarSdk.Transaction;

  // Submit to network
  const sendResponse = await server.sendTransaction(signedTx);
  if (sendResponse.status !== 'PENDING') {
    throw new Error(`Failed to submit transaction: ${JSON.stringify(sendResponse)}`);
  }

  // Wait for result
  return await waitForTransaction(sendResponse.hash);
}

async function waitForTransaction(hash: string) {
  let statusResponse = await server.getTransaction(hash);
  while (statusResponse.status === 'NOT_FOUND') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    statusResponse = await server.getTransaction(hash);
  }
  if (statusResponse.status === 'SUCCESS') {
    return { ...statusResponse, hash };
  }
  throw new Error(`Transaction failed: ${JSON.stringify(statusResponse)}`);
}

export async function loadAccount(publicKey: string) {
  return await server.getAccount(publicKey);
}
