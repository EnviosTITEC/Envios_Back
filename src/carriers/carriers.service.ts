// src/carriers/carriers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Carrier, CarrierDocument } from './schemas/carrier.schema';
import { ChilexpressAdapter } from './adapters/chilexpress-adapters';
import { DPA_TO_CHILEXPRESS_COUNTY } from './chilexpress-dpa-mapping';

import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';

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

  private resolveChilexpressCounty(communeId: string): string {
    const county = DPA_TO_CHILEXPRESS_COUNTY[communeId];
    if (!county)
      throw new NotFoundException(
        `No existe mapping Chilexpress para communeId=${communeId}`,
      );
    return county;
  }

  async quote(dto: any) {
    const origin = this.resolveChilexpressCounty(dto.originCommuneId);
    const dest = this.resolveChilexpressCounty(dto.destinationCommuneId);

    return this.chilexpress.getQuote({
      originCountyCode: origin,
      destinationCountyCode: dest,
      package: dto.package,
      productType: dto.productType,
      contentType: dto.contentType,
      declaredWorth: dto.declaredWorth,
      deliveryTime: dto.deliveryTime,
    });
  }

  async listCoverages() {
    return this.chilexpress.listCoverages();
  }
}
