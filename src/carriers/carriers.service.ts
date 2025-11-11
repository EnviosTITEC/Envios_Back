import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Carrier, CarrierDocument } from './schemas/carrier.schema';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { DeliveryDto } from '../contracts/delivery.dto';
// NOTE: since this file is in src/carriers/, the relative path is "./adapters/..."
import { ChilexpressAdapter } from './adapters/chilexpress-adapters';

const ERROR_MSG = 'Carrier not found.';

@Injectable()
export class CarriersService {
  constructor(
    @InjectModel(Carrier.name) private carrierModel: Model<CarrierDocument>,
    private readonly chilexpress: ChilexpressAdapter, // <-- inject
  ) {}

  async create(dto: CreateCarrierDto) {
    const carrier = new this.carrierModel(dto);
    return carrier.save();
  }

  async findAll() {
    return this.carrierModel.find().exec();
  }

  async findById(id: string) {
    const carrier = await this.carrierModel.findById(id).exec();
    if (!carrier) throw new NotFoundException(ERROR_MSG);
    return carrier;
  }

  async update(id: string, dto: UpdateCarrierDto) {
    const updated = await this.carrierModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(ERROR_MSG);
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.carrierModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(ERROR_MSG);
    return { deleted: true };
  }

  async quote(dto: DeliveryDto) {
    const quote = await this.chilexpress.getQuote(dto);
    return quote;
  }



}
