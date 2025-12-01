// src/addresses/schemas/address.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AddressDocument = Address & Document;

@Schema({
  collection: 'addresses',
  timestamps: true,
  toJSON: { virtuals: true },
})
export class Address {
  @Prop({ required: true })
  calle: string; //se usa

  @Prop({ required: true })
  numero: string; //se usa

  @Prop({ required: true })
  comuna_id: string; //se usa

  @Prop()
  codigo_comuna?: string; //se usa

  @Prop()
  provincia?: string; //no se usa

  @Prop({ required: true })
  region_id: string; //se usa

  @Prop()
  codigo_postal?: string; //se usa

  @Prop()
  referencias?: string; //se usa

  @Prop({ required: true })
  usuario_id: string; //se usa

  // Compatibility getters/setters (TypeScript)
  get street(): string {
    return (this as any).calle;
  }
  set street(v: string) {
    (this as any).calle = v;
  }

  get number(): string {
    return (this as any).numero;
  }
  set number(v: string) {
    (this as any).numero = v;
  }

  get communeId(): string {
    return (this as any).comuna_id;
  }
  set communeId(v: string) {
    (this as any).comuna_id = v;
  }

  get countyCode(): string | undefined {
    return (this as any).codigo_comuna;
  }
  set countyCode(v: string | undefined) {
    (this as any).codigo_comuna = v;
  }

  get province(): string | undefined {
    return (this as any).provincia;
  }
  set province(v: string | undefined) {
    (this as any).provincia = v;
  }

  get postalCode(): string | undefined {
    return (this as any).codigo_postal;
  }
  set postalCode(v: string | undefined) {
    (this as any).codigo_postal = v;
  }

  get userId(): string {
    return (this as any).usuario_id;
  }
  set userId(v: string) {
    (this as any).usuario_id = v;
  }

  get regionId(): string {
    return (this as any).region_id;
  }
  set regionId(v: string) {
    (this as any).region_id = v;
  }
}

export const AddressSchema = SchemaFactory.createForClass(Address);
AddressSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Virtuals English -> Spanish
AddressSchema.virtual('street')
  .get(function () {
    return this.calle;
  })
  .set(function (v) {
    this.calle = v;
  });

AddressSchema.virtual('number')
  .get(function () {
    return this.numero;
  })
  .set(function (v) {
    this.numero = v;
  });

AddressSchema.virtual('communeId')
  .get(function () {
    return this.comuna_id;
  })
  .set(function (v) {
    this.comuna_id = v;
  });

AddressSchema.virtual('countyCode')
  .get(function () {
    return this.codigo_comuna;
  })
  .set(function (v) {
    this.codigo_comuna = v;
  });

AddressSchema.virtual('province')
  .get(function () {
    return this.provincia;
  })
  .set(function (v) {
    this.provincia = v;
  });

AddressSchema.virtual('postalCode')
  .get(function () {
    return this.codigo_postal;
  })
  .set(function (v) {
    this.codigo_postal = v;
  });

AddressSchema.virtual('references')
  .get(function () {
    return this.referencias;
  })
  .set(function (v) {
    this.referencias = v;
  });

AddressSchema.virtual('userId')
  .get(function () {
    return this.usuario_id;
  })
  .set(function (v) {
    this.usuario_id = v;
  });

AddressSchema.virtual('regionId')
  .get(function () {
    return this.region_id;
  })
  .set(function (v) {
    this.region_id = v;
  });
