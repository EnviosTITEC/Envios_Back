import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Delivery } from './schemas/delivery.schema';
import { DeliveryDto } from '../contracts/delivery.dto';

const ERROR_MSG = "Delivery not found."

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<Delivery>,
  ) {}

  async create(dto: DeliveryDto) {
    const created = new this.deliveryModel(dto);
    return created.save();
  }

  async findAll() {
    const delivery = await this.deliveryModel.find().exec();
    if (!delivery) throw new NotFoundException(ERROR_MSG);
    return delivery
  }

  async findOne(id: string) {
    const delivery = await this.deliveryModel.findById(id).exec();
    if (!delivery) throw new NotFoundException(ERROR_MSG);
    return delivery
  }

  async update(id: string, dto: DeliveryDto) {
    const updated = await this.deliveryModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(ERROR_MSG);
    return updated;
  }

  async remove(id: string) {
    return this.deliveryModel.findByIdAndDelete(id).exec();
  }
}
