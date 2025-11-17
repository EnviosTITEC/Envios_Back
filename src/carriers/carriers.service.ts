// src/carriers/carriers.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Carrier, CarrierDocument } from './schemas/carrier.schema';
import { ChilexpressAdapter } from './adapters/chilexpress-adapters';

import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { QuoteRequestDto } from './dto/quote-request.dto';
import { QuoteResponseDto } from './dto/quote-response.dto';

@Injectable()
export class CarriersService {
  constructor(
    @InjectModel(Carrier.name) private carrierModel: Model<CarrierDocument>,
    private readonly chilexpress: ChilexpressAdapter,
  ) {}

  async create(dto: CreateCarrierDto) {
    return new this.carrierModel(dto).save();
  }

  async findAll() {
    return this.carrierModel.find().exec();
  }

  async findById(id: string) {
    const carrier = await this.carrierModel.findById(id).exec();
    if (!carrier) throw new NotFoundException('Carrier not found');
    return carrier;
  }

  async update(id: string, dto: UpdateCarrierDto) {
    const updated = await this.carrierModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('Carrier not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.carrierModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Carrier not found');
    return { deleted: true };
  }

  async quote(dto: QuoteRequestDto): Promise<QuoteResponseDto> {
    try {
      let origin: string;
      let dest: string;

      // Prioridad 1: Usar countyCode de Chilexpress si viene
      if (dto.originCountyCode && dto.destinationCountyCode) {
        origin = dto.originCountyCode;
        dest = dto.destinationCountyCode;
      }
      // Prioridad 2: Para backward compatibility con códigos DPA (ya no soportado)
      else if (dto.originCommuneId || dto.destinationCommuneId) {
        return {
          statusCode: -1,
          statusDescription:
            'Los códigos DPA ya no están soportados. Por favor use originCountyCode y destinationCountyCode obtenidos desde /geo/chilexpress/coverage-areas',
          error: 'DPA_NOT_SUPPORTED',
        };
      }
      // Error: Se necesita countyCode
      else {
        return {
          statusCode: -1,
          statusDescription:
            'Debe proporcionar originCountyCode + destinationCountyCode. Obténgalos desde /geo/chilexpress/coverage-areas',
          error: 'MISSING_LOCATION_DATA',
        };
      }

      const chilexpressResponse = await this.chilexpress.getQuote({
        originCountyCode: origin,
        destinationCountyCode: dest,
        package: dto.package,
        productType: dto.productType,
        contentType: dto.contentType,
        declaredWorth: dto.declaredWorth,
        deliveryTime: dto.deliveryTime ?? 0,
      });

      // Construir respuesta estructurada
      const response: QuoteResponseDto = {
        statusCode: chilexpressResponse.statusCode ?? 0,
        statusDescription:
          chilexpressResponse.statusDescription ??
          chilexpressResponse.error ??
          'Cotización procesada',
        originCommuneId: dto.originCommuneId,
        destinationCommuneId: dto.destinationCommuneId,
        originCountyCode: origin,
        destinationCountyCode: dest,
      };

      // Agregar opciones de servicio si existen
      if (chilexpressResponse.serviceOptions) {
        response.serviceOptions = chilexpressResponse.serviceOptions;
      }

      // Agregar datos raw para debugging
      if (process.env.NODE_ENV === 'development') {
        response.rawData = chilexpressResponse;
      }

      // Agregar error si existe
      if (chilexpressResponse.error) {
        response.error = chilexpressResponse.error;
      }

      return response;
    } catch (error) {
      // Si falla el mapeo de comunas, devolver error estructurado
      if (error instanceof NotFoundException) {
        return {
          statusCode: -1,
          statusDescription: error.message,
          error: 'COMMUNE_MAPPING_NOT_FOUND',
          originCommuneId: dto.originCommuneId,
          destinationCommuneId: dto.destinationCommuneId,
        };
      }

      // Error inesperado
      return {
        statusCode: -1,
        statusDescription: `Error al procesar cotización: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        error: 'PROCESSING_ERROR',
      };
    }
  }

  async listCoverages() {
    return this.chilexpress.listCoverages();
  }
}
