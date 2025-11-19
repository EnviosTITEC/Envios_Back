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

  @Prop({ required: true })
  communeId: string;

  @Prop()
  countyCode?: string;

  @Prop()
  province?: string;

  @Prop({ required: true })
  regionId: string;

  @Prop()
  postalCode?: string;

  @Prop()
  references?: string;

  @Prop({ required: true })
  userId: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
AddressSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
