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

@Schema({
  collection: 'envios', // Cambiado para cumplir con la nomenclatura
  timestamps: true,
  toJSON: { virtuals: true },
})
export class Delivery {
  // Tracking y estado
  @Prop({ required: true, unique: true, index: true })
  numero_seguimiento: string; // Cambiado de 'trackingNumber' a 'numero_seguimiento'

  @Prop({ 
    type: String, 
    enum: DeliveryStatus, 
    default: DeliveryStatus.PREPARANDO,
    required: true 
  })
  estado: DeliveryStatus; // Cambiado de 'status' a 'estado'

  // Referencias a otros microservicios
  @Prop({ required: true, index: true })
  id_pago: string; // Cambiado de 'paymentId' a 'id_pago'

  @Prop({ required: true, index: true })
  id_carrito: string; // Cambiado de 'cartId' a 'id_carrito'

  @Prop({ required: true, index: true })
  id_usuario: string; // Cambiado de 'userId' a 'id_usuario'

  @Prop({ required: true, index: true })
  id_vendedor: string; // Cambiado de 'sellerId' a 'id_vendedor'

  // Información del carrier
  @Prop({ required: true })
  id_transportista: string; // Cambiado de 'carrierId' a 'id_transportista'

  @Prop({ required: true })
  nombre_transportista: string; // Cambiado de 'carrierName' a 'nombre_transportista'

  @Prop({ required: true })
  tipo_servicio: string; // Cambiado de 'serviceType' a 'tipo_servicio'

  @Prop({ required: true })
  costo_estimado: number; // Cambiado de 'estimatedCost' a 'costo_estimado'

  @Prop({ default: 'CLP' })
  moneda: string; // Cambiado de 'currency' a 'moneda'

  // Direcciones (IDs de addresses collection)
  @Prop({ required: true })
  id_direccion_origen: string; // Cambiado de 'originAddressId' a 'id_direccion_origen'

  @Prop({ required: true })
  id_direccion_destino: string; // Cambiado de 'destinationAddressId' a 'id_direccion_destino'

  // Códigos postales (legacy - mantener por compatibilidad)
  @Prop()
  codigo_postal_origen: string; // Cambiado de 'originPostalCode' a 'codigo_postal_origen'

  @Prop()
  codigo_postal_destino: string; // Cambiado de 'destinationPostalCode' a 'codigo_postal_destino'

  // Información del paquete
  @Prop({ required: true })
  peso: number; // Cambiado de 'weight' a 'peso'

  @Prop({
    type: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    required: true,
  })
  dimensiones: {
    length: number;
    width: number;
    height: number;
  }; // Cambiado de 'dimensions' a 'dimensiones'

  @Prop({ 
    type: String, 
    enum: DeliverySpeed, 
    default: DeliverySpeed.STANDARD 
  })
  velocidad_envio: DeliverySpeed; // Cambiado de 'deliverySpeed' a 'velocidad_envio'

  @Prop({ required: true })
  valor_declarado: number; // Cambiado de 'declaredWorth' a 'valor_declarado'

  @Prop({ default: false })
  fragil: boolean; // Cambiado de 'fragile' a 'fragil'

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
  fecha_entrega_estimada: Date; // Cambiado de 'estimatedDeliveryDate' a 'fecha_entrega_estimada'

  @Prop({ type: Date })
  fecha_entrega_real: Date; // Cambiado de 'actualDeliveryDate' a 'fecha_entrega_real'

  @Prop({ type: Date })
  fecha_retiro: Date; // Cambiado de 'pickupDate' a 'fecha_retiro'

  // Etiqueta de envío (generación futura)
  @Prop()
  url_etiqueta: string; // Cambiado de 'labelUrl' a 'url_etiqueta'

  // Notas adicionales
  @Prop()
  notas: string; // Sin cambios, ya que cumple con la nomenclatura
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);

// Índices compuestos para queries frecuentes
DeliverySchema.index({ userId: 1, createdAt: -1 });
DeliverySchema.index({ sellerId: 1, status: 1 });
DeliverySchema.index({ trackingNumber: 1 }, { unique: true });
