// src/carriers/carriers.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Carrier, CarrierDocument } from './schemas/carrier.schema';
import { ChilexpressAdapter } from './adapters/chilexpress-adapters';

import { CrearTransportistaDto } from './dto/create-carrier.dto';
import { ActualizarTransportistaDto } from './dto/update-carrier.dto';
import { SolicitudCotizacionDto } from './dto/quote-request.dto';
import { RespuestaCotizacionDto } from './dto/quote-response.dto';

@Injectable()
export class CarriersService {
  constructor(
    @InjectModel(Carrier.name) private carrierModel: Model<CarrierDocument>,
    private readonly chilexpress: ChilexpressAdapter,
  ) {}

  async create(dto: CrearTransportistaDto) {
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

  async update(id: string, dto: ActualizarTransportistaDto) {
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

  async quote(dto: any): Promise<any> {
    // Delegate mapping to the Chilexpress adapter which accepts either
    // the Chilexpress-shaped payload or the internal Spanish DTO (paquete, tipo_producto, etc.).
    return this.chilexpress.getQuote(dto);
  }

  async listCoverages() {
    return this.chilexpress.listCoverages();
  }
}
