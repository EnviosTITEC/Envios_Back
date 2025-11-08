export interface CarrierAdapter {
  /** canonical unique key that matches DB `Carrier.code` (e.g., "DHL") */
  readonly code: string;

  // Example operations — add what you need:
  getQuote(payload: unknown): Promise<unknown>;
  createShipment(payload: unknown): Promise<unknown>;
  track(trackingId: string): Promise<unknown>;
}
