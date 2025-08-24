import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Direccion, DireccionDocument } from './schemas/direccion.schema';
import { Transportista, TransportistaDocument } from './schemas/transportista.schema';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { CreateTransportistaDto } from './dto/create-transportista.dto';
import { UpdateTransportistaDto } from './dto/update-transportista.dto';

@Injectable()
export class EnviosService {
  constructor(
    @InjectModel(Direccion.name) private direccionModel: Model<DireccionDocument>,
    @InjectModel(Transportista.name) private transportistaModel: Model<TransportistaDocument>,
  ) {}

  // ----- DIRECCIONES -----
  async createDireccion(dto: CreateDireccionDto) {
    const direccion = new this.direccionModel(dto);
    return direccion.save();
  }

  async findAllDirecciones(usuarioId: string) {
    return this.direccionModel.find({ usuarioId }).exec();
  }

  async findDireccionById(id: string) {
    const direccion = await this.direccionModel.findById(id).exec();
    if (!direccion) throw new NotFoundException('Dirección no encontrada');
    return direccion;
  }

  async updateDireccion(id: string, dto: UpdateDireccionDto) {
    const updated = await this.direccionModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Dirección no encontrada');
    return updated;
  }

  async deleteDireccion(id: string) {
    const deleted = await this.direccionModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Dirección no encontrada');
    return { deleted: true };
  }

  // ----- TRANSPORTISTAS -----
  async createTransportista(dto: CreateTransportistaDto) {
    const transportista = new this.transportistaModel(dto);
    return transportista.save();
  }

  async findAllTransportistas() {
    return this.transportistaModel.find().exec();
  }

  async findTransportistaById(id: string) {
    const transportista = await this.transportistaModel.findById(id).exec();
    if (!transportista) throw new NotFoundException('Transportista no encontrado');
    return transportista;
  }

  async updateTransportista(id: string, dto: UpdateTransportistaDto) {
    const updated = await this.transportistaModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Transportista no encontrado');
    return updated;
  }

  async deleteTransportista(id: string) {
    const deleted = await this.transportistaModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Transportista no encontrado');
    return { deleted: true };
  }
}
