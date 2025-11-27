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
  numero_seguimiento: string;

  @Prop({
    type: String,
    enum: DeliveryStatus,
    default: DeliveryStatus.PREPARANDO,
    required: true,
  })
  estado: DeliveryStatus;

  // Referencias a otros microservicios
  // `pago_id` puede estar ausente cuando se crea un envío directamente desde el frontend
  @Prop({ required: false, index: true })
  pago_id: string;

  @Prop({ required: true, index: true })
  carrito_id: string;

  @Prop({ required: true, index: true })
  usuario_id: string;

  @Prop({ required: true, index: true })
  vendedor_id: string;

  // Información del carrier
  @Prop({ required: true })
  transportista_id: string;

  @Prop({ required: true })
  nombre_transportista: string;

  @Prop({ required: true })
  tipo_servicio: string; // PRIORITARIO, EXPRESS, etc.

  @Prop({ required: true })
  costo_estimado: number;

  @Prop({ default: 'CLP' })
  moneda: string;

  // Direcciones (IDs de addresses collection)
  @Prop({ required: true })
  origen_direccion_id: string;

  @Prop({ required: true })
  destino_direccion_id: string;

  // Códigos postales (legacy - mantener por compatibilidad)
  @Prop()
  codigo_postal_origen: string;

  @Prop()
  codigo_postal_destino: string;

  // Información del paquete
  @Prop({ required: true })
  peso: number;

  @Prop({
    type: {
      largo: { type: Number, required: true },
      ancho: { type: Number, required: true },
      alto: { type: Number, required: true },
    },
    required: true,
  })
  dimensiones: {
    largo: number;
    ancho: number;
    alto: number;
  };

  @Prop({
    type: String,
    enum: DeliverySpeed,
    default: DeliverySpeed.STANDARD,
  })
  velocidad_envio: DeliverySpeed;


  @Prop({ required: true })
  valor_declarado: number; // Valor declarado para seguro

  @Prop({ default: false })
  fragil: boolean;

  // Items del carrito (snapshot para referencia)
  @Prop({
    type: [
      {
        producto_id: { type: String, required: true },
        nombre: { type: String, required: true },
        cantidad: { type: Number, required: true },
        precio: { type: Number, required: true },
      },
    ],
    required: true,
  })
  articulos: Array<{
    producto_id: string;
    nombre: string;
    cantidad: number;
    precio: number;
  }>;

  // Fechas
  @Prop({ type: Date })
  fecha_entrega_estimada: Date;

  @Prop({ type: Date })
  fecha_entrega_real: Date;

  @Prop({ type: Date })
  fecha_retiro: Date;

  // Etiqueta de envío (generación futura)
  @Prop()
  url_etiqueta: string;

  // Notas adicionales
  @Prop()
  notas: string;

  // Compatibility getters/setters (TypeScript) for existing English property names
  get trackingNumber(): string {
    return (this as any).numeroSeguimiento;
  }
  set trackingNumber(v: string) {
    (this as any).numeroSeguimiento = v;
  }

  get status(): DeliveryStatus {
    return (this as any).estado;
  }
  set status(v: DeliveryStatus) {
    (this as any).estado = v;
  }

  get paymentId(): string {
    return (this as any).pagoId;
  }
  set paymentId(v: string) {
    (this as any).pagoId = v;
  }

  get cartId(): string {
    return (this as any).carritoId;
  }
  set cartId(v: string) {
    (this as any).carritoId = v;
  }

  get userId(): string {
    return (this as any).usuarioId;
  }
  set userId(v: string) {
    (this as any).usuarioId = v;
  }

  get sellerId(): string {
    return (this as any).vendedorId;
  }
  set sellerId(v: string) {
    (this as any).vendedorId = v;
  }

  get carrierId(): string {
    return (this as any).transportistaId;
  }
  set carrierId(v: string) {
    (this as any).transportistaId = v;
  }

  get carrierName(): string {
    return (this as any).nombreTransportista;
  }
  set carrierName(v: string) {
    (this as any).nombreTransportista = v;
  }

  get serviceType(): string {
    return (this as any).tipoServicio;
  }
  set serviceType(v: string) {
    (this as any).tipoServicio = v;
  }

  get estimatedCost(): number {
    return (this as any).costoEstimado;
  }
  set estimatedCost(v: number) {
    (this as any).costoEstimado = v;
  }

  get currency(): string {
    return (this as any).moneda;
  }
  set currency(v: string) {
    (this as any).moneda = v;
  }

  get originAddressId(): string {
    return (this as any).origenDireccionId;
  }
  set originAddressId(v: string) {
    (this as any).origenDireccionId = v;
  }

  get destinationAddressId(): string {
    return (this as any).destinoDireccionId;
  }
  set destinationAddressId(v: string) {
    (this as any).destinoDireccionId = v;
  }

  get originPostalCode(): string {
    return (this as any).codigoPostalOrigen;
  }
  set originPostalCode(v: string) {
    (this as any).codigoPostalOrigen = v;
  }

  get destinationPostalCode(): string {
    return (this as any).codigoPostalDestino;
  }
  set destinationPostalCode(v: string) {
    (this as any).codigoPostalDestino = v;
  }

  get weight(): number {
    return (this as any).peso;
  }
  set weight(v: number) {
    (this as any).peso = v;
  }

  get dimensions(): any {
    return (this as any).dimensiones;
  }
  set dimensions(v: any) {
    (this as any).dimensiones = v;
  }

  get deliverySpeed(): DeliverySpeed {
    return (this as any).velocidadEnvio;
  }
  set deliverySpeed(v: DeliverySpeed) {
    (this as any).velocidadEnvio = v;
  }

  get declaredWorth(): number {
    return (this as any).valorDeclarado;
  }
  set declaredWorth(v: number) {
    (this as any).valorDeclarado = v;
  }

  get fragile(): boolean {
    return (this as any).fragil;
  }
  set fragile(v: boolean) {
    (this as any).fragil = v;
  }

  get items(): any {
    return (this as any).articulos;
  }
  set items(v: any) {
    (this as any).articulos = v;
  }

  get estimatedDeliveryDate(): Date {
    return (this as any).fechaEntregaEstimada;
  }
  set estimatedDeliveryDate(v: Date) {
    (this as any).fechaEntregaEstimada = v;
  }

  get actualDeliveryDate(): Date {
    return (this as any).fechaEntregaReal;
  }
  set actualDeliveryDate(v: Date) {
    (this as any).fechaEntregaReal = v;
  }

  get pickupDate(): Date {
    return (this as any).fechaRetiro;
  }
  set pickupDate(v: Date) {
    (this as any).fechaRetiro = v;
  }

  get labelUrl(): string {
    return (this as any).urlEtiqueta;
  }
  set labelUrl(v: string) {
    (this as any).urlEtiqueta = v;
  }

  get notes(): string {
    return (this as any).notas;
  }
  set notes(v: string) {
    (this as any).notas = v;
  }
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);

