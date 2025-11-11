import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { CarriersService } from './carriers.service';
import { CarriersController } from './carriers.controller';
import { Carrier, CarrierSchema } from './schemas/carrier.schema';
import { CarriersSeed } from './carriers.seed';
import { ChilexpressAdapter } from './adapters/chilexpress-adapters';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Carrier.name, schema: CarrierSchema },
    ]),
  ],
  controllers: [CarriersController],
  providers: [CarriersService, CarriersSeed, ChilexpressAdapter],
})
export class CarriersModule {}
