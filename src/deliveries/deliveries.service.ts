import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Delivery } from './schemas/delivery.schema';
import { DeliveryDto } from '../contracts/delivery.dto';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<Delivery>,
  ) {}

  create(createDeliveryDto: DeliveryDto) {
    const created = new this.deliveryModel(createDeliveryDto);
    return created.save();
  }

  findAll() {
    return this.deliveryModel.find().exec();
  }

  findOne(id: string) {
    return this.deliveryModel.findById(id).exec();
  }

  update(id: string, updateDeliveryDto: DeliveryDto) {
    return this.deliveryModel.findByIdAndUpdate(id, updateDeliveryDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.deliveryModel.findByIdAndDelete(id).exec();
  }
}