// Índices compuestos para queries frecuentes
DeliverySchema.index({ usuario_id: 1, createdAt: -1 });
DeliverySchema.index({ vendedor_id: 1, estado: 1 });

// Virtuals English -> Spanish
DeliverySchema.virtual('trackingNumber')
  .get(function () {
    return this.numero_seguimiento;
  })
  .set(function (v) {
    this.numero_seguimiento = v;
  });

DeliverySchema.virtual('status')
  .get(function () {
    return this.estado;
  })
  .set(function (v) {
    this.estado = v;
  });

DeliverySchema.virtual('paymentId')
  .get(function () {
    return this.pago_id;
  })
  .set(function (v) {
    this.pago_id = v;
  });

DeliverySchema.virtual('cartId')
  .get(function () {
    return this.carrito_id;
  })
  .set(function (v) {
    this.carrito_id = v;
  });

DeliverySchema.virtual('userId')
  .get(function () {
    return this.usuario_id;
  })
  .set(function (v) {
    this.usuario_id = v;
  });

DeliverySchema.virtual('sellerId')
  .get(function () {
    return this.vendedor_id;
  })
  .set(function (v) {
    this.vendedor_id = v;
  });

DeliverySchema.virtual('carrierId')
  .get(function () {
    return this.transportista_id;
  })
  .set(function (v) {
    this.transportista_id = v;
  });

