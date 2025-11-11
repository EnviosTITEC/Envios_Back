import { Injectable } from '@nestjs/common';
import { CarrierAdapter } from '../ports/carrier-adapter';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

type CarrierCfg = {
  code: string;
  name?: string;
  credentials?: Record<string, string>;
};

export type ChilexpressRateParams = {
  RegionCode: string;
  type: number;
};

@Injectable()
export class ChilexpressAdapter implements CarrierAdapter {
  readonly code = 'Chilexpress';

  constructor(private readonly httpService: HttpService) {}

  /** Devuelve la URL base según entorno (test o prod) */
  private get baseUrl(): string {
    const env = (process.env.CHILEXPRESS_ENV ?? 'test').toLowerCase();
    return env === 'prod'
      ? 'https://services.wschilexpress.com'
      : 'https://testservices.wschilexpress.com';
  }

  /**
   * Retorna endpoint completo según tipo de recurso.
   * @param section Ej: 'rating', 'georeference', 'coverage', etc.
   * @param path    Path relativo del endpoint (sin dominio)
   */
  private getEndpoint(section: 'rating' | 'georeference' | 'coverage', path: string): string {
    return `${this.baseUrl}/${section}/api/v1.0/${path}`;
  }


  /** Lee credenciales y devuelve los headers adecuados según el uso */
  private getCredentials(scope?: keyof CarrierCfg['credentials']): Record<string, string> {
    try {
      const carriers = JSON.parse(process.env.CARRIERS_JSON ?? '[]') as CarrierCfg[];
      const me = carriers.find(c => c.code === this.code);
      const credsGroup = me?.credentials ?? {};
      const selected = scope ? credsGroup[scope] : credsGroup;
      const headers = (selected && typeof selected === 'object') ? selected as Record<string, string> : {};
      return {
        'Content-Type': 'application/json',
        ...headers,
      };
    } catch {
      return { 'Content-Type': 'application/json' };
    }
  }

  async getQuote(payload: any) {
    const headers = this.getCredentials('cotizador');
    const url = this.getEndpoint('rating', 'rates/courier');
    const response$ = this.httpService.post(url, payload, {
      headers,
    });
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async listCovertures(payload: any) {
    const headers = this.getCredentials('coberturas');
    const url = this.getEndpoint('georeference', 'regions/coverage');
    /* To be done */
  }


}
