import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveriesService } from './deliveries.service';
import { DeliveriesController } from './deliveries.controller';
import { Address, AddressSchema } from './schemas/address.schema';
import { Carrier, CarrierSchema } from './schemas/carrier.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
  { name: Address.name, schema: AddressSchema },
      { name: Carrier.name, schema: CarrierSchema },
    ]),
  ],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
})
export class DeliveriesModule {}
