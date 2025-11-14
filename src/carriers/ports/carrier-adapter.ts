// src/carriers/ports/carrier-adapter.ts
export interface CarrierAdapter {
  code: string;
  getQuote(payload: any): Promise<any>;
  listCoverages?(): Promise<any>; // opcional
}