DeliverySchema.virtual('carrierName')
  .get(function () {
    return this.nombre_transportista;
  })
  .set(function (v) {
    this.nombre_transportista = v;
  });

DeliverySchema.virtual('serviceType')
  .get(function () {
    return this.tipo_servicio;
  })
  .set(function (v) {
    this.tipo_servicio = v;
  });

DeliverySchema.virtual('estimatedCost')
  .get(function () {
    return this.costo_estimado;
  })
  .set(function (v) {
    this.costo_estimado = v;
  });

DeliverySchema.virtual('currency')
  .get(function () {
    return this.moneda;
  })
  .set(function (v) {
    this.moneda = v;
  });

DeliverySchema.virtual('originAddressId')
  .get(function () {
    return this.origen_direccion_id;
  })
  .set(function (v) {
    this.origen_direccion_id = v;
  });

DeliverySchema.virtual('destinationAddressId')
  .get(function () {
    return this.destino_direccion_id;
  })
  .set(function (v) {
    this.destino_direccion_id = v;
  });

DeliverySchema.virtual('originPostalCode')
  .get(function () {
    return this.codigo_postal_origen;
  })
  .set(function (v) {
    this.codigo_postal_origen = v;
  });

DeliverySchema.virtual('destinationPostalCode')
  .get(function () {
    return this.codigo_postal_destino;
  })
  .set(function (v) {
    this.codigo_postal_destino = v;
  });

DeliverySchema.virtual('weight')
  .get(function () {
    return this.peso;
  })
  .set(function (v) {
    this.peso = v;
  });

DeliverySchema.virtual('dimensions')
  .get(function () {
    return this.dimensiones;
  })
  .set(function (v) {
    this.dimensiones = v;
  });

DeliverySchema.virtual('deliverySpeed')
  .get(function () {
    return this.velocidad_envio;
  })
  .set(function (v) {
    this.velocidad_envio = v;
  });

DeliverySchema.virtual('declaredWorth')
  .get(function () {
    return this.valor_declarado;
  })
  .set(function (v) {
    this.valor_declarado = v;
  });

DeliverySchema.virtual('fragile')
  .get(function () {
    return this.fragil;
  })
  .set(function (v) {
    this.fragil = v;
  });

DeliverySchema.virtual('items')
  .get(function () {
    return this.articulos;
  })
  .set(function (v) {
    this.articulos = v;
  });

DeliverySchema.virtual('estimatedDeliveryDate')
  .get(function () {
    return this.fecha_entrega_estimada;
  })
  .set(function (v) {
    this.fecha_entrega_estimada = v;
  });

DeliverySchema.virtual('actualDeliveryDate')
  .get(function () {
    return this.fecha_entrega_real;
  })
  .set(function (v) {
    this.fecha_entrega_real = v;
  });

DeliverySchema.virtual('pickupDate')
  .get(function () {
    return this.fecha_retiro;
  })
  .set(function (v) {
    this.fecha_retiro = v;
  });

DeliverySchema.virtual('labelUrl')
  .get(function () {
    return this.url_etiqueta;
  })
  .set(function (v) {
    this.url_etiqueta = v;
  });

DeliverySchema.virtual('notes')
  .get(function () {
    return this.notas;
  })
  .set(function (v) {
    this.notas = v;
  });
