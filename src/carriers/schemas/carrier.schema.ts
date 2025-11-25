import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarrierDocument = Carrier & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Carrier {
  @Prop({ required: true, unique: true, index: true })
  codigo: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ type: JSON, required: true })
  credenciales: JSON;

  @Prop({ default: true })
  disponible: boolean;

  // Compatibility getters/setters (TypeScript)
  get code(): string {
    return (this as any).codigo;
  }
  set code(v: string) {
    (this as any).codigo = v;
  }

  get name(): string {
    return (this as any).nombre;
  }
  set name(v: string) {
    (this as any).nombre = v;
  }

  get credentials(): JSON {
    return (this as any).credenciales;
  }
  set credentials(v: JSON) {
    (this as any).credenciales = v;
  }

  get isAvailable(): boolean {
    return (this as any).disponible;
  }
  set isAvailable(v: boolean) {
    (this as any).disponible = v;
  }
}

export const CarrierSchema = SchemaFactory.createForClass(Carrier);
CarrierSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Virtuals English -> Spanish
CarrierSchema.virtual('code')
  .get(function () {
    return this.codigo;
  })
  .set(function (v) {
    this.codigo = v;
  });

CarrierSchema.virtual('name')
  .get(function () {
    return this.nombre;
  })
  .set(function (v) {
    this.nombre = v;
  });

CarrierSchema.virtual('credentials')
  .get(function () {
    return this.credenciales;
  })
  .set(function (v) {
    this.credenciales = v;
  });

CarrierSchema.virtual('isAvailable')
  .get(function () {
    return this.disponible;
  })
  .set(function (v) {
    this.disponible = v;
  });
