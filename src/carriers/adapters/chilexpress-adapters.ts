import { Injectable } from '@nestjs/common';
import { CarrierAdapter } from '../ports/carrier-adapter';

@Injectable()
export class ChilexpressAdapter implements CarrierAdapter {
    readonly code = 'Chilexpress';

    async getQuote(payload: unknown) {
        return { carrier: this.code, quote: 123 }; 
    }

    async createShipment(payload: unknown) {
        return { shipmentId: 'dhl_abc' };
    }

    async track(trackingId: string) {
        return { id: trackingId, status: 'IN_TRANSIT' };
    }
}
