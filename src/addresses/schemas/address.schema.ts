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
  street: string;

  @Prop({ required: true })
  number: string;

  // Nombre de la comuna (lo que muestras en tablas, etc.)
  @Prop({ required: true })
  comune: string;

  // NUEVO: código Chilexpress de la comuna (ej: "STGO")
  @Prop()
  countyCode?: string;

  @Prop()
  province?: string;

  @Prop()
  region?: string;

  @Prop()
  postalCode?: string;

  @Prop()
  references?: string;

  @Prop({ required: true })
  userId: string; // referencia a usuario
}

export const AddressSchema = SchemaFactory.createForClass(Address);
AddressSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
