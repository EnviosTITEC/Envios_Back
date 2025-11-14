// src/carriers/carriers.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { CarriersController } from './carriers.controller';
import { CarriersService } from './carriers.service';
import { Carrier, CarrierSchema } from './schemas/carrier.schema';
import { ChilexpressAdapter } from './adapters/chilexpress-adapters';
import { GeoModule } from '../geo/geo.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Carrier.name, schema: CarrierSchema }]),
    HttpModule,
    GeoModule,
  ],
  controllers: [CarriersController],
  providers: [CarriersService, ChilexpressAdapter],
  exports: [CarriersService],
})
export class CarriersModule {}
