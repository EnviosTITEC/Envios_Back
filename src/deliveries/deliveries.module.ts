import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveriesService as DeliveriesService } from './deliveries.service';
import { DeliveriesController as DeliveriesController } from './deliveries.controller';
import { Delivery, DeliverySchema } from './schemas/delivery.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Delivery.name, schema: DeliverySchema }])],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
})
export class DeliveriesModule {}
