// src/carriers/adapters/chilexpress-adapters.ts
import { Injectable, Logger } from '@nestjs/common';
import { CarrierAdapter } from '../ports/carrier-adapter';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

type CarrierCfg = {
  code: string;
  name?: string;
  credentials?: Record<string, any>;
};

export type ChilexpressQuotePayload = {
  originCountyCode: string;
  destinationCountyCode: string;
  package: {
    weight: string;
    height: string;
    width: string;
    length: string;
  };
  productType: number;
  contentType: number;
  declaredWorth: string;
  deliveryTime: number;
};

@Injectable()
export class ChilexpressAdapter implements CarrierAdapter {
  readonly code = 'Chilexpress';
  private readonly logger = new Logger(ChilexpressAdapter.name);

  constructor(private readonly httpService: HttpService) {}

  private get baseUrl(): string {
    const env = (process.env.CHILEXPRESS_ENV ?? 'test').toLowerCase();
    return env === 'prod'
      ? 'https://services.wschilexpress.com'
      : 'https://testservices.wschilexpress.com';
  }

  private getEndpoint(
    section: 'rating' | 'georeference',
    path: string,
  ): string {
    return `${this.baseUrl}/${section}/api/v1.0/${path}`;
  }

  private getCredentials(
    scope?: keyof CarrierCfg['credentials'],
  ): Record<string, string> {
    try {
      const carriers = JSON.parse(process.env.CARRIERS_JSON ?? '[]') as CarrierCfg[];
      const me = carriers.find((c) => c.code === this.code);
      const credsGroup = me?.credentials ?? {};
      const selected = scope ? credsGroup[scope] : credsGroup;

      return {
        'Content-Type': 'application/json',
        ...(selected ?? {}),
      };
    } catch {
      return { 'Content-Type': 'application/json' };
    }
  }

  // -------------------- COTIZACIÓN --------------------
  async getQuote(payload: ChilexpressQuotePayload) {
    const headers = this.getCredentials('cotizador');
    const url = this.getEndpoint('rating', 'rates/courier');

    this.logger.debug(`Chilexpress quote → POST ${url}`);
    this.logger.debug(`Payload: ${JSON.stringify(payload)}`);

    const response$ = this.httpService.post(url, payload, { headers });
    const response = await lastValueFrom(response$);

    return response.data;
  }

  // -------------------- COBERTURAS (Opcional) --------------------
  async listCoverages() {
    const headers = this.getCredentials('coberturas');
    const url = this.getEndpoint('georeference', 'regions/coverage');

    this.logger.debug(`Chilexpress coverages → GET ${url}`);

    try {
      const response$ = this.httpService.get(url, { headers });
      const response = await lastValueFrom(response$);
      return response.data;
    } catch (err: any) {
      this.logger.error(
        `Error consultando coberturas Chilexpress: ${err?.message}`,
      );
      return {
        statusCode: -1,
        statusDescription:
          'No se pudieron obtener las coberturas desde Chilexpress (sandbox).',
        rawError: err?.message ?? 'Unknown error',
      };
    }
  }
}
