import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, AddressDocument } from './schemas/address.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

const ERROR_MSG = "Address not found."

@Injectable()
export class AddressesService {
  constructor(
  @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
  ) {}

  async createAddress(dto: CreateAddressDto) {
    const address = new this.addressModel(dto);
    return address.save();
  }

  async findAllAddresses(userId: string) {
    return this.addressModel.find({ userId: userId }).exec();
  }

  async findAddressById(id: string) {
    const address = await this.addressModel.findById(id).exec();
    if (!address) throw new NotFoundException(ERROR_MSG);
    return address;
  }

  async updateAddress(id: string, dto: UpdateAddressDto) {
    const updated = await this.addressModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(ERROR_MSG);
    return updated;
  }

  async deleteAddress(id: string) {
    const deleted = await this.addressModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(ERROR_MSG);
    return { deleted: true };
  }

}
