import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, AddressDocument } from './schemas/address.schema';
import { CrearDireccionDto } from './dto/create-address.dto';
import { ActualizarDireccionDto } from './dto/update-address.dto';

const ERROR_MSG = "Address not found."

@Injectable()
export class AddressesService {
  constructor(
  @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
  ) {}

  async create(dto: CrearDireccionDto) {
    const address = new this.addressModel(dto);
    return address.save();
  }

  async findAll(userId: string) {
    return this.addressModel.find({ usuario_id: userId }).exec();
  }

  async findById(id: string) {
    const address = await this.addressModel.findById(id).exec();
    if (!address) throw new NotFoundException(ERROR_MSG);
    return address;
  }

  async update(id: string, dto: ActualizarDireccionDto) {
    const updated = await this.addressModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(ERROR_MSG);
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.addressModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(ERROR_MSG);
    return { deleted: true };
  }

}
