// src/carriers/adapters/chilexpress-adapters.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CarrierAdapter } from '../ports/carrier-adapter';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

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

    try {
      // Validar que tengamos la API key correcta
      if (!headers['Ocp-Apim-Subscription-Key']) {
        throw new BadRequestException(
          'API Key de Chilexpress no configurada correctamente. Verifica CARRIERS_JSON en .env',
        );
      }

      const response$ = this.httpService.post(url, payload, { headers });
      const response = await lastValueFrom(response$);

      // Validar la respuesta de Chilexpress
      if (!response.data) {
        this.logger.error('Respuesta vacía de Chilexpress');
        return {
          statusCode: -1,
          statusDescription: 'Error: Respuesta vacía de Chilexpress',
          error: 'NO_RESPONSE',
        };
      }

      // Loggear respuesta exitosa
      this.logger.debug(
        `Chilexpress response: ${JSON.stringify(response.data)}`,
      );

      return response.data;
    } catch (error) {
      return this.handleQuoteError(error);
    }
  }

  private handleQuoteError(error: any) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const data = error.response?.data;

      this.logger.error(
        `Error Chilexpress API [${status}]: ${JSON.stringify(data)}`,
      );

      // Errores específicos de Chilexpress
      if (status === 401 || status === 403) {
        return {
          statusCode: -1,
          statusDescription:
            'Error de autenticación con Chilexpress. Verifica las API keys.',
          error: 'AUTHENTICATION_ERROR',
          rawError: data,
        };
      }

      if (status === 400) {
        return {
          statusCode: -1,
          statusDescription:
            data?.statusDescription ||
            'Solicitud inválida. Verifica los datos enviados.',
          error: 'INVALID_REQUEST',
          rawError: data,
        };
      }

      if (status === 404) {
        return {
          statusCode: -1,
          statusDescription:
            'Cobertura no disponible para origen/destino especificado',
          error: 'COVERAGE_NOT_FOUND',
          rawError: data,
        };
      }

      if (status >= 500) {
        return {
          statusCode: -1,
          statusDescription:
            'Error en el servidor de Chilexpress. Intenta más tarde.',
          error: 'SERVER_ERROR',
          rawError: data,
        };
      }

      return {
        statusCode: -1,
        statusDescription: `Error HTTP ${status}: ${error.message}`,
        error: 'HTTP_ERROR',
        rawError: data,
      };
    }

    // Error genérico
    this.logger.error(`Error desconocido: ${error?.message}`);
    return {
      statusCode: -1,
      statusDescription: `Error al cotizar: ${error?.message || 'Error desconocido'}`,
      error: 'UNKNOWN_ERROR',
      rawError: error,
    };
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
