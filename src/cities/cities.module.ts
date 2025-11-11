import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CitiesService as CitiesService } from './cities.service';
import { CitiesController as CitiesController } from './cities.controller';
import { City, CitySchema as CitySchema } from './schemas/city.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: City.name, schema: CitySchema }])],
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CityModule {}
