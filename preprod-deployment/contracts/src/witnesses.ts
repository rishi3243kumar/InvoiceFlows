import { Ledger } from "./managed/bboard/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";

export type InvoiceFlowPrivateState = {
  readonly secretKey: Uint8Array;
  readonly invoiceSecret?: Uint8Array;
};

export const createInvoiceFlowPrivateState = (secretKey: Uint8Array) => ({
  secretKey,
  invoiceSecret: secretKey,
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

  invoiceSecret: ({
    privateState,
  }: WitnessContext<Ledger, InvoiceFlowPrivateState>): [
    InvoiceFlowPrivateState,
    Uint8Array,
  ] => [privateState, privateState.invoiceSecret ?? privateState.secretKey ?? new Uint8Array(32)],

  merklePath: ({
    privateState,
  }: WitnessContext<Ledger, InvoiceFlowPrivateState>): [
    InvoiceFlowPrivateState,
    [Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array],
  ] => [
    privateState,
    [
      new Uint8Array(32),
      new Uint8Array(32),
      new Uint8Array(32),
      new Uint8Array(32),
      new Uint8Array(32),
    ],
  ],

  pathDirections: ({
    privateState,
  }: WitnessContext<Ledger, InvoiceFlowPrivateState>): [
    InvoiceFlowPrivateState,
    [boolean, boolean, boolean, boolean, boolean],
  ] => [privateState, [false, false, false, false, false]],
};
