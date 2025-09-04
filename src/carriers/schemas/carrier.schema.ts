import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarrierDocument = Carrier & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Carrier {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: [] })
  coverageZones: string[];

  @Prop({ default: true })
  isAvailable: boolean;
}

export const CarrierSchema = SchemaFactory.createForClass(Carrier);
CarrierSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
