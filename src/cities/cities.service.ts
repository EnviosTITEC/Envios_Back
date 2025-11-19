import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ciudad } from './schemas/city.schema';
import { CrearCiudadDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(Ciudad.name) private cityModel: Model<Ciudad>,
  ) {}

  create(dto: CrearCiudadDto) {
    const created = new this.cityModel(dto);
    return created.save();
  }

  findAll() {
    return this.cityModel.find().exec();
  }

  findOne(id: string) {
    return this.cityModel.findById(id).exec();
  }

  update(id: string, updateCityDto: UpdateCityDto) {
    return this.cityModel.findByIdAndUpdate(id, updateCityDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.cityModel.findByIdAndDelete(id).exec();
  }
}
