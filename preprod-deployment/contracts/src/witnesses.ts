import { Ledger } from "./managed/bboard/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";

export type InvoiceFlowPrivateState = {
  readonly secretKey: Uint8Array;
  readonly invoiceSecret?: Uint8Array;
  readonly amount?: bigint;
  readonly salt?: Uint8Array;
};

export const createInvoiceFlowPrivateState = (secretKey: Uint8Array) => ({
  secretKey,
});

export type BBoardPrivateState = InvoiceFlowPrivateState;
export const createBBoardPrivateState = createInvoiceFlowPrivateState;

export const witnesses = {
  secretKey: ({
    privateState,
  }: WitnessContext<Ledger, InvoiceFlowPrivateState>): [
    InvoiceFlowPrivateState,
    Uint8Array,
  ] => [privateState, privateState.secretKey ?? new Uint8Array(32)],

  getPrivateInvoiceSecret: ({
    privateState,
  }: WitnessContext<Ledger, InvoiceFlowPrivateState>): [
    InvoiceFlowPrivateState,
    Uint8Array,
  ] => [privateState, privateState.invoiceSecret ?? new Uint8Array(32)],

  getInvoiceAmount: ({
    privateState,
  }: WitnessContext<Ledger, InvoiceFlowPrivateState>): [
    InvoiceFlowPrivateState,
    bigint,
  ] => [privateState, privateState.amount ?? 0n],

  getInvoiceSalt: ({
    privateState,
  }: WitnessContext<Ledger, InvoiceFlowPrivateState>): [
    InvoiceFlowPrivateState,
    Uint8Array,
  ] => [privateState, privateState.salt ?? new Uint8Array(32)],

  getMerklePath: ({
    privateState,
  }: WitnessContext<Ledger, InvoiceFlowPrivateState>): [
    InvoiceFlowPrivateState,
    any,
  ] => [
    privateState,
    {
      leafIndex: 0,
      pathElements: Array.from({ length: 16 }, () => new Uint8Array(32)),
      pathIndices: Array.from({ length: 16 }, () => false),
    },
  ],

  merklePath: ({
    privateState,
  }: WitnessContext<Ledger, InvoiceFlowPrivateState>): [
    InvoiceFlowPrivateState,
    [Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array],
  ] => [privateState, [new Uint8Array(32), new Uint8Array(32), new Uint8Array(32), new Uint8Array(32), new Uint8Array(32)]],

  pathDirections: ({
    privateState,
  }: WitnessContext<Ledger, InvoiceFlowPrivateState>): [
    InvoiceFlowPrivateState,
    [boolean, boolean, boolean, boolean, boolean],
  ] => [privateState, [false, false, false, false, false]],
};

