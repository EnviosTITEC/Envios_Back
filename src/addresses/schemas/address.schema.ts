// src/addresses/schemas/address.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AddressDocument = Address & Document;

@Schema({
  collection: 'direcciones', // Cambiado de 'addresses' a 'direcciones'
  timestamps: true,
  toJSON: { virtuals: true },
})
export class Address {
  @Prop({ required: true })
  nombre_calle: string; // Cambiado de 'street'

  @Prop({ required: true })
  numero: string; // Cambiado de 'number'

  @Prop({ required: true })
  id_comuna: string; // Cambiado de 'communeId'

  @Prop()
  codigo_comuna?: string; // Cambiado de 'countyCode'

  @Prop()
  nombre_provincia?: string; // Cambiado de 'province'

  @Prop({ required: true })
  id_region: string; // Cambiado de 'regionId'

  @Prop()
  codigo_postal?: string; // Cambiado de 'postalCode'

  @Prop()
  referencias?: string; // Sin cambios, ya que cumple con la nomenclatura

  @Prop({ required: true })
  id_usuario: string; // Cambiado de 'userId'
}

export const AddressSchema = SchemaFactory.createForClass(Address);
AddressSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
