import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarriersService } from './carriers.service';
import { CarriersController } from './carriers.controller';
import { Carrier, CarrierSchema } from './schemas/carrier.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Carrier.name, schema: CarrierSchema },
    ]),
  ],
  controllers: [CarriersController],
  providers: [CarriersService],
})
export class DeliveriesModule {}
