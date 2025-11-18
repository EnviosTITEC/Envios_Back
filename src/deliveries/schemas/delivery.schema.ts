// delivery.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeliveryDocument = Delivery & Document;

export enum DeliveryStatus {
  PREPARANDO = 'Preparando',
  EN_TRANSITO = 'EnTransito',
  ENTREGADO = 'Entregado',
  CANCELADO = 'Cancelado',
  DEVUELTO = 'Devuelto',
}

export enum DeliverySpeed {
  STANDARD = 'standard',
  EXPRESS = 'express',
  OVERNIGHT = 'overnight',
}

@Schema({ collection: 'deliveries', timestamps: true, toJSON: { virtuals: true } })
export class Delivery {
  // Tracking y estado
  @Prop({ required: true, unique: true, index: true })
  trackingNumber: string;

  @Prop({ 
    type: String, 
    enum: DeliveryStatus, 
    default: DeliveryStatus.PREPARANDO,
    required: true 
  })
  status: DeliveryStatus;

  // Referencias a otros microservicios
  @Prop({ required: true, index: true })
  paymentId: string;

  @Prop({ required: true, index: true })
  cartId: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  sellerId: string;

  // Información del carrier
  @Prop({ required: true })
  carrierId: string;

  @Prop({ required: true })
  carrierName: string;

  @Prop({ required: true })
  serviceType: string; // PRIORITARIO, EXPRESS, etc.

  @Prop({ required: true })
  estimatedCost: number;

  @Prop({ default: 'CLP' })
  currency: string;

  // Direcciones (IDs de addresses collection)
  @Prop({ required: true })
  originAddressId: string;

  @Prop({ required: true })
  destinationAddressId: string;

  // Códigos postales (legacy - mantener por compatibilidad)
  @Prop()
  originPostalCode: string;

  @Prop()
  destinationPostalCode: string;

  // Información del paquete
  @Prop({ required: true })
  weight: number;

  @Prop({
    type: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    required: true,
  })
  dimensions: {
    length: number;
    width: number;
    height: number;
  };

  @Prop({ 
    type: String, 
    enum: DeliverySpeed, 
    default: DeliverySpeed.STANDARD 
  })
  deliverySpeed: DeliverySpeed;

  @Prop({ required: true })
  declaredWorth: number; // Valor declarado para seguro

  @Prop({ default: false })
  fragile: boolean;

  // Items del carrito (snapshot para referencia)
  @Prop({
    type: [{
      productId: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }],
    required: true,
  })
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;

  // Fechas
  @Prop({ type: Date })
  estimatedDeliveryDate: Date;

  @Prop({ type: Date })
  actualDeliveryDate: Date;

  @Prop({ type: Date })
  pickupDate: Date;

  // Etiqueta de envío (generación futura)
  @Prop()
  labelUrl: string;

  // Notas adicionales
  @Prop()
  notes: string;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);

// Índices compuestos para queries frecuentes
DeliverySchema.index({ userId: 1, createdAt: -1 });
DeliverySchema.index({ sellerId: 1, status: 1 });
DeliverySchema.index({ trackingNumber: 1 }, { unique: true });
