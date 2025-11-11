// delivery.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeliveryDocument = Delivery & Document;

export enum DeliverySpeed {
  STANDARD = 'standard',
  EXPRESS = 'express',
  OVERNIGHT = 'overnight',
}

@Schema({ collection: 'deliveries', timestamps: true, toJSON: { virtuals: true } })
export class Delivery {
  @Prop({ required: true })
  originPostalCode: string;

  @Prop({ required: true })
  destinationPostalCode: string;

  @Prop({ required: true })
  weight: number;

  @Prop({
    type: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      weight: { type: Number, required: true },
    },
    required: true,
  })
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };

  @Prop({ 
    type: String, 
    enum: DeliverySpeed, 
    default: DeliverySpeed.STANDARD 
  })
  deliverySpeed: DeliverySpeed;

  @Prop({ required: true })
  insuranceValue: number;

  @Prop({ required: true })
  fragile: boolean;

  @Prop({ default: 'CLP' })
  currency: string;

  @Prop({ type: Date, required: true })
  pickupDate: Date;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
