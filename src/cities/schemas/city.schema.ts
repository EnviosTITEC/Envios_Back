import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'cities', timestamps: true, toJSON: { virtuals: true } })
export class City extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  postal_code: string;
}

export const CitySchema = SchemaFactory.createForClass(City);
