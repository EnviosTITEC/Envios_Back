import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, AddressDocument } from './schemas/address.schema';
import { Carrier, CarrierDocument } from './schemas/carrier.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { QuoteCarrierDto } from './dto/quote-carrier.dto';

@Injectable()
export class DeliveriesService {
  constructor(
  @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
    @InjectModel(Carrier.name) private carrierModel: Model<CarrierDocument>,
  ) {}

  // ----- DIRECCIONES -----
  async createAddress(dto: CreateAddressDto) {
    const direccion = new this.addressModel(dto);
    return direccion.save();
  }

  async findAllDirecciones(usuarioId: string) {
    return this.addressModel.find({ userId: usuarioId }).exec();
  }

  async findAddressById(id: string) {
    const direccion = await this.addressModel.findById(id).exec();
    if (!direccion) throw new NotFoundException('Dirección no encontrada');
    return direccion;
  }

  async updateAddress(id: string, dto: UpdateAddressDto) {
    const updated = await this.addressModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Dirección no encontrada');
    return updated;
  }

  async deleteAddress(id: string) {
    const deleted = await this.addressModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Dirección no encontrada');
    return { deleted: true };
  }

  // ----- AGENCIAS TRANSPORTISTAS -----
  async createCarrier(dto: CreateCarrierDto) {
    const transportista = new this.carrierModel(dto);
    return transportista.save();
  }

  async findAllCarriers() {
    return this.carrierModel.find().exec();
  }

  async findCarrierById(id: string) {
    const transportista = await this.carrierModel.findById(id).exec();
    if (!transportista) throw new NotFoundException('Transportista no encontrado');
    return transportista;
  }

  async updateCarrier(id: string, dto: UpdateCarrierDto) {
    const updated = await this.carrierModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Transportista no encontrado');
    return updated;
  }

  async deleteCarrier(id: string) {
    const deleted = await this.carrierModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Transportista no encontrado');
    return { deleted: true };
  }

  async quoteCarrier(id: string, dto: QuoteCarrierDto) {
    const carrier = await this.carrierModel.findById(id);
    if (!carrier) throw new NotFoundException('Carrier not found');
    // Call a method on the carrier to calculate the price (for now, return 0)
    const price = 0
    return {
      carrier_id: id,
      price,
      currency: dto.currency,
    };
  }

}
