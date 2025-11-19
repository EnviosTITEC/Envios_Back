import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CitiesService as CitiesService } from './cities.service';
import { CitiesController as CitiesController } from './cities.controller';
import { Ciudad, CiudadSchema } from './schemas/city.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ciudad.name, schema: CiudadSchema }])],
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CityModule {}
