export interface CarrierAdapter {
  /** canonical unique key that matches DB `Carrier.code` (e.g., "DHL") */
  readonly code: string;

  listCovertures(payload: unknown): Promise<unknown>;
  getQuote(payload: unknown, params: unknown): Promise<unknown>;
}
